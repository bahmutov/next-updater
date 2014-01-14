var q = require('q');
q.longStackSupport  = true;
var verify = require('check-types').verify;
var cloneRepo = require('ggit').cloneRepo;
var exec = require('ggit').exec;
var path = require('path');
var fs = require('fs');

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

function testModuleUpdate(repo) {
  verifyRepo(repo);

  var repoUrl = 'https://github.com/' + repo + '.git';
  var tmpFolder = path.join(process.cwd(), 'tmp');
  return q(removeFolder(tmpFolder))
    .then(cloneRepo.bind(null, {
      url: repoUrl,
      folder: tmpFolder
    }))
    .then(function () {
      console.log('cloned', repo, 'to', tmpFolder);
      return tmpFolder;
    });
}

module.exports = {
  testModuleUpdate: testModuleUpdate
};