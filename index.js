#!/usr/bin/env node

require('lazy-ass');
var check = require('check-types');

require('./src/check-updates');

var options = require('./src/cli-options');
la(check.object(options), 'missing CLI options', options);

var nextUpdater = require('./src/next-updater');
nextUpdater.testModuleUpdate(options.repo)
  .done(function () {
    console.log('finished testing', options.repo);
  }, function (err) {
    console.error('could not update repo', options.repo);
    console.error('-------------------------');
    console.error(err.stack);
    console.error('-------------------------');
  });
