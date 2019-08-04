(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.TrickScrollbar = factory());
}(this, (function () { 'use strict';

'use strict';
var this$1 = undefined;


var TrickScrollbar = function TrickScrollbar (element) {
  this.scroller = element;
  this.wrapper;
  this.scrollbar;
  this.thumb;
  this.lastY;
  this.dragging = false;

  this.assembleDOM();
  this.resizeScrollbar();
  this.addEventListeners();
};

TrickScrollbar.prototype.handleScroll = function handleScroll () {
    var this$1 = this;

  this.lastY = (this.scroller.scrollTop / this.scroller.scrollHeight) * 100;

  window.requestAnimationFrame(function () {
    this$1.moveScrollbar(this$1.lastY);
  });
};

TrickScrollbar.prototype.moveScrollbar = function moveScrollbar (newY) {
  this.thumb.style.top = newY + "%";
};

TrickScrollbar.prototype.resize = function resize () {
  this.resizeScrollbar();
};

TrickScrollbar.prototype.resizeScrollbar = function resizeScrollbar () {
  var percent = this.wrapper.offsetHeight / this.scroller.scrollHeight;
  var height = this.wrapper.offsetHeight * percent;
  this.thumb.style.height = height + "px";
    
  if (this.scroller.scrollHeight <= this.wrapper.offsetHeight) {
    this.scrollbar.style.display ='none';
  } else {
    this.scrollbar.style.display ='inherit';
  }
};
  
TrickScrollbar.prototype.onThumbMouseDown = function onThumbMouseDown () {
  this.dragging = true;
  this.wrapper.classList.add('dragging');

  var top = this.thumb.style.top ? this.thumb.style.top : '0%';
  var perc = parseFloat(top.slice(0, -1)) / 100;
  var posY = this.wrapper.offsetHeight * perc;
  var clientY =
    event.clientY || event.clientY === 0
      ? event.clientY
      : event.touches[0].clientY;
  var offset = clientY - posY;

  window.addEventListener('mousemove', this.onThumbDragStart.bind(this, offset));
  window.addEventListener('touchmove', this.onThumbDragStart.bind(this, offset));

  event.stopPropagation();
};

TrickScrollbar.prototype.onThumbDragStart = function onThumbDragStart (offset, event) {
  if (this.dragging) {
    var perc = ((event.clientY - offset) / this.wrapper.offsetHeight);
    var posY = this.scroller.scrollHeight * perc;
    this.scroller.scrollTop = posY;
  }
};

TrickScrollbar.prototype.onThumbDragStop = function onThumbDragStop () {
  this.dragging = false;
  this.wrapper.classList.remove('dragging');
  window.removeEventListener('mousemove', this.onThumbDragStart.bind(this));
};

TrickScrollbar.prototype.onScrollbarClick = function onScrollbarClick (event) {
    var this$1 = this;

  var thumbHeight = parseFloat(this.thumb.style.height.slice(0, -2));
  var correctedY = event.clientY - (thumbHeight / 2);
  var perc = correctedY / this.scroller.offsetHeight;
  var posY = this.scroller.scrollHeight * perc;
  var diff = posY - this.scroller.scrollTop;
  var interval = diff / 12;
  var x = 0;

  var repeat = function () {
    setTimeout(function () {
      this$1.scroller.scrollTop += interval;
      x += 1;

      if (x < 12) { repeat(); }
    }, 16);
  };

  repeat();
};

TrickScrollbar.prototype.assembleDOM = function assembleDOM () {
  var parent = this.scroller.parentNode;
  this.wrapper = document.createElement('div');
  this.scrollbar = document.createElement('div');
  this.thumb = document.createElement('div');

  this.wrapper.classList.add('ts-scroll-content');
  this.scroller.classList.add('ts-scroller');
  this.scrollbar.classList.add('ts-scrollbar');
  this.thumb.classList.add('ts-thumb');

  parent.appendChild(this.wrapper);
  this.wrapper.appendChild(this.scroller);
  this.scrollbar.appendChild(this.thumb);
  this.wrapper.appendChild(this.scrollbar);
};

TrickScrollbar.prototype.addEventListeners = function addEventListeners () {
  this.scroller.addEventListener('scroll', this.handleScroll.bind(this));

  this.thumb.addEventListener('mousedown', this.onThumbMouseDown.bind(this));
  window.addEventListener('mouseup', this.onThumbDragStop.bind(this));
    
  this.thumb.addEventListener('touchstart', this.onThumbMouseDown.bind(this));
  window.addEventListener('touchend', this.onThumbDragStop.bind(this));
    
  this.scrollbar.addEventListener('click', this.onScrollbarClick.bind(this));

  window.addEventListener('resize', debounce(this.resize.bind(this), 250), false);
};

/**
 * Debounce function
 * 
 * @param {Function} fn 
 * @param {Number} wait 
 * @param {Object} options 
 */
var debounce = function (fn, wait, options) {
  if ( wait === void 0 ) wait = 0;
  if ( options === void 0 ) options = {};

  var timeout;

  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var inmediate = 'inmediate' in options ? !!options.inmediate : options.inmediate;
    var later = function () {
      timeout = null;
      if (!inmediate) { fn.apply(this$1, args); }
    };
    var now = inmediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (now) { fn.apply(this$1, args); }
  }
};

return TrickScrollbar;

})));
