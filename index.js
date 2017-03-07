/**
 * Created by jmooreoa on 12/2/16.
 */

const through = require('through2');
const Vinyl = require('vinyl');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

module.exports = generateFile;
module.exports.stream = generateFileStream;

const DEFAULT_POLYFILLS = 'https://cdn.byu.edu/web-component-polyfills/latest/polyfills.min.js';

const ABSOLUTE_URL_PATTERN = /^https?:\/\/|^\/\//i;

/**
 * @typedef {{}} Opts
 * @property {string} [polyfillsUrl]
 * @property {string} bundleFile
 * @property {string} compatBundleFile
 */

function generateFile(options) {
    if (!options) {
        throw new Error('must specify options');
    }
    const polyfills = options.polyfillsUrl || DEFAULT_POLYFILLS;

    const bundle = options.bundleFile;
    if (!bundle) throw new Error('must specify a bundle file');

    let hasRelative = isRelative(polyfills) || isRelative(bundle);

    const compat = options.compatBundleFile;

    if (compat) hasRelative = hasRelative || isRelative(compat);

    let template = fs.readFileSync(path.join(__dirname, 'bootstrap.template.js'), {encoding: 'utf8'});
    return Buffer.from(ejs.render(template, {
        relativeUrls: hasRelative,
        files: {
            bundle: bundle,
            compat: compat,
            polyfills: polyfills
        }
    }));

    function isRelative(file) {
        return !ABSOLUTE_URL_PATTERN.test(file);
    }
}

function generateFileStream(options) {
    return through.obj(function (file, enc, cb) {
        this.push(file);
        this.push(new Vinyl({
            path: opts.output || 'bootstrap.js',
            contents: generateFile(options)
        }));
    });
}

