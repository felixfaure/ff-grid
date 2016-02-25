/**
* ff-grid.js
*
* @fileoverview Minimal grid zero dependency responsive oriented
*
* @author David Félix-Faure
* @author http://www.felixfaure.fr/
*
*/
(function (global) {

  'use strict';

  //Vendor prefix transform property
  var transformProp;
  (function () {
    var style = document.createElement('a').style;
    var prop;
    if (style[prop = 'webkitTransform'] !== undefined) {
      transformProp = prop;
    }
    if (style[prop = 'msTransform'] !== undefined) {
      transformProp = prop;
    }
    if (style[prop = 'transform'] !== undefined) {
      transformProp = prop;
    }
  }());

  function getBCR(el) {
    return el.getBoundingClientRect();
  }

  //Main function
  //Args {
  //  cont: node or string (container)
  //  item: string (selector of the grid items)
  //  gutter: number or "auto" (vertical gutter, auto => same as horizontal gutter)
  //  animate: function (animate)
  //  ext: array[boolean,boolean] ([horizontal,vertical])
  //  done: function
  //}
  function ffgrid (args) {
    //No support for no csstransform browsers
    if(!transformProp) {
      return false;
    }

    //Get container element (with string or node element)
    var containerEle = args.cont instanceof Node ? args.cont : document.querySelector(args.cont);
    if (!containerEle) {
      return false;
    }
    //Get items
    var itemsNodeList = [].slice.call(containerEle.querySelectorAll(args.item));
    if (itemsNodeList.length === 0) {
      return false;
    }
    //Get variables
    args.ext = args.ext || [false,false];

    var containerWidth = getBCR(containerEle).width;
    var firstChildWidth = getBCR(itemsNodeList[0]).width;
    var cols = Math.max(Math.floor(containerWidth / firstChildWidth), 1);
    var gutterW = (containerWidth - cols * firstChildWidth) / (cols - 1 + (args.ext[0] ? 2 : 0));
    var gutterH = args.gutter || gutterW;
    var count = 0;

    //Style relative for container
    containerEle.style.position = 'relative';

    //Initials Calculs
    var itemsGutter = [];
    var itemsPosX = [];
    for ( var g = 0 ; g < cols ; ++g ) {
      itemsPosX.push(g * firstChildWidth + (g + (args.ext[0] ? 1 : 0)) * gutterW);
      itemsGutter.push((args.ext[1] ? gutterH : 0));
    }

    //Calcul of the items position
    itemsNodeList.forEach(function(item) {
      var itemIndex = itemsGutter
      .slice(0)
      .sort(function (a, b) {
        return a - b;
      })
      .shift();
      itemIndex = itemsGutter.indexOf(itemIndex);
      var posX = itemsPosX[itemIndex];
      var posY = itemsGutter[itemIndex];
      itemsGutter[itemIndex] += getBCR(item).height + gutterH;
      count++;
      item.style.position = 'absolute';
      if (!args.animate) {
        item.style[transformProp] = 'translate(' + posX + 'px,' + posY + 'px)';
      } else {
        return args.animate(item, posX, posY, count);
      }
    });

    //Container height
    var containerHeight = itemsGutter
    .slice(0)
    .sort(function (a, b) {
      return a - b;
    })
    .pop();
    containerEle.style.height = containerHeight - (args.ext[1] ? 0 : gutterH) + 'px';

    //Function when calculs are done
    if (args.done) {
      args.done(itemsNodeList, containerEle);
    }
  }

  // Exports in global environment
  global.ffgrid = ffgrid;

})(this);
