require('lazy-ass');
var check = require('check-types');
var nextUpdater = require('./src/next-updater');

function updateSingleRepo(options) {
  la(check.object(options), 'missing options');

  nextUpdater.testModuleUpdate(options.repo)
    .done(function () {
      console.log('finished testing', options.repo);
    }, function (err) {
      console.error('could not update repo', options.repo);
      console.error('-------------------------');
      console.error(err.stack);
      console.error('-------------------------');
    });
}

module.exports = updateSingleRepo;
