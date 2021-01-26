'use strict';
const Generator = require('yeoman-generator');
const getPkgs = require('./pkgs');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.option("typescript");

    this.option("react");

    this.option("prettier");

    this.option('parent-pkg')

    this.option('sub-pkg')
  }
  writing() {
    let pkgJson = getPkgs(this.options)
    if (!this.options['sub-pkg']) {
      this.fs.copyTpl(
        this.templatePath('eslintrc.tmpl'),
        this.destinationPath('.eslintrc.js'),
        {
          typescript: this.options.typescript,
          prettier: this.options.prettier,
          react: this.options.react
        }
      );
      this.fs.copy(
        this.templatePath('eslintignore.tmpl'),
        this.destinationPath('.eslintignore')
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
