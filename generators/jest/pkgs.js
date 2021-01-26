module.exports =  function getPkgs(options) {
  let pkgJson = {
    devDependencies: {
      "@types/jest": "^26.0.20",
      "jest": "^26.6.3",
    },
    scripts: {
      "test": "jest"
    }
  }

  if (options.typescript) {
    pkgJson.devDependencies["ts-jest"] = "^26.4.4";

  } else {
    pkgJson.devDependencies["cross-env"] = "^7.0.3";
    pkgJson.scripts.test = "cross-env NODE_OPTIONS=--experimental-vm-modules jest"

  }

  if (options.coverage) {
    pkgJson.devDependencies["jest-junit"] = "^12.0.0"
    pkgJson.scripts["test-ci"] = "cross-env NODE_OPTIONS=--experimental-vm-modules jest --ci --coverage"

    if (options.typescript) {
      pkgJson.scripts["test-ci"] = "jest --ci --coverage"
    }
  }

  if (options['sub-pkg']) {
    delete pkgJson.devDependencies
  }

  return pkgJson
}
