require('lazy-ass');
var check = require('check-more-types');

function updateUserRepos(options) {
  la(check.object(options), 'missing options');
  la(check.unemptyString(options.user), 'cannot find user option', options);
}

module.exports = updateUserRepos;
