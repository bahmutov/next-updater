function infoMessage() {
  var _ = require('lodash');
  var text = '<%= name %> - <%= description %>\n' +
    ' version: <%= version %>\n' +
    ' author: <%= author %>';
  var pkg = require('../package.json');
  return _.template(text)(pkg);
}

var info = infoMessage();

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

if (program.help || program.h) {
  optimist.showHelp();
  process.exit(0);
}

module.exports = program;
