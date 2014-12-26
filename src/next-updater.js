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
  var cwd = process.cwd();
  process.chdir(folder);
  console.log('changed current folder to', process.cwd());
  return exec('npm install')
    .then(function () {
      console.log('installed dependencies in', folder);
      process.chdir(cwd);
    });
}

function testModule(folder) {
  verify.unemptyString(folder, 'expected folder name');
  console.log('testing module', folder);
  var cwd = process.cwd();
  process.chdir(folder);
  return exec('npm test')
    .finally(function () {
      process.chdir(cwd);
    });
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

function testModuleUpdate(repo) {
  verifyRepo(repo);

  var repoUrl = 'https://github.com/' + repo + '.git';
  var tmpFolder = folderForRepo(repo);

  return q(removeFolder(tmpFolder))
    .then(cloneRepo.bind(null, {
      url: repoUrl,
      folder: tmpFolder
    }))
    .then(function () {
      console.log('cloned', repo, 'to', tmpFolder);
      return tmpFolder;
    })
    .then(installDependencies)
    .then(testModule.bind(null, tmpFolder))
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
