function TrickiScrollbar (scope) {
  let isDragging = false
  let lastY = 0

  createScrollbar(scope)

  function dragStart (event) {
    isDragging = true
    scope.style.pointerEvents = 'none'
    scope.style.userSelect = 'none'

    lastY = event.clientY || event.clientY === 0 ? event.clientY : event.touches[0].clientY
  }

  function dragMove (event) {
    if (!isDragging) return
    let clientY = event.clientY || event.clientY === 0 ? event.clientY : event.touches[0].clientY
    this.scrollTop += (clientY - lastY) / this.thumb.scaling
    lastY = clientY
    event.preventDefault()
  }

  function dragEnd (event) {
    isDragging = false
    scope.style.pointerEvents = 'initial'
    scope.style.userSelect = 'initial'
  }

  // update the thumb
  function updateThumbnail (scrollable) {
    scrollable.style.width = ''
    scrollable.style.width = `calc(${getComputedStyle(scrollable).width} + 20px)`

    let thumb = scrollable.thumb
    let viewport = scrollable.getBoundingClientRect()
    let scrollHeight = scrollable.scrollHeight
    let maxScrollTop = scrollHeight - viewport.height
    let thumbHeight = Math.pow(viewport.height, 2) / scrollHeight
    let maxTopOffset = viewport.height - thumbHeight

    thumb.scaling = maxTopOffset / maxScrollTop
    thumb.style.height = `${thumbHeight}px`

    if (scrollable.isIOS) {
      thumb.nextElementSibling.style.marginTop = `-${thumbHeight}px`
      let z = 1 - 1 / (1 + thumb.scaling)
      thumb.style.transform = `
        translateZ(${z}px)
        scale(${1 - z})
        translateX(-20px)
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
         translateX(-20px)
      `
    }
  }

  function createScrollbar (scrollable) {
    document.body.style.transform = 'translateZ(0)'

    const perspectiveWrapper = document.createElement('div')
    const thumb = document.createElement('div')

    scrollable.classList.add('cs-scrollable')
    perspectiveWrapper.classList.add('cs-perspective-wrapper')
    thumb.classList.add('cs-thumb')

    while (scrollable.firstChild) perspectiveWrapper.appendChild(scrollable.firstChild)

    scrollable.insertBefore(perspectiveWrapper, scrollable.firstChild)
    perspectiveWrapper.insertBefore(thumb, perspectiveWrapper.firstChild)
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
        .forEach((e) => perspectiveWrapper.appendChild(e))
    }
    
    const fn = () => updateThumbnail(scrollable)

    scrollable.thumb.addEventListener('mousedown', dragStart.bind(scrollable), { passive: true })
    scrollable.thumb.addEventListener('touchstart', dragStart.bind(scrollable), { passive: true })
    window.addEventListener('mousemove', dragMove.bind(scrollable))
    window.addEventListener('touchmove', dragMove.bind(scrollable))
    window.addEventListener('mouseup', dragEnd.bind(scrollable), { passive: true })
    window.addEventListener('touchend', dragEnd.bind(scrollable), { passive: true })
    window.addEventListener('resize', fn)

    requestAnimationFrame(fn)
    return fn
  }
}
