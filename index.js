#!/usr/bin/env node

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
  .usage(info)
  .argv;

if (program.version) {
  console.log(info);
  process.exit(0);
}

if (program.help || program.h) {
  optimist.showHelp();
  process.exit(0);
}
