/**
* ff-grid.js
*
* @fileoverview Minimal grid zero dependency
*
* @author David Félix-Faure
* @author http://www.felixfaure.fr/
*
*/
(function (global) {

    'use strict';

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

    function forEach (arr, cb) {
        if (arr) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i]) {
                    cb(arr[i], i, arr);
                }
            }
        }
    }

    function ffgrid (gridContainer, itemSelector, gutterH, animate, done) {
        var containerEle = gridContainer instanceof Node ? gridContainer : document.querySelector(gridContainer);
        if (!containerEle) { return false; }
        var itemsNodeList = containerEle.querySelectorAll(itemSelector);
        if (itemsNodeList.length === 0) {
            containerEle.style.height = "0px";
            return false;
        }
        var containerWidth = containerEle.getBoundingClientRect().width;
        var firstChildWidth = itemsNodeList[0].getBoundingClientRect().width;
        var cols = Math.max(Math.floor(containerWidth / firstChildWidth), 1);
        var gutterW = (containerWidth - cols * firstChildWidth) / (cols - 1);
        var gutterH = (typeof gutterH === 'number' && isFinite(gutterH) && Math.floor(gutterH) === gutterH) ? gutterH : 25;
        var count = 0;
        containerEle.style.position = 'relative';

        var itemsGutter = [];
        var itemsPosX = [];
        for ( var g = 0 ; g < cols ; ++g ) {
            itemsPosX.push(g * firstChildWidth + g * gutterW);
            itemsGutter.push(0);
        }

        forEach(itemsNodeList, function (item) {
            var itemIndex = itemsGutter
            .slice(0)
            .sort(function (a, b) {
                return a - b;
            })
            .shift();
            itemIndex = itemsGutter.indexOf(itemIndex);
            var posX = itemsPosX[itemIndex];
            var posY = itemsGutter[itemIndex];
            item.style.position = 'absolute';
            if (!animate && transformProp) {
                item.style[transformProp] = 'translate3D(' + posX + 'px,' + posY + 'px, 0)';
            }
            //   itemsGutter[itemIndex] += item.getBoundingClientRect().height + gutter;
            itemsGutter[itemIndex] += item.getBoundingClientRect().height + gutterH;
            count = count + 1;
            if (animate) {
                return animate(item, posX, posY, count);
            }
        });

        var containerHeight = itemsGutter
        .slice(0)
        .sort(function (a, b) {
            return a - b;
        })
        .pop();

        containerEle.style.height = containerHeight + 'px';

        if (typeof done === 'function') {
            done(itemsNodeList);
        }
    }

    // Exports in global environment
    global.ffgrid = ffgrid;

})(this);
