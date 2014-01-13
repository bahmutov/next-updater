var q = require('q');
q.longStackSupport  = true;
var verify = require('check-types').verify;

function verifyRepo(repo) {
  verify.unemptyString(repo, 'expected github repo string');
  var usernameReponameRegexp = /[\w]+\/[\w]+/;
  if (!usernameReponameRegexp.test(repo)) {
    throw new Error('Expected github username / repo name string, have ' + repo);
  }
}

function testModuleUpdate(repo) {
  verifyRepo(repo);

  var defer = q.defer();
  process.nextTick(function () {
    defer.resolve();
  });
  return defer.promise;
}

module.exports = {
  testModuleUpdate: testModuleUpdate
};