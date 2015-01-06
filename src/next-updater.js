require('lazy-ass');

var gitAndNpm = require('git-and-npm');

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
var exec = require('ggit').exec;
var fs = require('fs');
var pkg = require('../package.json');
var chdir = require('chdir-promise');
var quote = require('quote');

function cleanupTempFolder(folder) {
  verify.unemptyString(folder, 'expected folder name');
  if (fs.existsSync(folder)) {
    require('rimraf').sync(folder);
    console.log('removed temp local folder', quote(folder));
  }
}

function verifyRepo(repo) {
  verify.unemptyString(repo, 'expected github repo string');
  var usernameReponameRegexp = /[\w]+\/[\w]+/;
  la(usernameReponameRegexp.test(repo),
    'Expected github username / repo name string, have', repo);
}

function testUpdates(repo, options, folder) {
  la(check.unemptyString(repo), 'missing repo name', repo);
  la(check.unemptyString(folder), 'missing folder', folder);

  var nextUpdate = require('next-update');
  la(check.fn(nextUpdate), 'expected next update function', nextUpdate);

  var updateOptions = {
    keep: true,
    allow: options.allow || options.allowed
  };
  console.log('update options', updateOptions);
  var checkUpdates = nextUpdate.bind(null, updateOptions);

  return chdir.to(folder)
    .then(checkUpdates)
    .then(function (result) {
      // console.log('checking updates returned', result);
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

  var testRepo = testUpdates.bind(null, repo, options);
  var localRepoFolder;

  return gitAndNpm.cloneAndInstall(repo)
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
      // if testResults is an object, next-update could not find any updates
      // and just resolved with current module versions
      if (testResults && check.array(testResults)) {

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

        var tag = options.tag ? function () {
          console.log('bumping and tagging with new version');
          return exec('npm version patch');
        } : function () {
          console.log('skipping bumping the version number');
          return q();
        };

        var publish = options.publish ? function () {

          if (fs.existsSync('./package.json')) {
            var testedPackage = JSON.parse(fs.readFileSync('./package.json'), 'utf-8');
            if (!testedPackage.private) {
              console.log('publishing module to NPM');
              return exec('npm publish');
            } else {
              console.log('package', quote(testedPackage.name), 'is marked private');
            }
          } else {
            console.log('cannot find package.json in', quote(process.cwd()));
          }

          return q();
        } : function () {
          console.log('skipping publishing to NPM');
          return q();
        };

        return chdir.to(localRepoFolder)
          .then(commit)
          .then(tag)
          .then(push)
          .then(publish)
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
