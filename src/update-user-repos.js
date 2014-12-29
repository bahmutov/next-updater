require('lazy-ass');
var check = require('check-more-types');
var request = require('request');
var q = require('q');
var quote = require('quote');
var _ = require('lodash');

function githubReposForUserUrl(username) {
  la(check.unemptyString(username), 'expected username');
  return 'https://api.github.com/users/' + username + '/repos';
}

function getUserRepos(username) {
  var defer = q.defer();
  var url = githubReposForUserUrl(username);

  var options = {
    method: 'GET',
    url: url,
    headers: {
      'User-Agent': username
    }
  };

  request(options, function (err, response, body) {
    if (err) {
      console.error(err);
      defer.reject(err);
    } else {
      if (response.statusCode !== 200) {
        console.error(response.statusCode + ': ' + body);
        defer.reject(new Error(body));
      } else {
        defer.resolve(JSON.parse(body));
      }
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
        case 'reverse': {
          originalRepos.reverse();
          console.log('reversed repos order');
          break;
        }
        default: {
          console.log('leaving original sort order');
          break;
        }
      }
      return originalRepos;
    })
    .done();
}

module.exports = updateUserRepos;
