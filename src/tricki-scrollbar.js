function TrickiScrollbar (element) {
  let dragging = false
  let lastY = 0

  createTrickiScrollbar(element)

  function onDragStart (event) {
    dragging = true
    this.classList.add('scrolling')
    lastY = event.clientY || event.clientY === 0 ? event.clientY : event.touches[0].clientY
  }
  
  function onDrag (event) {
    if (!dragging) return
    const clientY = event.clientY || event.clientY === 0 ? event.clientY : event.touches[0].clientY
    this.scrollTop += (clientY - lastY) / this.thumb.scaling
    lastY = clientY
    event.preventDefault()
  }
  
  function onDragEnd () {
    dragging = false
    this.classList.remove('scrolling')
  }

  function updateThumb (scrollable) {
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

  function createTrickiScrollbar (scrollable) {
    const fn = () => updateThumb(scrollable)
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

    // We are on Safari, where we need to use the sticky trick!
    if (getComputedStyle(scrollable).webkitOverflowScrolling) {
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

    scrollable.thumb.addEventListener('mousedown', onDragStart.bind(scrollable), { passive: true })
    window.addEventListener('mousemove', onDrag.bind(scrollable))
    window.addEventListener('mouseup', onDragEnd.bind(scrollable), { passive: true })
    scrollable.thumb.addEventListener('touchstart', onDragStart.bind(scrollable), { passive: true })
    window.addEventListener('touchmove', onDrag.bind(scrollable))
    window.addEventListener('touchend', onDragEnd.bind(scrollable), { passive: true })

    requestAnimationFrame(fn)
    window.addEventListener('resize', fn)
    return fn
  }
}
