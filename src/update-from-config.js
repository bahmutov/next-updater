require('lazy-ass');
var check = require('check-more-types');
var stripComments = require('strip-json-comments');
var fs = require('fs');
var updateMultipleRepos = require('./update-multiple-repos');
var _ = require('lodash');

function updateFromConfig(options) {
  la(check.object(options), 'missing options');
  la(check.unemptyString(options.config), 'cannot find config option', options);
  la(fs.existsSync(options.config), 'cannot find file', options.config);

  var config = JSON.parse(stripComments(fs.readFileSync(options.config, 'utf-8')));
  la(check.arrayOfStrings(config.repos), 'cannot find repos list', config);

  var opts = _.cloneDeep(options);
  _.defaults(opts, config.options);

  return updateMultipleRepos(opts, config.repos);
}

module.exports = updateFromConfig;
