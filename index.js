/**
 * Created by jmooreoa on 12/2/16.
 */

const through = require('through2');
const Vinyl = require('vinyl');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

module.exports = function bootstrap(options) {
    const opts = options || {};
    const polyfills = opts.polyfills;
    if (!polyfills) {
        throw 'You must specify a polyfill location';
    }
    return through.obj(function (file, enc, cb) {
        this.push(file);
        this.push(new Vinyl({
            path: opts.output || 'bootstrap.js',
            contents: generateContent(opts.main, opts.polyfills)
        }));
    });
};

function generateContent(noPolyfills, polyfills) {
    var template = fs.readFileSync(path.join(__dirname, 'bootstrap.template.js'), {encoding: 'utf8'});
    return Buffer.from(ejs.render(template, {files: {
        noPolyfills: noPolyfills,
        polyfills: polyfills
    }}));
}
