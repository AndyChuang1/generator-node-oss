'use strict';

const path = require('path');

const Generator = require('yeoman-generator');
const camelCase = require('lodash.camelcase');
const kebabCase = require('lodash.kebabcase');
const includes = require('lodash.includes');
const commandExists = require('command-exists');
const findUp = require('find-up');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        name: 'projectName',
        message: 'Project name',
        default: this.appname,
      },
      {
        name: 'description',
        message: 'Description',
        default: 'Generated by `generator-node-oss`',
        store: true,
      },
      {
        name: 'extras',
        message: 'Extra features',
        type: 'checkbox',
        choices: [
          {
            name: 'Code Coverage',
            value: 'coverage',
            checked: true,
          },
          {
            name: 'Auto-formatting with Prettier',
            value: 'prettier',
          },
          {
            name: 'ESNext with Babel',
            value: 'esnext',
          },
          {
            name: 'GitHub templates',
            value: 'githubTemplates',
          },
        ],
      },
      {
        name: 'name',
        message: "Author's name",
        default: this.user.git.name(),
      },
      {
        name: 'email',
        message: "Author's email",
        default: this.user.git.email(),
      },
      {
        name: 'website',
        message: "Author's website",
        store: true,
      },
      {
        name: 'githubUsername',
        message: 'GitHub username',
        store: true,
      },
    ]).then(answers => {
      this.props = {
        projectName: kebabCase(answers.projectName),
        camelProject: camelCase(answers.projectName),
        description: answers.description,
        coverage: includes(answers.extras, 'coverage'),
        esnext: includes(answers.extras, 'esnext'),
        prettier: includes(answers.extras, 'prettier'),
        githubTemplates: includes(answers.extras, 'githubTemplates'),
        name: answers.name,
        email: answers.email,
        website: answers.website,
        githubUsername: answers.githubUsername,
      };
    });
  }

  configuring() {
    if (path.basename(this.destinationPath()) !== this.props.projectName) {
      this.spawnCommandSync('mkdir', [this.props.projectName]);
      this.destinationRoot(this.destinationPath(this.props.projectName));
    }
  }

  writing() {
    this.fs.copyTpl(
      [
        `${this.templatePath()}/**`,
        '!**/_babelrc',
        '!**/_github/**',
        '!**/contributing.md',
        '!**/other/**',
      ],
      this.destinationPath(),
      this.props
    );

    const mv = (from, to) => {
      this.fs.move(this.destinationPath(from), this.destinationPath(to));
    };

    mv('_editorconfig', '.editorconfig');
    mv('_gitattributes', '.gitattributes');
    mv('_gitignore', '.gitignore');
    mv('_package.json', 'package.json');
    mv('_test.js', 'test.js');
    mv('_travis.yml', '.travis.yml');

    if (this.props.esnext) {
      mv('index.js', 'src/index.js');
      mv('test.js', 'src/index.test.js');
      this.fs.copy(
        this.templatePath('_babelrc'),
        this.destinationPath('.babelrc')
      );
    }

    if (this.props.githubTemplates) {
      this.fs.copyTpl(
        this.templatePath('_github'),
        this.destinationPath('.github'),
        this.props
      );
      this.fs.copyTpl(
        this.templatePath('other'),
        this.destinationPath('other'),
        this.props
      );
      this.fs.copyTpl(
        this.templatePath('contributing.md'),
        this.destinationPath('contributing.md'),
        this.props
      );
    }

    this.spawnCommandSync('git', ['init', '--quiet']);
  }
  install() {
    const hasYarn = commandExists.sync('yarn');

    this.installDependencies({
      bower: false,
      npm: !hasYarn,
      yarn: hasYarn,
      callback: this.fs.delete(findUp.sync('.yo-rc.json')),
    });
  }
};
