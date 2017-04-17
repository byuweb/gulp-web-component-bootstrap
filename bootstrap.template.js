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
(function (opts) {
    "use strict";
    var byu = window.byu = window.byu || {};
    var comps = byu.webCommunityComponents = window.byu.webCommunityComponents || {};
    var loading = comps.resourceLoading = comps.resourceLoading || {};

    var bundleToLoad;
    if (opts.compatBundle) {
        bundleToLoad = canDoEs6() ? opts.bundle : opts.compatBundle;
    } else {
        bundleToLoad = opts.bundle;
    }

    if (needsPolyfills()) {
        ensureLoaded(comps.polyfillUrl || opts.polyfills, function () {
            ensureLoaded(bundleToLoad);
        });
    } else {
        ensureLoaded(bundleToLoad);
    }

    function ensureLoaded(script, callback) {
        var resolved = resolveUrl(script);
        var cb = callback || function () {
            };
        var status = loading[resolved];
        if (status === 'done') {
            cb();
        } else if (!status) {
            loading[resolved] = createLoader(resolved, function () {
                loading[script] = 'done';
                cb();
            });
        } else if (status instanceof HTMLScriptElement) {
            status.addEventListener('load', function () {
                cb();
            });
        }
    }

    function createLoader(script, cb) {
        var loader = document.createElement('script');
        loader.src = script;
        loader.async = true;
        loader.onload = cb;
        document.head.appendChild(loader);
        return loader;
    }

    function canDoEs6() {
        try {
            new Function("class TestClass {}"); // jshint ignore:line
            return true;
        } catch (e) {
            return false;
        }
    }

    function needsPolyfills() {
        var forcePolyfills = comps.forcePolyfills;
        var needsPolyfills;

        //This is here because if we have multiple component bundles on the page and one of them has already loaded the
        //  polyfills, we would erroneously detect that we don't need to load them and load the native ES6 code instead
        //  (which could cause problems).  So, we set 'needsPolyfills' to tell ourselves to ignore the feature detection.
        if (!('needsPolyfills' in comps)) {
            var shadow = !!HTMLElement.prototype.attachShadow;
            var customElements = 'customElements' in window;
            needsPolyfills = comps.needsPolyfills = !shadow || !customElements;
        }
        return needsPolyfills || forcePolyfills;
    }

    function resolveUrl(url) {
        var ABSOLUTE_URL_PATTERN = /^https?:\/\/|^\/\//i;
        if (ABSOLUTE_URL_PATTERN.test(url)) {
            return url;
        } else {
            return resolveRelative(url);
        }
    }

    function resolveRelative(script) {
        var thisFile = document.querySelector('script[src$="' + opts.loader + '"]');
        return thisFile.src.replace(opts.loader, script);
    }
})({
    loader: '<%= files.loader %>',
    polyfills: '<%= files.polyfills %>',
    bundle: '<%= files.bundle %>',
    compatBundle: '<%= files.compat %>'
});
