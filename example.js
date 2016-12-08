/**
 * Created by jmooreoa on 12/2/16.
 */

(function(opts) {
    console.log(document.currentScript);
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
    main: 'main.js',
    polyfills: 'polyfills.js'
});
