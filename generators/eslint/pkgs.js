module.exports =  function getPkgs(options) {
  let pkgJson = {
    devDependencies: {
      eslint: '^7.18.0',
      'eslint-config-airbnb': '^18.2.1',
      "eslint-plugin-import": "^2.22.1",
      "eslint-formatter-friendly": "^7.0.0",
    },
    scripts: {
      "lint": "eslint \"{src,__tests__}/**/*.js\" -f eslint-formatter-friendly",
    }
  }

  if (options.typescript) {
    pkgJson.devDependencies = Object.assign(pkgJson.devDependencies, {
      "@typescript-eslint/eslint-plugin": "^2.6.1",
      "@typescript-eslint/parser": "^2.6.1",
    })
    pkgJson.scripts = Object.assign(pkgJson.scripts, {
      "lint": "eslint \"{src,__tests__}/**/*.{ts,tsx}\" -f eslint-formatter-friendly",
    })
  }

  if (options.prettier) {
    pkgJson.devDependencies = Object.assign(pkgJson.devDependencies, {
      "eslint-plugin-prettier": "^3.3.1",
      "eslint-config-prettier": "^6.15.0",
    })
  }

  if (options.react) {
    pkgJson.devDependencies = Object.assign(pkgJson.devDependencies, {
      "eslint-plugin-jsx-a11y": "^6.4.1",
      "eslint-plugin-react": "^7.22.0",
      "eslint-plugin-react-hooks": "^4.0.0",
    })
  }

  if (options['parent-pkg']) {
    if (options.typescript) {
      pkgJson.scripts = Object.assign(pkgJson.scripts, {
        "lint": "eslint \"**/{src,__tests__}/**/*.{ts,tsx}\" -f eslint-formatter-friendly",
      })
    }
    else {
      pkgJson.scripts = Object.assign(pkgJson.scripts, {
        "lint": "eslint \"**/{src,__tests__}/**/*.js\" -f eslint-formatter-friendly",
      })
    }
  }

  if (options['sub-pkg']) {
    delete pkgJson.devDependencies
  }

  return pkgJson
}
