<h1 align="center">trick-scrollbar</h1>

<p align="center">CSS Customization for your browser native scrollbar<p>

________

## Why trick-scrollbar?

Simply because **trick-scrollbar** uses in native browser scroll but with some 
JavaScript CSS tricks

* It's native, it's efficient.
* Use plain `scrollTo`, `scrollTop` and all js methods.
* Is fully customizable.
* Easy to use.
* No dependencies.

## Live preview

Check out the..


## How to use

trick-scrollbar don't emulate a scroll, it's the browser's own scroll but 
customized with some magic tricks. For this reason, it's necessary to have 
some points in mind.

First, don't set the CSS `overflow` as `hidden` because the scroll **won't work**.

The container needs to have a `relative` position.
s
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

Import in browser:

```html
<script src="dist/trick-scrollbar.js"></script>
```

To initialise:

```js
const wrapper = document.querySelector('.wrapper')
const scroller = new TrickiScrollbar(wrapper)
```

## License

[MIT](LICENSE)


## TODO

- [ ] Finish the doc
- [ ] Add support to horizontal scroll
- [ ] Hide scrollbar when mouse is stopped
- [ ] Publish to `npm`