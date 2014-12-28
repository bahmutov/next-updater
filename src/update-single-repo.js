require('lazy-ass');
var check = require('check-types');
var quote = require('quote');
var nextUpdater = require('./next-updater');
var q = require('q');

function updateSingleRepo(options) {
  la(check.object(options), 'missing options');

  var defer = q.defer();

  nextUpdater.testModuleUpdate(options.repo, options)
    .finally(function () {
      console.log('finished testing', quote(options.repo));
    }, function (err) {
      console.error('could not update repo', quote(options.repo));
      console.error('-------------------------');
      console.error(err.stack);
      console.error('-------------------------');
    })
    .done(function () {
      defer.resolve(options.repo);
    });

  return defer.promise;
}

module.exports = updateSingleRepo;
