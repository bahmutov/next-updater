install:

```
sudo npm install -g {%= name %}
```

## Update single repo

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

## Update all github repos

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

## Update using parameters from config JSON file

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
