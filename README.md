# next-updater v0.9.0

> Dependable and safe automatic dependency updater for Nodejs packages

[![NPM][next-updater-icon] ][next-updater-url]

[![Build status][next-updater-ci-image] ][next-updater-ci-url]
[![dependencies][next-updater-dependencies-image] ][next-updater-dependencies-url]
[![devdependencies][next-updater-devdependencies-image] ][next-updater-devdependencies-url]

[next-updater-icon]: https://nodei.co/npm/next-updater.png?downloads=true
[next-updater-url]: https://npmjs.org/package/next-updater
[next-updater-ci-image]: https://travis-ci.org/bahmutov/next-updater.png?branch=master
[next-updater-ci-url]: https://travis-ci.org/bahmutov/next-updater
[next-updater-dependencies-image]: https://david-dm.org/bahmutov/next-updater.png
[next-updater-dependencies-url]: https://david-dm.org/bahmutov/next-updater
[next-updater-devdependencies-image]: https://david-dm.org/bahmutov/next-updater/dev-status.png
[next-updater-devdependencies-url]: https://david-dm.org/bahmutov/next-updater#info=devDependencies




## Command line options
```
next-updater - Dependable and safe automatic dependency updater for Nodejs packages
 version: 0.9.0
 author: Gleb Bahmutov <gleb.bahmutov@gmail.com>
 more info at: https://github.com/bahmutov/next-updater

Options:
  --version, -v   show version and exit                              [default: false]
  --push, -p      push changes (if any) to remote origin             [string]  [default: true]
  --repo, -r      <github username/repo>                             [default: null]
  --config, -c    JSON config filename                               [default: null]
  --user, -u      fetch list of repos for this github username       [default: null]
  --sort, -s      sort repos (listed, reverse, asc, desc)            [string]  [default: undefined]
  --clean         delete temp folder after finished                  [default: false]
  --allow         allow major / minor / patch updates                [default: "major"]
  --tag, -t       tag changed code with new patch version            [default: false]
  --publish       publish to NPM (if updated and has package.json)   [default: false]
  --npm-user, -n  update all NPM published repos for the given user  [default: null]
  -N              Limit update to first N sorted repos               [default: 10000]
```



install:

```
sudo npm install -g next-updater
```

### Update single repo

This is the simplest case - you want to upgrade NPM or bower dependencies in a single
repo (without breaking tests), then commit the changes. You should have permissions to
fetch and push changes.

```sh
next-updater --repo <github username>/<github reponame>
```

You can clone / test / commit locally without pushing changes to the remote server using `--push false` option
This way you can validate the results in the temp folder first.

```sh
next-updater --repo <github username>/<github reponame> --push false
```

Only check minor and patch updates, delete temp folder after pushing

```sh
next-updater --repo <github username>/<github reponame> --allow minor --clean
```

Update patch dependencies, commit changes, tag package with new version (increments patch),
then push to remote and publishes to NPM. Checks if there is *package.json* and the package is
not marked `private`.

```sh
next-updater --repo <github username>/<github reponame> --push true --tag true --publish true
```

### Update all github repos

Uses Github API to fetch all repos for the given username, then updates and pushes them one by one.

```sh
next-updater --user <github username>
```

Update all github repos, starting with the ones that were not updated the longest, allow
only patch updates

```sh
next-updater --user <github username> --sort oldest --allow patch
```

Other options from the above are also applied to each repo (`--push, --tag, etc`).

### Update NPM packages

Uses public NPM registry info to fetch packages maintained by the give npm username,
finds the corresponding github repo and updates the repo.

Example: update first 5 NPM packages (aphabetical order), tag and publish back to NPM registry.

```sh
next-updater --npm-user <NPM username> --sort desc -N 5 --tag --publish
```

### Update using parameters from config JSON file

Most flexible and repeatable way to update certain repos. Reads the settings from a JSON file.
Any additional command line options will overwrite the settings listed in the JSON file.
For example to use `my-repos.json` file but not to push the changes:

```sh
next-updater --config my-repos.json --push false
```

Typical config file is a JSON file, but allows C-style comments

```js
{
  // single list of repos to test
  // each repo <username>/<repo name>
  "repos": [
    "foo/bar",
    "foo/baz",
    "foo/baz2"
  ],
  // these options should match command line options
  // command line options will overwrite these
  "options": {
    // push to remote origin if found and committed changes
    "push": true,
    // delete temp folder after finished
    "clean": true,
    // sort order: listed, reverse, asc, desc
    // youngest and oldest
    //  apply to repo list fetched from github for given username
    "sort": "asc",
    // skip testing these repos
    "skip": ["foo/baz"]
  }
}
```



### Small print

Author: Gleb Bahmutov &copy; 2014

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://bahmutov.calepin.co/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet / open issue on Github



## MIT License

Copyright (c) 2014 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.



