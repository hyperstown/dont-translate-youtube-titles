// ==UserScript==
// @description Block automatic title translations on YouTube 
// @name        Don't translate YouTube titles
// @match           https://www.youtube.com/watch*
// @match           https://m.youtube.com/watch*
// @namespace       https://github.com/hyperstown/dont-translate-youtube-titles
// @supportURL      https://github.com/hyperstown/dont-translate-youtube-titles/issues
// @run-at          document-start
// @grant           none
// @version     2.0
// ==/UserScript==

// credit to https://github.com/zerodytrash/Simple-YouTube-Age-Restriction-Bypass for pageLoadedAndVisible
(function iife(inject) {
    // Trick to get around the sandbox restrictions in Greasemonkey (Firefox)
    // Inject code into the main window if criteria match
    if (typeof GM_info === "object" && GM_info.scriptHandler === "Greasemonkey" && inject) {
        window.eval("(" + iife.toString() + ")();");
        return;
    }

    class Deferred {
        constructor() {
            return Object.assign(
                new Promise((resolve, reject) => {
                    this.resolve = resolve;
                    this.reject = reject;
                }),
                this);

        }
    }

    const isDesktop = window.location.host !== 'm.youtube.com';

    let pageLoadedAndVisible = (() => {
        const pageLoadEventName = isDesktop ? 'yt-navigate-finish' : 'state-navigateend';

        window.addEventListener(pageLoadEventName, () => {
            if (document.visibilityState === 'hidden') {
                document.addEventListener('visibilitychange', ready, { once: true });
            } else {
                ready();
            }
        });

        function ready() {
            pageLoadedAndVisible.resolve();
            pageLoadedAndVisible = new Deferred();
        }

        return new Deferred();
    })();

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function returnTitle() {
        await pageLoadedAndVisible;
        // get original title from page title tag
        let trueTitle = document.getElementsByTagName('title')[0].text.slice(0, -10) // slice removes ' - YouTube' from title
        // replace title
        let orgTitle = null;

        await sleep(1000); // sleep because even with pageLoadedAndVisible title still returns null, I'd appreciate any suggestions on better solution
        orgTitle = document.querySelector('h1.title .style-scope.ytd-video-primary-info-renderer');
        for(let i=0; i < 3; i++){
            if(!orgTitle){
                // try 3 more times every second
                await sleep((i+1) * 1000);
                orgTitle = document.querySelector('h1.title .style-scope.ytd-video-primary-info-renderer');
            }
        }
        if(!orgTitle){
            return "Failed to translate title. Timeout!"
        }
        orgTitle.textContent = trueTitle;
        return "Title Translated"
    }

    returnTitle().then(
        function (value) { console.log(value); },
        function (error) { console.error(error); }
    );


})(true);
