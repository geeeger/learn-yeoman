'use strict';
const Generator = require('yeoman-generator');
const getPkgs = require('./pkgs');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts)

    this.option('parent-pkg')

    this.option('sub-pkg')
  }

  writing() {
    let pkgJson = getPkgs(this.options)

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
