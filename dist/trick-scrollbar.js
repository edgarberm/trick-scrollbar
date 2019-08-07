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
  this.scrollbarY;
  this.thumbY;
  this.thumbX;
  this.childrenWidth = 0;
  this.draggingX = false;
  this.draggingY = false;

  this.assembleDOM();
  this.chechChildrenWidth();
  this.appendThumbX();
  this.appendThumbY();
  this.resizeScrollbarX();
  this.resizeScrollbarY();
  this.addEventListeners();
};

TrickScrollbar.prototype.handleScroll = function handleScroll () {
    var this$1 = this;

  var lastX = (this.scroller.scrollLeft / this.scroller.scrollWidth) * 100;
  var lastY = (this.scroller.scrollTop / this.scroller.scrollHeight) * 100;

  window.requestAnimationFrame(function () {
    this$1.thumbX && this$1.moveScrollbarX(lastX);
    this$1.thumbY && this$1.moveScrollbarY(lastY);
  });
};

TrickScrollbar.prototype.moveScrollbarX = function moveScrollbarX (newX) {
  this.thumbX.style.left = newX + "%";
};
  
TrickScrollbar.prototype.moveScrollbarY = function moveScrollbarY (newY) {
  this.thumbY.style.top = newY + "%";
};

TrickScrollbar.prototype.resize = function resize () {
  this.thumbX && this.resizeScrollbarX();
  this.thumbY && this.resizeScrollbarY();
};

TrickScrollbar.prototype.resizeScrollbarX = function resizeScrollbarX () {
  var percentWidth = this.wrapper.offsetWidth / this.scroller.scrollWidth;
  var width = this.wrapper.offsetWidth * percentWidth;
  this.thumbX.style.width = width + "px";

  if (this.childrenWidth <= this.scroller.offsetWidth && this.scrollbarX) {
    this.scrollbarX.style.display ='none';
  } else {
    this.scrollbarX.style.display ='inherit';
  }
};
  
TrickScrollbar.prototype.resizeScrollbarY = function resizeScrollbarY () {
  var percentHeight = this.wrapper.offsetHeight / this.scroller.scrollHeight;
  var height = this.wrapper.offsetHeight * percentHeight;
  this.thumbY.style.height = height + "px";

  if (this.scroller.scrollHeight <= this.wrapper.offsetHeight) {
    this.scrollbarY.style.display = 'none';
  } else {
    this.scrollbarY.style.display = 'inherit';
  }
};

TrickScrollbar.prototype.onThumbXMouseDown = function onThumbXMouseDown () {
  this.draggingX = true;
  this.wrapper.classList.add('dragging');

  var left = this.thumbX.style.left ? this.thumbX.style.left : '0%';
  var perc = parseFloat(left.slice(0, -1)) / 100;
  var posX = this.wrapper.offsetWidth * perc;
  var clientX =
    event.clientX || event.clientX === 0
      ? event.clientX
      : event.touches[0].clientX;
  var offset = clientX - posX;

  window.addEventListener('mousemove', this.onThumbXDragStart.bind(this, offset));
  window.addEventListener('touchmove', this.onThumbXDragStart.bind(this, offset));

  event.stopPropagation();
};
  
TrickScrollbar.prototype.onThumbYMouseDown = function onThumbYMouseDown () {
  this.draggingY = true;
  this.wrapper.classList.add('dragging');
    
  var top = this.thumbY.style.top ? this.thumbY.style.top : '0%';
  var perc = parseFloat(top.slice(0, -1)) / 100;
  var posY = this.wrapper.offsetHeight * perc;
  var clientY =
    event.clientY || event.clientY === 0
      ? event.clientY
      : event.touches[0].clientY;
  var offset = clientY - posY;
    
  window.addEventListener('mousemove', this.onThumbYDragStart.bind(this, offset));
  window.addEventListener('touchmove', this.onThumbYDragStart.bind(this, offset));

  event.stopPropagation();
};

TrickScrollbar.prototype.onThumbXDragStart = function onThumbXDragStart (offset, event) {
  if (this.draggingX) {
    var perc = ((event.clientX - offset) / this.wrapper.offsetWidth);
    var posX = this.scroller.scrollWidth * perc;
    this.scroller.scrollLeft = posX;
  }
};

TrickScrollbar.prototype.onThumbYDragStart = function onThumbYDragStart (offset, event) {
  if (this.draggingY) {
    var perc = ((event.clientY - offset) / this.wrapper.offsetHeight);
    var posY = this.scroller.scrollHeight * perc;
    this.scroller.scrollTop = posY;
  }
};

TrickScrollbar.prototype.onThumbDragStop = function onThumbDragStop () {
  this.draggingX = false;
  this.draggingY = false;
  this.wrapper.classList.remove('dragging');
  window.removeEventListener('mousemove', this.onThumbXDragStart.bind(this));
  window.removeEventListener('mousemove', this.onThumbYDragStart.bind(this));
};

TrickScrollbar.prototype.assembleDOM = function assembleDOM () {
  var parent = this.scroller.parentNode;
  this.wrapper = document.createElement('div');
    
  this.wrapper.classList.add('ts-scroll-content');
  this.scroller.classList.add('ts-scroller');
    
  parent.appendChild(this.wrapper);
  this.wrapper.appendChild(this.scroller);
};
  
TrickScrollbar.prototype.appendThumbY = function appendThumbY () {
  this.scrollbarY = document.createElement('div');
  this.thumbY = document.createElement('div');
    
  this.scrollbarY.classList.add('ts-scrollbar-y');
  this.thumbY.classList.add('ts-thumb-y');
    
  this.scrollbarY.appendChild(this.thumbY);
  this.wrapper.appendChild(this.scrollbarY);
};

TrickScrollbar.prototype.appendThumbX = function appendThumbX () {
  if (this.childrenWidth > this.scroller.offsetWidth) {
    this.scrollbarX = document.createElement('div');
    this.scrollbarX.classList.add('ts-scrollbar-x');
    this.thumbX = document.createElement('div');
    this.thumbX.classList.add('ts-thumb-x');
    this.scrollbarX.appendChild(this.thumbX);
    this.wrapper.appendChild(this.scrollbarX);
  }
};

TrickScrollbar.prototype.chechChildrenWidth = function chechChildrenWidth () {
    var this$1 = this;

  Array.from(this.scroller.children).forEach(function (child) {
    if (this$1.childrenWidth <= child.offsetWidth) {
      this$1.childrenWidth = child.offsetWidth;
    }
  });
};

TrickScrollbar.prototype.addEventListeners = function addEventListeners () {
  this.scroller.addEventListener('scroll', this.handleScroll.bind(this));

  this.thumbX && this.thumbX.addEventListener('mousedown', this.onThumbXMouseDown.bind(this));
  this.thumbY && this.thumbY.addEventListener('mousedown', this.onThumbYMouseDown.bind(this));
  window.addEventListener('mouseup', this.onThumbDragStop.bind(this));
    
  this.thumbX && this.thumbX.addEventListener('touchstart', this.onThumbXMouseDown.bind(this));
  this.thumbY && this.thumbY.addEventListener('touchstart', this.onThumbYMouseDown.bind(this));
  window.addEventListener('touchend', this.onThumbDragStop.bind(this));

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
