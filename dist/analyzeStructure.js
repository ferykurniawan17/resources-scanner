"use strict";function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _slicedToArray(a,b){return _arrayWithHoles(a)||_iterableToArrayLimit(a,b)||_unsupportedIterableToArray(a,b)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArrayLimit(b,c){var d=null==b?null:"undefined"!=typeof Symbol&&b[Symbol.iterator]||b["@@iterator"];if(null!=d){var g,h,j,k,l=[],a=!0,m=!1;try{if(j=(d=d.call(b)).next,0===c){if(Object(d)!==d)return;a=!1}else for(;!(a=(g=j.call(d)).done)&&(l.push(g.value),l.length!==c);a=!0);}catch(a){m=!0,h=a}finally{try{if(!a&&null!=d["return"]&&(k=d["return"](),Object(k)!==k))return}finally{if(m)throw h}}return l}}function _arrayWithHoles(a){if(Array.isArray(a))return a}function ownKeys(a,b){var c=Object.keys(a);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(a);b&&(d=d.filter(function(b){return Object.getOwnPropertyDescriptor(a,b).enumerable})),c.push.apply(c,d)}return c}function _objectSpread(a){for(var b,c=1;c<arguments.length;c++)b=null==arguments[c]?{}:arguments[c],c%2?ownKeys(Object(b),!0).forEach(function(c){_defineProperty(a,c,b[c])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(b)):ownKeys(Object(b)).forEach(function(c){Object.defineProperty(a,c,Object.getOwnPropertyDescriptor(b,c))});return a}function _defineProperty(a,b,c){return(b=_toPropertyKey(b))in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}function _toPropertyKey(a){var b=_toPrimitive(a,"string");return"symbol"==_typeof(b)?b:b+""}function _toPrimitive(a,b){if("object"!=_typeof(a)||!a)return a;var c=a[Symbol.toPrimitive];if(void 0!==c){var d=c.call(a,b||"default");if("object"!=_typeof(d))return d;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===b?String:Number)(a)}function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_unsupportedIterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(b,c){if(b){if("string"==typeof b)return _arrayLikeToArray(b,c);var a={}.toString.call(b).slice(8,-1);return"Object"===a&&b.constructor&&(a=b.constructor.name),"Map"===a||"Set"===a?Array.from(b):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?_arrayLikeToArray(b,c):void 0}}function _iterableToArray(a){if("undefined"!=typeof Symbol&&null!=a[Symbol.iterator]||null!=a["@@iterator"])return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a))return _arrayLikeToArray(a)}function _arrayLikeToArray(b,c){(null==c||c>b.length)&&(c=b.length);for(var d=0,f=Array(c);d<c;d++)f[d]=b[d];return f}// eslint-disable-next-line @typescript-eslint/no-var-requires
var fs=require("fs"),path=require("path"),fileDependencies=require("./fileDependencies"),filesScanner=require("./filesScanner"),utils=require("./utils");// eslint-disable-next-line @typescript-eslint/no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
function getStructure(a){function b(a){var c=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},f=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{},g=3<arguments.length?arguments[3]:void 0,h=fs.readdirSync(a),i=h.reduce(function(b,c){var f=path.join(a,c),h=utils.getFileNameWithoutExt(f),i=e.includes(h),j=utils.isDirectory(f);if(d===h&&!j){var k=[f].concat(_toConsumableArray(fileDependencies(f,[],g)));b.pageFiles=_objectSpread(_objectSpread({},b.pageFiles),{},_defineProperty({},f,{files:k,keys:filesScanner.scan(k)}))}else if(i){var l=[f].concat(_toConsumableArray(fileDependencies(f,[],g)));b.globalFiles=_objectSpread(_objectSpread({},b.globalFiles),{},{files:l,keys:filesScanner.scan(l)})}else j&&b.folders.push(f);return b},{pageFiles:{},globalFiles:{},folders:[]}),j=i.pageFiles,k=i.globalFiles,l=i.folders,m=_objectSpread({},c),n=_objectSpread({},f);// if (pageFile) {
//   newPages[pageFile] = pageFile;
// }
return Object.keys(j).length&&(m=j),Object.keys(k).length&&(n[a]=k),l.forEach(function(a){var c=b(a,m,n,g),d=_slicedToArray(c,2),e=d[0],f=d[1];m=Object.assign(m,e),n=Object.assign(n,f)}),[m,n]}var c=utils.getRootProjectDir(),d=a.pageFileName,e=a.whitelistGlobalFiles,f=a.folders.map(function(a){return path.join(c,a)}),g={},h={};return f.forEach(function(c){var d=b(c,g,h,a),e=_slicedToArray(d,2),f=e[0],i=e[1];g=Object.assign(g,f),h=Object.assign(h,i)}),{allPages:g,allGlobalFiles:h}}function mergeKeys(a,b){var c=Object.keys(b).reduce(function(c,d){return a.includes(d)?_objectSpread(_objectSpread({},c),b[d].keys):c},{});return c}function combineKeys(a,b){var c=Object.keys(a).reduce(function(c,d){var e=a[d].keys,f=mergeKeys(d,b),g=_objectSpread(_objectSpread({},e),f);return _objectSpread(_objectSpread({},c),{},_defineProperty({},d,g))},{});return c}function convertFilePathsToUrls(a,b){var c=utils.getRootProjectDir(),d=Object.keys(a).reduce(function(d,e){var f=a[e];b.folders.forEach(function(a){e=e.replace("".concat(c,"/").concat(a),"")}),e=e.replace(/\.(tsx|js|jsx|ts|mjs)$/,"");// remove last section of the path if it is config.pageFileName
var g=e.split("/"),h=g[g.length-1];h===b.pageFileName&&g.pop(),e=g.join("/");var i=e.replace(/\\/g,"/");return _objectSpread(_objectSpread({},d),{},_defineProperty({},i,f))},{});return d}module.exports={getStructure:getStructure,combineKeys:combineKeys,convertFilePathsToUrls:convertFilePathsToUrls};