"use strict";// eslint-disable-next-line @typescript-eslint/no-var-requires
var fs=require("fs"),path=require("path"),utils=require("./utils");// eslint-disable-next-line @typescript-eslint/no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
function createJsonFiles(a,b){var c=utils.getRootProjectDir();b.sourceFiles=b.sourceFiles||{};// load existing json files
var d=Object.keys(b.sourceFiles).reduce(function(a,d){var e=path.join(c,b.sourceFiles[d]);return fs.existsSync(e)&&(a[d]=JSON.parse(fs.readFileSync(e,"utf8"))),a},{});// create json files for each map keys
Object.keys(a).forEach(function(e){var f=a[e];Object.keys(b.sourceFiles).forEach(function(a){var g=d[a]||{},h=Object.keys(f).reduce(function(a,b){return a[b]=g[b]||b,a},{}),i="".concat(c,"/").concat(b.output).concat(e,"/").concat(a,".json"),j=path.dirname(i);// create json file
// create folder if not exists
fs.existsSync(j)||fs.mkdirSync(j,{recursive:!0}),fs.writeFileSync(i,JSON.stringify(h,null,2))})})}module.exports={createJsonFiles:createJsonFiles};