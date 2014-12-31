#!/usr/bin/env node

require('lazy-ass');
var check = require('check-types');
var quote = require('quote');

require('./src/check-updates');

var options = require('./src/cli-options');
la(check.object(options), 'missing CLI options', options);

if (check.unemptyString(options.repo)) {

  console.log('updating single repo', quote(options.repo));
  require('./src/update-single-repo')(options);

} else if (check.unemptyString(options.config)) {

  console.log('reading repos to update from config file', quote(options.config));
  require('./src/update-from-config')(options);

} else if (check.unemptyString(options.user)) {

  console.log('updating all repos for user', quote(options.user));
  require('./src/update-user-repos')(options);

} else if (check.unemptyString(options['npm-user'])) {

  console.log('updating repos for NPM packages authored by', quote(options['npm-user']));
}
