require('lazy-ass');
var check = require('check-more-types');

function toUpdateSummary(testResults) {
  la(check.array(testResults), 'expected test results array', testResults);

  var summary = {};

  testResults.forEach(function (dependencyResults) {
    la(check.array(dependencyResults), 'not an array for one dependency', dependencyResults);
    dependencyResults.forEach(function (result) {
      la(check.unemptyString(result.name),
        'missing dependency name', result, 'in', dependencyResults);
      la(check.unemptyString(result.version),
        'missing dependency version', result, 'in', dependencyResults);

      if (result.works) {
        summary[result.name] = result.version;
      }
    });
  });

  return summary;
}

module.exports = toUpdateSummary;
