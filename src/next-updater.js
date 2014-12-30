require('lazy-ass');

var _ = require('lodash');
var q = require('q');
q.longStackSupport = true;
var updateSummary = require('./update-summary');

var check = require('check-more-types');
check.mixin(function (url) {
  return check.unemptyString(url) &&
    /^git@/.test(url);
}, 'git');


var verify = check.verify;
var ggit = require('ggit');
var cloneRepo = ggit.cloneRepo;
var exec = require('ggit').exec;
var path = require('path');
var fs = require('fs');
var tmpdir = require('os').tmpdir;
var pkg = require('../package.json');
var chdir = require('chdir-promise');
var quote = require('quote');

function verifyRepo(repo) {
  verify.unemptyString(repo, 'expected github repo string');
  var usernameReponameRegexp = /[\w]+\/[\w]+/;
  la(usernameReponameRegexp.test(repo),
    'Expected github username / repo name string, have', repo);
}

function cleanupTempFolder(folder) {
  verify.unemptyString(folder, 'expected folder name');
  if (fs.existsSync(folder)) {
    require('rimraf').sync(folder);
    console.log('removed temp local folder', quote(folder));
  }
}

function installDependencies(folder) {
  verify.unemptyString(folder, 'expected folder name');
  console.log('installing dependencies', folder);

  var npmInstall = exec.bind(null, 'npm install');
  var message = console.log.bind(console, 'installed dependencies in', folder);

  return chdir.to(folder)
    .then(npmInstall)
    .then(message)
    .finally(chdir.back);
}

function testModule(folder) {
  verify.unemptyString(folder, 'expected folder name');
  console.log('testing module', folder);

  var npmTest = exec.bind(null, 'npm test');
  return chdir.to(folder)
    .then(npmTest)
    .finally(chdir.back);
}

// returns tmp folder for given repo
// repoName: smith/foo for example
function folderForRepo(repoName) {
  la(check.unemptyString(repoName), 'missing repo name', repoName);

  var tmp = path.join(tmpdir(), pkg.name, repoName);
  if (!fs.existsSync(tmp)) {
    require('mkdirp').sync(tmp);
    console.log('Created folder to clone', repoName, 'to');
  }
  console.log(repoName);

  return tmp;
}

function repoNameToUrl(repo) {
  return 'git@github.com:' + repo + '.git';
}

function cloneInstallAndTest(repo) {

  var repoUrl = repoNameToUrl(repo);
  la(check.git(repoUrl), 'could not convert', repo, 'to git url', repoUrl);

  var tmpFolder = folderForRepo(repo);
  la(check.unemptyString(tmpFolder), 'missing tmp folder for repo', repo);

  var clone = cloneRepo.bind(null, {
    url: repoUrl,
    folder: tmpFolder
  });
  var install = installDependencies.bind(null, tmpFolder);
  var test = testModule.bind(null, tmpFolder);

  return q(cleanupTempFolder(tmpFolder))
    .then(clone)
    .then(function () {
      console.log('cloned', repo, 'to', tmpFolder);
    })
    .then(install)
    .then(test)
    .then(function () {
      console.log('tested npm module in', tmpFolder);
      return tmpFolder;
    }, function (err) {
      console.log('FAILED test for npm module in', tmpFolder);
      if (err) {
        console.log('==================');
        console.log(err);
        console.log('==================');
      }
      cleanupTempFolder(tmpFolder);
      throw new Error(err);
    });
}

function testUpdates(repo, folder) {
  la(check.unemptyString(repo), 'missing repo name', repo);
  la(check.unemptyString(folder), 'missing folder', folder);

  var nextUpdate = require('next-update');
  la(check.fn(nextUpdate), 'expected next update function', nextUpdate);

  var options = {
    keep: true
  };
  var checkUpdates = nextUpdate.bind(null, options);

  return chdir.to(folder)
    .then(checkUpdates)
    .then(function (result) {
      console.log('checking updates returned', result);
      return q.all([ggit.hasChanges(), result]);
    }, function (err) {
      console.error('checking updates error', err);
      throw err;
    })
    .finally(chdir.from);
}

function commitSummary(testResults) {
  var summary = updateSummary(testResults);
  la(check.object(summary), 'could not get update summary from test results', testResults);

  // object, keys - working names, values - versions
  var workingDependencies = Object.keys(summary);
  la(workingDependencies.length,
    'there are git changes, but no successful updates', testResults);

  var commitMessage = pkg.name + ' has upgraded ' + workingDependencies.length +
    (workingDependencies.length === 1 ? ' dependency ' : ' dependencies');
  return commitMessage;
}

function commitDetails(testResults) {
  var summary = updateSummary(testResults);
  la(check.object(summary), 'could not get update summary from test results', testResults);

  var details = 'Hi!\n\nI have upgraded dependencies to the latest non-breaking versions\n\n';
  _.forEach(summary, function (versions, name) {
    details += '    ' + name + ' ' + versions.from + ' -> ' + versions.to + '\n';
  });

  details += '\n';
  details += 'Truly yours, [' + pkg.name + '](' + pkg.homepage + ')\n';
  return details;
}

function testModuleUpdate(repo, options) {
  verifyRepo(repo);
  options = options || {};
  _.defaults(options, {
    push: true
  });

  var testRepo = testUpdates.bind(null, repo);
  var localRepoFolder;

  return cloneInstallAndTest(repo)
    .then(function (tmpFolder) {
      console.log('checking available updates in', tmpFolder);
      localRepoFolder = tmpFolder;
      return tmpFolder;
    })
    .then(testRepo)
    .spread(function (hasChanges, testResults) {
      console.log('after checking for working updates, any uncommitted git changes?', hasChanges);
      return hasChanges ? testResults : null;
    })
    .then(function (testResults) {
      if (testResults) {
        la(check.array(testResults), 'expected detailed test results', testResults);

        var commitMessage = commitSummary(testResults);
        var updateDetails = commitDetails(testResults);
        la(check.maybe.unemptyString(updateDetails),
          'expected update details to be a string', updateDetails);

        console.log('committing changes:', commitMessage);
        console.log(updateDetails);
        var commit = ggit.commit.bind(null, commitMessage, updateDetails);

        var push = options.push ? function () {
          console.log('pushing changes to remote origin');
          return ggit.push();
        } : function () {
          console.log('skipping pushing changes to remote origin');
          return q();
        };

        return chdir.to(localRepoFolder)
          .then(commit)
          .then(push)
          .finally(chdir.from);
      }
    })
    .catch(function (err) {
      console.error('Failed to test', repo);
      console.error(err);
    })
    .finally(function () {
      if (options.clean || options.cleanup) {
        cleanupTempFolder(localRepoFolder);
      }
    })
    .catch(function (err) {
      console.error('Problem cleaning up temp folder', quote(localRepoFolder));
      console.error(err);
    });
}

module.exports = {
  testModuleUpdate: testModuleUpdate
};
