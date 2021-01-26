'use strict';
const Generator = require('yeoman-generator');
const getPkgs = require('./pkgs');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.option('parent-pkg')

    this.option('sub-pkg')

    this.option('pika')
  }

  writing() {

    let pkgJson = getPkgs(this.options)

    if (!this.options['parent-pkg']) {
      this.fs.copy(
        this.templatePath('tsconfig.json.tmpl'),
        this.destinationPath('tsconfig.json')
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
