/* global gt */
require('lazy-ass');
var check = require('check-more-types');
gt.module('update summary');

var toSummary = require('../update-summary');
la(check.fn(toSummary), 'expected to summary function', toSummary);

gt.test('large summary', function () {
  /* eslint no-single-line-objects:0 */
  var testResults = [ [ { name: 'check-types', from: '1.0.0', version: '2.0.0', works: false },
    { name: 'check-types', from: '1.0.0', version: '2.0.1', works: false },
    { name: 'check-types', from: '1.0.0', version: '2.1.0', works: false },
    { name: 'check-types', from: '1.0.0', version: '2.1.1', works: false } ],
  [ { name: 'dox', from: '0.0.1', version: '0.4.5', works: false },
    { name: 'dox', from: '0.0.1', version: '0.4.6', works: false },
    { name: 'dox', from: '0.0.1', version: '0.5.0', works: false },
    { name: 'dox', from: '0.0.1', version: '0.5.1', works: false },
    { name: 'dox', from: '0.0.1', version: '0.5.2', works: false },
    { name: 'dox', from: '0.0.1', version: '0.5.3', works: false },
    { name: 'dox', from: '0.0.1', version: '0.6.0', works: false },
    { name: 'dox', from: '0.0.1', version: '0.6.1', works: false } ],
  [ { name: 'escodegen', from: '0.0.1', version: '1.4.2', works: true },
    { name: 'escodegen', from: '0.0.1', version: '1.4.3', works: true } ],
  [ { name: 'glob', from: '0.0.1', version: '4.2.2', works: true },
    { name: 'glob', from: '0.0.1', version: '4.3.0', works: true },
    { name: 'glob', from: '0.0.1', version: '4.3.1', works: true },
    { name: 'glob', from: '0.0.1', version: '4.3.2', works: true } ],
  [ { name: 'gt', from: '0.0.1', version: '0.8.45', works: true },
    { name: 'gt', from: '0.0.1', version: '0.8.46', works: true },
    { name: 'gt', from: '0.0.1', version: '0.8.47', works: true } ],
  [ { name: 'string', from: '0.0.1', version: '3.0.0', works: true } ],
  [ { name: 'update-notifier', from: '0.0.1', version: '0.2.0', works: false },
    { name: 'update-notifier', from: '0.0.1', version: '0.2.1', works: false },
    { name: 'update-notifier', from: '0.0.1', version: '0.2.2', works: false } ],
  [ { name: 'grunt-lineending', from: '0.0.1', version: '0.2.4', works: true } ],
  [ { name: 'mocha', from: '0.0.1', version: '2.1.0', works: true } ] ];

  var summary = toSummary(testResults);
  la(check.object(summary), 'summary is an object', summary, 'from', testResults);

  la(check.has(summary, 'escodegen'), 'escodegen', summary);
  la(check.has(summary, 'mocha'), 'mocha', summary);
  la(check.has(summary, 'string'), 'string', summary);

  la(check.object(summary.string), 'has summary for string module', summary);
  la(summary.string.from === '0.0.1', 'has correct from version', summary.string);
  la(summary.string.to === '3.0.0', 'has correct to version', summary.string);
});
