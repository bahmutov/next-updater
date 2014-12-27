#!/usr/bin/env node

require('lazy-ass');
var check = require('check-types');

require('./src/check-updates');

var options = require('./src/cli-options');
la(check.object(options), 'missing CLI options', options);

if (check.unemptyString(options.repo)) {

  console.log('updating single repo', options.repo);
  require('./src/update-single-repo')(options);

} else if (check.unemptyString(options.config)) {
  console.log('reading repos to update from config file', options.config);
}
