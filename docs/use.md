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

## Update all github repos

Uses Github API to fetch all repos for the given username, then updates and pushes them one by one.

```sh
next-updater --user <github username>
```

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
    // skip testing these repos
    "skip": ["foo/baz"]
  }
}
```
