// ==UserScript==
// @description Block automatic title translations on YouTube 
// @name        Don't translate YouTube titles
// @include     *://youtube.com/watch*
// @version     v1.0
// ==/UserScript==

// get original title from page title tag
let trueTitle = document.getElementsByTagName('title')[0].text.slice(0, -10) // slice removes ' - YouTube' from title

// replace title
document.querySelector('h1.title .style-scope.ytd-video-primary-info-renderer').textContent = trueTitle;

// TODO
// Make button to switch between titles
