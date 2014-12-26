require('lazy-ass');

var q = require('q');
q.longStackSupport = true;
var check = require('check-more-types');
var verify = check.verify;
var cloneRepo = require('ggit').cloneRepo;
var exec = require('ggit').exec;
var path = require('path');
var fs = require('fs');
var tmpdir = require('os').tmpdir;
var pkg = require('../package.json');
var chdir = require('chdir-promise');

function verifyRepo(repo) {
  verify.unemptyString(repo, 'expected github repo string');
  var usernameReponameRegexp = /[\w]+\/[\w]+/;
  if (!usernameReponameRegexp.test(repo)) {
    throw new Error('Expected github username / repo name string, have ' + repo);
  }
}

function removeFolder(folder) {
  verify.unemptyString(folder, 'expected folder name');
  if (fs.existsSync(folder)) {
    console.log('removing folder', folder);
    return exec('rm -rf ' + folder);
  }
}

function installDependencies(folder) {
  verify.unemptyString(folder, 'expected folder name');
  console.log('installing dependencies', folder);

  var npmInstall = exec.bind(null, 'npm install');

  return chdir.to(folder)
    .then(npmInstall)
    .then(function () {
      console.log('installed dependencies in', folder);
    })
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
  return 'https://github.com/' + repo + '.git';
}

function testModuleUpdate(repo) {
  verifyRepo(repo);

  var repoUrl = repoNameToUrl(repo);
  la(check.webUrl(repoUrl), 'could not convert', repo, 'to git url', repoUrl);

  var tmpFolder = folderForRepo(repo);
  la(check.unemptyString(tmpFolder), 'missing tmp folder for repo', repo);

  var clone = cloneRepo.bind(null, {
    url: repoUrl,
    folder: tmpFolder
  });
  var install = installDependencies.bind(null, tmpFolder);
  var test = testModule.bind(null, tmpFolder);

  return q(removeFolder(tmpFolder))
    .then(clone)
    .then(function () {
      console.log('cloned', repo, 'to', tmpFolder);
    })
    .then(install)
    .then(test)
    .then(function () {
      console.log('tested npm module in', tmpFolder);
    }, function (err) {
      console.log('FAILED test for npm module in', tmpFolder);
      if (err) {
        console.log('==================');
        console.log(err);
        console.log('==================');
      }
      throw new Error(err);
    });
}

module.exports = {
  testModuleUpdate: testModuleUpdate
};
