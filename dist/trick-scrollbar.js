(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.TrickScrollbar = factory());
}(this, (function () { 'use strict';

/**
 * @class: TrickScrollbar
 */
var TrickScrollbar = function TrickScrollbar(element) {
  this.dragging = false;
  this.lastY = 0;
  this.thumb;
    
  this.createTrickScrollbar(element);
  this.updateThumb(element);
};


TrickScrollbar.prototype.onDragStart = function onDragStart (event) {
  this.dragging = true;
  this.classList.add('scrolling');
  this.lastY = event.clientY || event.clientY === 0 ? event.clientY : event.touches[0].clientY;
};
  
TrickScrollbar.prototype.onDrag = function onDrag (event) {
  if (!this.dragging) { return }

  var clientY = event.clientY || event.clientY === 0 ? event.clientY : event.touches[0].clientY;
  this.scrollTop += (clientY - this.lastY) / this.thumb.scaling;
  this.lastY = clientY;

  event.preventDefault();
};
  
TrickScrollbar.prototype.onDragEnd = function onDragEnd () {
  this.dragging = false;
  this.classList.remove('scrolling');
};

TrickScrollbar.prototype.updateThumb = function updateThumb (scrollable) {
  var thumb = scrollable.thumb;
  var bounding = scrollable.getBoundingClientRect();
  var scrollHeight = scrollable.scrollHeight;
  var maxScrollTop = scrollHeight - bounding.height;
  var thumbHeight = Math.pow(bounding.height, 2) / scrollHeight;
  var maxTopOffset = bounding.height - thumbHeight;

  scrollable.style.width = '';
  scrollable.style.width = "calc(" + (getComputedStyle(scrollable).width) + " + 20px)";

  thumb.scaling = maxTopOffset / maxScrollTop;
  thumb.style.height = thumbHeight + "px";

  // I don't remember where I found this piece of code. 
  // If anyone knows, please contact me.
  if (scrollable.isIOS) {
    var z = 1 - 1 / (1 + thumb.scaling);
    thumb.nextElementSibling.style.marginTop = "-" + thumbHeight + "px";
    thumb.style.transform = "\n        translateZ(" + z + "px)\n        scale(" + (1 - z) + ")\n        translateX(-22px)\n      ";
  } else {
    thumb.style.transform = "\n         scale(" + (1 / thumb.scaling) + ")\n         matrix3d(\n           1, 0, 0, 0,\n           0, 1, 0, 0,\n           0, 0, 1, 0,\n           0, 0, 0, -1\n         )\n         translateZ(" + (-2 + 1 - 1 / thumb.scaling) + "px)\n         translateX(-22px)\n      ";
  }
};

TrickScrollbar.prototype.createTrickScrollbar = function createTrickScrollbar (scrollable) {
    var this$1 = this;

  var fn = function () { return this$1.updateThumb(scrollable); };
  var perspectiveWrapper = document.createElement('div');
  var thumb = document.createElement('div');

  if (getComputedStyle(document.body).transform == 'none') {
    document.body.style.transform = 'translateZ(0)';
  }

  scrollable.classList.add('cs-scrollable');
  perspectiveWrapper.classList.add('cs-perspective-wrapper');
  thumb.classList.add('cs-thumb');

  while (scrollable.firstChild) {
    perspectiveWrapper.appendChild(scrollable.firstChild);
  }

  scrollable.insertBefore(perspectiveWrapper, scrollable.firstChild);
  scrollable.appendChild(thumb);
    
  scrollable.thumb = thumb;
  scrollable.perspectiveWrapper = perspectiveWrapper;

  // Safari trick
  if (window.safari !== undefined) {
    scrollable.isIOS = true;
    thumb.style.right = '';
    thumb.style.left = '100%';
    thumb.style.position = '-webkit-sticky';
    perspectiveWrapper.style.perspective = '1px';
    perspectiveWrapper.style.height = '';
    perspectiveWrapper.style.width = '';
    perspectiveWrapper.style.position = '';
    Array.from(scrollable.children)
      .filter(function (e) { return e !== perspectiveWrapper; })
      .forEach(function (e) { perspectiveWrapper.appendChild(e); });
  }

  scrollable.thumb.addEventListener('mousedown', this.onDragStart.bind(scrollable), { passive: true });
  window.addEventListener('mousemove', this.onDrag.bind(scrollable));
  window.addEventListener('mouseup', this.onDragEnd.bind(scrollable), { passive: true });

  scrollable.thumb.addEventListener('touchstart', this.onDragStart.bind(scrollable), { passive: true });
  window.addEventListener('touchmove', this.onDrag.bind(scrollable));
  window.addEventListener('touchend', this.onDragEnd.bind(scrollable), { passive: true });

  requestAnimationFrame(fn);
  window.addEventListener('resize', fn);

  return fn
};

return TrickScrollbar;

})));
