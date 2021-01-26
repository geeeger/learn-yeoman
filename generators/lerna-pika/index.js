'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const ejs = require('ejs');
const _ = require('lodash');
const jestPkgs = require('../jest/pkgs')
const eslintPkgs = require('../eslint/pkgs')
const pikaPkgs = require('../pika/pkgs')
const prettierPkgs = require('../prettier/pkgs')
const tsPkgs = require('../ts/pkgs')

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts)

    this.option("typescript");

    this.option("prettier");

    this.option("pika");

    this.option("registry", {
      type: String,
      default: 'https://registry.npmjs.org/',
    });

    this.option("react");

    this.option("coverage");

    this.option('parent-pkg');

    this.option('sub-pkg');
  }

  initializing() {
    const options = Object.assign({}, this.options)
    this.composeWith(require.resolve('../editorconfig'), options);
    this.composeWith(require.resolve('../eslint'), options);
    this.composeWith(require.resolve('../gitignore'), options);
    this.composeWith(require.resolve('../jest'), options);
    this.composeWith(require.resolve('../npmrc'), options);
    if (this.options.prettier) {
      this.composeWith(require.resolve('../prettier'), options);
    }
    this.composeWith(require.resolve('../readme'), options);
    if (this.options.typescript) {
      this.composeWith(require.resolve('../ts'), options);
    }
    this.composeWith(require.resolve('../pika'), options);
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the impeccable ${chalk.red('generator-config')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: '请输入项目名',
        default: 'my-project'
      },
      {
        type: 'input',
        name: 'desc',
        message: '请输入项目描述',
        default: ''
      },
      {
        type: 'input',
        name: 'homepage',
        message: '对应git仓库地址',
        default: '',
      },
      {
        type: 'input',
        name: 'author',
        message: '作者名',
        default: '',
      },
      {
        type: 'input',
        name: 'email',
        message: '邮箱地址',
        default: ''
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    let result = ejs.render(this.fs.read(this.templatePath('package.json.tmpl')), Object.assign({}, this.props, {
      registry: this.options.registry,
      typescript: this.options.typescript
    }))

    if (this.options['parent-pkg']) {
      this.fs.copyTpl(
        this.templatePath('index.tmpl'),
        this.destinationPath(`lerna.json`)
      );
    }

    let pkgJSON = JSON.parse(result)

    pkgJSON.private = true

    const options = Object.assign({}, this.options)

    pkgJSON = _.merge(pkgJSON, jestPkgs(options))

    pkgJSON = _.merge(pkgJSON, eslintPkgs(options))

    if (this.options.typescript) {
      pkgJSON = _.merge(pkgJSON, tsPkgs(options))
    }

    if (this.options.prettier) {
      pkgJSON = _.merge(pkgJSON, prettierPkgs(options))
    }

    if (this.options.pika) {
      pkgJSON = _.merge(pkgJSON, pikaPkgs(options))
    }

    if (this.options['parent-pkg']) {
      pkgJSON = _.merge(pkgJSON, {
        scripts: {
          "version": "lerna version",
          "build:lerna": "lerna run build",
          "publish": "lerna publish from-package --contents pkg",
          "nuke": "lerna exec \"rm -f package-lock.json npm-shrinkwrap.json\" && lerna clean --yes && lerna bootstrap && lerna exec --stream -- \"test -f package-lock.json || npm install --package-lock-only\""
        },
        devDependencies: {
          lerna: "^3.22.1"
        }
      })

      delete pkgJSON.version
    }

    if (this.options['sub-pkg']) {
      this.fs.copyTpl(
        this.templatePath('index.tmpl'),
        this.destinationPath(`src/index.${this.options.typescript ? 'ts' : 'js'}`),
        {
          typescript: this.options.typescript
        }
      );
    }
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJSON);
  }

  // install() {
  //   this.installDependencies();
  // }
};
