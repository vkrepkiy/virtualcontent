!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.VC=e():t.VC=e()}(this,function(){return function(t){function e(i){if(n[i])return n[i].exports;var s=n[i]={i:i,l:!1,exports:{}};return t[i].call(s.exports,s,s.exports,e),s.l=!0,s.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=1)}([function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},function(t,e,n){"use strict";(function(t){function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var s,r,l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o=function(){function t(t,e){var n=[],i=!0,s=!1,r=void 0;try{for(var l,o=t[Symbol.iterator]();!(i=(l=o.next()).done)&&(n.push(l.value),!e||n.length!==e);i=!0);}catch(t){s=!0,r=t}finally{try{!i&&o.return&&o.return()}finally{if(s)throw r}}return n}return function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),h=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();!function(){function u(t){return!!t.jquery}function a(t){return t?"string"==typeof t?document.querySelector(t):t.constructor===HTMLElement?t:u(t)?t[0]:null:null}function c(t,e){function n(){t.apply(null,arguments)}var i;return function(){void 0!==i&&clearTimeout(i),i=setTimeout(n,e)}}var f="html",_="replace",p="append",d=100,y=10240,k=2,v=null,VirtualContent=function(){function VirtualContent(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};i(this,VirtualContent),this._chunkLenght=t.length||y,this._mode=t.append?p:_,this._threshold=t.threshold||k,this._contentType=t.type||f,this._chunkPreProcessor=t.chunkPreProcessor||v,this._renderDelay=t.delay||d,this._chunks=[],this._el=document.createElement("div"),this._heights=[],this._lastWidth=null,this._leftpads=[],this._offsets=[],this._onScroll=c(this._onScroll.bind(this),this._renderDelay),this._pointer=0,this._prevOffsetToScrollableEl=0,this._scrollableEl=a(t.scrollableParent)||this._el,this._visibles=[],this._el.setAttribute("style","height:100%;overflow:auto;position:relative;word-break:break-word;"),this._scrollableEl.setAttribute("tabindex",0),this._scrollableEl.style.outline="0px",this._startScrollTracking(),VirtualContent._trackInstances&&this._trackInstance()}return h(VirtualContent,[{key:"_addFillerTo",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=document.createElement("div");n.setAttribute("style","height:"+e+"px;"),t.appendChild(n)}},{key:"_calculateChunkData",value:function(t){return{leftPad:t.querySelector("[data-chunk-role='start']").offsetLeft,offsetHeight:t.offsetHeight,offsetTop:t.offsetTop}}},{key:"destroy",value:function(){var t=this._el.parentNode;if(this._stopScrollTracking(),this._el.innerHTML=null,this._chunks=null,this._heights=null,this._visibles=null,this._leftpads=null,this._scrollableEl=null,t&&t.removeChild(this._el),VirtualContent._trackInstances){var e=VirtualContent.instances.indexOf(this);VirtualContent.instances.splice(e,1)}return this}},{key:"_getBottomFillerHeightFor",value:function(t){var e=this._heights.slice(t,this._chunks.length);return e.length?e.reduce(function(t,e){return t+=e},0):0}},{key:"_getChunkElByIndex",value:function(t){return this._el.querySelector("[data-chunk-index='"+t+"']")}},{key:"_getChunkHeight",value:function(t){return this._heights[t]||0}},{key:"_getChunkLeftPad",value:function(t){return this._leftpads[t]||0}},{key:"_getChunkOffsetTop",value:function(t){return this._offsets[t]||0}},{key:"_getChunkOffsetTopByHeights",value:function(t){var e;if(0===t)return 0;if(t>this._heights.length)throw new Error("Bad chunk index");return e=this._heights.slice(0,t),e.length?e.reduce(function(t,e){return t+=e},0):0}},{key:"_getChunkRangeForReplacement",value:function(t){var e=this._chunks.length,n=this._threshold,i=t-n,s=t+n;return i<0&&s>e?[0,e]:(i<0&&(s+=Math.abs(0-i),i=0),s>e&&(i=i-s+e,s=e),[Math.max(i,0),Math.min(s,e)])}},{key:"_getCurrentPointer",value:function(){for(var t=this._offsets.length||0,e=0;e<t;e++)if(this._getChunkOffsetTop(e)>this._getScrollTopForChunks())return--e;return this._offsets.length-1}},{key:"_getLastVisible",value:function(){var t=this._visibles.length;return t?this._visibles[--t]:-1}},{key:"_getOffsetToScrollableEl",value:function(){return this._el===this._scrollableEl?0:this._el.getBoundingClientRect().top+this._scrollableEl.scrollTop-this._scrollableEl.getBoundingClientRect().top}},{key:"_getScrollTop",value:function(){return this._scrollableEl.scrollTop}},{key:"_getScrollTopForChunks",value:function(){return this._getScrollTop()-this._getOffsetToScrollableEl()}},{key:"isHtmlContent",value:function(){return this._contentType===f}},{key:"_needUpdate",value:function(t,e){var n,i;if(this._mode===_){var s=void 0,r=void 0;return t!==e&&(s=this._getChunkRangeForReplacement(t),r=this._getChunkRangeForReplacement(e),s[0]!==r[0]||s[1]!==r[1])}for(i=this._visibles,n=Math.min(e+this._threshold,this._chunks.length);e<n;e++)if(-1===i.indexOf(e))return!0;return!1}},{key:"_onScroll",value:function(t){var e=this._getScrollTop(),n=this._pointer,i=this._pointer=this._getCurrentPointer();this._widthHasChanged()&&this._recalculate(),this._needUpdate(n,i)&&(this._stopScrollTracking(),this._updateContent(n,i),this._scrollableEl.focus(),this._mode!==p&&this._setScrollTop(e),this._startScrollTracking())}},{key:"_preprocessChunk",value:function(t){return this._chunkPreProcessor&&(t=this._chunkPreProcessor(t)),t}},{key:"_recalculate",value:function(){this._storeWidth(this._el.offsetWidth)}},{key:"renderTo",value:function(t){return u(t)&&(t=t[0]),t.appendChild(this._el),this._storeWidth(this._el.offsetWidth),this._chunks.length&&this._updateContent(),this}},{key:"_scrollableOffsetHasChanged",value:function(){return this._prevOffsetToScrollableEl!==this._getOffsetToScrollableEl()}},{key:"_scrollToTop",value:function(){this._scrollableEl.scrollTop=0}},{key:"_setChunkElContent",value:function(t,e){this.isHtmlContent()?t.innerHTML=e:(t.style["white-space"]="pre-wrap",t.textContent=e)}},{key:"setHtml",value:function(t){return console.info(".setHtml() is not fully implemented yet"),t=this._validateString(t),this._contentType=f,this._chunks=this._splitString(t,this._chunkLenght),this._pointer=0,this._heights=[],this._leftpads=[],this._offsets=[],this._visibles=[],this._el.innerHTML="",this._scrollToTop(),this._el.parentNode&&this._updateContent(),this}},{key:"_setScrollTop",value:function(t){this._scrollableEl.scrollTop=t}},{key:"setText",value:function(t){return t=this._validateString(t),this._contentType="text",this._chunks=this._splitString(t,this._chunkLenght),this._pointer=0,this._heights=[],this._leftpads=[],this._offsets=[],this._visibles=[],this._el.innerHTML="",this._scrollToTop(),this._el.parentNode&&this._updateContent(),this}},{key:"_splitString",value:function(t,e){return new Array(Math.ceil(t.length/e)).fill(null).map(function(n,i){var s=i*e;return t.substring(s,s+e)})}},{key:"_startScrollTracking",value:function(){this._scrollableEl.style.overflow="auto",this._scrollableEl.addEventListener("scroll",this._onScroll)}},{key:"_stopScrollTracking",value:function(){this._scrollableEl.removeEventListener("scroll",this._onScroll),this._scrollableEl.style.overflow="hidden"}},{key:"_storeChunkData",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e.offsetTop,i=e.offsetHeight,s=e.leftPad;"number"!=typeof n||this._offsets[t]||(this._offsets[t]=n),"number"!=typeof i||this._heights[t]||(this._heights[t]=i),"number"!=typeof s||this._leftpads[t]||(this._leftpads[t]=s)}},{key:"_storeWidth",value:function(t){this._lastWidth=t}},{key:"_trackInstance",value:function(){if(-1!==VirtualContent.instances.indexOf(this))throw new Error("Already tracked");VirtualContent.instances.push(this)}},{key:"_updateChunksDataWith",value:function(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=t.offsetDelta||0,n=0;n<this._offsets.length;n++)this._offsets[n]+=e}},{key:"_updateContent",value:function(){this._mode===p?this._updateContentWithAppend.apply(this,arguments):this._updateContentWithReplace.apply(this,arguments)}},{key:"_updateContentWithAppend",value:function(){for(var t=(arguments.length>0&&void 0!==arguments[0]&&arguments[0],arguments.length>1&&void 0!==arguments[1]?arguments[1]:0),e=this._threshold,n=this._getLastVisible()+1||0,i=Math.min(t+e,this._chunks.length),s=this._offsets,r=n;r<i;r++){var l=document.createElement("span");l.dataset.chunkIndex=r,this._setChunkElContent(l,this._preprocessChunk(this._chunks[r])),this._el.appendChild(l),s[r]=l.offsetTop,this._visibles.push(r)}}},{key:"_updateContentWithReplace",value:function(){var t=this,e=(arguments.length>0&&void 0!==arguments[0]&&arguments[0],arguments.length>1&&void 0!==arguments[1]?arguments[1]:0),n=(this._threshold,this._getChunkRangeForReplacement(e)),i=o(n,2),s=i[0],r=i[1],l=this._getChunkOffsetTop(s),h=this._getBottomFillerHeightFor(r);this._el.innerHTML="",this._visibles=[],this._addFillerTo(this._el,l),this._chunks.slice(s,r).map(function(e,n){var i=document.createElement("span"),r=i.dataset.chunkIndex=s+n,l=!n&&t._getChunkLeftPad(r)||0,o=document.createElement("span");o.innerHTML="\n          <span data-chunk-role='start' style=\"display:inline-block;padding-left:"+l+'px;"></span>\n        ',o=o.children[0],e=t._preprocessChunk(e),i.setAttribute("style","position:relative; display:inline-block;"),t._setChunkElContent(i,e),i.insertBefore(o,i.children[0]),t._el.appendChild(i),t._storeChunkData(r,t._calculateChunkData(i)),t._visibles.push(r)}),this._addFillerTo(this._el,h)}},{key:"_validateString",value:function(t){if("string"==typeof t)return t;if("number"==typeof t&&!isNaN(t))return""+t;if(!t)return"";throw new TypeError("Not a string")}},{key:"_widthHasChanged",value:function(){return this._el.offsetWidth!==this._lastWidth}}],[{key:"create",value:function(t){return new VirtualContent(t)}}]),VirtualContent}();VirtualContent._trackInstances=!1,VirtualContent.instances=[],VirtualContent.startTracking=function(){return!VirtualContent._instanceTrackerTimer&&(VirtualContent._instanceTrackerTimer=setInterval(function(){VirtualContent.instances.forEach(function(t){t._widthHasChanged()&&t._recalculate()})},500),VirtualContent._trackInstances=!0)},"object"===l(t)&&"object"===l(t.exports)?t.exports=VirtualContent:(s=VirtualContent,void 0!==(r="function"==typeof s?s.call(e,n,e,t):s)&&(t.exports=r)),"undefined"!=typeof window&&(window.VC=VirtualContent)}()}).call(e,n(0)(t))}])});