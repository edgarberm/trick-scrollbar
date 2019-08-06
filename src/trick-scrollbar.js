'use strict'

export default class TrickScrollbar {
  constructor (element) {
    this.scroller = element
    this.wrapper
    this.scrollbarY
    this.thumbY
    this.thumbX
    this.lastX
    this.lastY
    this.dragging = false

    this.assembleDOM()
    this.resizeScrollbar()
    this.addEventListeners()
  }

  handleScroll () {
    this.lastX = (this.scroller.scrollLeft / this.scroller.scrollWidth) * 100
    this.lastY = (this.scroller.scrollTop / this.scroller.scrollHeight) * 100


    window.requestAnimationFrame(() => {
      this.moveScrollbar(this.lastY)
    })
  }

  moveScrollbar (newY) {
    this.thumbY.style.top = `${newY}%`;
  }

  resize () {
    this.resizeScrollbar()
  }

  resizeScrollbar () {
    const percentWidth = this.wrapper.offsetWidth / this.scroller.scrollWidth
    const width = this.wrapper.offsetHeight * percentWidth
    const percentHeight = this.wrapper.offsetHeight / this.scroller.scrollHeight
    const height = this.wrapper.offsetHeight * percentHeight
    this.thumbX.style.width = `${width}px`
    this.thumbY.style.height = `${height}px`
    
    if (this.scroller.scrollHeight <= this.wrapper.offsetHeight) {
      this.scrollbarX.style.display ='none'
      this.scrollbarY.style.display ='none'
    } else {
      this.scrollbarX.style.display ='inherit'
      this.scrollbarY.style.display ='inherit'
    }
  }
  
  onThumbMouseDown () {
    this.dragging = true
    this.wrapper.classList.add('dragging')

    const top = this.thumbY.style.top ? this.thumbY.style.top : '0%'
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
    const thumbHeight = parseFloat(this.thumbY.style.height.slice(0, -2))
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
    this.scrollbarY = document.createElement('div')
    this.thumbY = document.createElement('div')
    
    this.wrapper.classList.add('ts-scroll-content')
    this.scroller.classList.add('ts-scroller')
    this.scrollbarY.classList.add('ts-scrollbar-y')
    this.thumbY.classList.add('ts-thumb-y')

    parent.appendChild(this.wrapper)
    this.wrapper.appendChild(this.scroller)
    this.scrollbarY.appendChild(this.thumbY)
    this.wrapper.appendChild(this.scrollbarY)

    if (this.chechChildrenWidth() > this.scroller.offsetWidth) {
      this.scrollbarX = document.createElement('div')
      this.scrollbarX.classList.add('ts-scrollbar-x')
      this.thumbX = document.createElement('div')
      this.thumbX.classList.add('ts-thumb-x')
      this.scrollbarX.appendChild(this.thumbX)
      this.wrapper.appendChild(this.scrollbarX)

      console.log('Needs horizontal scroll');
    }
  }

  // TODO: refactor
  chechChildrenWidth () {
    let childrenWidth = 0
    Array.from(this.scroller.children).forEach(child => {
      if (childrenWidth <= child.offsetWidth) {
        childrenWidth = child.offsetWidth
      }
    })

    return childrenWidth
  }

  addEventListeners () {
    this.scroller.addEventListener('scroll', this.handleScroll.bind(this))

    this.thumbY.addEventListener('mousedown', this.onThumbMouseDown.bind(this))
    window.addEventListener('mouseup', this.onThumbDragStop.bind(this))
    
    this.thumbY.addEventListener('touchstart', this.onThumbMouseDown.bind(this))
    window.addEventListener('touchend', this.onThumbDragStop.bind(this))
    
    this.scrollbarY.addEventListener('click', this.onScrollbarClick.bind(this))

    window.addEventListener('resize', debounce(this.resize.bind(this), 250), false)
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
