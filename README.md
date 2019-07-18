<h1 align="center">trick-scrollbar</h1>

<p align="center">The native browser's scrollbar customized with some magic tricks ✨<p>
<p align="center">
  <img src="https://travis-ci.org/builtbyedgar/trick-scrollbar.svg?branch=master" alt="Build">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
</p>

________

## Why trick-scrollbar?

**trick-scrollbar** don't emulate a scroll, it's the browser's own scroll but 
customized with some magic tricks.

* It's native, it's efficient.
* You can use plain JavaScript `scrollTo`, `scrollTop` and all native methods.
* Is fully customizable.
* Easy to use.
* No dependencies.

## Live preview

Coming soon..


## How to use

First, don't set the CSS `overflow` as `hidden` because the scroll **won't work**.

```html
<style>
  .scroll {
    height: 100%;
    width: 100%;
    overflow: auto;
  }
</style>
```

You need to include the `trick-scrollbar.css` file.

```html
<link rel="stylesheet" href="css/trick-scrollbar.css">
```

Import from ES module:

```js
import TrickScrollbar from 'trick-scrollbar'
```

Import in browser:

```html
<script src="dist/trick-scrollbar.js"></script>
```

Initialise:

```js
const scrollContainer = document.querySelector('.scroll')
const scroller = new TrickScrollbar(scrollContainer)
```

## License

[MIT](LICENSE)


## TODO

- [ ] Add support to horizontal scroll
- [x] Test in all browsers
- [ ] Add CSS variables
- [ ] Hide scrollbar when mouse is stopped
- [ ] Finish the doc
- [ ] Add tests
- [ ] Publish to `npm`