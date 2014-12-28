require('lazy-ass');
var check = require('check-more-types');
var stripComments = require('strip-json-comments');
var fs = require('fs');
var updateSingleRepo = require('./update-single-repo');
la(check.fn(updateSingleRepo), 'missing update single repo function', updateSingleRepo);
var _ = require('lodash');
var q = require('q');

function updateMultipleRepos(options) {
  la(check.object(options), 'missing options');
  la(check.unemptyString(options.config), 'cannot find config option', options);
  la(fs.existsSync(options.config), 'cannot find file', options.config);

  var config = JSON.parse(stripComments(fs.readFileSync(options.config, 'utf-8')));
  la(check.arrayOfStrings(config.repos), 'cannot find repos list', config);

  var updates = q();
  config.repos.forEach(function (repo) {
    var opts = _.cloneDeep(options);
    _.defaults(opts, options);
    opts.repo = repo;

    updates = updates.then(function () {
      return updateSingleRepo(opts);
    });
  });

  updates.done(function () {
    console.log('all done');
  });
}

module.exports = updateMultipleRepos;
