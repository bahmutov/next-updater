require('lazy-ass');
var check = require('check-more-types');
var q = require('q');
var quote = require('quote');
var _ = require('lodash');
var updateMultipleRepos = require('./update-multiple-repos');
var Registry = require('npm-registry');
var npm = new Registry();
var sortNames = require('./sort-names');

function getUserNpmModules(username) {
  la(check.unemptyString(username), 'missing NPM username', username);
  return q.ninvoke(npm.users, 'list', username);
}

function toNames(modules) {
  la(check.array(modules), 'expected list of NPM modules', modules);
  return _.pluck(modules, 'name');
}

var isValidGithub = check.schema.bind(null, {
  user: check.unemptyString,
  repo: check.unemptyString
});

function packageToGithub(packageInfo) {
  // github: { user: 'bahmutov', repo: 'aged' },
  la(check.object(packageInfo) && isValidGithub(packageInfo.github),
    'could not get github from package info', packageInfo);
  return packageInfo.github.user + '/' + packageInfo.github.repo;
}

function npmNamesToGithuRepoNames(names) {
  la(check.arrayOfStrings(names), 'expected list of NPM names', names);

  console.log('getting git urls for', names);

  var defer = q.defer();
  var githubRepos = [];

  var getGitRepos = q([]);

  names.forEach(function (name) {
    getGitRepos = getGitRepos.then(function () {
      return q.ninvoke(npm.packages, 'get', name)
        .then(function (data) {
          la(check.array(data), 'could not get data for NPM package', name, data);
          var packageInfo = data[0];
          if (check.has(packageInfo, 'github')) {
            // console.log(packageInfo);
            githubRepos.push(packageToGithub(packageInfo));
          }
        });
    });
  });

  getGitRepos.then(function () {
    console.log('resolving', githubRepos);
    defer.resolve(githubRepos);
  });

  return defer.promise;
}

function updateNpmModules(options) {
  la(check.object(options), 'missing options');
  var username = options['npm-user'];
  la(check.unemptyString(username), 'cannot find NPM user option', options);

  var sort = sortNames.bind(null, options.sort || 'listed');

  return getUserNpmModules(username)
    .then(function (modules) {
      la(check.array(modules), 'expected list of NPM modules', modules);
      console.log('user', quote(username), 'has', modules.length, 'NPM modules');
      return modules;
    })
    .then(toNames)
    .then(sort)
    .then(function (names) {
      return _.first(names, options.N);
    })
    .then(npmNamesToGithuRepoNames)
    .then(function (repoNames) {
      console.log('updating', repoNames.length, 'github repos for NPM user', username);
      if (repoNames.length) {
        console.log(repoNames);
      }
      return updateMultipleRepos(options, repoNames);
    })
    .done();
}

module.exports = updateNpmModules;
