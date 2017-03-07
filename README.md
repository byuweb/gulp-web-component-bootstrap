# byu-web-component-loader-generator

[![NPM version][npm-image]][npm-url]

Generates a file that can be used to ensure that Web Component Polyfills
are loaded before the web components themselves.  Is also capable of
loading different bundles for browser that support ES6 and those that
don't (IE 10/11).  The built-in defaults are for Brigham Young University,
but can be used by others by overriding the polyfill URL.

# Usage

## Installation

```
npm install --save-dev byu-web-component-loader-generator
```

## Raw Node.js

```
const wcLoaderGenerator = require('byu-web-component-loader-generator');

let fileContents = wcLoaderGenerator({
    polyfills: 'path/to/polyfills.js', //Can also be an absolute URL
    bundle: 'path/to/bundle.js', //Can also be an absolute URL
    compatBundle: 'path/to/bundle.es5.js' //Can also be an absolute URL
});


//Write out to a file or something
```

## Gulp.js or Vinyl Streams

```
const wcLoaderGenerator = require('byu-web-component-loader-generator');

gulp.task('generate-loader', function() {
    return gulp.src('./this/doesnt/matter.js')
        .pipe(wcLoaderGenerator.stream({
            polyfills: 'path/to/polyfills.js', //Can also be an absolute URL
            bundle: 'path/to/bundle.js', //Can also be an absolute URL
            compatBundle: 'path/to/bundle.es5.js' //Can also be an absolute URL
         })
         .pipe(gulp.dest('dist'));
});
```

# Options

## A Note on relative vs. absolute URLs

This library is capable of using either absolute or relative URLs to serve
files. Relative URLs are resolved relative to the loader script.
There is a small performance hit to using relative URLs, however,
because in order to support IE 11, we have to polyfill window.currentScript
in order to resolve the URLs.  This performance hit comes in the way of
a slightly larger loader file.

*TODO: Add actual numbers about the added size*

## polyfills

**default**: https://cdn.byu.edu/web-component-polyfills/latest/polyfills.min.js

The URL (relative or absolute) of the bundled polyfill files to serve.

If you're using this for any organization other than Brigham Young University,
we ask that you specify your own bundle here.

## bundle

The URL (relative or absolute) of the web component bundle script to
load.

## compatBundle

**Optional**

The URL (relative or absolute) of the ES5-compatible web component bundle.

If not specified, we assume that the file specified in `bundle` will work
for ES5-only clients, or that you do not want to support them.

# Support

Since this is developed by BYU for BYU, it may change at any time to
match our needs. Buyer Beware.

# License

Apache 2.0

[npm-url]: https://www.npmjs.com/package/byu-web-component-loader-generator
[npm-image]: https://img.shields.io/npm/v/byu-web-component-loader-generator.svg
