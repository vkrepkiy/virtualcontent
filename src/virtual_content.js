"use strict";

(function () {
  const HTML_TYPE           = "html";
  const TEXT_TYPE           = "text";
  const REPLACE_MODE        = "replace";
  const APPEND_MODE         = "append";

  const ONSCROLL_TIMEOUT    = 200;
  const DEFAULT_CHUNK_SIZE  = 10240;
  const DEFAULT_THRESHOLD   = 2;

  const NO_WORD_SPLIT       = false;
  const MAX_WORD_SIZE       = 100;

  const CHUNK_PREPROCESSOR  = null;

  /**
   * @class VirtualContent
   *
   * @method destroy
   * @method renderTo
   * @method setHtml
   * @method setText
   *
   */

  class VirtualContent {

    constructor (options = {}) {
      this._chunkLenght       = options.length || DEFAULT_CHUNK_SIZE;
      this._mode              = options.append ? APPEND_MODE : REPLACE_MODE;
      this._noWordSplit       = options.noWordSplit || NO_WORD_SPLIT;
      this._threshold         = options.threshold || DEFAULT_THRESHOLD;
      this._type              = options.type || TEXT_TYPE;
      this._chunkPreProcessor = options.chunkPreProcessor || CHUNK_PREPROCESSOR;

      this._chunks      = [];
      this._el          = document.createElement("div");
      this._heights     = [];
      this._lastWidth   = null;
      this._leftpads    = [];
      this._offsets     = [];
      this._onScroll    = throttle(this._onScroll.bind(this), ONSCROLL_TIMEOUT);
      this._pointer     = 0;
      this._visibles    = [];

      this._el.setAttribute("style", "height:100%;overflow:auto;position:relative;outline:0px;word-break:break-word;");
      this._el.setAttribute("tabindex", 0);

      this._startScrollTracking();

      if (VirtualContent._trackInstances) {
        this._trackInstance();
      }
    }

    static create (options) {
      return new VirtualContent(options);
    }

    _addFillerTo (parent, height = 0) {
      var el = document.createElement("div");

      el.setAttribute("style", `height:${height}px;`);

      parent.appendChild(el);
    }

    destroy () {
      var parentNode = this._el.parentNode;

      this._stopScrollTracking();

      this._el.innerHTML  = null;
      this._chunks        = null;
      this._heights       = null;
      this._visibles      = null;
      this._leftpads      = null;


      if (parentNode) {
        parentNode.removeChild(this._el);
      }

      if (VirtualContent._trackInstances) {
        let i = VirtualContent.instances.indexOf(this);
        VirtualContent.instances.splice(i, 1);
      }

      return this;
    }

    // TODO: fix incorrect calculations
    _getBottomFillerHeightFor (chunkIndex) {
      var heights = this._heights.slice(chunkIndex, this._chunks.length);

      if (!heights.length) {
        return 0;
      }

      return heights.reduce(function (result, value) {
        return result += value;
      }, 0);
    }

    _getChunkElByIndex (i) {
      return this._el.querySelector(`[data-chunk-index='${i}']`);
    }

    _getChunkLeftPad (chunkIndex) {
      return this._leftpads[chunkIndex] || 0;
    }

    _getChunkOffsetTop (chunkIndex) {
      return this._offsets[chunkIndex] || 0;
    }

    _getChunkOffsetTopByHeights (chunkIndex) {
      var heights;

      if (chunkIndex === 0) {
        return 0;
      }

      if (chunkIndex > this._heights.length) {
        throw new Error("Bad chunk index");
      }

      heights = this._heights.slice(0, chunkIndex);

      if (!heights.length) {
        return 0;
      }

      return heights.reduce(function (result, value) {
        return result += value;
      }, 0);
    }

    _getCurrentPointer () {
      var scrollTop = this._el.scrollTop;
      var limit     = this._chunks.length;

      for (let i = 0; i<limit; i++) {
        if (this._getChunkOffsetTop(i) > scrollTop) {
          return i;
        }
      }

      return limit - 1;
    }

    _getLastVisible () {
      var length = this._visibles.length;

      return length ? this._visibles[--length] : -1;
    }

    _needUpdate (chunkIndex, prevPointer) {
      var limit, visibles;

      if (this._mode === REPLACE_MODE) {
        return chunkIndex !== prevPointer;
      }

      visibles  = this._visibles;
      limit     = Math.min(chunkIndex + this._threshold, this._chunks.length);

      for ( ; chunkIndex < limit; chunkIndex++) {
        if (visibles.indexOf(chunkIndex) === -1) {
          return true;
        }
      }

      return false;
    }

    // TODO: Fix glitches on fast scroll or restrict delta to 1
    _onScroll (e) {
      var prevPointer = this._pointer;
      var curPointer  = this._pointer = this._getCurrentPointer();

      if (this._widthHasChanged()) {
        this._recalculate();
      }

      if (!this._needUpdate(curPointer, prevPointer)) {
        return;
      }

      this._updateContent(curPointer, prevPointer);
    }

    _preprocessChunk (chunkContent) {
      if (this._chunkPreProcessor) {
        chunkContent = this._chunkPreProcessor(chunkContent);
      }

      return chunkContent;
    }

    // TODO: write _recalculate method or add some restrictions
    _recalculate () {
      console.info("Size was changed.");

      this._storeWidth(this._el.offsetWidth);
    }

    renderTo (el) {
      if (isJqueryEl(el)) {
        el = el[0];
      }

      el.appendChild(this._el);

      this._storeWidth(this._el.offsetWidth);

      if (this._chunks.length) {
        this._updateContent();
      }

      return this;
    }

    _scrollToTop () {
      this._el.scrollTop = 0;
    }

    // TODO: write setHtml method
    setHtml (html) {
      this._type    = HTML_TYPE;
      this._chunks = [];

      this._pointer   = 0;
      this._heights   = [];
      this._visibles  = [];

      this._el.innerHTML = "";

      this._scrollToTop();

      console.info("Not yet");

      return this;
    }

    _setScrollTop (num) {
      this._el.scrollTop = num;
    }

    setText (str) {
      this._type    = TEXT_TYPE;
      if (this._noWordSplit) {
        this._chunks  = this._splitText(str, this._chunkLenght);
      } else {
        this._chunks  = this._splitString(str, this._chunkLenght);
      }

      this._pointer   = 0;
      this._heights   = [];
      this._leftpads  = [];
      this._offsets   = [];
      this._visibles  = [];

      this._el.innerHTML = "";

      this._scrollToTop();

      if (this._el.parentNode) {
        this._updateContent();
      }

      return this;
    }

    _splitString (str, length) {
      return (new Array(Math.ceil(str.length/length))).fill(null).map(function (val, i) {
        var offset = i * length;
        return str.substring(offset, offset + length);
      });
    }

    _splitText (str, length) {
      var chunks      = [];

      var words = str.split(" ").reduce((result, val) => {
        if (val.length > MAX_WORD_SIZE) {
          return result.concat(this._splitString(val, MAX_WORD_SIZE));
        }

        result.push(`${val} `);

        return result;
      }, []);

      var wordsLength = words.length;

      words.reduce(function (result, val, i) {
        if ((result + val).length > length) {
          chunks.push(result);
          result = "";
        }

        result += val;

        if (i === wordsLength - 1) {
          chunks.push(result);
        }
        return result;
      }, "");

      return chunks.concat();
    }

    _startScrollTracking () {
      this._el.addEventListener("scroll", this._onScroll);
    }

    _stopScrollTracking () {
      this._el.removeEventListener("scroll", this._onScroll);
    }

    _storeChunkData (chunkIndex, extras = {}) {
      var {offsetTop, offsetHeight, leftPad} = extras;

      if (typeof offsetTop === "number" && !this._offsets[chunkIndex]) {
        this._offsets[chunkIndex] = offsetTop;
      }

      if (typeof offsetHeight === "number" && !this._heights[chunkIndex]) {
        this._heights[chunkIndex] = offsetHeight;
      }

      if (typeof leftPad === "number" && !this._leftpads[chunkIndex]) {
        this._leftpads[chunkIndex] = leftPad;
      }
    }

    _storeWidth (num) {
      this._lastWidth = num;
    }

    _trackInstance () {
      if (VirtualContent.instances.indexOf(this) !== -1) {
        throw new Error("Already tracked");
      }

      VirtualContent.instances.push(this);
    }

    _updateContent () {
      if (this._mode === APPEND_MODE) {
        this._updateContentWithAppend.apply(this, arguments);
      } else {
        this._updateContentWithReplace.apply(this, arguments);
      }
    }

    _updateContentWithAppend (pointer = 0, prevPointer = 0) {
      var threshold   = this._threshold;
      var el          = this._el;
      var first       = this._getLastVisible() + 1 || 0;
      var last        = Math.min(pointer + threshold, this._chunks.length);
      var offsets     = this._offsets;

      for (let i = first; i < last; i++) {
        let chunkEl = document.createElement("span");

        chunkEl.dataset.chunkIndex  = i;
        chunkEl.innerHTML           = this._preprocessChunk(this._chunks[i]);

        this._el.appendChild(chunkEl);

        offsets[i] = chunkEl.offsetTop;

        this._visibles.push(i);
      }
    }

    _updateContentWithReplace (pointer = 0, prevPointer = 0) {
      this._stopScrollTracking();

      var threshold     = this._threshold;
      var scrollTop     = this._el.scrollTop;
      var startOffset   = Math.max(0, pointer - threshold);
      var endOffset     = Math.min(this._chunks.length, pointer + threshold);
      var offsetLeft    = this._getChunkLeftPad(startOffset);

      var preFillerHeight   = this._getChunkOffsetTop(startOffset);
      var postFillerHeight  = this._getBottomFillerHeightFor(endOffset);

      this._el.innerHTML  = "";
      this._visibles      = [];

      this._addFillerTo(this._el, preFillerHeight);

      this._chunks.slice(startOffset, endOffset).map((content, i) => {
        var chunkEl     = document.createElement("span");
        var chunkIndex  = chunkEl.dataset.chunkIndex = startOffset + i;
        var leftPad     = (!i && this._getChunkLeftPad(chunkIndex)) || 0;

        content         = this._preprocessChunk(content);

        chunkEl.setAttribute("style", "position:relative;");

        chunkEl.innerHTML = `
          <span data-chunk-role="start" style="display:inline-block;padding-left:${leftPad}px;"></span>
          <span>${content}</span>
        `;

        this._el.appendChild(chunkEl);

        this._storeChunkData(chunkIndex, {
          leftPad       : chunkEl.querySelector("[data-chunk-role='start']").offsetLeft,
          offsetHeight  : chunkEl.offsetHeight,
          offsetTop     : chunkEl.offsetTop
        });

        this._visibles.push(chunkIndex);
      });

      this._addFillerTo(this._el, postFillerHeight);

      this._setScrollTop(scrollTop);
      this._el.focus();

      this._startScrollTracking();
    }

    _widthHasChanged () {
      return this._el.offsetWidth !== this._lastWidth;
    }

  }

  /**
   * Tracking is used to detect container width changes, etc.
   */

  VirtualContent._trackInstances  = false;
  VirtualContent.instances        = [];
  VirtualContent.startTracking    = function () {
    if (VirtualContent._instanceTrackerTimer) {
      return false;
    }

    VirtualContent._instanceTrackerTimer = setInterval(function () {
      VirtualContent.instances.forEach(function (vc) {
        if (!vc._widthHasChanged()) {
          return;
        }
        vc._recalculateHeights();
      });
    }, 500);

    return VirtualContent._trackInstances = true;
  };

  function isJqueryEl (el) {
    return !!el.jquery;
  }

  function throttle (func, wait, options) {
    var context, args, result;
    var timeout   = null;
    var previous  = 0;

    if (!options) options = {};

    var later = function () {
      previous  = options.leading === false ? 0 : Date.now();
      timeout   = null;
      result    = func.apply(context, args);

      if (!timeout) context = args = null;
    };

    return function () {
      var now = Date.now()
      ;
      if (!previous && options.leading === false) previous = now;

      var remaining = wait - (now - previous);

      context = this;
      args    = arguments;

      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }

        previous  = now;
        result    = func.apply(context, args);

        if (!timeout) context = args = null;

      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }


  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = VirtualContent;
  } else if (typeof define === "function" && define.amd) {
    define(VirtualContent);
  }
  if (typeof window !== "undefined") {
    window.VC = VirtualContent;
  }
})();
