'use strict';
const Generator = require('yeoman-generator');
const getPkgs = require('./pkgs');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.option("typescript");

    this.option("coverage");

    this.option('parent-pkg')

    this.option('sub-pkg')
  }
  writing() {
    let pkgJson = getPkgs(this.options)

    if (!this.options['sub-pkg']) {
      this.fs.copyTpl(
        this.templatePath('jest.config.tmpl'),
        this.destinationPath('jest.config.js'),
        {
          typescript: this.options.typescript,
          coverage: this.options.coverage
        }
      );
    }

    if (!this.options['parent-pkg']) {
      this.fs.copyTpl(
        this.templatePath('jest.test.tmpl'),
        this.destinationPath(`__tests__/index.spec.${this.options.typescript ? 'ts' : 'js'}`),
        {
          typescript: this.options.typescript,
          coverage: this.options.coverage
        }
      );
    }

    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    });
  }
};
