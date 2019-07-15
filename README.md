<h1 align="center">trick-scrollbar</h1>

<p align="center">The native browser's scrollbar customized with some magic tricks<p>

________

## Why trick-scrollbar?

Simply because **trick-scrollbar** uses in native browser scroll but with some 
JavaScript CSS tricks.

* It's native, it's efficient.
* Use plain `scrollTo`, `scrollTop` and all js methods.
* Is fully customizable.
* Easy to use.
* No dependencies.

## Live preview

Coming soon..


## How to use

trick-scrollbar don't emulate a scroll, it's the browser's own scroll but 
customized with some magic tricks. For this reason, it's necessary to have 
some points in mind.

First, don't set the CSS `overflow` as `hidden` because the scroll **won't work**.

The container needs to have a `relative` position.

```html
<style>
  .scroll-container {
    position: relative;
    width: var(--width);
    height: var(--height);
    overflow-x: hidden;
    overflow-y: scroll;
  }
</style>
```

You need to include the `trick-scrollbar.css` file.

```html
<link rel="stylesheet" href="css/trick-scrollbar.css">
```

Import from `npm`:

```html
// TODO.
```

Import in browser:

```html
<script src="dist/trick-scrollbar.js"></script>
```

Initialise:

```js
const wrapper = document.querySelector('.wrapper')
const scroller = new TrickScrollbar(wrapper)
```

## License

[MIT](LICENSE)


## TODO

- [ ] Add support to horizontal scroll
- [ ] Test in different browsers
- [ ] Add CSS variables
- [ ] Hide scrollbar when mouse is stopped
- [ ] Finish the doc
- [ ] Add tests
- [ ] Publish to `npm`