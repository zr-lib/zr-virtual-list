!function(e){function t(t){for(var n,o,a=t[0],c=t[1],i=0,l=[];i<a.length;i++)o=a[i],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&l.push(r[o][0]),r[o]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);for(s&&s(t);l.length;)l.shift()()}var n={},r={0:0};function o(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.e=function(e){var t=[],n=r[e];if(0!==n)if(n)t.push(n[2]);else{var a=new Promise((function(t,o){n=r[e]=[t,o]}));t.push(n[2]=a);var c,i=document.createElement("script");i.charset="utf-8",i.timeout=120,o.nc&&i.setAttribute("nonce",o.nc),i.src=function(e){return o.p+""+({}[e]||e)+".d4112f90.js"}(e);var s=new Error;c=function(t){i.onerror=i.onload=null,clearTimeout(l);var n=r[e];if(0!==n){if(n){var o=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src;s.message="Loading chunk "+e+" failed.\n("+o+": "+a+")",s.name="ChunkLoadError",s.type=o,s.request=a,n[1](s)}r[e]=void 0}};var l=setTimeout((function(){c({type:"timeout",target:i})}),12e4);i.onerror=i.onload=c,document.head.appendChild(i)}return Promise.all(t)},o.m=e,o.c=n,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="./",o.oe=function(e){throw console.error(e),e};var a=window.webpackJsonp=window.webpackJsonp||[],c=a.push.bind(a);a.push=t,a=a.slice();for(var i=0;i<a.length;i++)t(a[i]);var s=c;o(o.s=6)}([function(e,t){e.exports=React},function(e,t){e.exports=ReactDOM},function(e,t,n){"use strict";var r,o=function(){return void 0===r&&(r=Boolean(window&&document&&document.all&&!window.atob)),r},a=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),c=[];function i(e){for(var t=-1,n=0;n<c.length;n++)if(c[n].identifier===e){t=n;break}return t}function s(e,t){for(var n={},r=[],o=0;o<e.length;o++){var a=e[o],s=t.base?a[0]+t.base:a[0],l=n[s]||0,u="".concat(s," ").concat(l);n[s]=l+1;var f=i(u),d={css:a[1],media:a[2],sourceMap:a[3]};-1!==f?(c[f].references++,c[f].updater(d)):c.push({identifier:u,updater:h(d,t),references:1}),r.push(u)}return r}function l(e){var t=document.createElement("style"),r=e.attributes||{};if(void 0===r.nonce){var o=n.nc;o&&(r.nonce=o)}if(Object.keys(r).forEach((function(e){t.setAttribute(e,r[e])})),"function"==typeof e.insert)e.insert(t);else{var c=a(e.insert||"head");if(!c)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");c.appendChild(t)}return t}var u,f=(u=[],function(e,t){return u[e]=t,u.filter(Boolean).join("\n")});function d(e,t,n,r){var o=n?"":r.media?"@media ".concat(r.media," {").concat(r.css,"}"):r.css;if(e.styleSheet)e.styleSheet.cssText=f(t,o);else{var a=document.createTextNode(o),c=e.childNodes;c[t]&&e.removeChild(c[t]),c.length?e.insertBefore(a,c[t]):e.appendChild(a)}}function p(e,t,n){var r=n.css,o=n.media,a=n.sourceMap;if(o?e.setAttribute("media",o):e.removeAttribute("media"),a&&btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a))))," */")),e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}var m=null,v=0;function h(e,t){var n,r,o;if(t.singleton){var a=v++;n=m||(m=l(t)),r=d.bind(null,n,a,!1),o=d.bind(null,n,a,!0)}else n=l(t),r=p.bind(null,n,t),o=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else o()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=o());var n=s(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var r=0;r<n.length;r++){var o=i(n[r]);c[o].references--}for(var a=s(e,t),l=0;l<n.length;l++){var u=i(n[l]);0===c[u].references&&(c[u].updater(),c.splice(u,1))}n=a}}}},function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",r=e[3];if(!r)return n;if(t&&"function"==typeof btoa){var o=(c=r,i=btoa(unescape(encodeURIComponent(JSON.stringify(c)))),s="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(i),"/*# ".concat(s," */")),a=r.sources.map((function(e){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(e," */")}));return[n].concat(a).concat([o]).join("\n")}var c,i,s;return[n].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,r){"string"==typeof e&&(e=[[null,e,""]]);var o={};if(r)for(var a=0;a<this.length;a++){var c=this[a][0];null!=c&&(o[c]=!0)}for(var i=0;i<e.length;i++){var s=[].concat(e[i]);r&&o[s[0]]||(n&&(s[2]?s[2]="".concat(n," and ").concat(s[2]):s[2]=n),t.push(s))}},t}},function(e,t,n){var r=n(2),o=n(5);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var a={insert:"head",singleton:!1},c=(r(o,a),o.locals?o.locals:{});e.exports=c},function(e,t,n){(t=n(3)(!1)).push([e.i,"#example {\n  width: 100%;\n  max-width: 600px;\n  margin: auto;\n  font-family: sans-serif;\n  text-align: center;\n}\n.title {\n  padding: 0 10px;\n}\n.render-radio {\n  margin-bottom: 10px;\n}\n.radio {\n  display: inline-block;\n  padding: 0 4px;\n  margin-left: 6px;\n  cursor: pointer;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n.radio.checked {\n  color: #fff;\n  background: #2196f3;\n}\n",""]),e.exports=t},function(e,t,n){"use strict";n.r(t);var r=n(0),o=n.n(r),a=n(1),c=n.n(a);const i="__keep_alive_cache__";let s={store:window,maxLength:5,useStorage:void 0};var l=(e={})=>((()=>{var t;s=Object.assign(Object.assign({},s),e);const{store:n,maxLength:r,useStorage:o}=s;n[i]={maxLength:r,useStorage:o,cacheList:(null===(t=n[i])||void 0===t?void 0:t.cacheList)||[]}})(),Object.assign({cacheName:i},s));var u=()=>{const{cacheName:e,maxLength:t,store:n,useStorage:o}=l();Object(r.useEffect)(()=>{o?c():a()},[]);const a=()=>{var t,r;null===(t=n.sessionStorage)||void 0===t||t.removeItem(e),null===(r=n.localStorage)||void 0===r||r.removeItem(e)},c=()=>{const t=s();t&&(n[e]=t)},i=()=>!1!==Boolean(o)&&"sessionStorage"!==o&&"localStorage"!==o,s=({_store:t,_cacheName:r}={_store:n,_cacheName:e})=>{var c;if(i())return console.warn('useStorage只能为："sessionStorage","localStorage"');let s="";const l=null===(c=t[o])||void 0===c?void 0:c.getItem(r);if(l)try{s=JSON.parse(l)}catch(e){a(),console.error("从storage中恢复缓存出错，已删除storage缓存！",e)}return s},u=({_store:r,_cacheName:a}={_store:n,_cacheName:e})=>{var c;if(i())return console.warn('useStorage只能为："sessionStorage","localStorage"');null===(c=r[o])||void 0===c||c.setItem(a,JSON.stringify(Object.assign(Object.assign({},r[a]),{maxLength:t,useStorage:o})))},f=()=>n[e].cacheList;return{getItem:e=>f().find(t=>t.name===e)||null,updateCache:({name:e,scrollTop:n,state:r})=>{let a=f(),c=a.findIndex(t=>t.name===e);-1!==c?a.splice(c,1,{name:e,state:r,scrollTop:n}):a.unshift({name:e,state:r,scrollTop:n}),a.length>t&&a.pop(),o&&u()},deleteCache:e=>{let t=f(),n=t.findIndex(t=>t.name===e);-1!==n&&(t.splice(n,1),o&&u())},getStorageCache:s}};var f=({name:e,children:t})=>{const n="function"==typeof t,{getItem:o,updateCache:a,deleteCache:c}=u();Object(r.useEffect)(()=>{n||console.warn('children传递函数，如:\n <KeepAlive name="list">{(props) => <List {...props} />}</KeepAlive>')},[]);return n?t({beforeRouteLeave:(t=0,n)=>{a({name:e,state:n,scrollTop:t})},scrollRestore:()=>{const t=o(e);return(null==t?void 0:t.scrollTop)||null},stateRestore:()=>{const t=o(e);return(null==t?void 0:t.state)||null},deleteCache:()=>c(e),getKeepAlive:()=>o(e)}):null};n(4);function d(){return(d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function p(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var n=[],r=!0,o=!1,a=void 0;try{for(var c,i=e[Symbol.iterator]();!(r=(c=i.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(e){o=!0,a=e}finally{try{r||null==i.return||i.return()}finally{if(o)throw a}}return n}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return m(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return m(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var v=Object(r.lazy)((function(){return n.e(1).then(n.bind(null,11))})),h=[10,20,50,100,1e3,1e4],g=[0,6,21,56,112,2345];function b(){var e=p(Object(r.useState)(1e4),2),t=e[0],n=(e[1],p(Object(r.useState)(20),2)),a=n[0],c=n[1],i=p(Object(r.useState)(6),2),s=i[0],l=i[1];return o.a.createElement(o.a.Fragment,null,o.a.createElement("h1",{className:"title"},"zr-virtual-list example"),o.a.createElement("p",null,"dataLength: ",t),o.a.createElement("div",{className:"render-radio"},"startIndex:",g.map((function(e){return o.a.createElement("span",{key:e,className:"radio ".concat(s===e?"checked":""),onClick:function(){return l(e)}},e)}))),o.a.createElement("div",{className:"render-radio"},"renderCount:",h.map((function(e){return o.a.createElement("span",{key:e,className:"radio ".concat(a===e?"checked":""),onClick:function(){return c(e)}},e)}))),o.a.createElement(r.Suspense,{fallback:"loading..."},o.a.createElement(f,{name:"list"},(function(e){return o.a.createElement(v,d({},e,{dataLength:t,renderCount:a,startIndex:s}))}))))}var y=document.getElementById("example");c.a.render(o.a.createElement(b,null),y)}]);