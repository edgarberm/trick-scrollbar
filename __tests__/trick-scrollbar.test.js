import TrickScrollbar from '../src/trick-scrollbar'

jest.mock('../src/trick-scrollbar')

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
    const scroller = document.querySelector('.scroll')
    const trickScrollbar = new TrickScrollbar(scroller) 
    expect(TrickScrollbar).toHaveBeenCalledTimes(1)
    expect(TrickScrollbar).toHaveBeenCalledWith(scroller)
  })
  
  it('Checks if the item is set correctly', () => {
    const scroller = document.querySelector('.scroll')
    const trickScrollbar = new TrickScrollbar(scroller)
    expect(TrickScrollbar).toHaveBeenCalledWith(scroller) 
  })
  
  it('Checks if the scrollbars is append correctly', () => {
    // TODO
  })
})
