# generator-node-oss

[![Package Version](https://img.shields.io/npm/v/generator-node-oss.svg?style=flat-square)](https://www.npmjs.com/package/generator-node-oss)
[![Downloads Status](https://img.shields.io/npm/dm/generator-node-oss.svg?style=flat-square)](https://npm-stat.com/charts.html?package=generator-node-oss&from=2016-04-01)
[![Build Status: Linux](https://img.shields.io/travis/luftywiranda13/generator-node-oss/master.svg?style=flat-square)](https://travis-ci.org/luftywiranda13/generator-node-oss)
[![Coverage Status](https://img.shields.io/codecov/c/github/luftywiranda13/generator-node-oss/master.svg?style=flat-square)](https://codecov.io/gh/luftywiranda13/generator-node-oss)

This [Yeoman](http://yeoman.io) generator helps you to create a Node.js project with ease.

## Why

* Generates a simple but _ready to start_ project
* Includes only necessary tools
* Monitors repo quality through helpful badges
* [Jest testing framework](https://facebook.github.io/jest)
* Sensible [ESLint](http://eslint.org) config bundled in [XO](https://github.com/sindresorhus/xo)
* [Travis CI](https://travis-ci.org) configuration
* Automates code reformatting using [Prettier](https://github.com/prettier/prettier) _(optional)_
* [Issue, Pull Request, and Contributing templates](https://github.com/blog/2111-issue-and-pull-request-templates) _(optional)_
* [Supports ES2015+ using Babel](https://babeljs.io) _(optional)_

## Installation

```sh
npm install --global yo generator-node-oss
```

## Usage

```sh
yo node-oss
```

With the most basic options, youʼll get a project structured like this:

```sh
$ tree
.
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .travis.yml
├── index.js
├── license
├── package.json
├── readme.md
└── test.js
```

Less boilerplate 🎉

## FAQ

### How to upgrade existing project scaffolded with Yeoman?

Read how to do it [here](https://stackoverflow.com/a/18500003).

## Related

* [generator-bunny](https://github.com/luftywiranda13/generator-bunny) － Supports ES2015+ and [Flow](https://flow.org) by default
* [generator-kcd-oss](https://github.com/kentcdodds/generator-kcd-oss) － Lots of features but many things left untouched
* [generator-nm](https://github.com/sindresorhus/generator-nm) － A way simpler Yeoman generator

## License

MIT &copy; [Lufty Wiranda](https://www.instagram.com/luftywiranda13)
