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

    //Foreach function
    function forEach (arr, cb) {
        if (arr) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i]) {
                    cb(arr[i], i, arr);
                }
            }
        }
    }

    //Extend function
    function extend(origOptions, userOptions){
        var extendOptions = {}, attrname;
        for (attrname in origOptions) { extendOptions[attrname] = origOptions[attrname]; }
        for (attrname in userOptions) { extendOptions[attrname] = userOptions[attrname]; }
        return extendOptions;
    }

    //Main function
    function ffgrid (container, options, done) {
        //Default Options
        var args = {
            item: '.ffgrid_item', //String
            gutterH: "auto", //number or "auto"
            animate: false, //Boolean
            ext: [false,false] //Array of 2 booleans
        };
        //Fusion with user options
        args = extend(args, options);

        //Get container element (with string or node element)
        var containerEle = container instanceof Node ? container : document.querySelector(container);
        if (!containerEle) { return false; }
        //Get items
        var itemsNodeList = containerEle.querySelectorAll(args.item);
        if (itemsNodeList.length === 0) {
            containerEle.style.height = "0px";
            return false;
        }
        //Get variables
        var containerWidth = containerEle.getBoundingClientRect().width;
        var firstChildWidth = itemsNodeList[0].getBoundingClientRect().width;
        var cols = Math.max(Math.floor(containerWidth / firstChildWidth), 1);
        var gutterW = (containerWidth - cols * firstChildWidth) / (cols - 1 + (args.ext[0] ? 2 : 0));
        var gutterH = args.gutterH == "auto" ? gutterW : args.gutterH;
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
            if (!args.animate && transformProp) {
                item.style[transformProp] = 'translate3D(' + posX + 'px,' + posY + 'px, 0)';
            } else if(!args.animate && !transformProp) {
                item.style['left'] = posX + 'px';
                item.style['top'] = posY + 'px';
            }
            itemsGutter[itemIndex] += item.getBoundingClientRect().height + gutterH;
            count = count + 1;
            if (args.animate) {
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
        if (typeof done === 'function') {
            done(itemsNodeList);
        }
    }

    // Exports in global environment
    global.ffgrid = ffgrid;

})(this);
