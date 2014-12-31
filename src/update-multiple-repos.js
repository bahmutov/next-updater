require('lazy-ass');
var check = require('check-more-types');
var updateSingleRepo = require('./update-single-repo');
la(check.fn(updateSingleRepo), 'missing update single repo function', updateSingleRepo);
var _ = require('lodash');
var q = require('q');
var sortRepoNames = require('./sort-names');

function updateMultipleRepos(options, repos) {
  la(check.object(options), 'missing options');
  la(check.arrayOfStrings(repos), 'cannot find repos list', repos);

  options.skip = options.skip || [];
  if (check.unemptyString(options.skip)) {
    options.skip = [options.skip];
  }
  la(check.arrayOfStrings(options.skip), 'skip repos should be a list of names', options);

  if (options.skip.length) {
    console.log('will skip the following repos', options.skip);
  }

  options.sort = options.sort || 'listed';

  function isSkipped(repoName) {
    return options.skip.indexOf(repoName) !== -1;
  }
  _.remove(repos, isSkipped);

  repos = sortRepoNames(options.sort, repos);

  var updates = q();
  repos.forEach(function (repo) {
    var opts = _.cloneDeep(options);
    opts.repo = repo;

    updates = updates.then(function () {
      return updateSingleRepo(opts);
    });
  });

  updates.done(function () {
    console.log(repos.length + ' repo(s) done');
  });
}

module.exports = updateMultipleRepos;
