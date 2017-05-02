# vile-htmllint

A [vile](https://vile.io) plugin for [htmllint](https://htmllint.github.io).

**NOTICE**

This project is not actively maintained. If you want to
help maintain the project, or if you have a better
alternative to switch to, please open an issue and ask!

## Requirements

- [nodejs](http://nodejs.org)
- [npm](http://npmjs.org)

## Installation

    npm i -D vile vile-htmllint

## Config File

By default, config uses `.htmllintrc`.

You can specify a custom one, instead:

```yaml
htmllint:
  config: htmllint.json
```

Or, you can specify inline rules:

```yaml
htmllint:
  config:
    doctype-html5: true
```

## Ignoring Files

`vile.ignore` is used as a base, but you can add onto it:

```yaml
htmllint:
  ignore: [
    "some/path/**"
    "file",
    "dir"
  ]
```

## Plugins

This will pass these values to `htmllint.use`.

```yaml
htmllint:
  config:
    plugins: [ "a_plugin" ]
```

## Versioning

This project ascribes to [semantic versioning](http://semver.org).

## Licensing

This project is licensed under the [MPL-2.0](LICENSE) license.

Any contributions made to this project are made under the current license.

## Contributions

Current list of [Contributors](https://github.com/forthright/vile-htmllint/graphs/contributors).

Any contributions are welcome and appreciated!

All you need to do is submit a [Pull Request](https://github.com/forthright/vile-htmllint/pulls).

1. Please consider tests and code quality before submitting.
2. Please try to keep commits clean, atomic and well explained (for others).

### Issues

Current issue tracker is on [GitHub](https://github.com/forthright/vile-htmllint/issues).

Even if you are uncomfortable with code, an issue or question is welcome.

### Code Of Conduct

This project ascribes to [contributor-covenant.org](http://contributor-covenant.org).

By participating in this project you agree to our [Code of Conduct](CODE_OF_CONDUCT.md).

### Maintainers

- Nothing to see here...

## Hacking

    cd vile-htmllint
    npm install
    npm test

To run compile task with file watch in the background:

    npm run dev

To run tests with coverage:

    npm run test-cov

See `package.json` for other available scripts.

## Architecture

- `src` is es6+ syntax compiled with [Babel](https://babeljs.io)
- `lib` generated js library
- `test` is any test code, written in [CoffeeScript](http://coffeescript.org)
- `.test` where coffeescript is generated to
