/**
 * @class: TrickScrollbar
 */
class TrickScrollbar {

  constructor(element) {
    this.dragging = false
    this.lastY = 0
    this.thumb
    
    this.createTrickScrollbar(element)
    this.updateThumb(element)
  }


  onDragStart (event) {
    this.dragging = true
    this.classList.add('scrolling')
    this.lastY = event.clientY || event.clientY === 0 ? event.clientY : event.touches[0].clientY
  }
  
  onDrag (event) {
    if (!this.dragging) return

    const clientY = event.clientY || event.clientY === 0 ? event.clientY : event.touches[0].clientY
    this.scrollTop += (clientY - this.lastY) / this.thumb.scaling
    this.lastY = clientY

    event.preventDefault()
  }
  
  onDragEnd () {
    this.dragging = false
    this.classList.remove('scrolling')
  }

  updateThumb (scrollable) {
    const thumb = scrollable.thumb
    const bounding = scrollable.getBoundingClientRect()
    const scrollHeight = scrollable.scrollHeight
    const maxScrollTop = scrollHeight - bounding.height
    const thumbHeight = Math.pow(bounding.height, 2) / scrollHeight
    const maxTopOffset = bounding.height - thumbHeight

    scrollable.style.width = ''
    scrollable.style.width = `calc(${getComputedStyle(scrollable).width} + 20px)`

    thumb.scaling = maxTopOffset / maxScrollTop
    thumb.style.height = `${thumbHeight}px`

    // I don't remember where I found this piece of code. 
    // If anyone knows, please contact me.
    if (scrollable.isIOS) {
      const z = 1 - 1 / (1 + thumb.scaling)
      thumb.nextElementSibling.style.marginTop = `-${thumbHeight}px`
      thumb.style.transform = `
        translateZ(${z}px)
        scale(${1 - z})
        translateX(-22px)
      `
    } else {
      thumb.style.transform = `
         scale(${1 / thumb.scaling})
         matrix3d(
           1, 0, 0, 0,
           0, 1, 0, 0,
           0, 0, 1, 0,
           0, 0, 0, -1
         )
         translateZ(${-2 + 1 - 1 / thumb.scaling}px)
         translateX(-22px)
      `
    }
  }

  createTrickScrollbar (scrollable) {
    const fn = () => this.updateThumb(scrollable)
    const perspectiveWrapper = document.createElement('div')
    const thumb = document.createElement('div')

    if (getComputedStyle(document.body).transform == 'none') {
      document.body.style.transform = 'translateZ(0)'
    }

    scrollable.classList.add('cs-scrollable')
    perspectiveWrapper.classList.add('cs-perspective-wrapper')
    thumb.classList.add('cs-thumb')

    while (scrollable.firstChild) {
      perspectiveWrapper.appendChild(scrollable.firstChild)
    }

    scrollable.insertBefore(perspectiveWrapper, scrollable.firstChild)
    scrollable.appendChild(thumb)
    
    scrollable.thumb = thumb
    scrollable.perspectiveWrapper = perspectiveWrapper

    // Safari trick
    if (window.safari !== undefined) {
      scrollable.isIOS = true
      thumb.style.right = ''
      thumb.style.left = '100%'
      thumb.style.position = '-webkit-sticky'
      perspectiveWrapper.style.perspective = '1px'
      perspectiveWrapper.style.height = ''
      perspectiveWrapper.style.width = ''
      perspectiveWrapper.style.position = ''
      Array.from(scrollable.children)
        .filter((e) => e !== perspectiveWrapper)
        .forEach((e) => { perspectiveWrapper.appendChild(e) })
    }

    scrollable.thumb.addEventListener('mousedown', this.onDragStart.bind(scrollable), { passive: true })
    window.addEventListener('mousemove', this.onDrag.bind(scrollable))
    window.addEventListener('mouseup', this.onDragEnd.bind(scrollable), { passive: true })

    scrollable.thumb.addEventListener('touchstart', this.onDragStart.bind(scrollable), { passive: true })
    window.addEventListener('touchmove', this.onDrag.bind(scrollable))
    window.addEventListener('touchend', this.onDragEnd.bind(scrollable), { passive: true })

    requestAnimationFrame(fn)
    window.addEventListener('resize', fn)

    return fn
  }
  
}
