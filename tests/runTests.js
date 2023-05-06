const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const html = '<html><body><canvas id="screen"></canvas></body></html>';
const { document } = new JSDOM(html).window;

// Polyfills
global.document = document
global.Image = function() {}
// END -- Polyfills

console.log("")
console.log("***********************")
console.log("")

const suite = require("./output")