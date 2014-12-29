/*global module:false*/
module.exports = function(grunt) {
  require('time-grunt')(grunt);

  var sourceFiles = ['index.js', 'src/**/*.js', '!src/**/cover/**/*.js'];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: sourceFiles,
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-summary')
      }
    },

    eslint: {
      target: sourceFiles,
      options: {
        config: 'eslint.json',
        rulesdir: ['./node_modules/eslint-rules']
      }
    },

    jscs: {
      src: sourceFiles,
      options: {
          config: 'jscs.json'
      }
    },

    jsonlint: {
      all: {
        src: ['package.json', 'complexity.json']
      }
    },

    complexity: {
      all: {
        src: [sourceFiles, '!index.js', '!src/**/test/*.js'],
        options: {
          errorsOnly: false,
          cyclomatic: 7,
          halstead: 18,
          maintainability: 100
        }
      }
    },

    'nice-package': {
      all: {
        options: {}
      }
    },

    help: {
      options: {
        destination: 'docs/help.md',
        characters: '```'
      },
      all: {}
    },

    readme: {
      options: {
        readme: './docs/README.tmpl.md',
        docs: '.',
        templates: './docs'
      }
    },
    /* to bump version, then run grunt (to update readme), then commit
    grunt release
    */
    bump: {
      options: {
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['-a'], // '-a' for all files
        createTag: true,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin'
      }
    }
  });

  var plugins = require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('lint', ['jsonlint', 'jshint', 'eslint', 'jscs']);
  grunt.registerTask('pre-check', ['deps-ok', 'lint', 'nice-package', 'complexity']);
  grunt.registerTask('default', ['pre-check', 'help', 'readme']);
  grunt.registerTask('release', ['bump-only:patch', 'help', 'readme', 'bump-commit']);
};
