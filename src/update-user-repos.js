require('lazy-ass');
var check = require('check-more-types');
var q = require('q');
var quote = require('quote');
var _ = require('lodash');
var updateMultipleRepos = require('./update-multiple-repos');
var github = require('octonode');

function getReposPage(ghuser, k, allRepos) {
  la(check.positiveNumber(k), 'invalid repos page index', k);
  allRepos = allRepos || [];

  la(check.array(allRepos), 'expected all repos to be an array', allRepos);

  var defer = q.defer();

  console.log('fetching repos page', k);
  var perPage = 100;

  ghuser.repos(k, perPage, function (err, repos) {
    if (err) {
      console.error(err);
      defer.resolve(allRepos);
      return;
    }
    if (!check.array(repos) || repos.length === 0) {
      console.log('no repos at page', k, 'have', allRepos.length, 'total repos');
      defer.resolve(allRepos);
      return;
    }

    console.log(repos.length + ' repos on page ' + k);
    allRepos = allRepos.concat(repos);

    defer.resolve(getReposPage(ghuser, k + 1, allRepos));
  });

  return defer.promise;
}

function getUserRepos(username) {
  la(check.unemptyString(username), 'missing github username', username);

  var defer = q.defer();

  var client = github.client();
  var ghuser = client.user(username);

  getReposPage(ghuser, 1).then(function (allRepos) {
    console.log('fetched', allRepos.length, 'repos for user', quote(username));
    if (!check.array(allRepos) || allRepos.length === 0) {
      defer.reject('Could not fetch any repos for user ' + quote(username));
    } else {
      defer.resolve(allRepos);
    }
  });

  return defer.promise;
}

function updateUserRepos(options) {
  la(check.object(options), 'missing options');
  la(check.unemptyString(options.user), 'cannot find user option', options);

  return getUserRepos(options.user)
    .then(function (repos) {
      la(check.array(repos), 'expected list of repos', repos);
      console.log('user', quote(options.user), 'has', repos.length, 'github repos');
      return repos;
    })
    .then(function (repos) {
      return _.filter(repos, { fork: false });
    })
    .then(function (originalRepos) {
      console.log('user', quote(options.user), 'has', originalRepos.length, 'non-forked repos');
      return originalRepos;
    })
    .then(function (originalRepos) {
      switch (options.sort) {
        case 'oldest': {
          console.log('sorted repos from oldest to youngest');
          break;
        }
        case 'youngest': {
          console.log('sorted repos from youngest to oldest');
          break;
        }
      }
      return originalRepos;
    })
    .then(function (repos) {
      return _.pluck(repos, 'full_name');
    })
    .then(function (repoNames) {
      return updateMultipleRepos(options, repoNames);
    })
    .done();
}

module.exports = updateUserRepos;
