module.exports =  function getPkgs(options) {
  let pkgJson = {
    devDependencies: {
      "@pika/pack": "^0.5.0",
      "@pika/plugin-build-node": "^0.9.2",
      "@pika/plugin-build-types": "^0.9.2",
      "@pika/plugin-build-web": "^0.9.2",
      "@pika/plugin-standard-pkg": "^0.9.2",
      "pika-plugin-package.json": "^1.0.2"
    },
    scripts: {
      "build:pika": "pika build",
      "build": "npm run build:pika",
      "release:pika": "npm run build:pika && cd pkg && npm publish"
    },
    main: 'pkg/dist-node/index.js',
    types: 'pkg/dist-types/index.d.ts',
    "@pika/pack": {
      "pipeline": [
        ["@pika/plugin-standard-pkg", {"exclude": ["__tests__/**/*"]}],
        ["@pika/plugin-build-node"],
        ["@pika/plugin-build-web"],
        ["@pika/plugin-build-types"],
        [
          "pika-plugin-package.json",
          {
            "+author": "^"
          }
        ]
      ]
    }
  }

  if (options['parent-pkg']) {
    delete pkgJson.scripts
    delete pkgJson.main
    delete pkgJson.types
    delete pkgJson['@pika/pack']
  }

  if (options['sub-pkg']) {
    delete pkgJson.devDependencies
  }

  return pkgJson
}
