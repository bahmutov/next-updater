require('lazy-ass');
var check = require('check-types');
var quote = require('quote');
var nextUpdater = require('./next-updater');
var q = require('q');
var hr = require('hr').hr;

function updateSingleRepo(options) {
  la(check.object(options), 'missing options');

  var defer = q.defer();

  hr('=');

  nextUpdater.testModuleUpdate(options.repo, options)
    .finally(function () {
      console.log('finished testing', quote(options.repo));
    }, function (err) {
      console.log('could not update repo', quote(options.repo));
      hr('-');
      console.log(err.stack);
      hr('-');
    })
    .done(function () {
      defer.resolve(options.repo);
    });

  return defer.promise;
}

module.exports = updateSingleRepo;
