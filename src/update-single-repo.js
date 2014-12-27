require('lazy-ass');
var check = require('check-types');
var quote = require('quote');
var nextUpdater = require('./src/next-updater');

function updateSingleRepo(options) {
  la(check.object(options), 'missing options');

  nextUpdater.testModuleUpdate(options.repo)
    .done(function () {
      console.log('finished testing', quote(options.repo));
    }, function (err) {
      console.error('could not update repo', quote(options.repo));
      console.error('-------------------------');
      console.error(err.stack);
      console.error('-------------------------');
    });
}

module.exports = updateSingleRepo;
