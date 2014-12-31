require('lazy-ass');
var check = require('check-more-types');
var q = require('q');
var quote = require('quote');
var _ = require('lodash');
// var updateMultipleRepos = require('./update-multiple-repos');
var Registry = require('npm-registry');
var npm = new Registry();

function getUserNpmModules(username) {
  la(check.unemptyString(username), 'missing NPM username', username);
  return q.ninvoke(npm.users, 'list', username);
}

function npmToGithuRepoNames(modules) {
  la(check.array(modules), 'expected list of NPM modules', modules);
  return _.pluck(modules, 'name');
}

function updateNpmModules(options) {
  la(check.object(options), 'missing options');
  var username = options['npm-user'];
  la(check.unemptyString(username), 'cannot find NPM user option', options);

  return getUserNpmModules(username)
    .then(function (modules) {
      la(check.array(modules), 'expected list of NPM modules', modules);
      console.log('user', quote(username), 'has', modules.length, 'NPM modules');
      return modules;
    })
    .then(npmToGithuRepoNames)
    .then(function (repoNames) {
      console.log('updating', repoNames.length, 'github repos for NPM user', username);
      if (repoNames.length) {
        console.log(repoNames);
      }
      // return updateMultipleRepos(options, repoNames);
    })
    .done();
}

module.exports = updateNpmModules;
