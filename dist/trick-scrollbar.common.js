'use strict';

'use strict';
var this$1 = undefined;


var TrickScrollbar = function TrickScrollbar (element) {
  this.scroller = element;
  this.wrapper;
  this.scrollbarY;
  this.thumbY;
  this.thumbX;
  this.lastX;
  this.lastY;
  this.childrenWidth = 0;
  this.dragging = false;

  this.assembleDOM();
  this.chechChildrenWidth();
  this.appendThumbY();
  this.appendThumbX();
  this.resizeScrollbar();
  this.addEventListeners();
};

TrickScrollbar.prototype.handleScroll = function handleScroll () {
    var this$1 = this;

  this.lastX = (this.scroller.scrollLeft / this.scroller.scrollWidth) * 100;
  this.lastY = (this.scroller.scrollTop / this.scroller.scrollHeight) * 100;

  window.requestAnimationFrame(function () {
    this$1.moveScrollbar(this$1.lastX, this$1.lastY);
  });
};

TrickScrollbar.prototype.moveScrollbar = function moveScrollbar (newX, newY) {
  if (this.thumbX) {
    this.thumbX.style.left = newX + "%";
  }
  this.thumbY.style.top = newY + "%";
};

TrickScrollbar.prototype.resize = function resize () {
  this.resizeScrollbar();
};

TrickScrollbar.prototype.resizeScrollbar = function resizeScrollbar () {
  var percentWidth = this.wrapper.offsetWidth / this.scroller.scrollWidth;
  var width = this.wrapper.offsetWidth * percentWidth;

  var percentHeight = this.wrapper.offsetHeight / this.scroller.scrollHeight;
  var height = this.wrapper.offsetHeight * percentHeight;
  console.log(width);
    
  if (this.thumbX) {
    this.thumbX.style.width = width + "px";
  }
  this.thumbY.style.height = height + "px";
    
  if (this.scroller.scrollHeight <= this.wrapper.offsetHeight) {
    this.scrollbarY.style.display ='none';
  } else if (this.childrenWidth <= this.scroller.offsetWidth && this.scrollbarX) {
    this.scrollbarX.style.display ='none';
  } else {
    this.scrollbarY.style.display ='inherit';
  }
};
  
TrickScrollbar.prototype.onThumbMouseDown = function onThumbMouseDown () {
  this.dragging = true;
  this.wrapper.classList.add('dragging');

  var top = this.thumbY.style.top ? this.thumbY.style.top : '0%';
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

  var thumbHeight = parseFloat(this.thumbY.style.height.slice(0, -2));
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

// TODO: refactor
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

  this.thumbY.addEventListener('mousedown', this.onThumbMouseDown.bind(this));
  window.addEventListener('mouseup', this.onThumbDragStop.bind(this));
    
  this.thumbY.addEventListener('touchstart', this.onThumbMouseDown.bind(this));
  window.addEventListener('touchend', this.onThumbDragStop.bind(this));
    
  this.scrollbarY.addEventListener('click', this.onScrollbarClick.bind(this));

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

module.exports = TrickScrollbar;
