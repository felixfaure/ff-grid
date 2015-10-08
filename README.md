# FF-GRID
FF-Grid is a minimal Javascript plugin to create grids.

**[Demo](http://felixfaure.github.io/ff-grid/)**

## Features
- Minimal, less than 2kb!
- Dependency free
- Responsive oriented
- Animation ready
- Automatic calculation of gutter width

##Usage
Set up your HTML markup.
```html
<div class="ffgrid">
    <div class="ffgrid_item"></div>
    <div class="ffgrid_item"></div>
    <div class="ffgrid_item"></div>
    <div class="ffgrid_item"></div>
    <div class="ffgrid_item"></div>
    <div class="ffgrid_item"></div>
</div>
```
Add ff-grid.min.js before your closing tag.

```html
<script type="text/javascript" src="js/ff-grid.js"></script>
```

Initialize your grid in your script file or an inline script tag.

```js
ffgrid('.ffgrid', options, done);
```

##Options

The second parameter "options" is used to set several options:

```js
//Default options
{
    item: '.ffgrid_item', //string
    gutterH: "auto", //number or "auto"
    animate: false, //function
    ext: [false, false] //array of 2 booleans
};
```

The final parameter "done" is used to run a function once the grid has been initialized.

##Responsive

While FF-Grid is ready for responsive it doesn't incorporate the resize listener, this allows you to adjust it as you like (with bouncing, etc.).

For the grid fits the resizing you need to add this code:

```js
window.addEventListener('resize', function(){
    ffgrid('.ffgrid',options,done);
});
```
