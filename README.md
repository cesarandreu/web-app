# Web app

Reasonable starting point for building a web app.

## Features

* Reasonable webpack configuration starting point
* JSX, ES6, and ES7 with babel.js
* Development server with hot reload when possible and refresh otherwise
* Production builds with cache busting and asset minification
* Testing environment using karma to run tests and mocha as the framework
* No gulp and no grunt, just npm run-scripts

## Installation

Install [io.js](https://iojs.org/), my favored approach is using [Node Version Manager](https://github.com/creationix/nvm). (Tested with `iojs-v2.2.1` and `npm-v2.11.0`.)

Clone the repo and change `origin` git remote.

```shell
$ npm install
```

## Scripts

All scripts are run with `npm run [script]`, for example: `npm run test`.

* `build` - generate a minified build to public folder
* `dev` - start development server, try it by opening `http://localhost:8080/`
* `test` - run all tests
* `test:unit` - run all unit tests
* `test:unit:live` - continuously run unit tests watching for changes

See what each script does by looking at the `scripts` section in [package.json](./package.json).
