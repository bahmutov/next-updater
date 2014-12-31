require('lazy-ass');
var check = require('check-more-types');
var q = require('q');
var quote = require('quote');
// var _ = require('lodash');
// var updateMultipleRepos = require('./update-multiple-repos');

function getUserNpmModules(username) {
  la(check.unemptyString(username), 'missing NPM username', username);

  return q([]);
}

function npmToGithuRepoNames(modules) {
  la(check.array(modules), 'expected list of NPM modules', modules);
  return [];
}

function updateNpmModules(options) {
  la(check.object(options), 'missing options');
  var username = options['npm-user'];
  la(check.unemptyString(username), 'cannot find NPM user option', options);

  return getUserNpmModules(username)
    .then(function (repos) {
      la(check.array(repos), 'expected list of repos', repos);
      console.log('user', quote(username), 'has', repos.length, 'NPM modules');
      return repos;
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
