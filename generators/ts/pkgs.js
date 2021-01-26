module.exports =  function getPkgs(options) {
  let pkgJson = {
    devDependencies: {
      typescript: '^3.9.7',
      "@typescript-eslint/eslint-plugin": "^4.7.0",
      "@typescript-eslint/parser": "^4.7.0",
    },
    scripts: {
      "build:tsc": "tsc --pretty",
      "check": "tsc --noEmit",
      "release:tsc": "npm run build:tsc && npm publish"
    }
  }

  if (options.pika) {
    delete pkgJson.scripts
  }

  if (options['sub-pkg']) {
    delete pkgJson.devDependencies
  }

  if (options['parent-pkg']) {
    delete pkgJson.scripts
  }

  return pkgJson
}
