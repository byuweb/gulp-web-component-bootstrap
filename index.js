/*
 *  @license
 *    Copyright 2017 Brigham Young University
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

module.exports = generateFile;
module.exports.stream = generateFileStream;

const DEFAULT_POLYFILLS = 'https://cdn.byu.edu/web-component-polyfills/latest/web-component-polyfills.min.js';
const DEFAULT_LOADER = 'loader.js';

/**
 * @typedef {{}} Opts
 * @property {string} output
 * @property {string} [polyfillsUrl]
 * @property {string} bundleFile
 * @proprety {string} [bundleFileMin]
 * @property {string} compatBundleFile
 * @property {string} [compatBundleFileMin]
 */

function generateFile(options) {
    if (!options) {
        throw new Error('must specify options');
    }
    const polyfills = options.polyfills || DEFAULT_POLYFILLS;

    const bundle = options.bundle;
    if (!bundle) throw new Error('must specify a bundle file');

    const compat = options.compatBundle;

    let template = fs.readFileSync(path.join(__dirname, 'bootstrap.template.js'), {encoding: 'utf8'});
    return Buffer.from(ejs.render(template, {
        files: {
            loader: options.output || DEFAULT_LOADER,
            bundle: bundle,
            compat: compat,
            polyfills: polyfills
        }
    }));
}

function generateFileStream(options) {
    const through = require('through2');
    const Vinyl = require('vinyl');
    let written = false;
    return through.obj(function (file, enc, cb) {
        if (!written) {
            written = true;
            this.push(new Vinyl({
                path: options.output || DEFAULT_LOADER,
                contents: generateFile(options)
            }));
        }
        this.push(file);
        cb();
    });
}

