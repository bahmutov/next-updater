/* global gt */
require('lazy-ass');
gt.module('next-updater');

var nextUpdater = require('../next-updater');

gt.test('testModuleUpdate', function () {
  gt.func(nextUpdater.testModuleUpdate, 'is a function');
});

gt.test('invalid repo names', function () {
  gt.throws(function () {
    nextUpdater.testModuleUpdate();
  }, Error, 'need repo string');

  gt.throws(function () {
    nextUpdater.testModuleUpdate('just name');
  }, Error, 'need username / repo string');
});

gt.async('valid repo name', 0, function () {
  var repo = 'bahmutov/test-next-updater';
  nextUpdater.testModuleUpdate(repo)
    .then(function () {
      gt.start();
    }, function (err) {
      throw new Error('Could not test update for ' +
        repo + '\n' + JSON.stringify(err));
    });
}, 60000);
