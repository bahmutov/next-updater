require('lazy-ass');
var check = require('check-more-types');
var stripComments = require('strip-json-comments');
var fs = require('fs');
// var nextUpdater = require('./src/next-updater');

function updateSingleRepo(options) {
  la(check.object(options), 'missing options');
  la(check.unemptyString(options.config), 'cannot find config option', options);
  la(fs.existsSync(options.config), 'cannot find file', options.config);

  var config = JSON.parse(stripComments(fs.readFileSync(options.config, 'utf-8')));
  console.log('config');
  console.log(config);

  la(check.arrayOfStrings(config.repos), 'cannot find repos list', config);
}

module.exports = updateSingleRepo;
