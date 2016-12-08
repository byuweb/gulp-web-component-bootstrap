/**
 * Created by jmooreoa on 12/2/16.
 */

const through = require('through2');
const Vinyl = require('vinyl');

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
            contents: generateContent(file.path, opts.polyfills)
        }));
    });
};

function generateContent(target, polyfill) {
    return `(function(opts) {
    var shadow = !!HTMLElement.prototype.attachShadow;
    var customElements = 'customElements' in window;

    if (shadow && customElements) {
        loadMain();
    } else {
        loadPolyfills(loadMain);
    }

    function loadMain() {
        var main = document.createElement('script');
        main.src = opts.main;
        main.async = true;
        document.head.appendChild(main);
    }

    function loadPolyfills(cb) {
        var main = document.createElement('script');
        main.src = opts.polyfills;
        main.async = true;
        main.addEventListener('load', function() {
            cb();
        }, false);
        document.head.appendChild(main);
    }
})({
    main: '${target}',
    polyfills: '${polyfill}'
});`;
}
