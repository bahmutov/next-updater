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
  nextUpdater.testModuleUpdate('bahmutov/test-next-updater')
  .then(function () {
    gt.start();
  });
}, 30000);
