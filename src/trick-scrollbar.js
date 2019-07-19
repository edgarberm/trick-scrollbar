'use strict'

export default class TrickScrollbar {
  constructor (element) {
    this.scroller = element
    this.wrapper
    this.scrollbar
    this.thumb
    this.lastY
    this.dragging = false

    this.assembleDOM()
    this.resizeScrollbar()
    this.addEventListeners()
  }

  handleScroll () {
    this.lastY = (this.scroller.scrollTop / this.scroller.scrollHeight) * 100

    window.requestAnimationFrame(() => {
      this.moveScrollbar(this.lastY)
    })
  }

  moveScrollbar (newY) {
    this.thumb.style.top = `${newY}%`;
  }

  onResize () {
    this.resizeScrollbar()
  }

  resizeScrollbar () {
    const percent = this.wrapper.offsetHeight / this.scroller.scrollHeight
    const height = this.wrapper.offsetHeight * percent
    this.thumb.style.height = `${height}px`
  }
  
  onThumbMouseDown () {
    this.dragging = true
    this.wrapper.classList.add('dragging')

    const top = this.thumb.style.top ? this.thumb.style.top : '0%'
    const perc = parseFloat(top.slice(0, -1)) / 100
    const posY = this.wrapper.offsetHeight * perc
    const clientY =
      event.clientY || event.clientY === 0
        ? event.clientY
        : event.touches[0].clientY
    const offset = clientY - posY

    window.addEventListener('mousemove', this.onThumbDragStart.bind(this, offset))
    window.addEventListener('touchmove', this.onThumbDragStart.bind(this, offset))

    event.stopPropagation()
  }

  onThumbDragStart (offset, event) {
    if (this.dragging) {
      const perc = ((event.clientY - offset) / this.wrapper.offsetHeight)
      const posY = this.scroller.scrollHeight * perc
      this.scroller.scrollTop = posY
    }
  }

  onThumbDragStop () {
    this.dragging = false
    this.wrapper.classList.remove('dragging')
    window.removeEventListener('mousemove', this.onThumbDragStart.bind(this))
  }

  onScrollbarClick (event) {
    const thumbHeight = parseFloat(this.thumb.style.height.slice(0, -2))
    const correctedY = event.clientY - (thumbHeight / 2)
    const perc = correctedY / this.scroller.offsetHeight
    const posY = this.scroller.scrollHeight * perc
    const diff = posY - this.scroller.scrollTop
    const interval = diff / 12
    let x = 0

    const repeat = () => {
      setTimeout(() => {
        this.scroller.scrollTop += interval
        x += 1

        if (x < 12) repeat()
      }, 16)
    }

    repeat()
  }

  assembleDOM () {
    const parent = this.scroller.parentNode
    this.wrapper = document.createElement('div')
    this.scrollbar = document.createElement('div')
    this.thumb = document.createElement('div')

    this.wrapper.classList.add('ts-scroll-content')
    this.scroller.classList.add('ts-scroller')
    this.scrollbar.classList.add('ts-scrollbar')
    this.thumb.classList.add('ts-thumb')

    parent.appendChild(this.wrapper)
    this.wrapper.appendChild(this.scroller)
    this.scrollbar.appendChild(this.thumb)
    this.wrapper.appendChild(this.scrollbar)
  }

  addEventListeners () {
    this.scroller.addEventListener('scroll', this.handleScroll.bind(this))

    this.thumb.addEventListener('mousedown', this.onThumbMouseDown.bind(this))
    window.addEventListener('mouseup', this.onThumbDragStop.bind(this))
    
    this.thumb.addEventListener('touchstart', this.onThumbMouseDown.bind(this))
    window.addEventListener('touchend', this.onThumbDragStop.bind(this))
    
    this.scrollbar.addEventListener('click', this.onScrollbarClick.bind(this))

    window.addEventListener('resize', debounce(this.onResize.bind(this), 250), false)
  }
}

/**
 * Debounce function
 * 
 * @param {Function} fn 
 * @param {Number} wait 
 * @param {Object} options 
 */
const debounce = (fn, wait = 0, options = {}) => {
  let timeout

  return (...args) => {
    const inmediate = 'inmediate' in options ? !!options.inmediate : options.inmediate
    const later = () => {
      timeout = null
      if (!inmediate) fn.apply(this, args)
    }
    const now = inmediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (now) fn.apply(this, args)
  }
}
