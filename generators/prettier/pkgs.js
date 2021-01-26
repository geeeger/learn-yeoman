module.exports =  function getPkgs(options) {
  let pkgJson = {
    devDependencies: {
      prettier: '^2.2.1'
    },
    scripts: {
      "format": "prettier --write \"**/src/**/*.js\"  \"!**/lib/**\" \"!**/dist/**\"",
    }
  }

  if (options.typescript) {
    pkgJson.scripts = Object.assign(pkgJson.scripts, {
      "format": "prettier --write \"**/src/**/*.ts\"  \"!**/lib/**\" \"!**/dist/**\"",
    })
  }

  if (options['sub-pkg']) {
    delete pkgJson.devDependencies
  }

  return pkgJson
}
