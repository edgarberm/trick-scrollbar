import TrickScrollbar from '../src/trick-scrollbar'

jest.mock('../src/trick-scrollbar')

beforeEach(() => {
  TrickScrollbar.mockClear()
})

function setDOM () {
  document.body.innerHTML = '<div class="wrapper"><div class="scroll"></div></div>'
}


it('The TrickScrollbar instance can be created', () => {
  const trickScrollbar = new TrickScrollbar()
  expect(trickScrollbar).toBeTruthy()
})

it('Check if the class constructor is called', () => {
  setDOM()
  const scroller = document.querySelector('.scroll')
  const trickScrollbar = new TrickScrollbar(scroller)
  expect(TrickScrollbar).toHaveBeenCalledTimes(1)
  expect(TrickScrollbar).toHaveBeenCalledWith(scroller);
})

it('Checks to see if the item is set correctly', () => {
  setDOM()
  const scroller = document.querySelector('.scroll')
  const trickScrollbar = new TrickScrollbar(scroller)
  expect(TrickScrollbar).toHaveBeenCalledWith(scroller);
})