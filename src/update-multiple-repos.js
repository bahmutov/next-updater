require('lazy-ass');
var check = require('check-more-types');
var updateSingleRepo = require('./update-single-repo');
la(check.fn(updateSingleRepo), 'missing update single repo function', updateSingleRepo);
var _ = require('lodash');
var q = require('q');

function updateMultipleRepos(options, repos) {
  la(check.object(options), 'missing options');
  la(check.arrayOfStrings(repos), 'cannot find repos list', repos);

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
