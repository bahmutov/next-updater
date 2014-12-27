function checkUpdates() {
  var pkg = require('../package.json');
  var updateNotifier = require('update-notifier');
  var notifier = updateNotifier({
    packageName: pkg.name,
    packageVersion: pkg.version
  });
  if (notifier.update) {
    notifier.notify();
  }
}

checkUpdates();
