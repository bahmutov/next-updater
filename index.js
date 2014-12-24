#!/usr/bin/env node

var check = require('check-types');
var pkg = require('./package.json');
var info = pkg.name + ' - ' + pkg.description + '\n' +
  '  version: ' + pkg.version + '\n' +
  '  author: ' + JSON.stringify(pkg.author);

var optimist = require('optimist');
var program = optimist
.option('version', {
  boolean: true,
  alias: 'v',
  description: 'show version and exit',
  default: false
})
.option('repo', {
  string: true,
  alias: 'r',
  description: '<github username/repo>',
  default: 'bahmutov/test-next-updater'
})
.usage(info)
.argv;

if (program.version) {
  console.log(info);
  process.exit(0);
}

if (program.help || program.h ||
  !check.unemptyString(program.repo)) {
  optimist.showHelp();
  process.exit(0);
}

var nextUpdater = require('./src/next-updater');
nextUpdater.testModuleUpdate(program.repo)
.done(function () {
  console.log('finished testing', program.repo);
}, function (err) {
  console.error('could not update repo', program.repo);
  console.error('-------------------------');
  console.error(err.stack);
  console.error('-------------------------');
});
