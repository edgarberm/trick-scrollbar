import TrickScrollbar from '../src/trick-scrollbar'
import fs from 'fs'

jest.dontMock('fs')
jest.mock('../src/trick-scrollbar')
const html = fs.readFileSync('example/index.html', 'utf8').toString()

describe('TrickScrollbar', () => {
  beforeEach(() => {
    TrickScrollbar.mockClear()
  })
  
  afterEach(() => {
    jest.resetModules()
  })
  
  it('Instance can be created', () => {
    const trickScrollbar = new TrickScrollbar()
    expect(trickScrollbar).toBeTruthy()
  })
  
  it('Check if the class constructor is called', () => {
    document.documentElement.innerHTML = html
    const scroller = document.querySelector('.scroll')
    new TrickScrollbar(scroller)

    expect(TrickScrollbar).toHaveBeenCalledTimes(1)
    expect(TrickScrollbar).toHaveBeenCalledWith(scroller)
  })
  
  it('Checks if inital methods are called', () => {
    document.documentElement.innerHTML = html
    const scroller = document.querySelector('.scroll')
    new TrickScrollbar(scroller)
    const mockTrickScrollbar = TrickScrollbar.mock.instances[0]
    const mockAssembleDOM = mockTrickScrollbar.assembleDOM
    const mockChechChildrenWidth = mockTrickScrollbar.chechChildrenWidth
    const mockAppendThumbX = mockTrickScrollbar.appendThumbX
    const mockAppendThumbY = mockTrickScrollbar.appendThumbY
    const mockResizeScrollbarX = mockTrickScrollbar.resizeScrollbarX
    const mockResizeScrollbarY = mockTrickScrollbar.resizeScrollbarY
    const mockAddEventListeners = mockTrickScrollbar.addEventListeners
    
    setTimeout(() => {
      expect(mockAssembleDOM).toHaveBeenCalledTimes(1)
      expect(mockChechChildrenWidth).toHaveBeenCalledTimes(1)
      expect(mockAppendThumbX).toHaveBeenCalledTimes(1)
      expect(mockAppendThumbY).toHaveBeenCalledTimes(1)
      expect(mockResizeScrollbarX).toHaveBeenCalledTimes(1)
      expect(mockResizeScrollbarY).toHaveBeenCalledTimes(1)
      expect(mockAddEventListeners).toHaveBeenCalledTimes(1)
    }, 200)
  })

  it('Checks if DOM is assembled correctly', () => {
    document.documentElement.innerHTML = html
    const scroller = document.querySelector('.scroll')
    new TrickScrollbar(scroller)

    setTimeout(() => {
      const scrollContent = document.find('.ts-scroll-content')
      const scroller = scrollContent.find('.ts-scroller')
      const scrollbarX = scrollContent.find('.ts-scrollbar-x')
      const scrollbarY = scrollContent.find('.ts-scrollbar-y')
      const thumbX = scrollbarX.find('.ts-thumb-x')
      const thumbY = thumbY.find('.ts-thumb-y')

      expect(scrollContent).toBeEqual(HTMLDivElement)
      expect(scroller).toBeEqual(HTMLDivElement)
      expect(scrollbarX).toBeEqual(HTMLDivElement)
      expect(scrollbarY).toBeEqual(HTMLDivElement)
      expect(thumbX).toBeEqual(HTMLDivElement)
      expect(thumbY).toBeEqual(HTMLDivElement)
    }, 200)
  })
  
  it('Fire mousedown event correctly', () => {
    document.documentElement.innerHTML = html
    const scroller = document.querySelector('.scroll')
    new TrickScrollbar(scroller)
    const mockTrickScrollbar = TrickScrollbar.mock.instances[0]
  })
})
