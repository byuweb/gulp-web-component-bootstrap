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
    var byu = window.byu = window.byu || {};
    var comps = byu.webCommunityComponents = byu.webCommunityComponents || {};
    //You can set window.byu.webCommunityComponents.forcePolyfills to true to always use polyfills.
    var forcePolyfills = comps.forcePolyfills;
    //This is here because if we have multiple component bundles on the page and one of them has already loaded the
    //  polyfills, we would erroneously detect that we don't need to load them and load the native ES6 code instead 
    //  (which could cause problems).  So, we set 'needsPolyfills' to tell ourselves to ignore the feature detection.
    var needsPolyfills;
    if (!'needsPolyfills' in comps) {
        var shadow = !!HTMLElement.prototype.attachShadow;
        var customElements = 'customElements' in window;
        
        needsPolyfills = comps.needsPolyfills = !shadow || !customElements;
    }   
    if (needsPolyfills || forcePolyfills) {
        load(opts.polyfills);
    } else {
        load(opts.main);
    }
    
    function load(script) {
        var main = document.createElement('script');
        main.src = script;
        main.async = true;
        document.head.appendChild(main);
    }
})({
    main: '${target}',
    polyfills: '${polyfill}'
});`;
}
