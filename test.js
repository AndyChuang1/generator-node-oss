'use strict';

const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

test('destinationRoot', () => {
  return helpers
    .run(path.join(__dirname, './app'))
    .withPrompts({ projectName: 'temp' })
    .then(() => {
      assert.equal(path.basename(process.cwd()), 'temp');
    });
});

test('default files', () => {
  return helpers.run(path.join(__dirname, './app')).then(() => {
    assert.file([
      '.git',
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.travis.yml',
      'index.js',
      'license',
      'package.json',
      'readme.md',
      'test.js',
    ]);

    assert.noFile([
      '.babelrc',
      '.prettierignore',
      '.yo-rc.json',
      'src/index.js',
      'src/index.test.js',
    ]);
  });
});

describe('prompts', () => {
  test('projectName', () => {
    return helpers
      .run(path.join(__dirname, './app'))
      .withPrompts({
        githubUsername: 'foo',
        projectName: 'bar',
      })
      .then(() => {
        assert.jsonFileContent('package.json', {
          name: 'bar',
          repository: 'https://github.com/foo/bar',
        });

        assert.fileContent(
          'readme.md',
          '[![Package Version](https://img.shields.io/npm/v/bar.svg?style=flat-square)](https://www.npmjs.com/package/bar)'
        );
        assert.fileContent(
          'readme.md',
          '[![Build Status: Linux](https://img.shields.io/travis/foo/bar/master.svg?style=flat-square)](https://travis-ci.org/foo/bar)'
        );
        assert.fileContent(
          'readme.md',
          '[![Downloads Status](https://img.shields.io/npm/dm/bar.svg?style=flat-square)](https://npm-stat.com/charts.html?package=bar&from=2016-04-01)'
        );

        assert.fileContent('readme.md', '# bar');
        assert.fileContent('readme.md', 'npm install --save bar');
        assert.fileContent('readme.md', "const bar = require('bar');");
      });
  });

  test('description', () => {
    return helpers
      .run(path.join(__dirname, './app'))
      .withPrompts({ description: 'foo' })
      .then(() => {
        assert.jsonFileContent('package.json', {
          description: 'foo',
        });
        assert.fileContent('readme.md', 'foo');
      });
  });

  test('name', () => {
    return helpers
      .run(path.join(__dirname, './app'))
      .withPrompts({ name: 'foo bar' })
      .then(() => {
        assert.jsonFileContent('package.json', {
          author: {
            name: 'foo bar',
          },
        });

        assert.fileContent('license', 'foo bar');
        assert.fileContent('readme.md', 'MIT &copy; [foo bar]');
      });
  });

  test('email', () => {
    return helpers
      .run(path.join(__dirname, './app'))
      .withPrompts({ email: 'foo@bar.com' })
      .then(() => {
        assert.jsonFileContent('package.json', {
          author: {
            email: 'foo@bar.com',
          },
        });

        assert.fileContent('license', 'foo@bar.com');
      });
  });

  test('website', () => {
    return helpers
      .run(path.join(__dirname, './app'))
      .withPrompts({ website: 'test.com' })
      .then(() => {
        assert.jsonFileContent('package.json', {
          author: {
            url: 'test.com',
          },
        });

        assert.fileContent('readme.md', 'test.com');
      });
  });

  describe('extras', () => {
    test('coverage', () => {
      return helpers
        .run(path.join(__dirname, './app'))
        .withPrompts({
          githubUsername: 'foo',
          projectName: 'bar',
          extras: ['coverage'],
        })
        .then(() => {
          assert.jsonFileContent('package.json', {
            scripts: {
              test: 'jest --coverage',
            },
          });

          assert.fileContent(
            '.travis.yml',
            'after_success: if [[ `npm -v` > 4* ]]; then npx codecov; fi'
          );

          assert.fileContent(
            'readme.md',
            '[![Coverage Status](https://img.shields.io/codecov/c/github/foo/bar/master.svg?style=flat-square)](https://codecov.io/gh/foo/bar)'
          );
        });
    });

    test('prettier', () => {
      return helpers
        .run(path.join(__dirname, './app'))
        .withPrompts({ extras: ['prettier'] })
        .then(() => {
          assert.fileContent('package.json', 'eslint-config-prettier');
          assert.fileContent(
            '.travis.yml',
            'node node_modules/.bin/prettier -l "*.{js,json,md}"'
          );
          assert.file('.prettierignore');
          assert.jsonFileContent('package.json', {
            'lint-staged': {
              '*.{js,json,md}': ['prettier --write'],
            },
            prettier: {
              singleQuote: true,
              trailingComma: 'es5',
            },
            xo: {
              extends: 'prettier',
            },
          });
        });
    });

    test('esnext', () => {
      return helpers
        .run(path.join(__dirname, './app'))
        .withPrompts({
          projectName: 'foo',
          extras: ['esnext'],
        })
        .then(() => {
          assert.file(['.babelrc', 'src/index.js', 'src/index.test.js']);
          assert.noFile(['index.js', 'test.js']);

          assert.fileContent('.gitignore', 'dist');

          assert.jsonFileContent('package.json', {
            scripts: {
              prebuild: 'rimraf dist',
              build: 'babel src --out-dir dist --copy-files --ignore *.test.js',
            },
            main: 'dist/index.js',
            files: ['dist'],
          });
          assert.fileContent('package.json', 'babel-cli');
          assert.fileContent('package.json', 'babel-jest');
          assert.fileContent('package.json', 'babel-plugin-add-module-exports');
          assert.fileContent('package.json', 'babel-preset-env');
          assert.fileContent('package.json', 'rimraf');

          assert.fileContent('.travis.yml', /npm run build/);

          assert.fileContent('src/index.test.js', "import foo from './';");
          assert.fileContent(
            'src/index.js',
            "export default (input = 'No args passed!')"
          );
        });
    });

    test('githubTemplates', () => {
      return helpers
        .run(path.join(__dirname, './app'))
        .withPrompts({
          githubUsername: 'foo',
          projectName: 'bar',
          email: 'foo@test.com',
          extras: ['githubTemplates'],
        })
        .then(() => {
          assert.fileContent('contributing.md', 'https://github.com/foo/bar');
          assert.fileContent(
            '.github/issue_template.md',
            /bar version: <!-- run `npm ls bar` -->/
          );
          assert.fileContent(
            '.github/pull_request_template.md',
            'https://github.com/foo/bar/blob/master/contributing.md'
          );
          assert.fileContent('other/code_of_conduct.md', 'foo@test.com');
        });
    });
  });
});
