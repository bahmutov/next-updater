function infoMessage() {
  var _ = require('lodash');
  var text = '<%= name %> - <%= description %>\n' +
    ' version: <%= version %>\n' +
    ' author: <%= author %>\n' +
    ' more info at: <%= homepage %>';
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
  .option('push', {
    boolean: true,
    alias: 'p',
    description: 'push changes (if any) to remote origin',
    default: true
  })
  .option('repo', {
    string: true,
    alias: 'r',
    description: '<github username/repo>',
    default: null
  })
  .option('config', {
    string: true,
    alias: 'c',
    description: 'JSON config filename',
    default: null
  })
  .option('user', {
    string: true,
    alias: 'u',
    description: 'fetch list of repos for this github username',
    default: null
  })
  .option('sort', {
    string: true,
    alias: 's',
    description: 'sort repos (listed, reverse, asc, desc)'
  })
  .option('clean', {
    boolean: true,
    description: 'delete temp folder after finished',
    default: false
  })
  .option('allow', {
    string: true,
    default: 'major',
    description: 'allow major / minor / patch updates'
  })
  .option('tag', {
    boolean: true,
    default: false,
    alias: 't',
    description: 'tag changed code with new patch version'
  })
  .option('publish', {
    boolean: true,
    default: false,
    description: 'publish to NPM (if updated and has package.json)'
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
