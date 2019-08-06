'use strict'

export default class TrickScrollbar {
  constructor (element) {
    this.scroller = element
    this.wrapper
    this.scrollbarY
    this.thumbY
    this.thumbX
    this.childrenWidth = 0
    this.dragging = false

    this.assembleDOM()
    this.chechChildrenWidth()
    this.appendThumbX()
    this.appendThumbY()
    this.resizeScrollbarX()
    this.resizeScrollbarY()
    this.addEventListeners()
  }

  handleScroll () {
    const lastX = (this.scroller.scrollLeft / this.scroller.scrollWidth) * 100
    const lastY = (this.scroller.scrollTop / this.scroller.scrollHeight) * 100

    window.requestAnimationFrame(() => {
      this.thumbX && this.moveScrollbarX(lastX)
      this.thumbY && this.moveScrollbarY(lastY)
    })
  }

  moveScrollbarX (newX) {
    this.thumbX.style.left = `${newX}%`;
  }
  
  moveScrollbarY (newY) {
    this.thumbY.style.top = `${newY}%`;
  }

  resize () {
    this.thumbX && this.resizeScrollbarX()
    this.thumbY && this.resizeScrollbarY()
  }

  resizeScrollbarX () {
    const percentWidth = this.wrapper.offsetWidth / this.scroller.scrollWidth
    const width = this.wrapper.offsetWidth * percentWidth
    this.thumbX.style.width = `${width}px`

    if (this.childrenWidth <= this.scroller.offsetWidth && this.scrollbarX) {
      this.scrollbarX.style.display ='none'
    } else {
      this.scrollbarX.style.display ='inherit'
    }
  }
  
  resizeScrollbarY () {
    const percentHeight = this.wrapper.offsetHeight / this.scroller.scrollHeight
    const height = this.wrapper.offsetHeight * percentHeight
    this.thumbY.style.height = `${height}px`

    if (this.scroller.scrollHeight <= this.wrapper.offsetHeight) {
      this.scrollbarY.style.display = 'none'
    } else {
      this.scrollbarY.style.display = 'inherit'
    }
  }

  onThumbXMouseDown() {
    this.dragging = true
    this.wrapper.classList.add('dragging')

    const left = this.thumbX.style.left ? this.thumbX.style.left : '0%'
    const perc = parseFloat(left.slice(0, -1)) / 100
    const posX = this.wrapper.offsetHeight * perc
    const clientX =
      event.clientX || event.clientX === 0
        ? event.clientX
        : event.touches[0].clientX
    const offset = clientX - posX

    window.addEventListener('mousemove', this.onThumbXDragStart.bind(this, offset))
    window.addEventListener('touchmove', this.onThumbXDragStart.bind(this, offset))

    event.stopPropagation()
  }
  
  onThumbYMouseDown () {
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

    window.addEventListener('mousemove', this.onThumbYDragStart.bind(this, offset))
    window.addEventListener('touchmove', this.onThumbYDragStart.bind(this, offset))

    event.stopPropagation()
  }

  onThumbYDragStart (offset, event) {
    if (this.dragging) {
      const perc = ((event.clientY - offset) / this.wrapper.offsetHeight)
      const posY = this.scroller.scrollHeight * perc
      this.scroller.scrollTop = posY
    }
  }

  onThumbXDragStart(offset, event) {
    if (this.dragging) {
      const perc = ((event.clientX - offset) / this.wrapper.offsetWidth)
      const posX = this.scroller.scrollWidth * perc
      this.scroller.scrollLeft = posX
    }
  }

  onThumbDragStop () {
    this.dragging = false
    this.wrapper.classList.remove('dragging')
    window.removeEventListener('mousemove', this.onThumbXDragStart.bind(this))
    window.removeEventListener('mousemove', this.onThumbYDragStart.bind(this))
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
    
    this.wrapper.classList.add('ts-scroll-content')
    this.scroller.classList.add('ts-scroller')
    
    parent.appendChild(this.wrapper)
    this.wrapper.appendChild(this.scroller)
  }
  
  appendThumbY () {
    this.scrollbarY = document.createElement('div')
    this.thumbY = document.createElement('div')
    
    this.scrollbarY.classList.add('ts-scrollbar-y')
    this.thumbY.classList.add('ts-thumb-y')
    
    this.scrollbarY.appendChild(this.thumbY)
    this.wrapper.appendChild(this.scrollbarY)
  }

  appendThumbX () {
    if (this.childrenWidth > this.scroller.offsetWidth) {
      this.scrollbarX = document.createElement('div')
      this.scrollbarX.classList.add('ts-scrollbar-x')
      this.thumbX = document.createElement('div')
      this.thumbX.classList.add('ts-thumb-x')
      this.scrollbarX.appendChild(this.thumbX)
      this.wrapper.appendChild(this.scrollbarX)
    }
  }

  // TODO: refactor
  chechChildrenWidth () {
    Array.from(this.scroller.children).forEach(child => {
      if (this.childrenWidth <= child.offsetWidth) {
        this.childrenWidth = child.offsetWidth
      }
    })
  }

  addEventListeners () {
    this.scroller.addEventListener('scroll', this.handleScroll.bind(this))

    this.thumbX && this.thumbX.addEventListener('mousedown', this.onThumbXMouseDown.bind(this))
    this.thumbY && this.thumbY.addEventListener('mousedown', this.onThumbYMouseDown.bind(this))
    window.addEventListener('mouseup', this.onThumbDragStop.bind(this))
    
    this.thumbX && this.thumbX.addEventListener('touchstart', this.onThumbXMouseDown.bind(this))
    this.thumbY && this.thumbY.addEventListener('touchstart', this.onThumbYMouseDown.bind(this))
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
