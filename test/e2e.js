gt.module('end to end tests');

var path = require('path');
var indexPath = path.join(__dirname, '../index.js');
var repo = 'bahmutov/test-next-updater';

gt.async('showing help', function () {
  gt.exec('node', [indexPath, '--help'], 0);
}, 5000);

gt.async('testing --repo', function () {
  gt.exec('node', [indexPath, '--repo', repo], 0);
}, 10000);

gt.async('testing -r', function () {
  gt.exec('node', [indexPath, '-r', repo], 0);
}, 10000);