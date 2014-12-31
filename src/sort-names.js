require('lazy-ass');
var check = require('check-more-types');

function sortAsc(names) {
  names.sort();
  names.reverse();
  console.log('sorted names from Z to A');
  return names;
}

function sortDesc(names) {
  names.sort();
  console.log('sorted names from A to Z');
  return names;
}

function sortReverse(names) {
  names.reverse();
  console.log('reversed names order');
  return names;
}

function defaultSort(names) {
  console.log('leaving the original sort order');
  return names;
}

var sortFunctions = {
  asc: sortAsc,
  desc: sortDesc,
  reverse: sortReverse
};

function sortNames(sort, names) {
  la(check.unemptyString(sort), 'missing sort order string', sort);
  la(check.arrayOfStrings(names), 'missing names', names);

  var sortFn = sortFunctions[sort] || defaultSort;
  return sortFn(names);
}

module.exports = sortNames;
