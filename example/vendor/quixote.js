(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.quixote = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
// Copyright (c) 2015 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("./util/ensure.js");
var oop = require("./util/oop.js");
var shim = require("./util/shim.js");

var Me = module.exports = function Assertable() {
	ensure.unreachable("Assertable is abstract and should not be constructed directly.");
};
Me.extend = oop.extendFn(Me);
oop.makeAbstract(Me, []);

Me.prototype.assert = function assert(expected, message) {
	ensure.signature(arguments, [ Object, [undefined, String] ]);
	if (message === undefined) message = "Differences found";

	var diff = this.diff(expected);
	if (diff !== "") throw new Error(message + ":\n" + diff + "\n");
};

Me.prototype.diff = function diff(expected) {
	ensure.signature(arguments, [ Object ]);

	var result = [];
	var keys = shim.Object.keys(expected);
	var key, oneDiff, descriptor;
	for (var i = 0; i < keys.length; i++) {
		key = keys[i];
		descriptor = this[key];
		ensure.that(
				descriptor !== undefined,
				this + " doesn't have a property named '" + key + "'. Did you misspell it?"
		);
		oneDiff = descriptor.diff(expected[key]);
		if (oneDiff !== "") result.push(oneDiff);
	}

	return result.join("\n");
};

},{"./util/ensure.js":23,"./util/oop.js":24,"./util/shim.js":25}],3:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("../util/ensure.js");
var PositionDescriptor = require("./position_descriptor.js");
var Position = require("../values/position.js");
var RelativePosition = require("./relative_position.js");

var X_DIMENSION = "x";
var Y_DIMENSION = "y";

var Me = module.exports = function Center(dimension, position1, position2, description) {
	ensure.signature(arguments, [ String, PositionDescriptor, PositionDescriptor, String ]);

	if (dimension === X_DIMENSION) PositionDescriptor.x(this);
	else if (dimension === Y_DIMENSION) PositionDescriptor.y(this);
	else ensure.unreachable("Unknown dimension: " + dimension);

	this._dimension = dimension;
	this._position1 = position1;
	this._position2 = position2;
	this._description = description;
};
PositionDescriptor.extend(Me);

Me.x = factoryFn(X_DIMENSION);
Me.y = factoryFn(Y_DIMENSION);

Me.prototype.value = function value() {
	ensure.signature(arguments, []);
	return this._position1.value().midpoint(this._position2.value());
};

Me.prototype.toString = function toString() {
	ensure.signature(arguments, []);
	return this._description;
};

function factoryFn(dimension) {
	return function(position1, position2, description) {
		return new Me(dimension, position1, position2, description);
	};
}

},{"../util/ensure.js":23,"../values/position.js":27,"./position_descriptor.js":10,"./relative_position.js":11}],4:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("../util/ensure.js");
var oop = require("../util/oop.js");
var Value = require("../values/value.js");

var Me = module.exports = function Descriptor() {
	ensure.unreachable("Descriptor is abstract and should not be constructed directly.");
};
Me.extend = oop.extendFn(Me);
oop.makeAbstract(Me, [
	"value",
	"toString"
]);

Me.prototype.diff = function diff(expected) {
	expected = normalizeType(this, expected);
	try {
		var actualValue = this.value();
		var expectedValue = expected.value();

		if (actualValue.equals(expectedValue)) return "";

		var difference = actualValue.diff(expectedValue);
		var expectedDesc = expectedValue.toString();
		if (expected instanceof Me) expectedDesc += " (" + expected + ")";

		return this + " was " + difference + ".\n" +
			"  Expected: " + expectedDesc + "\n" +
			"  But was:  " + actualValue;
	}
	catch (err) {
		throw new Error("Can't compare " + this + " to " + expected + ": " + err.message);
	}
};

Me.prototype.convert = function convert(arg, type) {
	// This method is meant to be overridden by subclasses. It should return 'undefined' when an argument
	// can't be converted. In this default implementation, no arguments can be converted, so we always
	// return 'undefined'.
	return undefined;
};

Me.prototype.equals = function equals(that) {
	// Descriptors aren't value objects. They're never equal to anything. But sometimes
	// they're used in the same places value objects are used, and this method gets called.
	return false;
};

function normalizeType(self, expected) {
	var expectedType = typeof expected;
	if (expected === null) expectedType = "null";

	if (expectedType === "object" && (expected instanceof Me || expected instanceof Value)) return expected;

	if (expected === undefined) {
		throw new Error("Can't compare " + self + " to " + expected + ". Did you misspell a property name?");
	}
	else if (expectedType === "object") {
		throw new Error("Can't compare " + self + " to " + oop.instanceName(expected) + " instances.");
	}
	else {
		var converted = self.convert(expected, expectedType);
		if (converted !== undefined) return converted;

		var explanation = expected;
		if (expectedType === "string") explanation = "'" + explanation + "'";
		if (expectedType === "function") explanation = "a function";

		throw new Error("Can't compare " + self + " to " + explanation + ".");
	}

}

},{"../util/ensure.js":23,"../util/oop.js":24,"../values/value.js":30}],5:[function(require,module,exports){
// Copyright (c) 2014-2016 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
(function() {
	"use strict";

	var ensure = require("../util/ensure.js");
	var Position = require("../values/position.js");
	var PositionDescriptor = require("./position_descriptor.js");
	var RenderState = require("../values/render_state.js");

	var TOP = "top";
	var RIGHT = "right";
	var BOTTOM = "bottom";
	var LEFT = "left";

	var Me = module.exports = function ElementEdge(element, position) {
		var QElement = require("../q_element.js");      // break circular dependency
		ensure.signature(arguments, [QElement, String]);

		if (position === LEFT || position === RIGHT) PositionDescriptor.x(this);
		else if (position === TOP || position === BOTTOM) PositionDescriptor.y(this);
		else ensure.unreachable("Unknown position: " + position);

		this._element = element;
		this._position = position;
	};
	PositionDescriptor.extend(Me);

	Me.top = factoryFn(TOP);
	Me.right = factoryFn(RIGHT);
	Me.bottom = factoryFn(BOTTOM);
	Me.left = factoryFn(LEFT);

	Me.prototype.value = function value() {
		ensure.signature(arguments, []);

		var rawPosition = this._element.getRawPosition();

		var edge = rawPosition[this._position];
		var scroll = this._element.frame.getRawScrollPosition();

		if (this._position === RIGHT || this._position === LEFT) {
			if (!elementRendered(this)) return Position.noX();
			return Position.x(edge + scroll.x);
		}
		else {
			if (!elementRendered(this)) return Position.noY();
			return Position.y(edge + scroll.y);
		}
	};

	Me.prototype.toString = function toString() {
		ensure.signature(arguments, []);
		return this._position + " edge of " + this._element;
	};

	function factoryFn(position) {
		return function factory(element) {
			return new Me(element, position);
		};
	}

	function elementRendered(self) {
		return self._element.rendered.value().equals(RenderState.rendered());
	}

}());
},{"../q_element.js":17,"../util/ensure.js":23,"../values/position.js":27,"../values/render_state.js":28,"./position_descriptor.js":10}],6:[function(require,module,exports){
// Copyright (c) 2016 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
(function() {
	"use strict";

	var ensure = require("../util/ensure.js");
	var RenderState = require("../values/render_state.js");
	var Descriptor = require("./descriptor.js");

	var Me = module.exports = function ElementRendered(element) {
		var QElement = require("../q_element.js");      // break circular dependency
		ensure.signature(arguments, [ QElement ]);

		this._element = element;
	};
	Descriptor.extend(Me);

	Me.create = function create(element) {
		return new Me(element);
	};

	Me.prototype.value = function value() {
		if (!this._element.frame.body().toDomElement().contains(this._element.toDomElement())) return RenderState.detached();
		else if (this._element.getRawStyle("display") === "none") return RenderState.displayNone();
		else return RenderState.rendered();
	};

	Me.prototype.toString = function toString() {
		return "render status of " + this._element.toString();
	};

	Me.prototype.convert = function convert(arg, type) {
	  if (type === "boolean") {
		  return arg ? RenderState.rendered() : RenderState.notRendered();
	  }
		if (type === "string") {
			if (arg === "display:none") return RenderState.displayNone();
			if (arg === "detached") return RenderState.detached();
		}
	};

}());
},{"../q_element.js":17,"../util/ensure.js":23,"../values/render_state.js":28,"./descriptor.js":4}],7:[function(require,module,exports){
// Copyright (c) 2014-2016 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
(function() {
	"use strict";

	var ensure = require("../util/ensure.js");
	var SizeDescriptor = require("./size_descriptor.js");
	var Size = require("../values/size.js");
	var RenderState = require("../values/render_state.js");

	var X_DIMENSION = "width";
	var Y_DIMENSION = "height";

	var Me = module.exports = function ElementSize(dimension, element) {
		var QElement = require("../q_element.js");    // break circular dependency
		ensure.signature(arguments, [String, QElement]);
		ensure.that(dimension === X_DIMENSION || dimension === Y_DIMENSION, "Unrecognized dimension: " + dimension);

		this._dimension = dimension;
		this._element = element;
	};
	SizeDescriptor.extend(Me);

	Me.x = factoryFn(X_DIMENSION);
	Me.y = factoryFn(Y_DIMENSION);

	Me.prototype.value = function value() {
		ensure.signature(arguments, []);

		if (!elementRendered(this)) return Size.createNone();

		var position = this._element.getRawPosition();
		return Size.create(position[this._dimension]);
	};

	Me.prototype.toString = function toString() {
		ensure.signature(arguments, []);

		return this._dimension + " of " + this._element;
	};

	function factoryFn(dimension) {
		return function factory(element) {
			return new Me(dimension, element);
		};
	}

	function elementRendered(self) {
		return self._element.rendered.value().equals(RenderState.rendered());
	}

}());
},{"../q_element.js":17,"../util/ensure.js":23,"../values/render_state.js":28,"../values/size.js":29,"./size_descriptor.js":13}],8:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("../util/ensure.js");
var PositionDescriptor = require("./position_descriptor.js");
var Position = require("../values/position.js");

var TOP = "top";
var RIGHT = "right";
var BOTTOM = "bottom";
var LEFT = "left";

var Me = module.exports = function PageEdge(edge, frame) {
	var QFrame = require("../q_frame.js");    // break circular dependency
	ensure.signature(arguments, [ String, QFrame ]);

	if (edge === LEFT || edge === RIGHT) PositionDescriptor.x(this);
	else if (edge === TOP || edge === BOTTOM) PositionDescriptor.y(this);
	else ensure.unreachable("Unknown edge: " + edge);

	this._edge = edge;
	this._frame = frame;
};
PositionDescriptor.extend(Me);

Me.top = factoryFn(TOP);
Me.right = factoryFn(RIGHT);
Me.bottom = factoryFn(BOTTOM);
Me.left = factoryFn(LEFT);

Me.prototype.value = function value() {
	ensure.signature(arguments, []);

	var x = Position.x(0);
	var y = Position.y(0);

	switch(this._edge) {
		case TOP: return y;
		case RIGHT: return x.plus(this._frame.page().width.value());
		case BOTTOM: return y.plus(this._frame.page().height.value());
		case LEFT: return x;

		default: ensure.unreachable();
	}
};

Me.prototype.toString = function toString() {
	ensure.signature(arguments, []);

	switch(this._edge) {
		case TOP: return "top of page";
		case RIGHT: return "right side of page";
		case BOTTOM: return "bottom of page";
		case LEFT: return "left side of page";

		default: ensure.unreachable();
	}
};

function factoryFn(edge) {
	return function factory(frame) {
		return new Me(edge, frame);
	};
}
},{"../q_frame.js":19,"../util/ensure.js":23,"../values/position.js":27,"./position_descriptor.js":10}],9:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("../util/ensure.js");
var SizeDescriptor = require("./size_descriptor.js");
var Size = require("../values/size.js");

var X_DIMENSION = "width";
var Y_DIMENSION = "height";

var Me = module.exports = function PageSize(dimension, frame) {
	var QFrame = require("../q_frame.js");    // break circular dependency
	ensure.signature(arguments, [ String, QFrame ]);
	ensure.that(dimension === X_DIMENSION || dimension === Y_DIMENSION, "Unrecognized dimension: " + dimension);

	this._dimension = dimension;
	this._frame = frame;
};
SizeDescriptor.extend(Me);

Me.x = factoryFn(X_DIMENSION);
Me.y = factoryFn(Y_DIMENSION);

Me.prototype.value = function() {
	ensure.signature(arguments, []);

	// USEFUL READING: http://www.quirksmode.org/mobile/viewports.html
	// and http://www.quirksmode.org/mobile/viewports2.html

	// API SEMANTICS.
	// Ref https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements
	//    getBoundingClientRect().width: sum of bounding boxes of element (the displayed width of the element,
	//      including padding and border). Fractional. Applies transformations.
	//    clientWidth: visible width of element including padding (but not border). EXCEPT on root element (html), where
	//      it is the width of the viewport. Rounds to an integer. Doesn't apply transformations.
	//    offsetWidth: visible width of element including padding, border, and scrollbars (if any). Rounds to an integer.
	//      Doesn't apply transformations.
	//    scrollWidth: entire width of element, including any part that's not visible due to scrollbars. Rounds to
	//      an integer. Doesn't apply transformations. Not clear if it includes scrollbars, but I think not. Also
	//      not clear if it includes borders or padding. (But from tests, apparently not borders. Except on root
	//      element and body element, which have special results that vary by browser.)

	// TEST RESULTS: WIDTH
	//   ✔ = correct answer
	//   ✘ = incorrect answer and diverges from spec
	//   ~ = incorrect answer, but matches spec
	// BROWSERS TESTED: Safari 6.2.0 (Mac OS X 10.8.5); Mobile Safari 7.0.0 (iOS 7.1); Firefox 32.0.0 (Mac OS X 10.8);
	//    Firefox 33.0.0 (Windows 7); Chrome 38.0.2125 (Mac OS X 10.8.5); Chrome 38.0.2125 (Windows 7); IE 8, 9, 10, 11

	// html width style smaller than viewport width; body width style smaller than html width style
	//  NOTE: These tests were conducted when correct result was width of border. That has been changed
	//  to "width of viewport."
	//    html.getBoundingClientRect().width
	//      ✘ IE 8, 9, 10: width of viewport
	//      ✔ Safari, Mobile Safari, Chrome, Firefox, IE 11: width of html, including border
	//    html.clientWidth
	//      ~ Safari, Mobile Safari, Chrome, Firefox, IE 8, 9, 10, 11: width of viewport
	//    html.offsetWidth
	//      ✘ IE 8, 9, 10: width of viewport
	//      ✔ Safari, Mobile Safari, Chrome, Firefox, IE 11: width of html, including border
	//    html.scrollWidth
	//      ✘ IE 8, 9, 10, 11, Firefox: width of viewport
	//      ~ Safari, Mobile Safari, Chrome: width of html, excluding border
	//    body.getBoundingClientRect().width
	//      ~ Safari, Mobile Safari, Chrome, Firefox, IE 8, 9, 10, 11: width of body, including border
	//    body.clientWidth
	//      ~ Safari, Mobile Safari, Chrome, Firefox, IE 8, 9, 10, 11: width of body, excluding border
	//    body.offsetWidth
	//      ~ Safari, Mobile Safari, Chrome, Firefox, IE 8, 9, 10, 11: width of body, including border
	//    body.scrollWidth
	//      ✘ Safari, Mobile Safari, Chrome: width of viewport
	//      ~ Firefox, IE 8, 9, 10, 11: width of body, excluding border

	// element width style wider than viewport; body and html width styles at default
	// BROWSER BEHAVIOR: html and body border extend to width of viewport and not beyond (except on Mobile Safari)
	// Correct result is element width + body border-left + html border-left (except on Mobile Safari)
	// Mobile Safari uses a layout viewport, so it's expected to include body border-right and html border-right.
	//    html.getBoundingClientRect().width
	//      ✔ Mobile Safari: element width + body border + html border
	//      ~ Safari, Chrome, Firefox, IE 8, 9, 10, 11: viewport width
	//    html.clientWidth
	//      ✔ Mobile Safari: element width + body border + html border
	//      ~ Safari, Chrome, Firefox, IE 8, 9, 10, 11: viewport width
	//    html.offsetWidth
	//      ✔ Mobile Safari: element width + body border + html border
	//      ~ Safari, Chrome, Firefox, IE 8, 9, 10, 11: viewport width
	//    html.scrollWidth
	//      ✔ Mobile Safari: element width + body border + html border
	//      ✘ Safari, Chrome: element width + body border-left (BUT NOT html border-left)
	//      ✔ Firefox, IE 8, 9, 10, 11: element width + body border-left + html border-left
	//    body.getBoundingClientRect().width
	//      ~ Mobile Safari: element width + body border
	//      ~ Safari, Chrome, Firefox, IE 8, 9, 10, 11: viewport width - html border
	//    body.clientWidth
	//      ~ Mobile Safari: element width
	//      ~ Safari, Chrome, Firefox, IE 8, 9, 10, 11: viewport width - html border - body border
	//    body.offsetWidth
	//      ~ Mobile Safari: element width + body border
	//      ~ Safari, Chrome, Firefox, IE 8, 9, 10, 11: viewport width - html border
	//    body.scrollWidth
	//      ✔ Mobile Safari: element width + body border + html border
	//      ✔ Safari, Chrome: element width + body border-left + html border-left (matches actual browser)
	//      ~ Firefox, IE 8, 9, 10, 11: element width

	// TEST RESULTS: HEIGHT
	//   ✔ = correct answer
	//   ✘ = incorrect answer and diverges from spec
	//   ~ = incorrect answer, but matches spec

	// html height style smaller than viewport height; body height style smaller than html height style
	//  NOTE: These tests were conducted when correct result was height of viewport.
	//    html.clientHeight
	//      ✔ Safari, Mobile Safari, Chrome, Firefox, IE 8, 9, 10, 11: height of viewport

	// element height style taller than viewport; body and html width styles at default
	// BROWSER BEHAVIOR: html and body border enclose entire element
	// Correct result is element width + body border-top + html border-top + body border-bottom + html border-bottom
	//    html.clientHeight
	//      ✔ Mobile Safari: element height + all borders
	//      ~ Safari, Chrome, Firefox, IE 8, 9, 10, 11: height of viewport
	//    html.scrollHeight
	//      ✔ Firefox, IE 8, 9, 10, 11: element height + all borders
	//      ✘ Safari, Mobile Safari, Chrome: element height + html border-bottom
	//    body.scrollHeight
	//      ✔ Safari, Mobile Safari, Chrome: element height + all borders
	//      ~ Firefox, IE 8, 9, 10, 11: element height (body height - body border)

	var document = this._frame.toDomElement().contentDocument;
	var html = document.documentElement;
	var body = document.body;

	// BEST WIDTH ANSWER SO FAR (ASSUMING VIEWPORT IS MINIMUM ANSWER):
	var width = Math.max(body.scrollWidth, html.scrollWidth);

	// BEST HEIGHT ANSWER SO FAR (ASSUMING VIEWPORT IS MINIMUM ANSWER):
	var height = Math.max(body.scrollHeight, html.scrollHeight);

	return Size.create(this._dimension === X_DIMENSION ? width : height);
};

Me.prototype.toString = function() {
	ensure.signature(arguments, []);

	return this._dimension + " of page";
};

function factoryFn(dimension) {
	return function factory(frame) {
		return new Me(dimension, frame);
	};
}
},{"../q_frame.js":19,"../util/ensure.js":23,"../values/size.js":29,"./size_descriptor.js":13}],10:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
/*jshint newcap:false */
"use strict";

var ensure = require("../util/ensure.js");
var oop = require("../util/oop.js");
var Descriptor = require("./descriptor.js");
var Position = require("../values/position.js");

function RelativePosition() {
	return require("./relative_position.js");   	// break circular dependency
}

var X_DIMENSION = "x";
var Y_DIMENSION = "y";

var Me = module.exports = function PositionDescriptor(dimension) {
	ensure.signature(arguments, [ String ]);
	ensure.unreachable("PositionDescriptor is abstract and should not be constructed directly.");
};
Descriptor.extend(Me);
Me.extend = oop.extendFn(Me);

Me.x = factoryFn(X_DIMENSION);
Me.y = factoryFn(Y_DIMENSION);

Me.prototype.plus = function plus(amount) {
	if (this._pdbc.dimension === X_DIMENSION) return RelativePosition().right(this, amount);
	else return RelativePosition().down(this, amount);
};

Me.prototype.minus = function minus(amount) {
	if (this._pdbc.dimension === X_DIMENSION) return RelativePosition().left(this, amount);
	else return RelativePosition().up(this, amount);
};

Me.prototype.convert = function convert(arg, type) {
	switch (type) {
		case "number": return this._pdbc.dimension === X_DIMENSION ? Position.x(arg) : Position.y(arg);
		case "string":
			if (arg === "none") return this._pdbc.dimension === X_DIMENSION ? Position.noX() : Position.noY();
			else return undefined;
			break;
		default: return undefined;
	}
};

function factoryFn(dimension) {
	return function factory(self) {
		// _pdbc: "PositionDescriptor base class." An attempt to prevent name conflicts.
		self._pdbc = { dimension: dimension };
	};
}

},{"../util/ensure.js":23,"../util/oop.js":24,"../values/position.js":27,"./descriptor.js":4,"./relative_position.js":11}],11:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("../util/ensure.js");
var Position = require("../values/position.js");
var Descriptor = require("./descriptor.js");
var PositionDescriptor = require("./position_descriptor.js");
var Value = require("../values/value.js");
var Size = require("../values/size.js");
var Pixels = require("../values/pixels.js");
var ElementSize = require("./element_size.js");

var X_DIMENSION = "x";
var Y_DIMENSION = "y";
var PLUS = 1;
var MINUS = -1;

var Me = module.exports = function RelativePosition(dimension, direction, relativeTo, relativeAmount) {
	ensure.signature(arguments, [ String, Number, Descriptor, [Number, Descriptor, Value] ]);

	if (dimension === X_DIMENSION) PositionDescriptor.x(this);
	else if (dimension === Y_DIMENSION) PositionDescriptor.y(this);
	else ensure.unreachable("Unknown dimension: " + dimension);

	this._dimension = dimension;
	this._direction = direction;
	this._relativeTo = relativeTo;

	if (typeof relativeAmount === "number") {
		if (relativeAmount < 0) this._direction *= -1;
		this._amount = Size.create(Math.abs(relativeAmount));
	}
	else {
		this._amount = relativeAmount;
	}
};
PositionDescriptor.extend(Me);

Me.right = createFn(X_DIMENSION, PLUS);
Me.down = createFn(Y_DIMENSION, PLUS);
Me.left = createFn(X_DIMENSION, MINUS);
Me.up = createFn(Y_DIMENSION, MINUS);

function createFn(dimension, direction) {
	return function create(relativeTo, relativeAmount) {
		return new Me(dimension, direction, relativeTo, relativeAmount);
	};
}

Me.prototype.value = function value() {
	ensure.signature(arguments, []);

	var baseValue = this._relativeTo.value();
	var relativeValue = this._amount.value();

	if (this._direction === PLUS) return baseValue.plus(relativeValue);
	else return baseValue.minus(relativeValue);
};

Me.prototype.toString = function toString() {
	ensure.signature(arguments, []);

	var base = this._relativeTo.toString();
	if (this._amount.equals(Size.create(0))) return base;

	var relation = this._amount.toString();
	if (this._dimension === X_DIMENSION) relation += (this._direction === PLUS) ? " to right of " : " to left of ";
	else relation += (this._direction === PLUS) ? " below " : " above ";

	return relation + base;
};

},{"../util/ensure.js":23,"../values/pixels.js":26,"../values/position.js":27,"../values/size.js":29,"../values/value.js":30,"./descriptor.js":4,"./element_size.js":7,"./position_descriptor.js":10}],12:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("../util/ensure.js");
var Size = require("../values/size.js");
var Descriptor = require("./descriptor.js");
var SizeDescriptor = require("./size_descriptor.js");
var Value = require("../values/value.js");
var SizeMultiple = require("./size_multiple.js");

var PLUS = 1;
var MINUS = -1;

var Me = module.exports = function RelativeSize(direction, relativeTo, amount) {
	ensure.signature(arguments, [ Number, Descriptor, [Number, Descriptor, Value] ]);

	this._direction = direction;
	this._relativeTo = relativeTo;

	if (typeof amount === "number") {
		this._amount = Size.create(Math.abs(amount));
		if (amount < 0) this._direction *= -1;
	}
	else {
		this._amount = amount;
	}
};
SizeDescriptor.extend(Me);

Me.larger = factoryFn(PLUS);
Me.smaller = factoryFn(MINUS);

Me.prototype.value = function value() {
	ensure.signature(arguments, []);

	var baseValue = this._relativeTo.value();
	var relativeValue = this._amount.value();

	if (this._direction === PLUS) return baseValue.plus(relativeValue);
	else return baseValue.minus(relativeValue);
};

Me.prototype.toString = function toString() {
	ensure.signature(arguments, []);

	var base = this._relativeTo.toString();
	if (this._amount.equals(Size.create(0))) return base;

	var relation = this._amount.toString();
	if (this._direction === PLUS) relation += " larger than ";
	else relation += " smaller than ";

	return relation + base;
};

function factoryFn(direction) {
	return function factory(relativeTo, amount) {
		return new Me(direction, relativeTo, amount);
	};
}
},{"../util/ensure.js":23,"../values/size.js":29,"../values/value.js":30,"./descriptor.js":4,"./size_descriptor.js":13,"./size_multiple.js":14}],13:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
/*jshint newcap:false */
"use strict";

var ensure = require("../util/ensure.js");
var oop = require("../util/oop.js");
var Descriptor = require("./descriptor.js");
var Size = require("../values/size.js");

function RelativeSize() {
	return require("./relative_size.js");   	// break circular dependency
}

function SizeMultiple() {
	return require("./size_multiple.js");   	// break circular dependency
}

var Me = module.exports = function SizeDescriptor() {
	ensure.unreachable("SizeDescriptor is abstract and should not be constructed directly.");
};
Descriptor.extend(Me);
Me.extend = oop.extendFn(Me);

Me.prototype.plus = function plus(amount) {
	return RelativeSize().larger(this, amount);
};

Me.prototype.minus = function minus(amount) {
	return RelativeSize().smaller(this, amount);
};

Me.prototype.times = function times(amount) {
	return SizeMultiple().create(this, amount);
};

Me.prototype.convert = function convert(arg, type) {
	switch(type) {
		case "number": return Size.create(arg);
		case "string": return arg === "none" ? Size.createNone() : undefined;
		default: return undefined;
	}
};

},{"../util/ensure.js":23,"../util/oop.js":24,"../values/size.js":29,"./descriptor.js":4,"./relative_size.js":12,"./size_multiple.js":14}],14:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("../util/ensure.js");
var Descriptor = require("./descriptor.js");
var SizeDescriptor = require("./size_descriptor.js");
var Size = require("../values/size.js");

var Me = module.exports = function SizeMultiple(relativeTo, multiple) {
	ensure.signature(arguments, [ Descriptor, Number ]);

	this._relativeTo = relativeTo;
	this._multiple = multiple;
};
SizeDescriptor.extend(Me);

Me.create = function create(relativeTo, multiple) {
	return new Me(relativeTo, multiple);
};

Me.prototype.value = function value() {
	ensure.signature(arguments, []);

	return this._relativeTo.value().times(this._multiple);
};

Me.prototype.toString = function toString() {
	ensure.signature(arguments, []);

	var multiple = this._multiple;
	var base = this._relativeTo.toString();
	if (multiple === 1) return base;

	var desc;
	switch(multiple) {
		case 1/2: desc = "half of "; break;
		case 1/3: desc = "one-third of "; break;
		case 2/3: desc = "two-thirds of "; break;
		case 1/4: desc = "one-quarter of "; break;
		case 3/4: desc = "three-quarters of "; break;
		case 1/5: desc = "one-fifth of "; break;
		case 2/5: desc = "two-fifths of "; break;
		case 3/5: desc = "three-fifths of "; break;
		case 4/5: desc = "four-fifths of "; break;
		case 1/6: desc = "one-sixth of "; break;
		case 5/6: desc = "five-sixths of "; break;
		case 1/8: desc = "one-eighth of "; break;
		case 3/8: desc = "three-eighths of "; break;
		case 5/8: desc = "five-eighths of "; break;
		case 7/8: desc = "seven-eighths of "; break;
		default:
			if (multiple > 1) desc = multiple + " times ";
			else desc = (multiple * 100) + "% of ";
	}

	return desc + base;
};
},{"../util/ensure.js":23,"../values/size.js":29,"./descriptor.js":4,"./size_descriptor.js":13}],15:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("../util/ensure.js");
var PositionDescriptor = require("./position_descriptor.js");
var Position = require("../values/position.js");

var TOP = "top";
var RIGHT = "right";
var BOTTOM = "bottom";
var LEFT = "left";

var Me = module.exports = function ViewportEdge(position, frame) {
	var QFrame = require("../q_frame.js");    // break circular dependency
	ensure.signature(arguments, [ String, QFrame ]);

	if (position === LEFT || position === RIGHT) PositionDescriptor.x(this);
	else if (position === TOP || position === BOTTOM) PositionDescriptor.y(this);
	else ensure.unreachable("Unknown position: " + position);

	this._position = position;
	this._frame = frame;
};
PositionDescriptor.extend(Me);

Me.top = factoryFn(TOP);
Me.right = factoryFn(RIGHT);
Me.bottom = factoryFn(BOTTOM);
Me.left = factoryFn(LEFT);

Me.prototype.value = function() {
	ensure.signature(arguments, []);

	var scroll = this._frame.getRawScrollPosition();
	var x = Position.x(scroll.x);
	var y = Position.y(scroll.y);

	switch(this._position) {
		case TOP: return y;
		case RIGHT: return x.plus(this._frame.viewport().width.value());
		case BOTTOM: return y.plus(this._frame.viewport().height.value());
		case LEFT: return x;

		default: ensure.unreachable();
	}
};

Me.prototype.toString = function() {
	ensure.signature(arguments, []);
	return this._position + " edge of viewport";
};

function factoryFn(position) {
	return function factory(frame) {
		return new Me(position, frame);
	};
}

},{"../q_frame.js":19,"../util/ensure.js":23,"../values/position.js":27,"./position_descriptor.js":10}],16:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("../util/ensure.js");
var SizeDescriptor = require("./size_descriptor.js");
var Size = require("../values/size.js");
var RelativeSize = require("./relative_size.js");
var SizeMultiple = require("./size_multiple.js");

var X_DIMENSION = "x";
var Y_DIMENSION = "y";

var Me = module.exports = function PageSize(dimension, frame) {
	ensure.signature(arguments, [ String, Object ]);
	ensure.that(dimension === X_DIMENSION || dimension === Y_DIMENSION, "Unrecognized dimension: " + dimension);

	this._dimension = dimension;
	this._frame = frame;
};
SizeDescriptor.extend(Me);

Me.x = factoryFn(X_DIMENSION);
Me.y = factoryFn(Y_DIMENSION);

Me.prototype.value = function() {
	ensure.signature(arguments, []);

	// USEFUL READING: http://www.quirksmode.org/mobile/viewports.html
	// and http://www.quirksmode.org/mobile/viewports2.html

	// BROWSERS TESTED: Safari 6.2.0 (Mac OS X 10.8.5); Mobile Safari 7.0.0 (iOS 7.1); Firefox 32.0.0 (Mac OS X 10.8);
	//    Firefox 33.0.0 (Windows 7); Chrome 38.0.2125 (Mac OS X 10.8.5); Chrome 38.0.2125 (Windows 7); IE 8, 9, 10, 11

	// Width techniques I've tried: (Note: results are different in quirks mode)
	// body.clientWidth
	// body.offsetWidth
	// body.getBoundingClientRect().width
	//    fails on all browsers: doesn't include margin
	// body.scrollWidth
	//    works on Safari, Mobile Safari, Chrome
	//    fails on Firefox, IE 8, 9, 10, 11: doesn't include margin
	// html.getBoundingClientRect().width
	// html.offsetWidth
	//    works on Safari, Mobile Safari, Chrome, Firefox
	//    fails on IE 8, 9, 10: includes scrollbar
	// html.scrollWidth
	// html.clientWidth
	//    WORKS! Safari, Mobile Safari, Chrome, Firefox, IE 8, 9, 10, 11

	// Height techniques I've tried: (Note that results are different in quirks mode)
	// body.clientHeight
	// body.offsetHeight
	// body.getBoundingClientRect().height
	//    fails on all browsers: only includes height of content
	// body getComputedStyle("height")
	//    fails on all browsers: IE8 returns "auto"; others only include height of content
	// body.scrollHeight
	//    works on Safari, Mobile Safari, Chrome;
	//    fails on Firefox, IE 8, 9, 10, 11: only includes height of content
	// html.getBoundingClientRect().height
	// html.offsetHeight
	//    works on IE 8, 9, 10
	//    fails on IE 11, Safari, Mobile Safari, Chrome: only includes height of content
	// html.scrollHeight
	//    works on Firefox, IE 8, 9, 10, 11
	//    fails on Safari, Mobile Safari, Chrome: only includes height of content
	// html.clientHeight
	//    WORKS! Safari, Mobile Safari, Chrome, Firefox, IE 8, 9, 10, 11

	var html = this._frame.get("html").toDomElement();
	var value = (this._dimension === X_DIMENSION) ? html.clientWidth : html.clientHeight;
	return Size.create(value);
};

Me.prototype.toString = function() {
	ensure.signature(arguments, []);

	var desc = (this._dimension === X_DIMENSION) ? "width" : "height";
	return desc + " of viewport";
};

function factoryFn(dimension) {
	return function factory(frame) {
		return new Me(dimension, frame);
	};
}
},{"../util/ensure.js":23,"../values/size.js":29,"./relative_size.js":12,"./size_descriptor.js":13,"./size_multiple.js":14}],17:[function(require,module,exports){
// Copyright (c) 2014-2016 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
(function() {
	"use strict";

	var ensure = require("./util/ensure.js");
	var shim = require("./util/shim.js");
	var camelcase = require("../vendor/camelcase-1.0.1-modified.js");
	var ElementRendered = require("./descriptors/element_rendered.js");
	var ElementEdge = require("./descriptors/element_edge.js");
	var Center = require("./descriptors/center.js");
	var ElementSize = require("./descriptors/element_size.js");
	var Assertable = require("./assertable.js");

	var Me = module.exports = function QElement(domElement, frame, nickname) {
		var QFrame = require("./q_frame.js");    // break circular dependency
		ensure.signature(arguments, [Object, QFrame, String]);

		this._domElement = domElement;
		this._nickname = nickname;

		this.frame = frame;

		// properties
		this.rendered = ElementRendered.create(this);

		this.top = ElementEdge.top(this);
		this.right = ElementEdge.right(this);
		this.bottom = ElementEdge.bottom(this);
		this.left = ElementEdge.left(this);

		this.center = Center.x(this.left, this.right, "center of '" + nickname + "'");
		this.middle = Center.y(this.top, this.bottom, "middle of '" + nickname + "'");

		this.width = ElementSize.x(this);
		this.height = ElementSize.y(this);
	};
	Assertable.extend(Me);

	Me.prototype.getRawStyle = function(styleName) {
		ensure.signature(arguments, [String]);

		var styles;
		var result;

		// WORKAROUND IE 8: no getComputedStyle()
		if (window.getComputedStyle) {
			// WORKAROUND Firefox 40.0.3: must use frame's contentWindow (ref https://bugzilla.mozilla.org/show_bug.cgi?id=1204062)
			styles = this.frame.toDomElement().contentWindow.getComputedStyle(this._domElement);
			result = styles.getPropertyValue(styleName);
		}
		else {
			styles = this._domElement.currentStyle;
			result = styles[camelcase(styleName)];
		}
		if (result === null || result === undefined) result = "";
		return result;
	};

	Me.prototype.getRawPosition = function() {
		ensure.signature(arguments, []);

		// WORKAROUND IE 8: No TextRectangle.height or .width
		var rect = this._domElement.getBoundingClientRect();
		return {
			left: rect.left,
			right: rect.right,
			width: rect.width !== undefined ? rect.width : rect.right - rect.left,

			top: rect.top,
			bottom: rect.bottom,
			height: rect.height !== undefined ? rect.height : rect.bottom - rect.top
		};
	};

	Me.prototype.parent = function(nickname) {
		ensure.signature(arguments, [[ undefined, String ]]);
		if (nickname === undefined) nickname = "parent of " + this._nickname;

		if (this.equals(this.frame.body())) return null;
		else return new Me(this._domElement.parentElement, this.frame, nickname);
	};

	Me.prototype.add = function(html, nickname) {
		ensure.signature(arguments, [String, [undefined, String]]);
		if (nickname === undefined) nickname = html + " in " + this._nickname;

		var tempElement = document.createElement("div");
		tempElement.innerHTML = shim.String.trim(html);
		ensure.that(
			tempElement.childNodes.length === 1,
			"Expected one element, but got " + tempElement.childNodes.length + " (" + html + ")"
		);

		var insertedElement = tempElement.childNodes[0];
		this._domElement.appendChild(insertedElement);
		return new Me(insertedElement, this.frame, nickname);
	};

	Me.prototype.remove = function() {
		ensure.signature(arguments, []);
		shim.Element.remove(this._domElement);
	};

	Me.prototype.toDomElement = function() {
		ensure.signature(arguments, []);
		return this._domElement;
	};

	Me.prototype.toString = function() {
		ensure.signature(arguments, []);
		return "'" + this._nickname + "'";
	};

	Me.prototype.equals = function(that) {
		ensure.signature(arguments, [Me]);
		return this._domElement === that._domElement;
	};

}());
},{"../vendor/camelcase-1.0.1-modified.js":32,"./assertable.js":2,"./descriptors/center.js":3,"./descriptors/element_edge.js":5,"./descriptors/element_rendered.js":6,"./descriptors/element_size.js":7,"./q_frame.js":19,"./util/ensure.js":23,"./util/shim.js":25}],18:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("./util/ensure.js");
var QElement = require("./q_element.js");

var Me = module.exports = function QElementList(nodeList, frame, nickname) {
	var QFrame = require("./q_frame.js");    // break circular dependency
	ensure.signature(arguments, [ Object, QFrame, String ]);

	this._nodeList = nodeList;
	this._frame = frame;
	this._nickname = nickname;
};

Me.prototype.length = function length() {
	ensure.signature(arguments, []);

	return this._nodeList.length;
};

Me.prototype.at = function at(requestedIndex, nickname) {
	ensure.signature(arguments, [ Number, [undefined, String] ]);

	var index = requestedIndex;
	var length = this.length();
	if (index < 0) index = length + index;

	ensure.that(
		index >= 0 && index < length,
		"'" + this._nickname + "'[" + requestedIndex + "] is out of bounds; list length is " + length
	);
	var element = this._nodeList[index];

	if (nickname === undefined) nickname = this._nickname + "[" + index + "]";
	return new QElement(element, this._frame, nickname);
};

Me.prototype.toString = function toString() {
	ensure.signature(arguments, []);

	return "'" + this._nickname + "' list";
};
},{"./q_element.js":17,"./q_frame.js":19,"./util/ensure.js":23}],19:[function(require,module,exports){
// Copyright (c) 2014-2015 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
(function() {
	"use strict";

	var ensure = require("./util/ensure.js");
	var shim = require("./util/shim.js");
	var quixote = require("./quixote.js");
	var QElement = require("./q_element.js");
	var QElementList = require("./q_element_list.js");
	var QViewport = require("./q_viewport.js");
	var QPage = require("./q_page.js");
	var async = require("../vendor/async-1.4.2.js");

	var Me = module.exports = function QFrame(frameDom) {
		ensure.signature(arguments, [Object]);
		ensure.that(frameDom.tagName === "IFRAME", "QFrame DOM element must be an iframe");

		this._domElement = frameDom;
		this._loaded = false;
		this._removed = false;
	};

	function loaded(self, width, height, src, stylesheets) {
		self._loaded = true;
		self._document = self._domElement.contentDocument;
		self._originalBody = self._document.body.innerHTML;
		self._originalWidth = width;
		self._originalHeight = height;
		self._originalSrc = src;
		self._originalStylesheets = stylesheets;
	}

	Me.create = function create(parentElement, options, callback) {
		ensure.signature(arguments, [Object, [Object, Function], [undefined, Function]]);
		if (callback === undefined) {
			callback = options;
			options = {};
		}
		var width = options.width || 2000;
		var height = options.height || 2000;
		var src = options.src;
		var stylesheets = options.stylesheet || [];
		if (!shim.Array.isArray(stylesheets)) stylesheets = [ stylesheets ];

		var err = checkUrls(src, stylesheets);
		if (err) return callback(err);

		var iframe = insertIframe(parentElement, width, height);
		shim.EventTarget.addEventListener(iframe, "load", onFrameLoad);
		setIframeContent(iframe, src);

		var frame = new Me(iframe);
		setFrameLoadCallback(frame, callback);

		return frame;

		function onFrameLoad() {
			// WORKAROUND Mobile Safari 7.0.0, Safari 6.2.0, Chrome 38.0.2125: frame is loaded synchronously
			// We force it to be asynchronous here
			setTimeout(function() {
				loaded(frame, width, height, src, stylesheets);
				loadStylesheets(frame, stylesheets, function() {
					frame._frameLoadCallback(null, frame);
				});
			}, 0);
		}
	};

	function setFrameLoadCallback(frame, callback) {
		frame._frameLoadCallback = callback;
	}

	function checkUrls(src, stylesheets) {
		if (!urlExists(src)) return error("src", src);

		for (var i = 0; i < stylesheets.length; i++) {
			var url = stylesheets[i];
			if (!urlExists(url)) return error("stylesheet", url);
		}

		return null;

		function error(name, url) {
			return new Error("404 error while loading " + name + " (" + url + ")");
		}
	}

	function urlExists(url) {
		if (url === undefined) return true;

		var http = new XMLHttpRequest();
		http.open('HEAD', url, false);
		http.send();
		return http.status !== 404;
	}

	function insertIframe(parentElement, width, height) {
		var iframe = document.createElement("iframe");
		iframe.setAttribute("width", width);
		iframe.setAttribute("height", height);
		iframe.setAttribute("frameborder", "0");    // WORKAROUND IE 8: don't include frame border in position calcs
		parentElement.appendChild(iframe);
		return iframe;
	}

	function setIframeContent(iframe, src) {
		if (src === undefined) {
			writeStandardsModeHtml(iframe);
		}	else {
			setIframeSrc(iframe, src);
		}
	}

	function setIframeSrc(iframe, src) {
		iframe.setAttribute("src", src);
	}

	function writeStandardsModeHtml(iframe) {
		var standardsMode = "<!DOCTYPE html>\n<html><head></head><body></body></html>";
		iframe.contentWindow.document.open();
		iframe.contentWindow.document.write(standardsMode);
		iframe.contentWindow.document.close();
	}

	function loadStylesheets(self, urls, callback) {
		async.each(urls, addLinkTag, callback);

		function addLinkTag(url, onLinkLoad) {
			var link = document.createElement("link");
			shim.EventTarget.addEventListener(link, "load", function(event) { onLinkLoad(null); });
			link.setAttribute("rel", "stylesheet");
			link.setAttribute("type", "text/css");
			link.setAttribute("href", url);
			shim.Document.head(self._document).appendChild(link);
		}
	}

	Me.prototype.reset = function() {
		ensure.signature(arguments, []);
		ensureUsable(this);

		this._document.body.innerHTML = this._originalBody;
		this.scroll(0, 0);
		this.resize(this._originalWidth, this._originalHeight);
	};

	Me.prototype.reload = function(callback) {
		ensure.signature(arguments, [Function]);
		ensureUsable(this);

		var frame = this;
		var iframe = this._domElement;
		var src = this._originalSrc;

		this.resize(this._originalWidth, this._originalHeight);
		setFrameLoadCallback(frame, callback);
		setIframeContent(iframe, src);
	};

	Me.prototype.toDomElement = function() {
		ensure.signature(arguments, []);
		ensureNotRemoved(this);

		return this._domElement;
	};

	Me.prototype.remove = function() {
		ensure.signature(arguments, []);
		ensureLoaded(this);
		if (this._removed) return;

		this._domElement.parentNode.removeChild(this._domElement);
		this._removed = true;
	};

	Me.prototype.viewport = function() {
		ensure.signature(arguments, []);
		ensureUsable(this);

		return new QViewport(this);
	};

	Me.prototype.page = function() {
		ensure.signature(arguments, []);
		ensureUsable(this);

		return new QPage(this);
	};

	Me.prototype.body = function() {
		ensure.signature(arguments, []);

		return this.get("body");
	};

	Me.prototype.add = function(html, nickname) {
		ensure.signature(arguments, [String, [undefined, String]]);
		if (nickname === undefined) nickname = html;

		return this.body().add(html, nickname);
	};

	Me.prototype.get = function(selector, nickname) {
		ensure.signature(arguments, [String, [undefined, String]]);
		if (nickname === undefined) nickname = selector;
		ensureUsable(this);

		var nodes = this._document.querySelectorAll(selector);
		ensure.that(nodes.length === 1, "Expected one element to match '" + selector + "', but found " + nodes.length);
		return new QElement(nodes[0], this, nickname);
	};

	Me.prototype.getAll = function(selector, nickname) {
		ensure.signature(arguments, [String, [undefined, String]]);
		if (nickname === undefined) nickname = selector;

		return new QElementList(this._document.querySelectorAll(selector), this, nickname);
	};

	Me.prototype.scroll = function scroll(x, y) {
		ensure.signature(arguments, [Number, Number]);

		this._domElement.contentWindow.scroll(x, y);
	};

	Me.prototype.getRawScrollPosition = function getRawScrollPosition() {
		ensure.signature(arguments, []);

		return {
			x: shim.Window.pageXOffset(this._domElement.contentWindow, this._document),
			y: shim.Window.pageYOffset(this._domElement.contentWindow, this._document)
		};
	};

	Me.prototype.resize = function resize(width, height) {
		ensure.signature(arguments, [Number, Number]);

		this._domElement.setAttribute("width", "" + width);
		this._domElement.setAttribute("height", "" + height);
	};

	function ensureUsable(self) {
		ensureLoaded(self);
		ensureNotRemoved(self);
	}

	function ensureLoaded(self) {
		ensure.that(self._loaded, "QFrame not loaded: Wait for frame creation callback to execute before using frame");
	}

	function ensureNotRemoved(self) {
		ensure.that(!self._removed, "Attempted to use frame after it was removed");
	}

})();

},{"../vendor/async-1.4.2.js":31,"./q_element.js":17,"./q_element_list.js":18,"./q_page.js":20,"./q_viewport.js":21,"./quixote.js":22,"./util/ensure.js":23,"./util/shim.js":25}],20:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("./util/ensure.js");
var PageSize = require("./descriptors/page_size.js");
var PageEdge = require("./descriptors/page_edge.js");
var Center = require("./descriptors/center.js");
var Assertable = require("./assertable.js");

var Me = module.exports = function QPage(frame) {
	var QFrame = require("./q_frame.js");   // break circular dependency
	ensure.signature(arguments, [ QFrame ]);

	// properties
	this.width = PageSize.x(frame);
	this.height = PageSize.y(frame);

	this.top = PageEdge.top(frame);
	this.right = PageEdge.right(frame);
	this.bottom = PageEdge.bottom(frame);
	this.left = PageEdge.left(frame);

	this.center = Center.x(this.left, this.right, "center of page");
	this.middle = Center.y(this.top, this.bottom, "middle of page");
};
Assertable.extend(Me);

},{"./assertable.js":2,"./descriptors/center.js":3,"./descriptors/page_edge.js":8,"./descriptors/page_size.js":9,"./q_frame.js":19,"./util/ensure.js":23}],21:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("./util/ensure.js");
var ViewportSize = require("./descriptors/viewport_size.js");
var ViewportEdge = require("./descriptors/viewport_edge.js");
var Center = require("./descriptors/center.js");
var Assertable = require("./assertable.js");

var Me = module.exports = function QViewport(frame) {
	var QFrame = require("./q_frame.js");   // break circular dependency
	ensure.signature(arguments, [ QFrame ]);

	// properties
	this.width = ViewportSize.x(frame);
	this.height = ViewportSize.y(frame);

	this.top = ViewportEdge.top(frame);
	this.right = ViewportEdge.right(frame);
	this.bottom = ViewportEdge.bottom(frame);
	this.left = ViewportEdge.left(frame);

	this.center = Center.x(this.left, this.right, "center of viewport");
	this.middle = Center.y(this.top, this.bottom, "middle of viewport");
};
Assertable.extend(Me);

},{"./assertable.js":2,"./descriptors/center.js":3,"./descriptors/viewport_edge.js":15,"./descriptors/viewport_size.js":16,"./q_frame.js":19,"./util/ensure.js":23}],22:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("./util/ensure.js");
var QFrame = require("./q_frame.js");
var Size = require("./values/size.js");

var features = null;

exports.createFrame = function(options, callback) {
	return QFrame.create(document.body, options, function(err, callbackFrame) {
		if (features === null) {
			detectBrowserFeatures(function() {
				callback(err, callbackFrame);
			});
		}
		else {
			callback(err, callbackFrame);
		}
	});
};

exports.browser = {};

exports.browser.enlargesFrameToPageSize = createDetectionMethod("enlargesFrame");
exports.browser.enlargesFonts = createDetectionMethod("enlargesFonts");

function createDetectionMethod(propertyName) {
	return function() {
		ensure.signature(arguments, []);

		var feature = features[propertyName];
		ensure.that(feature !== undefined, "Must create a frame before using Quixote browser feature detection.");
		return feature;
	};
}

function detectBrowserFeatures(callback) {
	var FRAME_WIDTH = 1500;
	var FRAME_HEIGHT = 200;

	features = {};
	var frame = QFrame.create(document.body, { width: FRAME_WIDTH, height: FRAME_HEIGHT }, function(err) {
		if (err) {
			console.log("Error while creating Quixote browser feature detection frame: " + err);
			return callback();
		}

		try {
			features.enlargesFrame = detectFrameEnlargement(frame, FRAME_WIDTH);

			frame.reset();
			detectFontEnlargement(frame, FRAME_WIDTH, function(result) {
				features.enlargesFonts = result;
				frame.remove();
				return callback();
			});

		}
		catch(err2) {
			console.log("Error during Quixote browser feature detection: " + err2);
		}
	});

}

function detectFrameEnlargement(frame, frameWidth) {
	frame.add("<div style='width: " + (frameWidth + 200) + "px'>force scrolling</div>");
	return !frame.viewport().width.value().equals(Size.create(frameWidth));
}

function detectFontEnlargement(frame, frameWidth, callback) {
	ensure.that(frameWidth >= 1500, "Detector frame width must be larger than screen to detect font enlargement");

	// WORKAROUND IE 8: we use a <div> because the <style> tag can't be added by frame.add(). At the time of this
	// writing, I'm not sure if the issue is with frame.add() or if IE just can't programmatically add <style> tags.
	frame.add("<div><style>p { font-size: 15px; }</style></div>");

	var text = frame.add("<p>arbitrary text</p>");
	frame.add("<p>must have two p tags to work</p>");

	// WORKAROUND IE 8: need to force reflow or getting font-size may fail below
	// This seems to occur when IE is running in a slow VirtualBox VM. There is no test for this line.
	var forceReflow = text.offsetHeight;

	// WORKAROUND Safari 8.0.0: timeout required because font is enlarged asynchronously
	setTimeout(function() {
		var fontSize = text.getRawStyle("font-size");
		ensure.that(fontSize !== "", "Expected font-size to be a value");

		// WORKAROUND IE 8: ignores <style> tag we added above
		if (fontSize === "12pt") return callback(false);

		return callback(fontSize !== "15px");
	}, 0);

}

},{"./q_frame.js":19,"./util/ensure.js":23,"./values/size.js":29}],23:[function(require,module,exports){
// Copyright (c) 2013-2014 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
"use strict";

// Runtime assertions for production code. (Contrast to assert.js, which is for test code.)

var shim = require("./shim.js");
var oop = require("./oop.js");

exports.that = function(variable, message) {
	if (message === undefined) message = "Expected condition to be true";

	if (variable === false) throw new EnsureException(exports.that, message);
	if (variable !== true) throw new EnsureException(exports.that, "Expected condition to be true or false");
};

exports.unreachable = function(message) {
	if (!message) message = "Unreachable code executed";

	throw new EnsureException(exports.unreachable, message);
};

exports.signature = function(args, signature) {
	signature = signature || [];
	var expectedArgCount = signature.length;
	var actualArgCount = args.length;

	if (actualArgCount > expectedArgCount) {
		throw new EnsureException(
			exports.signature,
			"Function called with too many arguments: expected " + expectedArgCount + " but got " + actualArgCount
		);
	}

	var type, arg, name;
	for (var i = 0; i < signature.length; i++) {
		type = signature[i];
		arg = args[i];
		name = "Argument " + i;

		if (!shim.Array.isArray(type)) type = [ type ];
		if (!typeMatches(type, arg, name)) {
			var message = name + " expected " + explainType(type) + ", but was ";
			throw new EnsureException(exports.signature, message + explainArg(arg));
		}
	}
};

function typeMatches(type, arg) {
	for (var i = 0; i < type.length; i++) {
		if (oneTypeMatches(type[i], arg)) return true;
	}
	return false;

	function oneTypeMatches(type, arg) {
		switch (getType(arg)) {
			case "boolean": return type === Boolean;
			case "string": return type === String;
			case "number": return type === Number;
			case "array": return type === Array;
			case "function": return type === Function;
			case "object": return type === Object || arg instanceof type;
			case "undefined": return type === undefined;
			case "null": return type === null;
			case "NaN": return isNaN(type);

			default: exports.unreachable();
		}
	}
}

function explainType(type) {
	var joiner = "";
	var result = "";
	for (var i = 0; i < type.length; i++) {
		result += joiner + explainOneType(type[i]);
		joiner = (i === type.length - 2) ? ", or " : ", ";
	}
	return result;

	function explainOneType(type) {
		switch (type) {
			case Boolean: return "boolean";
			case String: return "string";
			case Number: return "number";
			case Array: return "array";
			case Function: return "function";
			case null: return "null";
			default:
				if (typeof type === "number" && isNaN(type)) return "NaN";
				else {
					return oop.className(type) + " instance";
				}
		}
	}
}

function explainArg(arg) {
	var type = getType(arg);
	if (type !== "object") return type;

	return oop.instanceName(arg) + " instance";
}

function getType(variable) {
	var type = typeof variable;
	if (variable === null) type = "null";
	if (shim.Array.isArray(variable)) type = "array";
	if (type === "number" && isNaN(variable)) type = "NaN";
	return type;
}


/*****/

var EnsureException = exports.EnsureException = function EnsureException(fnToRemoveFromStackTrace, message) {
	if (Error.captureStackTrace) Error.captureStackTrace(this, fnToRemoveFromStackTrace);
	else this.stack = (new Error()).stack;
	this.message = message;
};
EnsureException.prototype = shim.Object.create(Error.prototype);
EnsureException.prototype.constructor = EnsureException;
EnsureException.prototype.name = "EnsureException";

},{"./oop.js":24,"./shim.js":25}],24:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

// can't use ensure.js due to circular dependency
var shim = require("./shim.js");

exports.className = function(constructor) {
	if (typeof constructor !== "function") throw new Error("Not a constructor");
	return shim.Function.name(constructor);
};

exports.instanceName = function(obj) {
	var prototype = shim.Object.getPrototypeOf(obj);
	if (prototype === null) return "<no prototype>";

	var constructor = prototype.constructor;
	if (constructor === undefined || constructor === null) return "<anon>";

	return shim.Function.name(constructor);
};

exports.extendFn = function extendFn(parentConstructor) {
	return function(childConstructor) {
		childConstructor.prototype = shim.Object.create(parentConstructor.prototype);
		childConstructor.prototype.constructor = childConstructor;
	};
};

exports.makeAbstract = function makeAbstract(constructor, methods) {
	var name = shim.Function.name(constructor);
	shim.Array.forEach(methods, function(method) {
		constructor.prototype[method] = function() {
			throw new Error(name + " subclasses must implement " + method + "() method");
		};
	});

	constructor.prototype.checkAbstractMethods = function checkAbstractMethods() {
		var unimplemented = [];
		var self = this;
		shim.Array.forEach(methods, function(name) {
			if (self[name] === constructor.prototype[name]) unimplemented.push(name + "()");
		});
		return unimplemented;
	};
};
},{"./shim.js":25}],25:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

exports.Array = {

	// WORKAROUND IE 8: no Array.isArray
	isArray: function isArray(thing) {
		if (Array.isArray) return Array.isArray(thing);

		return Object.prototype.toString.call(thing) === '[object Array]';
	},

	// WORKAROUND IE 8: no Array.forEach
	every: function every(obj, callbackfn, thisArg) {
		/*jshint bitwise:false, eqeqeq:false, -W041:false */
		if (Array.prototype.every) return obj.every(callbackfn, thisArg);

		// This workaround based on polyfill code from MDN:
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
		var T, k;

		if (this == null) {
			throw new TypeError('this is null or not defined');
		}

		// 1. Let O be the result of calling ToObject passing the this
		//    value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get internal method
		//    of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
		if (typeof callbackfn !== 'function') {
			throw new TypeError();
		}

		// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
		if (arguments.length > 1) {
			T = thisArg;
		}

		// 6. Let k be 0.
		k = 0;

		// 7. Repeat, while k < len
		while (k < len) {

			var kValue;

			// a. Let Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the HasProperty internal
			//    method of O with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			if (k in O) {

				// i. Let kValue be the result of calling the Get internal method
				//    of O with argument Pk.
				kValue = O[k];

				// ii. Let testResult be the result of calling the Call internal method
				//     of callbackfn with T as the this value and argument list
				//     containing kValue, k, and O.
				var testResult = callbackfn.call(T, kValue, k, O);

				// iii. If ToBoolean(testResult) is false, return false.
				if (!testResult) {
					return false;
				}
			}
			k++;
		}
		return true;
	},

	// WORKAROUND IE 8: no Array.forEach
	forEach: function forEach(obj, callback, thisArg) {
		/*jshint bitwise:false, eqeqeq:false, -W041:false */

		if (Array.prototype.forEach) return obj.forEach(callback, thisArg);

		// This workaround based on polyfill code from MDN:
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

		// Production steps of ECMA-262, Edition 5, 15.4.4.18
		// Reference: http://es5.github.io/#x15.4.4.18

    var T, k;

    if (obj == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(obj);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
	}

};


exports.Element = {

	// WORKAROUND IE 8, IE 9, IE 10, IE 11: no Element.remove()
	remove: function remove(element) {
		element.parentNode.removeChild(element);
	}

};


exports.EventTarget = {

	// WORKAROUND IE 8: no EventTarget.addEventListener()
	addEventListener: function addEventListener(element, event, callback) {
		if (element.addEventListener) return element.addEventListener(event, callback);

		element.attachEvent("on" + event, callback);
	}

};


exports.Document = {

	// WORKAROUND IE 8: no document.head
	head: function head(doc) {
		if (doc.head) return doc.head;

		return doc.querySelector("head");
	}

};


exports.Function = {

	// WORKAROUND IE 8, IE 9, IE 10, IE 11: no function.name
	name: function name(fn) {
		if (fn.name) return fn.name;

		// Based on code by Jason Bunting et al, http://stackoverflow.com/a/332429
		var funcNameRegex = /function\s+(.{1,})\s*\(/;
		var results = (funcNameRegex).exec((fn).toString());
		return (results && results.length > 1) ? results[1] : "<anon>";
	},

};


exports.Object = {

	// WORKAROUND IE 8: no Object.create()
	create: function create(prototype) {
		if (Object.create) return Object.create(prototype);

		var Temp = function Temp() {};
		Temp.prototype = prototype;
		return new Temp();
	},

	// WORKAROUND IE 8: no Object.getPrototypeOf
	// Caution: Doesn't work on IE 8 if constructor has been changed, as is the case with a subclass.
	getPrototypeOf: function getPrototypeOf(obj) {
		if (Object.getPrototypeOf) return Object.getPrototypeOf(obj);

		var result = obj.constructor ? obj.constructor.prototype : null;
		return result || null;
	},

	// WORKAROUND IE 8: No Object.keys
	keys: function keys(obj) {
		if (Object.keys) return Object.keys(obj);

		// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	  var hasOwnProperty = Object.prototype.hasOwnProperty,
	      hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
	      dontEnums = [
	        'toString',
	        'toLocaleString',
	        'valueOf',
	        'hasOwnProperty',
	        'isPrototypeOf',
	        'propertyIsEnumerable',
	        'constructor'
	      ],
	      dontEnumsLength = dontEnums.length;

	  if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
	    throw new TypeError('Object.keys called on non-object');
	  }

	  var result = [], prop, i;

	  for (prop in obj) {
	    if (hasOwnProperty.call(obj, prop)) {
	      result.push(prop);
	    }
	  }

	  if (hasDontEnumBug) {
	    for (i = 0; i < dontEnumsLength; i++) {
	      if (hasOwnProperty.call(obj, dontEnums[i])) {
	        result.push(dontEnums[i]);
	      }
	    }
	  }
	  return result;
	}

};


exports.String = {

	// WORKAROUND IE 8: No String.trim()
	trim: function(str) {
		if (str.trim !== undefined) return str.trim();

		// Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
		return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	}

};


exports.Window = {

	// WORKAROUND IE 8: No Window.pageXOffset
	pageXOffset: function(window, document) {
		if (window.pageXOffset !== undefined) return window.pageXOffset;

		// Based on https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY
		var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
		return isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
	},


	// WORKAROUND IE 8: No Window.pageYOffset
	pageYOffset: function(window, document) {
		if (window.pageYOffset !== undefined) return window.pageYOffset;

		// Based on https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY
		var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
		return isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
	}

};
},{}],26:[function(require,module,exports){
// Copyright (c) 2014-2016 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("../util/ensure.js");
var Value = require("./value.js");

var Me = module.exports = function Pixels(amount) {
	ensure.signature(arguments, [ [ Number, null ] ]);
	this._none = (amount === null);
	this._amount = amount;
};
Value.extend(Me);

Me.create = function create(amount) {
	return new Me(amount);
};

Me.createNone = function createNone() {
	return new Me(null);
};

Me.ZERO = Me.create(0);
Me.NONE = Me.createNone();

Me.prototype.compatibility = function compatibility() {
	return [ Me ];
};

Me.prototype.plus = Value.safe(function plus(operand) {
	if (this._none || operand._none) return Me.createNone();
	return new Me(this._amount + operand._amount);
});

Me.prototype.minus = Value.safe(function minus(operand) {
	if (this._none || operand._none) return Me.createNone();
	return new Me(this._amount - operand._amount);
});

Me.prototype.times = function times(operand) {
	ensure.signature(arguments, [ Number ]);

	if (this._none) return Me.createNone();
	return new Me(this._amount * operand);
};

Me.prototype.average = Value.safe(function average(operand) {
	if (this._none || operand._none) return Me.createNone();
	return new Me((this._amount + operand._amount) / 2);
});

Me.prototype.compare = Value.safe(function compare(operand) {
	var bothHavePixels = !this._none && !operand._none;
	var neitherHavePixels = this._none && operand._none;
	var onlyLeftHasPixels = !this._none && operand._none;

	if (bothHavePixels) {
		var difference = this._amount - operand._amount;
		if (Math.abs(difference) <= 2) return 0;
		else return difference;
	}
	else if (neitherHavePixels) {
				return 0;
	}
	else if (onlyLeftHasPixels) {
		return 1;
	}
	else {
		return -1;
	}
});

Me.min = function(l, r) {
	ensure.signature(arguments, [ Me, Me ]);

	if (l._none || r._none) return Me.createNone();
	return l.compare(r) <= 0 ? l : r;
};

Me.max = function(l, r) {
	ensure.signature(arguments, [ Me, Me ]);

	if (l._none || r._none) return Me.createNone();
	return l.compare(r) >= 0 ? l : r;
};

Me.prototype.diff = Value.safe(function diff(expected) {
	if (this.compare(expected) === 0) return "";
	if (this._none || expected._none) return "non-measurable";

	var difference = Math.abs(this._amount - expected._amount);

	var desc = difference;
	if (difference * 100 !== Math.floor(difference * 100)) desc = "about " + difference.toFixed(2);
	return desc + "px";
});

Me.prototype.toString = function toString() {
	ensure.signature(arguments, []);
	return this._none ? "no pixels" : this._amount + "px";
};

},{"../util/ensure.js":23,"./value.js":30}],27:[function(require,module,exports){
// Copyright (c) 2014-2016 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("../util/ensure.js");
var Value = require("./value.js");
var Pixels = require("./pixels.js");
var Size = require("./size.js");

var X_DIMENSION = "x";
var Y_DIMENSION = "y";

var Me = module.exports = function Position(dimension, value) {
	ensure.signature(arguments, [ String, [ Number, Pixels ] ]);

	this._dimension = dimension;
	this._value = (typeof value === "number") ? Pixels.create(value) : value;
};
Value.extend(Me);

Me.x = function x(value) {
	ensure.signature(arguments, [ [ Number, Pixels ] ]);

	return new Me(X_DIMENSION, value);
};

Me.y = function y(value) {
	ensure.signature(arguments, [ [ Number, Pixels ] ]);

	return new Me(Y_DIMENSION, value);
};

Me.noX = function noX() {
	ensure.signature(arguments, []);

	return new Me(X_DIMENSION, Pixels.NONE);
};

Me.noY = function noY() {
	ensure.signature(arguments, []);

	return new Me(Y_DIMENSION, Pixels.NONE);
};

Me.prototype.compatibility = function compatibility() {
	return [ Me, Size ];
};

Me.prototype.plus = Value.safe(function plus(operand) {
	checkAxis(this, operand);
	return new Me(this._dimension, this._value.plus(operand.toPixels()));
});

Me.prototype.minus = Value.safe(function minus(operand) {
	checkAxis(this, operand);
	return new Me(this._dimension, this._value.minus(operand.toPixels()));
});

Me.prototype.midpoint = Value.safe(function midpoint(operand) {
	checkAxis(this, operand);
	return new Me(this._dimension, this._value.average(operand.toPixels()));
});

Me.prototype.compare = Value.safe(function compare(operand) {
	checkAxis(this, operand);
	return this._value.compare(operand.toPixels());
});

Me.prototype.min = Value.safe(function min(operand) {
	checkAxis(this, operand);
	return new Me(this._dimension, Pixels.min(this._value, operand.toPixels()));
});

Me.prototype.max = Value.safe(function max(operand) {
	checkAxis(this, operand);
	return new Me(this._dimension, Pixels.max(this._value, operand.toPixels()));
});

Me.prototype.diff = Value.safe(function diff(expected) {
	checkAxis(this, expected);

	var actualValue = this._value;
	var expectedValue = expected._value;

	if (actualValue.equals(expectedValue)) return "";
	else if (isNone(expected) && !isNone(this)) return "rendered when not expected";
	else if (!isNone(expected) && isNone(this)) return "not rendered";

	var direction;
	var comparison = actualValue.compare(expectedValue);
	if (this._dimension === X_DIMENSION) direction = comparison < 0 ? "further left than expected" : "further right than expected";
	else direction = comparison < 0 ? "higher than expected" : "lower than expected";

	return actualValue.diff(expectedValue) + " " + direction;
});

Me.prototype.toString = function toString() {
	ensure.signature(arguments, []);

	if (isNone(this)) return "not rendered";
	else return this._value.toString();
};

Me.prototype.toPixels = function toPixels() {
	ensure.signature(arguments, []);
	return this._value;
};

function checkAxis(self, other) {
	if (other instanceof Me) {
		ensure.that(self._dimension === other._dimension, "Can't compare X coordinate to Y coordinate");
	}
}

function isNone(position) {
	return position._value.equals(Pixels.NONE);
}
},{"../util/ensure.js":23,"./pixels.js":26,"./size.js":29,"./value.js":30}],28:[function(require,module,exports){
// Copyright (c) 2016 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
(function() {
	"use strict";

	var ensure = require("../util/ensure.js");
	var Value = require("./value.js");

	var RENDERED = "rendered";
	var NOT_RENDERED = "not rendered";
	var DISPLAY_NONE = "not rendered due to display:none property";
	var DETACHED = "not rendered due to being detached from DOM";

	var Me = module.exports = function RenderState(state) {
		ensure.signature(arguments, [ String ]);

		this._state = state;
	};
	Value.extend(Me);

	Me.rendered = function rendered() {
		return new Me(RENDERED);
	};

	Me.notRendered = function notRendered() {
		return new Me(NOT_RENDERED);
	};

	Me.displayNone = function displayNone() {
		return new Me(DISPLAY_NONE);
	};

	Me.detached = function detached() {
		return new Me(DETACHED);
	};

	Me.prototype.compatibility = function compatibility() {
		return [ Me ];
	};

	Me.prototype.diff = Value.safe(function diff(expected) {
		var thisState = this._state;
		var expectedState = expected._state;

		if (thisState === expectedState) return "";

		if (thisState === RENDERED) return "different than expected";
		else if (expectedState === RENDERED) return "different than expected";
		else if (thisState === NOT_RENDERED || expectedState === NOT_RENDERED) return "";
		else return "achieved differently than expected";
	});

	Me.prototype.toString = function toString() {
		return this._state;
	};

}());
},{"../util/ensure.js":23,"./value.js":30}],29:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("../util/ensure.js");
var Value = require("./value.js");
var Pixels = require("./pixels.js");

var Me = module.exports = function Size(value) {
	ensure.signature(arguments, [ [Number, Pixels] ]);

	this._value = (typeof value === "number") ? Pixels.create(value) : value;
};
Value.extend(Me);

Me.create = function create(value) {
	return new Me(value);
};

Me.createNone = function createNone() {
	ensure.signature(arguments, []);

	return new Me(Pixels.NONE);
};

Me.prototype.compatibility = function compatibility() {
	return [ Me ];
};

Me.prototype.plus = Value.safe(function plus(operand) {
	return new Me(this._value.plus(operand._value));
});

Me.prototype.minus = Value.safe(function minus(operand) {
	return new Me(this._value.minus(operand._value));
});

Me.prototype.times = function times(operand) {
	return new Me(this._value.times(operand));
};

Me.prototype.compare = Value.safe(function compare(that) {
	return this._value.compare(that._value);
});

Me.prototype.diff = Value.safe(function diff(expected) {
	var actualValue = this._value;
	var expectedValue = expected._value;

	if (actualValue.equals(expectedValue)) return "";
	if (isNone(expected) && !isNone(this)) return "rendered when not expected";
	if (!isNone(expected) && isNone(this)) return "not rendered";

	var desc = actualValue.compare(expectedValue) > 0 ? " larger than expected" : " smaller than expected";
	return actualValue.diff(expectedValue) + desc;
});

Me.prototype.toString = function toString() {
	ensure.signature(arguments, []);

	if (isNone(this)) return "not rendered";
	else return this._value.toString();
};

Me.prototype.toPixels = function toPixels() {
	ensure.signature(arguments, []);
	return this._value;
};

function isNone(size) {
	return size._value.equals(Pixels.NONE);
}
},{"../util/ensure.js":23,"./pixels.js":26,"./value.js":30}],30:[function(require,module,exports){
// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var ensure = require("../util/ensure.js");
var oop = require("../util/oop.js");
var shim = require("../util/shim.js");

var Me = module.exports = function Value() {};
Me.extend = oop.extendFn(Me);
oop.makeAbstract(Me, [
	"compatibility",
	"diff",
	"toString"
]);

Me.safe = function safe(fn) {
	return function() {
		ensureCompatibility(this, this.compatibility(), arguments);
		return fn.apply(this, arguments);
	};
};

Me.prototype.value = function value() {
	ensure.signature(arguments, []);
	return this;
};

Me.prototype.equals = function equals(that) {
	return this.diff(that) === "";
};

function ensureCompatibility(self, compatible, args) {
	var arg;
	for (var i = 0; i < args.length; i++) {   // args is not an Array, can't use forEach
		arg = args[i];
		checkOneArg(self, compatible, arg);
	}
}

function checkOneArg(self, compatible, arg) {
	var type = typeof arg;
	if (arg === null) type = "null";
	if (type !== "object") throwError(type);

	for (var i = 0; i < compatible.length; i++) {
		if (arg instanceof compatible[i]) return;
	}
	throwError(oop.instanceName(arg));

	function throwError(type) {
		throw new Error(oop.instanceName(self) + " isn't compatible with " + type);
	}
}
},{"../util/ensure.js":23,"../util/oop.js":24,"../util/shim.js":25}],31:[function(require,module,exports){
(function (process,global){
/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
(function () {

    var async = {};
    function noop() {}
    function identity(v) {
        return v;
    }
    function toBool(v) {
        return !!v;
    }
    function notId(v) {
        return !v;
    }

    // global on the server, window in the browser
    var previous_async;

    // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.
    var root = typeof self === 'object' && self.self === self && self ||
            typeof global === 'object' && global.global === global && global ||
            this;

    if (root != null) {
        previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        return function() {
            if (fn === null) throw new Error("Callback was already called.");
            fn.apply(this, arguments);
            fn = null;
        };
    }

    function _once(fn) {
        return function() {
            if (fn === null) return;
            fn.apply(this, arguments);
            fn = null;
        };
    }

    //// cross-browser compatiblity functions ////

    var _toString = Object.prototype.toString;

    var _isArray = Array.isArray || function (obj) {
        return _toString.call(obj) === '[object Array]';
    };

    // Ported from underscore.js isObject
    var _isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    function _isArrayLike(arr) {
        return _isArray(arr) || (
            // has a positive integer length property
            typeof arr.length === "number" &&
            arr.length >= 0 &&
            arr.length % 1 === 0
        );
    }

    function _each(coll, iterator) {
        return _isArrayLike(coll) ?
            _arrayEach(coll, iterator) :
            _forEachOf(coll, iterator);
    }

    function _arrayEach(arr, iterator) {
        var index = -1,
            length = arr.length;

        while (++index < length) {
            iterator(arr[index], index, arr);
        }
    }

    function _map(arr, iterator) {
        var index = -1,
            length = arr.length,
            result = Array(length);

        while (++index < length) {
            result[index] = iterator(arr[index], index, arr);
        }
        return result;
    }

    function _range(count) {
        return _map(Array(count), function (v, i) { return i; });
    }

    function _reduce(arr, iterator, memo) {
        _arrayEach(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    }

    function _forEachOf(object, iterator) {
        _arrayEach(_keys(object), function (key) {
            iterator(object[key], key);
        });
    }

    function _indexOf(arr, item) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === item) return i;
        }
        return -1;
    }

    var _keys = Object.keys || function (obj) {
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    function _keyIterator(coll) {
        var i = -1;
        var len;
        var keys;
        if (_isArrayLike(coll)) {
            len = coll.length;
            return function next() {
                i++;
                return i < len ? i : null;
            };
        } else {
            keys = _keys(coll);
            len = keys.length;
            return function next() {
                i++;
                return i < len ? keys[i] : null;
            };
        }
    }

    // Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
    // This accumulates the arguments passed into an array, after a given index.
    // From underscore.js (https://github.com/jashkenas/underscore/pull/2140).
    function _restParam(func, startIndex) {
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function() {
            var length = Math.max(arguments.length - startIndex, 0);
            var rest = Array(length);
            for (var index = 0; index < length; index++) {
                rest[index] = arguments[index + startIndex];
            }
            switch (startIndex) {
                case 0: return func.call(this, rest);
                case 1: return func.call(this, arguments[0], rest);
            }
            // Currently unused but handle cases outside of the switch statement:
            // var args = Array(startIndex + 1);
            // for (index = 0; index < startIndex; index++) {
            //     args[index] = arguments[index];
            // }
            // args[startIndex] = rest;
            // return func.apply(this, args);
        };
    }

    function _withoutIndex(iterator) {
        return function (value, index, callback) {
            return iterator(value, callback);
        };
    }

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////

    // capture the global reference to guard against fakeTimer mocks
    var _setImmediate = typeof setImmediate === 'function' && setImmediate;

    var _delay = _setImmediate ? function(fn) {
        // not a direct alias for IE10 compatibility
        _setImmediate(fn);
    } : function(fn) {
        setTimeout(fn, 0);
    };

    if (typeof process === 'object' && typeof process.nextTick === 'function') {
        async.nextTick = process.nextTick;
    } else {
        async.nextTick = _delay;
    }
    async.setImmediate = _setImmediate ? _delay : async.nextTick;


    async.forEach =
    async.each = function (arr, iterator, callback) {
        return async.eachOf(arr, _withoutIndex(iterator), callback);
    };

    async.forEachSeries =
    async.eachSeries = function (arr, iterator, callback) {
        return async.eachOfSeries(arr, _withoutIndex(iterator), callback);
    };


    async.forEachLimit =
    async.eachLimit = function (arr, limit, iterator, callback) {
        return _eachOfLimit(limit)(arr, _withoutIndex(iterator), callback);
    };

    async.forEachOf =
    async.eachOf = function (object, iterator, callback) {
        callback = _once(callback || noop);
        object = object || [];
        var size = _isArrayLike(object) ? object.length : _keys(object).length;
        var completed = 0;
        if (!size) {
            return callback(null);
        }
        _each(object, function (value, key) {
            iterator(object[key], key, only_once(done));
        });
        function done(err) {
            if (err) {
                callback(err);
            }
            else {
                completed += 1;
                if (completed >= size) {
                    callback(null);
                }
            }
        }
    };

    async.forEachOfSeries =
    async.eachOfSeries = function (obj, iterator, callback) {
        callback = _once(callback || noop);
        obj = obj || [];
        var nextKey = _keyIterator(obj);
        var key = nextKey();
        function iterate() {
            var sync = true;
            if (key === null) {
                return callback(null);
            }
            iterator(obj[key], key, only_once(function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    key = nextKey();
                    if (key === null) {
                        return callback(null);
                    } else {
                        if (sync) {
                            async.setImmediate(iterate);
                        } else {
                            iterate();
                        }
                    }
                }
            }));
            sync = false;
        }
        iterate();
    };



    async.forEachOfLimit =
    async.eachOfLimit = function (obj, limit, iterator, callback) {
        _eachOfLimit(limit)(obj, iterator, callback);
    };

    function _eachOfLimit(limit) {

        return function (obj, iterator, callback) {
            callback = _once(callback || noop);
            obj = obj || [];
            var nextKey = _keyIterator(obj);
            if (limit <= 0) {
                return callback(null);
            }
            var done = false;
            var running = 0;
            var errored = false;

            (function replenish () {
                if (done && running <= 0) {
                    return callback(null);
                }

                while (running < limit && !errored) {
                    var key = nextKey();
                    if (key === null) {
                        done = true;
                        if (running <= 0) {
                            callback(null);
                        }
                        return;
                    }
                    running += 1;
                    iterator(obj[key], key, only_once(function (err) {
                        running -= 1;
                        if (err) {
                            callback(err);
                            errored = true;
                        }
                        else {
                            replenish();
                        }
                    }));
                }
            })();
        };
    }


    function doParallel(fn) {
        return function (obj, iterator, callback) {
            return fn(async.eachOf, obj, iterator, callback);
        };
    }
    function doParallelLimit(fn) {
        return function (obj, limit, iterator, callback) {
            return fn(_eachOfLimit(limit), obj, iterator, callback);
        };
    }
    function doSeries(fn) {
        return function (obj, iterator, callback) {
            return fn(async.eachOfSeries, obj, iterator, callback);
        };
    }

    function _asyncMap(eachfn, arr, iterator, callback) {
        callback = _once(callback || noop);
        var results = [];
        eachfn(arr, function (value, index, callback) {
            iterator(value, function (err, v) {
                results[index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    }

    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = doParallelLimit(_asyncMap);

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.inject =
    async.foldl =
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachOfSeries(arr, function (x, i, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err || null, memo);
        });
    };

    async.foldr =
    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, identity).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };

    function _filter(eachfn, arr, iterator, callback) {
        var results = [];
        eachfn(arr, function (x, index, callback) {
            iterator(x, function (v) {
                if (v) {
                    results.push({index: index, value: x});
                }
                callback();
            });
        }, function () {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    }

    async.select =
    async.filter = doParallel(_filter);

    async.selectLimit =
    async.filterLimit = doParallelLimit(_filter);

    async.selectSeries =
    async.filterSeries = doSeries(_filter);

    function _reject(eachfn, arr, iterator, callback) {
        _filter(eachfn, arr, function(value, cb) {
            iterator(value, function(v) {
                cb(!v);
            });
        }, callback);
    }
    async.reject = doParallel(_reject);
    async.rejectLimit = doParallelLimit(_reject);
    async.rejectSeries = doSeries(_reject);

    function _createTester(eachfn, check, getResult) {
        return function(arr, limit, iterator, cb) {
            function done() {
                if (cb) cb(getResult(false, void 0));
            }
            function iteratee(x, _, callback) {
                if (!cb) return callback();
                iterator(x, function (v) {
                    if (cb && check(v)) {
                        cb(getResult(true, x));
                        cb = iterator = false;
                    }
                    callback();
                });
            }
            if (arguments.length > 3) {
                eachfn(arr, limit, iteratee, done);
            } else {
                cb = iterator;
                iterator = limit;
                eachfn(arr, iteratee, done);
            }
        };
    }

    async.any =
    async.some = _createTester(async.eachOf, toBool, identity);

    async.someLimit = _createTester(async.eachOfLimit, toBool, identity);

    async.all =
    async.every = _createTester(async.eachOf, notId, notId);

    async.everyLimit = _createTester(async.eachOfLimit, notId, notId);

    function _findGetResult(v, x) {
        return x;
    }
    async.detect = _createTester(async.eachOf, identity, _findGetResult);
    async.detectSeries = _createTester(async.eachOfSeries, identity, _findGetResult);
    async.detectLimit = _createTester(async.eachOfLimit, identity, _findGetResult);

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                callback(null, _map(results.sort(comparator), function (x) {
                    return x.value;
                }));
            }

        });

        function comparator(left, right) {
            var a = left.criteria, b = right.criteria;
            return a < b ? -1 : a > b ? 1 : 0;
        }
    };

    async.auto = function (tasks, callback) {
        callback = _once(callback || noop);
        var keys = _keys(tasks);
        var remainingTasks = keys.length;
        if (!remainingTasks) {
            return callback(null);
        }

        var results = {};

        var listeners = [];
        function addListener(fn) {
            listeners.unshift(fn);
        }
        function removeListener(fn) {
            var idx = _indexOf(listeners, fn);
            if (idx >= 0) listeners.splice(idx, 1);
        }
        function taskComplete() {
            remainingTasks--;
            _arrayEach(listeners.slice(0), function (fn) {
                fn();
            });
        }

        addListener(function () {
            if (!remainingTasks) {
                callback(null, results);
            }
        });

        _arrayEach(keys, function (k) {
            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];
            var taskCallback = _restParam(function(err, args) {
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _forEachOf(results, function(val, rkey) {
                        safeResults[rkey] = val;
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            });
            var requires = task.slice(0, task.length - 1);
            // prevent dead-locks
            var len = requires.length;
            var dep;
            while (len--) {
                if (!(dep = tasks[requires[len]])) {
                    throw new Error('Has inexistant dependency');
                }
                if (_isArray(dep) && _indexOf(dep, k) >= 0) {
                    throw new Error('Has cyclic dependencies');
                }
            }
            function ready() {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            }
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                addListener(listener);
            }
            function listener() {
                if (ready()) {
                    removeListener(listener);
                    task[task.length - 1](taskCallback, results);
                }
            }
        });
    };



    async.retry = function(times, task, callback) {
        var DEFAULT_TIMES = 5;
        var DEFAULT_INTERVAL = 0;

        var attempts = [];

        var opts = {
            times: DEFAULT_TIMES,
            interval: DEFAULT_INTERVAL
        };

        function parseTimes(acc, t){
            if(typeof t === 'number'){
                acc.times = parseInt(t, 10) || DEFAULT_TIMES;
            } else if(typeof t === 'object'){
                acc.times = parseInt(t.times, 10) || DEFAULT_TIMES;
                acc.interval = parseInt(t.interval, 10) || DEFAULT_INTERVAL;
            } else {
                throw new Error('Unsupported argument type for \'times\': ' + typeof t);
            }
        }

        var length = arguments.length;
        if (length < 1 || length > 3) {
            throw new Error('Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)');
        } else if (length <= 2 && typeof times === 'function') {
            callback = task;
            task = times;
        }
        if (typeof times !== 'function') {
            parseTimes(opts, times);
        }
        opts.callback = callback;
        opts.task = task;

        function wrappedTask(wrappedCallback, wrappedResults) {
            function retryAttempt(task, finalAttempt) {
                return function(seriesCallback) {
                    task(function(err, result){
                        seriesCallback(!err || finalAttempt, {err: err, result: result});
                    }, wrappedResults);
                };
            }

            function retryInterval(interval){
                return function(seriesCallback){
                    setTimeout(function(){
                        seriesCallback(null);
                    }, interval);
                };
            }

            while (opts.times) {

                var finalAttempt = !(opts.times-=1);
                attempts.push(retryAttempt(opts.task, finalAttempt));
                if(!finalAttempt && opts.interval > 0){
                    attempts.push(retryInterval(opts.interval));
                }
            }

            async.series(attempts, function(done, data){
                data = data[data.length - 1];
                (wrappedCallback || opts.callback)(data.err, data.result);
            });
        }

        // If a callback is passed, run this as a controll flow
        return opts.callback ? wrappedTask() : wrappedTask;
    };

    async.waterfall = function (tasks, callback) {
        callback = _once(callback || noop);
        if (!_isArray(tasks)) {
            var err = new Error('First argument to waterfall must be an array of functions');
            return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        function wrapIterator(iterator) {
            return _restParam(function (err, args) {
                if (err) {
                    callback.apply(null, [err].concat(args));
                }
                else {
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    ensureAsync(iterator).apply(null, args);
                }
            });
        }
        wrapIterator(async.iterator(tasks))();
    };

    function _parallel(eachfn, tasks, callback) {
        callback = callback || noop;
        var results = _isArrayLike(tasks) ? [] : {};

        eachfn(tasks, function (task, key, callback) {
            task(_restParam(function (err, args) {
                if (args.length <= 1) {
                    args = args[0];
                }
                results[key] = args;
                callback(err);
            }));
        }, function (err) {
            callback(err, results);
        });
    }

    async.parallel = function (tasks, callback) {
        _parallel(async.eachOf, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel(_eachOfLimit(limit), tasks, callback);
    };

    async.series = function(tasks, callback) {
        _parallel(async.eachOfSeries, tasks, callback);
    };

    async.iterator = function (tasks) {
        function makeCallback(index) {
            function fn() {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            }
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        }
        return makeCallback(0);
    };

    async.apply = _restParam(function (fn, args) {
        return _restParam(function (callArgs) {
            return fn.apply(
                null, args.concat(callArgs)
            );
        });
    });

    function _concat(eachfn, arr, fn, callback) {
        var result = [];
        eachfn(arr, function (x, index, cb) {
            fn(x, function (err, y) {
                result = result.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, result);
        });
    }
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        callback = callback || noop;
        if (test()) {
            var next = _restParam(function(err, args) {
                if (err) {
                    callback(err);
                } else if (test.apply(this, args)) {
                    iterator(next);
                } else {
                    callback(null);
                }
            });
            iterator(next);
        } else {
            callback(null);
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        var calls = 0;
        return async.whilst(function() {
            return ++calls <= 1 || test.apply(this, arguments);
        }, iterator, callback);
    };

    async.until = function (test, iterator, callback) {
        return async.whilst(function() {
            return !test.apply(this, arguments);
        }, iterator, callback);
    };

    async.doUntil = function (iterator, test, callback) {
        return async.doWhilst(iterator, function() {
            return !test.apply(this, arguments);
        }, callback);
    };

    async.during = function (test, iterator, callback) {
        callback = callback || noop;

        var next = _restParam(function(err, args) {
            if (err) {
                callback(err);
            } else {
                args.push(check);
                test.apply(this, args);
            }
        });

        var check = function(err, truth) {
            if (err) {
                callback(err);
            } else if (truth) {
                iterator(next);
            } else {
                callback(null);
            }
        };

        test(check);
    };

    async.doDuring = function (iterator, test, callback) {
        var calls = 0;
        async.during(function(next) {
            if (calls++ < 1) {
                next(null, true);
            } else {
                test.apply(this, arguments);
            }
        }, iterator, callback);
    };

    function _queue(worker, concurrency, payload) {
        if (concurrency == null) {
            concurrency = 1;
        }
        else if(concurrency === 0) {
            throw new Error('Concurrency must not be zero');
        }
        function _insert(q, data, pos, callback) {
            if (callback != null && typeof callback !== "function") {
                throw new Error("task callback must be a function");
            }
            q.started = true;
            if (!_isArray(data)) {
                data = [data];
            }
            if(data.length === 0 && q.idle()) {
                // call drain immediately if there are no tasks
                return async.setImmediate(function() {
                    q.drain();
                });
            }
            _arrayEach(data, function(task) {
                var item = {
                    data: task,
                    callback: callback || noop
                };

                if (pos) {
                    q.tasks.unshift(item);
                } else {
                    q.tasks.push(item);
                }

                if (q.tasks.length === q.concurrency) {
                    q.saturated();
                }
            });
            async.setImmediate(q.process);
        }
        function _next(q, tasks) {
            return function(){
                workers -= 1;
                var args = arguments;
                _arrayEach(tasks, function (task) {
                    task.callback.apply(task, args);
                });
                if (q.tasks.length + workers === 0) {
                    q.drain();
                }
                q.process();
            };
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            payload: payload,
            saturated: noop,
            empty: noop,
            drain: noop,
            started: false,
            paused: false,
            push: function (data, callback) {
                _insert(q, data, false, callback);
            },
            kill: function () {
                q.drain = noop;
                q.tasks = [];
            },
            unshift: function (data, callback) {
                _insert(q, data, true, callback);
            },
            process: function () {
                if (!q.paused && workers < q.concurrency && q.tasks.length) {
                    while(workers < q.concurrency && q.tasks.length){
                        var tasks = q.payload ?
                            q.tasks.splice(0, q.payload) :
                            q.tasks.splice(0, q.tasks.length);

                        var data = _map(tasks, function (task) {
                            return task.data;
                        });

                        if (q.tasks.length === 0) {
                            q.empty();
                        }
                        workers += 1;
                        var cb = only_once(_next(q, tasks));
                        worker(data, cb);
                    }
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            },
            idle: function() {
                return q.tasks.length + workers === 0;
            },
            pause: function () {
                q.paused = true;
            },
            resume: function () {
                if (q.paused === false) { return; }
                q.paused = false;
                var resumeCount = Math.min(q.concurrency, q.tasks.length);
                // Need to call q.process once per concurrent
                // worker to preserve full concurrency after pause
                for (var w = 1; w <= resumeCount; w++) {
                    async.setImmediate(q.process);
                }
            }
        };
        return q;
    }

    async.queue = function (worker, concurrency) {
        var q = _queue(function (items, cb) {
            worker(items[0], cb);
        }, concurrency, 1);

        return q;
    };

    async.priorityQueue = function (worker, concurrency) {

        function _compareTasks(a, b){
            return a.priority - b.priority;
        }

        function _binarySearch(sequence, item, compare) {
            var beg = -1,
                end = sequence.length - 1;
            while (beg < end) {
                var mid = beg + ((end - beg + 1) >>> 1);
                if (compare(item, sequence[mid]) >= 0) {
                    beg = mid;
                } else {
                    end = mid - 1;
                }
            }
            return beg;
        }

        function _insert(q, data, priority, callback) {
            if (callback != null && typeof callback !== "function") {
                throw new Error("task callback must be a function");
            }
            q.started = true;
            if (!_isArray(data)) {
                data = [data];
            }
            if(data.length === 0) {
                // call drain immediately if there are no tasks
                return async.setImmediate(function() {
                    q.drain();
                });
            }
            _arrayEach(data, function(task) {
                var item = {
                    data: task,
                    priority: priority,
                    callback: typeof callback === 'function' ? callback : noop
                };

                q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

                if (q.tasks.length === q.concurrency) {
                    q.saturated();
                }
                async.setImmediate(q.process);
            });
        }

        // Start with a normal queue
        var q = async.queue(worker, concurrency);

        // Override push to accept second parameter representing priority
        q.push = function (data, priority, callback) {
            _insert(q, data, priority, callback);
        };

        // Remove unshift function
        delete q.unshift;

        return q;
    };

    async.cargo = function (worker, payload) {
        return _queue(worker, 1, payload);
    };

    function _console_fn(name) {
        return _restParam(function (fn, args) {
            fn.apply(null, args.concat([_restParam(function (err, args) {
                if (typeof console === 'object') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _arrayEach(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            })]));
        });
    }
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || identity;
        var memoized = _restParam(function memoized(args) {
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                async.setImmediate(function () {
                    callback.apply(null, memo[key]);
                });
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([_restParam(function (args) {
                    memo[key] = args;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                        q[i].apply(null, args);
                    }
                })]));
            }
        });
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
        return function () {
            return (fn.unmemoized || fn).apply(null, arguments);
        };
    };

    function _times(mapper) {
        return function (count, iterator, callback) {
            mapper(_range(count), iterator, callback);
        };
    }

    async.times = _times(async.map);
    async.timesSeries = _times(async.mapSeries);
    async.timesLimit = function (count, limit, iterator, callback) {
        return async.mapLimit(_range(count), limit, iterator, callback);
    };

    async.seq = function (/* functions... */) {
        var fns = arguments;
        return _restParam(function (args) {
            var that = this;

            var callback = args[args.length - 1];
            if (typeof callback == 'function') {
                args.pop();
            } else {
                callback = noop;
            }

            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([_restParam(function (err, nextargs) {
                    cb(err, nextargs);
                })]));
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        });
    };

    async.compose = function (/* functions... */) {
        return async.seq.apply(null, Array.prototype.reverse.call(arguments));
    };


    function _applyEach(eachfn) {
        return _restParam(function(fns, args) {
            var go = _restParam(function(args) {
                var that = this;
                var callback = args.pop();
                return eachfn(fns, function (fn, _, cb) {
                    fn.apply(that, args.concat([cb]));
                },
                callback);
            });
            if (args.length) {
                return go.apply(this, args);
            }
            else {
                return go;
            }
        });
    }

    async.applyEach = _applyEach(async.eachOf);
    async.applyEachSeries = _applyEach(async.eachOfSeries);


    async.forever = function (fn, callback) {
        var done = only_once(callback || noop);
        var task = ensureAsync(fn);
        function next(err) {
            if (err) {
                return done(err);
            }
            task(next);
        }
        next();
    };

    function ensureAsync(fn) {
        return _restParam(function (args) {
            var callback = args.pop();
            args.push(function () {
                var innerArgs = arguments;
                if (sync) {
                    async.setImmediate(function () {
                        callback.apply(null, innerArgs);
                    });
                } else {
                    callback.apply(null, innerArgs);
                }
            });
            var sync = true;
            fn.apply(this, args);
            sync = false;
        });
    }

    async.ensureAsync = ensureAsync;

    async.constant = _restParam(function(values) {
        var args = [null].concat(values);
        return function (callback) {
            return callback.apply(this, args);
        };
    });

    async.wrapSync =
    async.asyncify = function asyncify(func) {
        return _restParam(function (args) {
            var callback = args.pop();
            var result;
            try {
                result = func.apply(this, args);
            } catch (e) {
                return callback(e);
            }
            // if result is Promise object
            if (_isObject(result) && typeof result.then === "function") {
                result.then(function(value) {
                    callback(null, value);
                })["catch"](function(err) {
                    callback(err.message ? err : new Error(err));
                });
            } else {
                callback(null, result);
            }
        });
    };

    // Node.js
    if (typeof module === 'object' && module.exports) {
        module.exports = async;
    }
    // AMD / RequireJS
    else if (typeof define === 'function' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":1}],32:[function(require,module,exports){
'use strict';
module.exports = function (str) {
	if (str.length === 1) {
		return str;
	}

	return str
	.replace(/^[_.\- ]+/, '')
	.toLowerCase()
	.replace(/[_.\- ]+(\w|$)/g, function (m, p1) {
		return p1.toUpperCase();
	});
};

},{}]},{},[22])(22)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL2Fzc2VydGFibGUuanMiLCJzcmMvZGVzY3JpcHRvcnMvY2VudGVyLmpzIiwic3JjL2Rlc2NyaXB0b3JzL2Rlc2NyaXB0b3IuanMiLCJzcmMvZGVzY3JpcHRvcnMvZWxlbWVudF9lZGdlLmpzIiwic3JjL2Rlc2NyaXB0b3JzL2VsZW1lbnRfcmVuZGVyZWQuanMiLCJzcmMvZGVzY3JpcHRvcnMvZWxlbWVudF9zaXplLmpzIiwic3JjL2Rlc2NyaXB0b3JzL3BhZ2VfZWRnZS5qcyIsInNyYy9kZXNjcmlwdG9ycy9wYWdlX3NpemUuanMiLCJzcmMvZGVzY3JpcHRvcnMvcG9zaXRpb25fZGVzY3JpcHRvci5qcyIsInNyYy9kZXNjcmlwdG9ycy9yZWxhdGl2ZV9wb3NpdGlvbi5qcyIsInNyYy9kZXNjcmlwdG9ycy9yZWxhdGl2ZV9zaXplLmpzIiwic3JjL2Rlc2NyaXB0b3JzL3NpemVfZGVzY3JpcHRvci5qcyIsInNyYy9kZXNjcmlwdG9ycy9zaXplX211bHRpcGxlLmpzIiwic3JjL2Rlc2NyaXB0b3JzL3ZpZXdwb3J0X2VkZ2UuanMiLCJzcmMvZGVzY3JpcHRvcnMvdmlld3BvcnRfc2l6ZS5qcyIsInNyYy9xX2VsZW1lbnQuanMiLCJzcmMvcV9lbGVtZW50X2xpc3QuanMiLCJzcmMvcV9mcmFtZS5qcyIsInNyYy9xX3BhZ2UuanMiLCJzcmMvcV92aWV3cG9ydC5qcyIsInNyYy9xdWl4b3RlLmpzIiwic3JjL3V0aWwvZW5zdXJlLmpzIiwic3JjL3V0aWwvb29wLmpzIiwic3JjL3V0aWwvc2hpbS5qcyIsInNyYy92YWx1ZXMvcGl4ZWxzLmpzIiwic3JjL3ZhbHVlcy9wb3NpdGlvbi5qcyIsInNyYy92YWx1ZXMvcmVuZGVyX3N0YXRlLmpzIiwic3JjL3ZhbHVlcy9zaXplLmpzIiwic3JjL3ZhbHVlcy92YWx1ZS5qcyIsInZlbmRvci9hc3luYy0xLjQuMi5qcyIsInZlbmRvci9jYW1lbGNhc2UtMS4wLjEtbW9kaWZpZWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9QQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdHNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgVGl0YW5pdW0gSS5ULiBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIEZvciBsaWNlbnNlLCBzZWUgXCJSRUFETUVcIiBvciBcIkxJQ0VOU0VcIiBmaWxlLlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBlbnN1cmUgPSByZXF1aXJlKFwiLi91dGlsL2Vuc3VyZS5qc1wiKTtcbnZhciBvb3AgPSByZXF1aXJlKFwiLi91dGlsL29vcC5qc1wiKTtcbnZhciBzaGltID0gcmVxdWlyZShcIi4vdXRpbC9zaGltLmpzXCIpO1xuXG52YXIgTWUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEFzc2VydGFibGUoKSB7XG5cdGVuc3VyZS51bnJlYWNoYWJsZShcIkFzc2VydGFibGUgaXMgYWJzdHJhY3QgYW5kIHNob3VsZCBub3QgYmUgY29uc3RydWN0ZWQgZGlyZWN0bHkuXCIpO1xufTtcbk1lLmV4dGVuZCA9IG9vcC5leHRlbmRGbihNZSk7XG5vb3AubWFrZUFic3RyYWN0KE1lLCBbXSk7XG5cbk1lLnByb3RvdHlwZS5hc3NlcnQgPSBmdW5jdGlvbiBhc3NlcnQoZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFsgT2JqZWN0LCBbdW5kZWZpbmVkLCBTdHJpbmddIF0pO1xuXHRpZiAobWVzc2FnZSA9PT0gdW5kZWZpbmVkKSBtZXNzYWdlID0gXCJEaWZmZXJlbmNlcyBmb3VuZFwiO1xuXG5cdHZhciBkaWZmID0gdGhpcy5kaWZmKGV4cGVjdGVkKTtcblx0aWYgKGRpZmYgIT09IFwiXCIpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlICsgXCI6XFxuXCIgKyBkaWZmICsgXCJcXG5cIik7XG59O1xuXG5NZS5wcm90b3R5cGUuZGlmZiA9IGZ1bmN0aW9uIGRpZmYoZXhwZWN0ZWQpIHtcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFsgT2JqZWN0IF0pO1xuXG5cdHZhciByZXN1bHQgPSBbXTtcblx0dmFyIGtleXMgPSBzaGltLk9iamVjdC5rZXlzKGV4cGVjdGVkKTtcblx0dmFyIGtleSwgb25lRGlmZiwgZGVzY3JpcHRvcjtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0a2V5ID0ga2V5c1tpXTtcblx0XHRkZXNjcmlwdG9yID0gdGhpc1trZXldO1xuXHRcdGVuc3VyZS50aGF0KFxuXHRcdFx0XHRkZXNjcmlwdG9yICE9PSB1bmRlZmluZWQsXG5cdFx0XHRcdHRoaXMgKyBcIiBkb2Vzbid0IGhhdmUgYSBwcm9wZXJ0eSBuYW1lZCAnXCIgKyBrZXkgKyBcIicuIERpZCB5b3UgbWlzc3BlbGwgaXQ/XCJcblx0XHQpO1xuXHRcdG9uZURpZmYgPSBkZXNjcmlwdG9yLmRpZmYoZXhwZWN0ZWRba2V5XSk7XG5cdFx0aWYgKG9uZURpZmYgIT09IFwiXCIpIHJlc3VsdC5wdXNoKG9uZURpZmYpO1xuXHR9XG5cblx0cmV0dXJuIHJlc3VsdC5qb2luKFwiXFxuXCIpO1xufTtcbiIsIi8vIENvcHlyaWdodCAoYykgMjAxNCBUaXRhbml1bSBJLlQuIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gRm9yIGxpY2Vuc2UsIHNlZSBcIlJFQURNRVwiIG9yIFwiTElDRU5TRVwiIGZpbGUuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGVuc3VyZSA9IHJlcXVpcmUoXCIuLi91dGlsL2Vuc3VyZS5qc1wiKTtcbnZhciBQb3NpdGlvbkRlc2NyaXB0b3IgPSByZXF1aXJlKFwiLi9wb3NpdGlvbl9kZXNjcmlwdG9yLmpzXCIpO1xudmFyIFBvc2l0aW9uID0gcmVxdWlyZShcIi4uL3ZhbHVlcy9wb3NpdGlvbi5qc1wiKTtcbnZhciBSZWxhdGl2ZVBvc2l0aW9uID0gcmVxdWlyZShcIi4vcmVsYXRpdmVfcG9zaXRpb24uanNcIik7XG5cbnZhciBYX0RJTUVOU0lPTiA9IFwieFwiO1xudmFyIFlfRElNRU5TSU9OID0gXCJ5XCI7XG5cbnZhciBNZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQ2VudGVyKGRpbWVuc2lvbiwgcG9zaXRpb24xLCBwb3NpdGlvbjIsIGRlc2NyaXB0aW9uKSB7XG5cdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbIFN0cmluZywgUG9zaXRpb25EZXNjcmlwdG9yLCBQb3NpdGlvbkRlc2NyaXB0b3IsIFN0cmluZyBdKTtcblxuXHRpZiAoZGltZW5zaW9uID09PSBYX0RJTUVOU0lPTikgUG9zaXRpb25EZXNjcmlwdG9yLngodGhpcyk7XG5cdGVsc2UgaWYgKGRpbWVuc2lvbiA9PT0gWV9ESU1FTlNJT04pIFBvc2l0aW9uRGVzY3JpcHRvci55KHRoaXMpO1xuXHRlbHNlIGVuc3VyZS51bnJlYWNoYWJsZShcIlVua25vd24gZGltZW5zaW9uOiBcIiArIGRpbWVuc2lvbik7XG5cblx0dGhpcy5fZGltZW5zaW9uID0gZGltZW5zaW9uO1xuXHR0aGlzLl9wb3NpdGlvbjEgPSBwb3NpdGlvbjE7XG5cdHRoaXMuX3Bvc2l0aW9uMiA9IHBvc2l0aW9uMjtcblx0dGhpcy5fZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbn07XG5Qb3NpdGlvbkRlc2NyaXB0b3IuZXh0ZW5kKE1lKTtcblxuTWUueCA9IGZhY3RvcnlGbihYX0RJTUVOU0lPTik7XG5NZS55ID0gZmFjdG9yeUZuKFlfRElNRU5TSU9OKTtcblxuTWUucHJvdG90eXBlLnZhbHVlID0gZnVuY3Rpb24gdmFsdWUoKSB7XG5cdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbXSk7XG5cdHJldHVybiB0aGlzLl9wb3NpdGlvbjEudmFsdWUoKS5taWRwb2ludCh0aGlzLl9wb3NpdGlvbjIudmFsdWUoKSk7XG59O1xuXG5NZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtdKTtcblx0cmV0dXJuIHRoaXMuX2Rlc2NyaXB0aW9uO1xufTtcblxuZnVuY3Rpb24gZmFjdG9yeUZuKGRpbWVuc2lvbikge1xuXHRyZXR1cm4gZnVuY3Rpb24ocG9zaXRpb24xLCBwb3NpdGlvbjIsIGRlc2NyaXB0aW9uKSB7XG5cdFx0cmV0dXJuIG5ldyBNZShkaW1lbnNpb24sIHBvc2l0aW9uMSwgcG9zaXRpb24yLCBkZXNjcmlwdGlvbik7XG5cdH07XG59XG4iLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTQgVGl0YW5pdW0gSS5ULiBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIEZvciBsaWNlbnNlLCBzZWUgXCJSRUFETUVcIiBvciBcIkxJQ0VOU0VcIiBmaWxlLlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBlbnN1cmUgPSByZXF1aXJlKFwiLi4vdXRpbC9lbnN1cmUuanNcIik7XG52YXIgb29wID0gcmVxdWlyZShcIi4uL3V0aWwvb29wLmpzXCIpO1xudmFyIFZhbHVlID0gcmVxdWlyZShcIi4uL3ZhbHVlcy92YWx1ZS5qc1wiKTtcblxudmFyIE1lID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBEZXNjcmlwdG9yKCkge1xuXHRlbnN1cmUudW5yZWFjaGFibGUoXCJEZXNjcmlwdG9yIGlzIGFic3RyYWN0IGFuZCBzaG91bGQgbm90IGJlIGNvbnN0cnVjdGVkIGRpcmVjdGx5LlwiKTtcbn07XG5NZS5leHRlbmQgPSBvb3AuZXh0ZW5kRm4oTWUpO1xub29wLm1ha2VBYnN0cmFjdChNZSwgW1xuXHRcInZhbHVlXCIsXG5cdFwidG9TdHJpbmdcIlxuXSk7XG5cbk1lLnByb3RvdHlwZS5kaWZmID0gZnVuY3Rpb24gZGlmZihleHBlY3RlZCkge1xuXHRleHBlY3RlZCA9IG5vcm1hbGl6ZVR5cGUodGhpcywgZXhwZWN0ZWQpO1xuXHR0cnkge1xuXHRcdHZhciBhY3R1YWxWYWx1ZSA9IHRoaXMudmFsdWUoKTtcblx0XHR2YXIgZXhwZWN0ZWRWYWx1ZSA9IGV4cGVjdGVkLnZhbHVlKCk7XG5cblx0XHRpZiAoYWN0dWFsVmFsdWUuZXF1YWxzKGV4cGVjdGVkVmFsdWUpKSByZXR1cm4gXCJcIjtcblxuXHRcdHZhciBkaWZmZXJlbmNlID0gYWN0dWFsVmFsdWUuZGlmZihleHBlY3RlZFZhbHVlKTtcblx0XHR2YXIgZXhwZWN0ZWREZXNjID0gZXhwZWN0ZWRWYWx1ZS50b1N0cmluZygpO1xuXHRcdGlmIChleHBlY3RlZCBpbnN0YW5jZW9mIE1lKSBleHBlY3RlZERlc2MgKz0gXCIgKFwiICsgZXhwZWN0ZWQgKyBcIilcIjtcblxuXHRcdHJldHVybiB0aGlzICsgXCIgd2FzIFwiICsgZGlmZmVyZW5jZSArIFwiLlxcblwiICtcblx0XHRcdFwiICBFeHBlY3RlZDogXCIgKyBleHBlY3RlZERlc2MgKyBcIlxcblwiICtcblx0XHRcdFwiICBCdXQgd2FzOiAgXCIgKyBhY3R1YWxWYWx1ZTtcblx0fVxuXHRjYXRjaCAoZXJyKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgY29tcGFyZSBcIiArIHRoaXMgKyBcIiB0byBcIiArIGV4cGVjdGVkICsgXCI6IFwiICsgZXJyLm1lc3NhZ2UpO1xuXHR9XG59O1xuXG5NZS5wcm90b3R5cGUuY29udmVydCA9IGZ1bmN0aW9uIGNvbnZlcnQoYXJnLCB0eXBlKSB7XG5cdC8vIFRoaXMgbWV0aG9kIGlzIG1lYW50IHRvIGJlIG92ZXJyaWRkZW4gYnkgc3ViY2xhc3Nlcy4gSXQgc2hvdWxkIHJldHVybiAndW5kZWZpbmVkJyB3aGVuIGFuIGFyZ3VtZW50XG5cdC8vIGNhbid0IGJlIGNvbnZlcnRlZC4gSW4gdGhpcyBkZWZhdWx0IGltcGxlbWVudGF0aW9uLCBubyBhcmd1bWVudHMgY2FuIGJlIGNvbnZlcnRlZCwgc28gd2UgYWx3YXlzXG5cdC8vIHJldHVybiAndW5kZWZpbmVkJy5cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbk1lLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHModGhhdCkge1xuXHQvLyBEZXNjcmlwdG9ycyBhcmVuJ3QgdmFsdWUgb2JqZWN0cy4gVGhleSdyZSBuZXZlciBlcXVhbCB0byBhbnl0aGluZy4gQnV0IHNvbWV0aW1lc1xuXHQvLyB0aGV5J3JlIHVzZWQgaW4gdGhlIHNhbWUgcGxhY2VzIHZhbHVlIG9iamVjdHMgYXJlIHVzZWQsIGFuZCB0aGlzIG1ldGhvZCBnZXRzIGNhbGxlZC5cblx0cmV0dXJuIGZhbHNlO1xufTtcblxuZnVuY3Rpb24gbm9ybWFsaXplVHlwZShzZWxmLCBleHBlY3RlZCkge1xuXHR2YXIgZXhwZWN0ZWRUeXBlID0gdHlwZW9mIGV4cGVjdGVkO1xuXHRpZiAoZXhwZWN0ZWQgPT09IG51bGwpIGV4cGVjdGVkVHlwZSA9IFwibnVsbFwiO1xuXG5cdGlmIChleHBlY3RlZFR5cGUgPT09IFwib2JqZWN0XCIgJiYgKGV4cGVjdGVkIGluc3RhbmNlb2YgTWUgfHwgZXhwZWN0ZWQgaW5zdGFuY2VvZiBWYWx1ZSkpIHJldHVybiBleHBlY3RlZDtcblxuXHRpZiAoZXhwZWN0ZWQgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNhbid0IGNvbXBhcmUgXCIgKyBzZWxmICsgXCIgdG8gXCIgKyBleHBlY3RlZCArIFwiLiBEaWQgeW91IG1pc3NwZWxsIGEgcHJvcGVydHkgbmFtZT9cIik7XG5cdH1cblx0ZWxzZSBpZiAoZXhwZWN0ZWRUeXBlID09PSBcIm9iamVjdFwiKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgY29tcGFyZSBcIiArIHNlbGYgKyBcIiB0byBcIiArIG9vcC5pbnN0YW5jZU5hbWUoZXhwZWN0ZWQpICsgXCIgaW5zdGFuY2VzLlwiKTtcblx0fVxuXHRlbHNlIHtcblx0XHR2YXIgY29udmVydGVkID0gc2VsZi5jb252ZXJ0KGV4cGVjdGVkLCBleHBlY3RlZFR5cGUpO1xuXHRcdGlmIChjb252ZXJ0ZWQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGNvbnZlcnRlZDtcblxuXHRcdHZhciBleHBsYW5hdGlvbiA9IGV4cGVjdGVkO1xuXHRcdGlmIChleHBlY3RlZFR5cGUgPT09IFwic3RyaW5nXCIpIGV4cGxhbmF0aW9uID0gXCInXCIgKyBleHBsYW5hdGlvbiArIFwiJ1wiO1xuXHRcdGlmIChleHBlY3RlZFR5cGUgPT09IFwiZnVuY3Rpb25cIikgZXhwbGFuYXRpb24gPSBcImEgZnVuY3Rpb25cIjtcblxuXHRcdHRocm93IG5ldyBFcnJvcihcIkNhbid0IGNvbXBhcmUgXCIgKyBzZWxmICsgXCIgdG8gXCIgKyBleHBsYW5hdGlvbiArIFwiLlwiKTtcblx0fVxuXG59XG4iLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNiBUaXRhbml1bSBJLlQuIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gRm9yIGxpY2Vuc2UsIHNlZSBcIlJFQURNRVwiIG9yIFwiTElDRU5TRVwiIGZpbGUuXG4oZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBlbnN1cmUgPSByZXF1aXJlKFwiLi4vdXRpbC9lbnN1cmUuanNcIik7XG5cdHZhciBQb3NpdGlvbiA9IHJlcXVpcmUoXCIuLi92YWx1ZXMvcG9zaXRpb24uanNcIik7XG5cdHZhciBQb3NpdGlvbkRlc2NyaXB0b3IgPSByZXF1aXJlKFwiLi9wb3NpdGlvbl9kZXNjcmlwdG9yLmpzXCIpO1xuXHR2YXIgUmVuZGVyU3RhdGUgPSByZXF1aXJlKFwiLi4vdmFsdWVzL3JlbmRlcl9zdGF0ZS5qc1wiKTtcblxuXHR2YXIgVE9QID0gXCJ0b3BcIjtcblx0dmFyIFJJR0hUID0gXCJyaWdodFwiO1xuXHR2YXIgQk9UVE9NID0gXCJib3R0b21cIjtcblx0dmFyIExFRlQgPSBcImxlZnRcIjtcblxuXHR2YXIgTWUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEVsZW1lbnRFZGdlKGVsZW1lbnQsIHBvc2l0aW9uKSB7XG5cdFx0dmFyIFFFbGVtZW50ID0gcmVxdWlyZShcIi4uL3FfZWxlbWVudC5qc1wiKTsgICAgICAvLyBicmVhayBjaXJjdWxhciBkZXBlbmRlbmN5XG5cdFx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtRRWxlbWVudCwgU3RyaW5nXSk7XG5cblx0XHRpZiAocG9zaXRpb24gPT09IExFRlQgfHwgcG9zaXRpb24gPT09IFJJR0hUKSBQb3NpdGlvbkRlc2NyaXB0b3IueCh0aGlzKTtcblx0XHRlbHNlIGlmIChwb3NpdGlvbiA9PT0gVE9QIHx8IHBvc2l0aW9uID09PSBCT1RUT00pIFBvc2l0aW9uRGVzY3JpcHRvci55KHRoaXMpO1xuXHRcdGVsc2UgZW5zdXJlLnVucmVhY2hhYmxlKFwiVW5rbm93biBwb3NpdGlvbjogXCIgKyBwb3NpdGlvbik7XG5cblx0XHR0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcblx0XHR0aGlzLl9wb3NpdGlvbiA9IHBvc2l0aW9uO1xuXHR9O1xuXHRQb3NpdGlvbkRlc2NyaXB0b3IuZXh0ZW5kKE1lKTtcblxuXHRNZS50b3AgPSBmYWN0b3J5Rm4oVE9QKTtcblx0TWUucmlnaHQgPSBmYWN0b3J5Rm4oUklHSFQpO1xuXHRNZS5ib3R0b20gPSBmYWN0b3J5Rm4oQk9UVE9NKTtcblx0TWUubGVmdCA9IGZhY3RvcnlGbihMRUZUKTtcblxuXHRNZS5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbiB2YWx1ZSgpIHtcblx0XHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW10pO1xuXG5cdFx0dmFyIHJhd1Bvc2l0aW9uID0gdGhpcy5fZWxlbWVudC5nZXRSYXdQb3NpdGlvbigpO1xuXG5cdFx0dmFyIGVkZ2UgPSByYXdQb3NpdGlvblt0aGlzLl9wb3NpdGlvbl07XG5cdFx0dmFyIHNjcm9sbCA9IHRoaXMuX2VsZW1lbnQuZnJhbWUuZ2V0UmF3U2Nyb2xsUG9zaXRpb24oKTtcblxuXHRcdGlmICh0aGlzLl9wb3NpdGlvbiA9PT0gUklHSFQgfHwgdGhpcy5fcG9zaXRpb24gPT09IExFRlQpIHtcblx0XHRcdGlmICghZWxlbWVudFJlbmRlcmVkKHRoaXMpKSByZXR1cm4gUG9zaXRpb24ubm9YKCk7XG5cdFx0XHRyZXR1cm4gUG9zaXRpb24ueChlZGdlICsgc2Nyb2xsLngpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGlmICghZWxlbWVudFJlbmRlcmVkKHRoaXMpKSByZXR1cm4gUG9zaXRpb24ubm9ZKCk7XG5cdFx0XHRyZXR1cm4gUG9zaXRpb24ueShlZGdlICsgc2Nyb2xsLnkpO1xuXHRcdH1cblx0fTtcblxuXHRNZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW10pO1xuXHRcdHJldHVybiB0aGlzLl9wb3NpdGlvbiArIFwiIGVkZ2Ugb2YgXCIgKyB0aGlzLl9lbGVtZW50O1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGZhY3RvcnlGbihwb3NpdGlvbikge1xuXHRcdHJldHVybiBmdW5jdGlvbiBmYWN0b3J5KGVsZW1lbnQpIHtcblx0XHRcdHJldHVybiBuZXcgTWUoZWxlbWVudCwgcG9zaXRpb24pO1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBlbGVtZW50UmVuZGVyZWQoc2VsZikge1xuXHRcdHJldHVybiBzZWxmLl9lbGVtZW50LnJlbmRlcmVkLnZhbHVlKCkuZXF1YWxzKFJlbmRlclN0YXRlLnJlbmRlcmVkKCkpO1xuXHR9XG5cbn0oKSk7IiwiLy8gQ29weXJpZ2h0IChjKSAyMDE2IFRpdGFuaXVtIEkuVC4gTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBGb3IgbGljZW5zZSwgc2VlIFwiUkVBRE1FXCIgb3IgXCJMSUNFTlNFXCIgZmlsZS5cbihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIGVuc3VyZSA9IHJlcXVpcmUoXCIuLi91dGlsL2Vuc3VyZS5qc1wiKTtcblx0dmFyIFJlbmRlclN0YXRlID0gcmVxdWlyZShcIi4uL3ZhbHVlcy9yZW5kZXJfc3RhdGUuanNcIik7XG5cdHZhciBEZXNjcmlwdG9yID0gcmVxdWlyZShcIi4vZGVzY3JpcHRvci5qc1wiKTtcblxuXHR2YXIgTWUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEVsZW1lbnRSZW5kZXJlZChlbGVtZW50KSB7XG5cdFx0dmFyIFFFbGVtZW50ID0gcmVxdWlyZShcIi4uL3FfZWxlbWVudC5qc1wiKTsgICAgICAvLyBicmVhayBjaXJjdWxhciBkZXBlbmRlbmN5XG5cdFx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFsgUUVsZW1lbnQgXSk7XG5cblx0XHR0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcblx0fTtcblx0RGVzY3JpcHRvci5leHRlbmQoTWUpO1xuXG5cdE1lLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShlbGVtZW50KSB7XG5cdFx0cmV0dXJuIG5ldyBNZShlbGVtZW50KTtcblx0fTtcblxuXHRNZS5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbiB2YWx1ZSgpIHtcblx0XHRpZiAoIXRoaXMuX2VsZW1lbnQuZnJhbWUuYm9keSgpLnRvRG9tRWxlbWVudCgpLmNvbnRhaW5zKHRoaXMuX2VsZW1lbnQudG9Eb21FbGVtZW50KCkpKSByZXR1cm4gUmVuZGVyU3RhdGUuZGV0YWNoZWQoKTtcblx0XHRlbHNlIGlmICh0aGlzLl9lbGVtZW50LmdldFJhd1N0eWxlKFwiZGlzcGxheVwiKSA9PT0gXCJub25lXCIpIHJldHVybiBSZW5kZXJTdGF0ZS5kaXNwbGF5Tm9uZSgpO1xuXHRcdGVsc2UgcmV0dXJuIFJlbmRlclN0YXRlLnJlbmRlcmVkKCk7XG5cdH07XG5cblx0TWUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIFwicmVuZGVyIHN0YXR1cyBvZiBcIiArIHRoaXMuX2VsZW1lbnQudG9TdHJpbmcoKTtcblx0fTtcblxuXHRNZS5wcm90b3R5cGUuY29udmVydCA9IGZ1bmN0aW9uIGNvbnZlcnQoYXJnLCB0eXBlKSB7XG5cdCAgaWYgKHR5cGUgPT09IFwiYm9vbGVhblwiKSB7XG5cdFx0ICByZXR1cm4gYXJnID8gUmVuZGVyU3RhdGUucmVuZGVyZWQoKSA6IFJlbmRlclN0YXRlLm5vdFJlbmRlcmVkKCk7XG5cdCAgfVxuXHRcdGlmICh0eXBlID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRpZiAoYXJnID09PSBcImRpc3BsYXk6bm9uZVwiKSByZXR1cm4gUmVuZGVyU3RhdGUuZGlzcGxheU5vbmUoKTtcblx0XHRcdGlmIChhcmcgPT09IFwiZGV0YWNoZWRcIikgcmV0dXJuIFJlbmRlclN0YXRlLmRldGFjaGVkKCk7XG5cdFx0fVxuXHR9O1xuXG59KCkpOyIsIi8vIENvcHlyaWdodCAoYykgMjAxNC0yMDE2IFRpdGFuaXVtIEkuVC4gTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBGb3IgbGljZW5zZSwgc2VlIFwiUkVBRE1FXCIgb3IgXCJMSUNFTlNFXCIgZmlsZS5cbihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIGVuc3VyZSA9IHJlcXVpcmUoXCIuLi91dGlsL2Vuc3VyZS5qc1wiKTtcblx0dmFyIFNpemVEZXNjcmlwdG9yID0gcmVxdWlyZShcIi4vc2l6ZV9kZXNjcmlwdG9yLmpzXCIpO1xuXHR2YXIgU2l6ZSA9IHJlcXVpcmUoXCIuLi92YWx1ZXMvc2l6ZS5qc1wiKTtcblx0dmFyIFJlbmRlclN0YXRlID0gcmVxdWlyZShcIi4uL3ZhbHVlcy9yZW5kZXJfc3RhdGUuanNcIik7XG5cblx0dmFyIFhfRElNRU5TSU9OID0gXCJ3aWR0aFwiO1xuXHR2YXIgWV9ESU1FTlNJT04gPSBcImhlaWdodFwiO1xuXG5cdHZhciBNZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gRWxlbWVudFNpemUoZGltZW5zaW9uLCBlbGVtZW50KSB7XG5cdFx0dmFyIFFFbGVtZW50ID0gcmVxdWlyZShcIi4uL3FfZWxlbWVudC5qc1wiKTsgICAgLy8gYnJlYWsgY2lyY3VsYXIgZGVwZW5kZW5jeVxuXHRcdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbU3RyaW5nLCBRRWxlbWVudF0pO1xuXHRcdGVuc3VyZS50aGF0KGRpbWVuc2lvbiA9PT0gWF9ESU1FTlNJT04gfHwgZGltZW5zaW9uID09PSBZX0RJTUVOU0lPTiwgXCJVbnJlY29nbml6ZWQgZGltZW5zaW9uOiBcIiArIGRpbWVuc2lvbik7XG5cblx0XHR0aGlzLl9kaW1lbnNpb24gPSBkaW1lbnNpb247XG5cdFx0dGhpcy5fZWxlbWVudCA9IGVsZW1lbnQ7XG5cdH07XG5cdFNpemVEZXNjcmlwdG9yLmV4dGVuZChNZSk7XG5cblx0TWUueCA9IGZhY3RvcnlGbihYX0RJTUVOU0lPTik7XG5cdE1lLnkgPSBmYWN0b3J5Rm4oWV9ESU1FTlNJT04pO1xuXG5cdE1lLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uIHZhbHVlKCkge1xuXHRcdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbXSk7XG5cblx0XHRpZiAoIWVsZW1lbnRSZW5kZXJlZCh0aGlzKSkgcmV0dXJuIFNpemUuY3JlYXRlTm9uZSgpO1xuXG5cdFx0dmFyIHBvc2l0aW9uID0gdGhpcy5fZWxlbWVudC5nZXRSYXdQb3NpdGlvbigpO1xuXHRcdHJldHVybiBTaXplLmNyZWF0ZShwb3NpdGlvblt0aGlzLl9kaW1lbnNpb25dKTtcblx0fTtcblxuXHRNZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW10pO1xuXG5cdFx0cmV0dXJuIHRoaXMuX2RpbWVuc2lvbiArIFwiIG9mIFwiICsgdGhpcy5fZWxlbWVudDtcblx0fTtcblxuXHRmdW5jdGlvbiBmYWN0b3J5Rm4oZGltZW5zaW9uKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGZhY3RvcnkoZWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIG5ldyBNZShkaW1lbnNpb24sIGVsZW1lbnQpO1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBlbGVtZW50UmVuZGVyZWQoc2VsZikge1xuXHRcdHJldHVybiBzZWxmLl9lbGVtZW50LnJlbmRlcmVkLnZhbHVlKCkuZXF1YWxzKFJlbmRlclN0YXRlLnJlbmRlcmVkKCkpO1xuXHR9XG5cbn0oKSk7IiwiLy8gQ29weXJpZ2h0IChjKSAyMDE0IFRpdGFuaXVtIEkuVC4gTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBGb3IgbGljZW5zZSwgc2VlIFwiUkVBRE1FXCIgb3IgXCJMSUNFTlNFXCIgZmlsZS5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgZW5zdXJlID0gcmVxdWlyZShcIi4uL3V0aWwvZW5zdXJlLmpzXCIpO1xudmFyIFBvc2l0aW9uRGVzY3JpcHRvciA9IHJlcXVpcmUoXCIuL3Bvc2l0aW9uX2Rlc2NyaXB0b3IuanNcIik7XG52YXIgUG9zaXRpb24gPSByZXF1aXJlKFwiLi4vdmFsdWVzL3Bvc2l0aW9uLmpzXCIpO1xuXG52YXIgVE9QID0gXCJ0b3BcIjtcbnZhciBSSUdIVCA9IFwicmlnaHRcIjtcbnZhciBCT1RUT00gPSBcImJvdHRvbVwiO1xudmFyIExFRlQgPSBcImxlZnRcIjtcblxudmFyIE1lID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBQYWdlRWRnZShlZGdlLCBmcmFtZSkge1xuXHR2YXIgUUZyYW1lID0gcmVxdWlyZShcIi4uL3FfZnJhbWUuanNcIik7ICAgIC8vIGJyZWFrIGNpcmN1bGFyIGRlcGVuZGVuY3lcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFsgU3RyaW5nLCBRRnJhbWUgXSk7XG5cblx0aWYgKGVkZ2UgPT09IExFRlQgfHwgZWRnZSA9PT0gUklHSFQpIFBvc2l0aW9uRGVzY3JpcHRvci54KHRoaXMpO1xuXHRlbHNlIGlmIChlZGdlID09PSBUT1AgfHwgZWRnZSA9PT0gQk9UVE9NKSBQb3NpdGlvbkRlc2NyaXB0b3IueSh0aGlzKTtcblx0ZWxzZSBlbnN1cmUudW5yZWFjaGFibGUoXCJVbmtub3duIGVkZ2U6IFwiICsgZWRnZSk7XG5cblx0dGhpcy5fZWRnZSA9IGVkZ2U7XG5cdHRoaXMuX2ZyYW1lID0gZnJhbWU7XG59O1xuUG9zaXRpb25EZXNjcmlwdG9yLmV4dGVuZChNZSk7XG5cbk1lLnRvcCA9IGZhY3RvcnlGbihUT1ApO1xuTWUucmlnaHQgPSBmYWN0b3J5Rm4oUklHSFQpO1xuTWUuYm90dG9tID0gZmFjdG9yeUZuKEJPVFRPTSk7XG5NZS5sZWZ0ID0gZmFjdG9yeUZuKExFRlQpO1xuXG5NZS5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbiB2YWx1ZSgpIHtcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtdKTtcblxuXHR2YXIgeCA9IFBvc2l0aW9uLngoMCk7XG5cdHZhciB5ID0gUG9zaXRpb24ueSgwKTtcblxuXHRzd2l0Y2godGhpcy5fZWRnZSkge1xuXHRcdGNhc2UgVE9QOiByZXR1cm4geTtcblx0XHRjYXNlIFJJR0hUOiByZXR1cm4geC5wbHVzKHRoaXMuX2ZyYW1lLnBhZ2UoKS53aWR0aC52YWx1ZSgpKTtcblx0XHRjYXNlIEJPVFRPTTogcmV0dXJuIHkucGx1cyh0aGlzLl9mcmFtZS5wYWdlKCkuaGVpZ2h0LnZhbHVlKCkpO1xuXHRcdGNhc2UgTEVGVDogcmV0dXJuIHg7XG5cblx0XHRkZWZhdWx0OiBlbnN1cmUudW5yZWFjaGFibGUoKTtcblx0fVxufTtcblxuTWUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbXSk7XG5cblx0c3dpdGNoKHRoaXMuX2VkZ2UpIHtcblx0XHRjYXNlIFRPUDogcmV0dXJuIFwidG9wIG9mIHBhZ2VcIjtcblx0XHRjYXNlIFJJR0hUOiByZXR1cm4gXCJyaWdodCBzaWRlIG9mIHBhZ2VcIjtcblx0XHRjYXNlIEJPVFRPTTogcmV0dXJuIFwiYm90dG9tIG9mIHBhZ2VcIjtcblx0XHRjYXNlIExFRlQ6IHJldHVybiBcImxlZnQgc2lkZSBvZiBwYWdlXCI7XG5cblx0XHRkZWZhdWx0OiBlbnN1cmUudW5yZWFjaGFibGUoKTtcblx0fVxufTtcblxuZnVuY3Rpb24gZmFjdG9yeUZuKGVkZ2UpIHtcblx0cmV0dXJuIGZ1bmN0aW9uIGZhY3RvcnkoZnJhbWUpIHtcblx0XHRyZXR1cm4gbmV3IE1lKGVkZ2UsIGZyYW1lKTtcblx0fTtcbn0iLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTQgVGl0YW5pdW0gSS5ULiBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIEZvciBsaWNlbnNlLCBzZWUgXCJSRUFETUVcIiBvciBcIkxJQ0VOU0VcIiBmaWxlLlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBlbnN1cmUgPSByZXF1aXJlKFwiLi4vdXRpbC9lbnN1cmUuanNcIik7XG52YXIgU2l6ZURlc2NyaXB0b3IgPSByZXF1aXJlKFwiLi9zaXplX2Rlc2NyaXB0b3IuanNcIik7XG52YXIgU2l6ZSA9IHJlcXVpcmUoXCIuLi92YWx1ZXMvc2l6ZS5qc1wiKTtcblxudmFyIFhfRElNRU5TSU9OID0gXCJ3aWR0aFwiO1xudmFyIFlfRElNRU5TSU9OID0gXCJoZWlnaHRcIjtcblxudmFyIE1lID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBQYWdlU2l6ZShkaW1lbnNpb24sIGZyYW1lKSB7XG5cdHZhciBRRnJhbWUgPSByZXF1aXJlKFwiLi4vcV9mcmFtZS5qc1wiKTsgICAgLy8gYnJlYWsgY2lyY3VsYXIgZGVwZW5kZW5jeVxuXHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgWyBTdHJpbmcsIFFGcmFtZSBdKTtcblx0ZW5zdXJlLnRoYXQoZGltZW5zaW9uID09PSBYX0RJTUVOU0lPTiB8fCBkaW1lbnNpb24gPT09IFlfRElNRU5TSU9OLCBcIlVucmVjb2duaXplZCBkaW1lbnNpb246IFwiICsgZGltZW5zaW9uKTtcblxuXHR0aGlzLl9kaW1lbnNpb24gPSBkaW1lbnNpb247XG5cdHRoaXMuX2ZyYW1lID0gZnJhbWU7XG59O1xuU2l6ZURlc2NyaXB0b3IuZXh0ZW5kKE1lKTtcblxuTWUueCA9IGZhY3RvcnlGbihYX0RJTUVOU0lPTik7XG5NZS55ID0gZmFjdG9yeUZuKFlfRElNRU5TSU9OKTtcblxuTWUucHJvdG90eXBlLnZhbHVlID0gZnVuY3Rpb24oKSB7XG5cdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbXSk7XG5cblx0Ly8gVVNFRlVMIFJFQURJTkc6IGh0dHA6Ly93d3cucXVpcmtzbW9kZS5vcmcvbW9iaWxlL3ZpZXdwb3J0cy5odG1sXG5cdC8vIGFuZCBodHRwOi8vd3d3LnF1aXJrc21vZGUub3JnL21vYmlsZS92aWV3cG9ydHMyLmh0bWxcblxuXHQvLyBBUEkgU0VNQU5USUNTLlxuXHQvLyBSZWYgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0NTU19PYmplY3RfTW9kZWwvRGV0ZXJtaW5pbmdfdGhlX2RpbWVuc2lvbnNfb2ZfZWxlbWVudHNcblx0Ly8gICAgZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg6IHN1bSBvZiBib3VuZGluZyBib3hlcyBvZiBlbGVtZW50ICh0aGUgZGlzcGxheWVkIHdpZHRoIG9mIHRoZSBlbGVtZW50LFxuXHQvLyAgICAgIGluY2x1ZGluZyBwYWRkaW5nIGFuZCBib3JkZXIpLiBGcmFjdGlvbmFsLiBBcHBsaWVzIHRyYW5zZm9ybWF0aW9ucy5cblx0Ly8gICAgY2xpZW50V2lkdGg6IHZpc2libGUgd2lkdGggb2YgZWxlbWVudCBpbmNsdWRpbmcgcGFkZGluZyAoYnV0IG5vdCBib3JkZXIpLiBFWENFUFQgb24gcm9vdCBlbGVtZW50IChodG1sKSwgd2hlcmVcblx0Ly8gICAgICBpdCBpcyB0aGUgd2lkdGggb2YgdGhlIHZpZXdwb3J0LiBSb3VuZHMgdG8gYW4gaW50ZWdlci4gRG9lc24ndCBhcHBseSB0cmFuc2Zvcm1hdGlvbnMuXG5cdC8vICAgIG9mZnNldFdpZHRoOiB2aXNpYmxlIHdpZHRoIG9mIGVsZW1lbnQgaW5jbHVkaW5nIHBhZGRpbmcsIGJvcmRlciwgYW5kIHNjcm9sbGJhcnMgKGlmIGFueSkuIFJvdW5kcyB0byBhbiBpbnRlZ2VyLlxuXHQvLyAgICAgIERvZXNuJ3QgYXBwbHkgdHJhbnNmb3JtYXRpb25zLlxuXHQvLyAgICBzY3JvbGxXaWR0aDogZW50aXJlIHdpZHRoIG9mIGVsZW1lbnQsIGluY2x1ZGluZyBhbnkgcGFydCB0aGF0J3Mgbm90IHZpc2libGUgZHVlIHRvIHNjcm9sbGJhcnMuIFJvdW5kcyB0b1xuXHQvLyAgICAgIGFuIGludGVnZXIuIERvZXNuJ3QgYXBwbHkgdHJhbnNmb3JtYXRpb25zLiBOb3QgY2xlYXIgaWYgaXQgaW5jbHVkZXMgc2Nyb2xsYmFycywgYnV0IEkgdGhpbmsgbm90LiBBbHNvXG5cdC8vICAgICAgbm90IGNsZWFyIGlmIGl0IGluY2x1ZGVzIGJvcmRlcnMgb3IgcGFkZGluZy4gKEJ1dCBmcm9tIHRlc3RzLCBhcHBhcmVudGx5IG5vdCBib3JkZXJzLiBFeGNlcHQgb24gcm9vdFxuXHQvLyAgICAgIGVsZW1lbnQgYW5kIGJvZHkgZWxlbWVudCwgd2hpY2ggaGF2ZSBzcGVjaWFsIHJlc3VsdHMgdGhhdCB2YXJ5IGJ5IGJyb3dzZXIuKVxuXG5cdC8vIFRFU1QgUkVTVUxUUzogV0lEVEhcblx0Ly8gICDinJQgPSBjb3JyZWN0IGFuc3dlclxuXHQvLyAgIOKcmCA9IGluY29ycmVjdCBhbnN3ZXIgYW5kIGRpdmVyZ2VzIGZyb20gc3BlY1xuXHQvLyAgIH4gPSBpbmNvcnJlY3QgYW5zd2VyLCBidXQgbWF0Y2hlcyBzcGVjXG5cdC8vIEJST1dTRVJTIFRFU1RFRDogU2FmYXJpIDYuMi4wIChNYWMgT1MgWCAxMC44LjUpOyBNb2JpbGUgU2FmYXJpIDcuMC4wIChpT1MgNy4xKTsgRmlyZWZveCAzMi4wLjAgKE1hYyBPUyBYIDEwLjgpO1xuXHQvLyAgICBGaXJlZm94IDMzLjAuMCAoV2luZG93cyA3KTsgQ2hyb21lIDM4LjAuMjEyNSAoTWFjIE9TIFggMTAuOC41KTsgQ2hyb21lIDM4LjAuMjEyNSAoV2luZG93cyA3KTsgSUUgOCwgOSwgMTAsIDExXG5cblx0Ly8gaHRtbCB3aWR0aCBzdHlsZSBzbWFsbGVyIHRoYW4gdmlld3BvcnQgd2lkdGg7IGJvZHkgd2lkdGggc3R5bGUgc21hbGxlciB0aGFuIGh0bWwgd2lkdGggc3R5bGVcblx0Ly8gIE5PVEU6IFRoZXNlIHRlc3RzIHdlcmUgY29uZHVjdGVkIHdoZW4gY29ycmVjdCByZXN1bHQgd2FzIHdpZHRoIG9mIGJvcmRlci4gVGhhdCBoYXMgYmVlbiBjaGFuZ2VkXG5cdC8vICB0byBcIndpZHRoIG9mIHZpZXdwb3J0LlwiXG5cdC8vICAgIGh0bWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGhcblx0Ly8gICAgICDinJggSUUgOCwgOSwgMTA6IHdpZHRoIG9mIHZpZXdwb3J0XG5cdC8vICAgICAg4pyUIFNhZmFyaSwgTW9iaWxlIFNhZmFyaSwgQ2hyb21lLCBGaXJlZm94LCBJRSAxMTogd2lkdGggb2YgaHRtbCwgaW5jbHVkaW5nIGJvcmRlclxuXHQvLyAgICBodG1sLmNsaWVudFdpZHRoXG5cdC8vICAgICAgfiBTYWZhcmksIE1vYmlsZSBTYWZhcmksIENocm9tZSwgRmlyZWZveCwgSUUgOCwgOSwgMTAsIDExOiB3aWR0aCBvZiB2aWV3cG9ydFxuXHQvLyAgICBodG1sLm9mZnNldFdpZHRoXG5cdC8vICAgICAg4pyYIElFIDgsIDksIDEwOiB3aWR0aCBvZiB2aWV3cG9ydFxuXHQvLyAgICAgIOKclCBTYWZhcmksIE1vYmlsZSBTYWZhcmksIENocm9tZSwgRmlyZWZveCwgSUUgMTE6IHdpZHRoIG9mIGh0bWwsIGluY2x1ZGluZyBib3JkZXJcblx0Ly8gICAgaHRtbC5zY3JvbGxXaWR0aFxuXHQvLyAgICAgIOKcmCBJRSA4LCA5LCAxMCwgMTEsIEZpcmVmb3g6IHdpZHRoIG9mIHZpZXdwb3J0XG5cdC8vICAgICAgfiBTYWZhcmksIE1vYmlsZSBTYWZhcmksIENocm9tZTogd2lkdGggb2YgaHRtbCwgZXhjbHVkaW5nIGJvcmRlclxuXHQvLyAgICBib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXG5cdC8vICAgICAgfiBTYWZhcmksIE1vYmlsZSBTYWZhcmksIENocm9tZSwgRmlyZWZveCwgSUUgOCwgOSwgMTAsIDExOiB3aWR0aCBvZiBib2R5LCBpbmNsdWRpbmcgYm9yZGVyXG5cdC8vICAgIGJvZHkuY2xpZW50V2lkdGhcblx0Ly8gICAgICB+IFNhZmFyaSwgTW9iaWxlIFNhZmFyaSwgQ2hyb21lLCBGaXJlZm94LCBJRSA4LCA5LCAxMCwgMTE6IHdpZHRoIG9mIGJvZHksIGV4Y2x1ZGluZyBib3JkZXJcblx0Ly8gICAgYm9keS5vZmZzZXRXaWR0aFxuXHQvLyAgICAgIH4gU2FmYXJpLCBNb2JpbGUgU2FmYXJpLCBDaHJvbWUsIEZpcmVmb3gsIElFIDgsIDksIDEwLCAxMTogd2lkdGggb2YgYm9keSwgaW5jbHVkaW5nIGJvcmRlclxuXHQvLyAgICBib2R5LnNjcm9sbFdpZHRoXG5cdC8vICAgICAg4pyYIFNhZmFyaSwgTW9iaWxlIFNhZmFyaSwgQ2hyb21lOiB3aWR0aCBvZiB2aWV3cG9ydFxuXHQvLyAgICAgIH4gRmlyZWZveCwgSUUgOCwgOSwgMTAsIDExOiB3aWR0aCBvZiBib2R5LCBleGNsdWRpbmcgYm9yZGVyXG5cblx0Ly8gZWxlbWVudCB3aWR0aCBzdHlsZSB3aWRlciB0aGFuIHZpZXdwb3J0OyBib2R5IGFuZCBodG1sIHdpZHRoIHN0eWxlcyBhdCBkZWZhdWx0XG5cdC8vIEJST1dTRVIgQkVIQVZJT1I6IGh0bWwgYW5kIGJvZHkgYm9yZGVyIGV4dGVuZCB0byB3aWR0aCBvZiB2aWV3cG9ydCBhbmQgbm90IGJleW9uZCAoZXhjZXB0IG9uIE1vYmlsZSBTYWZhcmkpXG5cdC8vIENvcnJlY3QgcmVzdWx0IGlzIGVsZW1lbnQgd2lkdGggKyBib2R5IGJvcmRlci1sZWZ0ICsgaHRtbCBib3JkZXItbGVmdCAoZXhjZXB0IG9uIE1vYmlsZSBTYWZhcmkpXG5cdC8vIE1vYmlsZSBTYWZhcmkgdXNlcyBhIGxheW91dCB2aWV3cG9ydCwgc28gaXQncyBleHBlY3RlZCB0byBpbmNsdWRlIGJvZHkgYm9yZGVyLXJpZ2h0IGFuZCBodG1sIGJvcmRlci1yaWdodC5cblx0Ly8gICAgaHRtbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxuXHQvLyAgICAgIOKclCBNb2JpbGUgU2FmYXJpOiBlbGVtZW50IHdpZHRoICsgYm9keSBib3JkZXIgKyBodG1sIGJvcmRlclxuXHQvLyAgICAgIH4gU2FmYXJpLCBDaHJvbWUsIEZpcmVmb3gsIElFIDgsIDksIDEwLCAxMTogdmlld3BvcnQgd2lkdGhcblx0Ly8gICAgaHRtbC5jbGllbnRXaWR0aFxuXHQvLyAgICAgIOKclCBNb2JpbGUgU2FmYXJpOiBlbGVtZW50IHdpZHRoICsgYm9keSBib3JkZXIgKyBodG1sIGJvcmRlclxuXHQvLyAgICAgIH4gU2FmYXJpLCBDaHJvbWUsIEZpcmVmb3gsIElFIDgsIDksIDEwLCAxMTogdmlld3BvcnQgd2lkdGhcblx0Ly8gICAgaHRtbC5vZmZzZXRXaWR0aFxuXHQvLyAgICAgIOKclCBNb2JpbGUgU2FmYXJpOiBlbGVtZW50IHdpZHRoICsgYm9keSBib3JkZXIgKyBodG1sIGJvcmRlclxuXHQvLyAgICAgIH4gU2FmYXJpLCBDaHJvbWUsIEZpcmVmb3gsIElFIDgsIDksIDEwLCAxMTogdmlld3BvcnQgd2lkdGhcblx0Ly8gICAgaHRtbC5zY3JvbGxXaWR0aFxuXHQvLyAgICAgIOKclCBNb2JpbGUgU2FmYXJpOiBlbGVtZW50IHdpZHRoICsgYm9keSBib3JkZXIgKyBodG1sIGJvcmRlclxuXHQvLyAgICAgIOKcmCBTYWZhcmksIENocm9tZTogZWxlbWVudCB3aWR0aCArIGJvZHkgYm9yZGVyLWxlZnQgKEJVVCBOT1QgaHRtbCBib3JkZXItbGVmdClcblx0Ly8gICAgICDinJQgRmlyZWZveCwgSUUgOCwgOSwgMTAsIDExOiBlbGVtZW50IHdpZHRoICsgYm9keSBib3JkZXItbGVmdCArIGh0bWwgYm9yZGVyLWxlZnRcblx0Ly8gICAgYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxuXHQvLyAgICAgIH4gTW9iaWxlIFNhZmFyaTogZWxlbWVudCB3aWR0aCArIGJvZHkgYm9yZGVyXG5cdC8vICAgICAgfiBTYWZhcmksIENocm9tZSwgRmlyZWZveCwgSUUgOCwgOSwgMTAsIDExOiB2aWV3cG9ydCB3aWR0aCAtIGh0bWwgYm9yZGVyXG5cdC8vICAgIGJvZHkuY2xpZW50V2lkdGhcblx0Ly8gICAgICB+IE1vYmlsZSBTYWZhcmk6IGVsZW1lbnQgd2lkdGhcblx0Ly8gICAgICB+IFNhZmFyaSwgQ2hyb21lLCBGaXJlZm94LCBJRSA4LCA5LCAxMCwgMTE6IHZpZXdwb3J0IHdpZHRoIC0gaHRtbCBib3JkZXIgLSBib2R5IGJvcmRlclxuXHQvLyAgICBib2R5Lm9mZnNldFdpZHRoXG5cdC8vICAgICAgfiBNb2JpbGUgU2FmYXJpOiBlbGVtZW50IHdpZHRoICsgYm9keSBib3JkZXJcblx0Ly8gICAgICB+IFNhZmFyaSwgQ2hyb21lLCBGaXJlZm94LCBJRSA4LCA5LCAxMCwgMTE6IHZpZXdwb3J0IHdpZHRoIC0gaHRtbCBib3JkZXJcblx0Ly8gICAgYm9keS5zY3JvbGxXaWR0aFxuXHQvLyAgICAgIOKclCBNb2JpbGUgU2FmYXJpOiBlbGVtZW50IHdpZHRoICsgYm9keSBib3JkZXIgKyBodG1sIGJvcmRlclxuXHQvLyAgICAgIOKclCBTYWZhcmksIENocm9tZTogZWxlbWVudCB3aWR0aCArIGJvZHkgYm9yZGVyLWxlZnQgKyBodG1sIGJvcmRlci1sZWZ0IChtYXRjaGVzIGFjdHVhbCBicm93c2VyKVxuXHQvLyAgICAgIH4gRmlyZWZveCwgSUUgOCwgOSwgMTAsIDExOiBlbGVtZW50IHdpZHRoXG5cblx0Ly8gVEVTVCBSRVNVTFRTOiBIRUlHSFRcblx0Ly8gICDinJQgPSBjb3JyZWN0IGFuc3dlclxuXHQvLyAgIOKcmCA9IGluY29ycmVjdCBhbnN3ZXIgYW5kIGRpdmVyZ2VzIGZyb20gc3BlY1xuXHQvLyAgIH4gPSBpbmNvcnJlY3QgYW5zd2VyLCBidXQgbWF0Y2hlcyBzcGVjXG5cblx0Ly8gaHRtbCBoZWlnaHQgc3R5bGUgc21hbGxlciB0aGFuIHZpZXdwb3J0IGhlaWdodDsgYm9keSBoZWlnaHQgc3R5bGUgc21hbGxlciB0aGFuIGh0bWwgaGVpZ2h0IHN0eWxlXG5cdC8vICBOT1RFOiBUaGVzZSB0ZXN0cyB3ZXJlIGNvbmR1Y3RlZCB3aGVuIGNvcnJlY3QgcmVzdWx0IHdhcyBoZWlnaHQgb2Ygdmlld3BvcnQuXG5cdC8vICAgIGh0bWwuY2xpZW50SGVpZ2h0XG5cdC8vICAgICAg4pyUIFNhZmFyaSwgTW9iaWxlIFNhZmFyaSwgQ2hyb21lLCBGaXJlZm94LCBJRSA4LCA5LCAxMCwgMTE6IGhlaWdodCBvZiB2aWV3cG9ydFxuXG5cdC8vIGVsZW1lbnQgaGVpZ2h0IHN0eWxlIHRhbGxlciB0aGFuIHZpZXdwb3J0OyBib2R5IGFuZCBodG1sIHdpZHRoIHN0eWxlcyBhdCBkZWZhdWx0XG5cdC8vIEJST1dTRVIgQkVIQVZJT1I6IGh0bWwgYW5kIGJvZHkgYm9yZGVyIGVuY2xvc2UgZW50aXJlIGVsZW1lbnRcblx0Ly8gQ29ycmVjdCByZXN1bHQgaXMgZWxlbWVudCB3aWR0aCArIGJvZHkgYm9yZGVyLXRvcCArIGh0bWwgYm9yZGVyLXRvcCArIGJvZHkgYm9yZGVyLWJvdHRvbSArIGh0bWwgYm9yZGVyLWJvdHRvbVxuXHQvLyAgICBodG1sLmNsaWVudEhlaWdodFxuXHQvLyAgICAgIOKclCBNb2JpbGUgU2FmYXJpOiBlbGVtZW50IGhlaWdodCArIGFsbCBib3JkZXJzXG5cdC8vICAgICAgfiBTYWZhcmksIENocm9tZSwgRmlyZWZveCwgSUUgOCwgOSwgMTAsIDExOiBoZWlnaHQgb2Ygdmlld3BvcnRcblx0Ly8gICAgaHRtbC5zY3JvbGxIZWlnaHRcblx0Ly8gICAgICDinJQgRmlyZWZveCwgSUUgOCwgOSwgMTAsIDExOiBlbGVtZW50IGhlaWdodCArIGFsbCBib3JkZXJzXG5cdC8vICAgICAg4pyYIFNhZmFyaSwgTW9iaWxlIFNhZmFyaSwgQ2hyb21lOiBlbGVtZW50IGhlaWdodCArIGh0bWwgYm9yZGVyLWJvdHRvbVxuXHQvLyAgICBib2R5LnNjcm9sbEhlaWdodFxuXHQvLyAgICAgIOKclCBTYWZhcmksIE1vYmlsZSBTYWZhcmksIENocm9tZTogZWxlbWVudCBoZWlnaHQgKyBhbGwgYm9yZGVyc1xuXHQvLyAgICAgIH4gRmlyZWZveCwgSUUgOCwgOSwgMTAsIDExOiBlbGVtZW50IGhlaWdodCAoYm9keSBoZWlnaHQgLSBib2R5IGJvcmRlcilcblxuXHR2YXIgZG9jdW1lbnQgPSB0aGlzLl9mcmFtZS50b0RvbUVsZW1lbnQoKS5jb250ZW50RG9jdW1lbnQ7XG5cdHZhciBodG1sID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXHR2YXIgYm9keSA9IGRvY3VtZW50LmJvZHk7XG5cblx0Ly8gQkVTVCBXSURUSCBBTlNXRVIgU08gRkFSIChBU1NVTUlORyBWSUVXUE9SVCBJUyBNSU5JTVVNIEFOU1dFUik6XG5cdHZhciB3aWR0aCA9IE1hdGgubWF4KGJvZHkuc2Nyb2xsV2lkdGgsIGh0bWwuc2Nyb2xsV2lkdGgpO1xuXG5cdC8vIEJFU1QgSEVJR0hUIEFOU1dFUiBTTyBGQVIgKEFTU1VNSU5HIFZJRVdQT1JUIElTIE1JTklNVU0gQU5TV0VSKTpcblx0dmFyIGhlaWdodCA9IE1hdGgubWF4KGJvZHkuc2Nyb2xsSGVpZ2h0LCBodG1sLnNjcm9sbEhlaWdodCk7XG5cblx0cmV0dXJuIFNpemUuY3JlYXRlKHRoaXMuX2RpbWVuc2lvbiA9PT0gWF9ESU1FTlNJT04gPyB3aWR0aCA6IGhlaWdodCk7XG59O1xuXG5NZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtdKTtcblxuXHRyZXR1cm4gdGhpcy5fZGltZW5zaW9uICsgXCIgb2YgcGFnZVwiO1xufTtcblxuZnVuY3Rpb24gZmFjdG9yeUZuKGRpbWVuc2lvbikge1xuXHRyZXR1cm4gZnVuY3Rpb24gZmFjdG9yeShmcmFtZSkge1xuXHRcdHJldHVybiBuZXcgTWUoZGltZW5zaW9uLCBmcmFtZSk7XG5cdH07XG59IiwiLy8gQ29weXJpZ2h0IChjKSAyMDE0IFRpdGFuaXVtIEkuVC4gTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBGb3IgbGljZW5zZSwgc2VlIFwiUkVBRE1FXCIgb3IgXCJMSUNFTlNFXCIgZmlsZS5cbi8qanNoaW50IG5ld2NhcDpmYWxzZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBlbnN1cmUgPSByZXF1aXJlKFwiLi4vdXRpbC9lbnN1cmUuanNcIik7XG52YXIgb29wID0gcmVxdWlyZShcIi4uL3V0aWwvb29wLmpzXCIpO1xudmFyIERlc2NyaXB0b3IgPSByZXF1aXJlKFwiLi9kZXNjcmlwdG9yLmpzXCIpO1xudmFyIFBvc2l0aW9uID0gcmVxdWlyZShcIi4uL3ZhbHVlcy9wb3NpdGlvbi5qc1wiKTtcblxuZnVuY3Rpb24gUmVsYXRpdmVQb3NpdGlvbigpIHtcblx0cmV0dXJuIHJlcXVpcmUoXCIuL3JlbGF0aXZlX3Bvc2l0aW9uLmpzXCIpOyAgIFx0Ly8gYnJlYWsgY2lyY3VsYXIgZGVwZW5kZW5jeVxufVxuXG52YXIgWF9ESU1FTlNJT04gPSBcInhcIjtcbnZhciBZX0RJTUVOU0lPTiA9IFwieVwiO1xuXG52YXIgTWUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFBvc2l0aW9uRGVzY3JpcHRvcihkaW1lbnNpb24pIHtcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFsgU3RyaW5nIF0pO1xuXHRlbnN1cmUudW5yZWFjaGFibGUoXCJQb3NpdGlvbkRlc2NyaXB0b3IgaXMgYWJzdHJhY3QgYW5kIHNob3VsZCBub3QgYmUgY29uc3RydWN0ZWQgZGlyZWN0bHkuXCIpO1xufTtcbkRlc2NyaXB0b3IuZXh0ZW5kKE1lKTtcbk1lLmV4dGVuZCA9IG9vcC5leHRlbmRGbihNZSk7XG5cbk1lLnggPSBmYWN0b3J5Rm4oWF9ESU1FTlNJT04pO1xuTWUueSA9IGZhY3RvcnlGbihZX0RJTUVOU0lPTik7XG5cbk1lLnByb3RvdHlwZS5wbHVzID0gZnVuY3Rpb24gcGx1cyhhbW91bnQpIHtcblx0aWYgKHRoaXMuX3BkYmMuZGltZW5zaW9uID09PSBYX0RJTUVOU0lPTikgcmV0dXJuIFJlbGF0aXZlUG9zaXRpb24oKS5yaWdodCh0aGlzLCBhbW91bnQpO1xuXHRlbHNlIHJldHVybiBSZWxhdGl2ZVBvc2l0aW9uKCkuZG93bih0aGlzLCBhbW91bnQpO1xufTtcblxuTWUucHJvdG90eXBlLm1pbnVzID0gZnVuY3Rpb24gbWludXMoYW1vdW50KSB7XG5cdGlmICh0aGlzLl9wZGJjLmRpbWVuc2lvbiA9PT0gWF9ESU1FTlNJT04pIHJldHVybiBSZWxhdGl2ZVBvc2l0aW9uKCkubGVmdCh0aGlzLCBhbW91bnQpO1xuXHRlbHNlIHJldHVybiBSZWxhdGl2ZVBvc2l0aW9uKCkudXAodGhpcywgYW1vdW50KTtcbn07XG5cbk1lLnByb3RvdHlwZS5jb252ZXJ0ID0gZnVuY3Rpb24gY29udmVydChhcmcsIHR5cGUpIHtcblx0c3dpdGNoICh0eXBlKSB7XG5cdFx0Y2FzZSBcIm51bWJlclwiOiByZXR1cm4gdGhpcy5fcGRiYy5kaW1lbnNpb24gPT09IFhfRElNRU5TSU9OID8gUG9zaXRpb24ueChhcmcpIDogUG9zaXRpb24ueShhcmcpO1xuXHRcdGNhc2UgXCJzdHJpbmdcIjpcblx0XHRcdGlmIChhcmcgPT09IFwibm9uZVwiKSByZXR1cm4gdGhpcy5fcGRiYy5kaW1lbnNpb24gPT09IFhfRElNRU5TSU9OID8gUG9zaXRpb24ubm9YKCkgOiBQb3NpdGlvbi5ub1koKTtcblx0XHRcdGVsc2UgcmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdGJyZWFrO1xuXHRcdGRlZmF1bHQ6IHJldHVybiB1bmRlZmluZWQ7XG5cdH1cbn07XG5cbmZ1bmN0aW9uIGZhY3RvcnlGbihkaW1lbnNpb24pIHtcblx0cmV0dXJuIGZ1bmN0aW9uIGZhY3Rvcnkoc2VsZikge1xuXHRcdC8vIF9wZGJjOiBcIlBvc2l0aW9uRGVzY3JpcHRvciBiYXNlIGNsYXNzLlwiIEFuIGF0dGVtcHQgdG8gcHJldmVudCBuYW1lIGNvbmZsaWN0cy5cblx0XHRzZWxmLl9wZGJjID0geyBkaW1lbnNpb246IGRpbWVuc2lvbiB9O1xuXHR9O1xufVxuIiwiLy8gQ29weXJpZ2h0IChjKSAyMDE0IFRpdGFuaXVtIEkuVC4gTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBGb3IgbGljZW5zZSwgc2VlIFwiUkVBRE1FXCIgb3IgXCJMSUNFTlNFXCIgZmlsZS5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgZW5zdXJlID0gcmVxdWlyZShcIi4uL3V0aWwvZW5zdXJlLmpzXCIpO1xudmFyIFBvc2l0aW9uID0gcmVxdWlyZShcIi4uL3ZhbHVlcy9wb3NpdGlvbi5qc1wiKTtcbnZhciBEZXNjcmlwdG9yID0gcmVxdWlyZShcIi4vZGVzY3JpcHRvci5qc1wiKTtcbnZhciBQb3NpdGlvbkRlc2NyaXB0b3IgPSByZXF1aXJlKFwiLi9wb3NpdGlvbl9kZXNjcmlwdG9yLmpzXCIpO1xudmFyIFZhbHVlID0gcmVxdWlyZShcIi4uL3ZhbHVlcy92YWx1ZS5qc1wiKTtcbnZhciBTaXplID0gcmVxdWlyZShcIi4uL3ZhbHVlcy9zaXplLmpzXCIpO1xudmFyIFBpeGVscyA9IHJlcXVpcmUoXCIuLi92YWx1ZXMvcGl4ZWxzLmpzXCIpO1xudmFyIEVsZW1lbnRTaXplID0gcmVxdWlyZShcIi4vZWxlbWVudF9zaXplLmpzXCIpO1xuXG52YXIgWF9ESU1FTlNJT04gPSBcInhcIjtcbnZhciBZX0RJTUVOU0lPTiA9IFwieVwiO1xudmFyIFBMVVMgPSAxO1xudmFyIE1JTlVTID0gLTE7XG5cbnZhciBNZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUmVsYXRpdmVQb3NpdGlvbihkaW1lbnNpb24sIGRpcmVjdGlvbiwgcmVsYXRpdmVUbywgcmVsYXRpdmVBbW91bnQpIHtcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFsgU3RyaW5nLCBOdW1iZXIsIERlc2NyaXB0b3IsIFtOdW1iZXIsIERlc2NyaXB0b3IsIFZhbHVlXSBdKTtcblxuXHRpZiAoZGltZW5zaW9uID09PSBYX0RJTUVOU0lPTikgUG9zaXRpb25EZXNjcmlwdG9yLngodGhpcyk7XG5cdGVsc2UgaWYgKGRpbWVuc2lvbiA9PT0gWV9ESU1FTlNJT04pIFBvc2l0aW9uRGVzY3JpcHRvci55KHRoaXMpO1xuXHRlbHNlIGVuc3VyZS51bnJlYWNoYWJsZShcIlVua25vd24gZGltZW5zaW9uOiBcIiArIGRpbWVuc2lvbik7XG5cblx0dGhpcy5fZGltZW5zaW9uID0gZGltZW5zaW9uO1xuXHR0aGlzLl9kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG5cdHRoaXMuX3JlbGF0aXZlVG8gPSByZWxhdGl2ZVRvO1xuXG5cdGlmICh0eXBlb2YgcmVsYXRpdmVBbW91bnQgPT09IFwibnVtYmVyXCIpIHtcblx0XHRpZiAocmVsYXRpdmVBbW91bnQgPCAwKSB0aGlzLl9kaXJlY3Rpb24gKj0gLTE7XG5cdFx0dGhpcy5fYW1vdW50ID0gU2l6ZS5jcmVhdGUoTWF0aC5hYnMocmVsYXRpdmVBbW91bnQpKTtcblx0fVxuXHRlbHNlIHtcblx0XHR0aGlzLl9hbW91bnQgPSByZWxhdGl2ZUFtb3VudDtcblx0fVxufTtcblBvc2l0aW9uRGVzY3JpcHRvci5leHRlbmQoTWUpO1xuXG5NZS5yaWdodCA9IGNyZWF0ZUZuKFhfRElNRU5TSU9OLCBQTFVTKTtcbk1lLmRvd24gPSBjcmVhdGVGbihZX0RJTUVOU0lPTiwgUExVUyk7XG5NZS5sZWZ0ID0gY3JlYXRlRm4oWF9ESU1FTlNJT04sIE1JTlVTKTtcbk1lLnVwID0gY3JlYXRlRm4oWV9ESU1FTlNJT04sIE1JTlVTKTtcblxuZnVuY3Rpb24gY3JlYXRlRm4oZGltZW5zaW9uLCBkaXJlY3Rpb24pIHtcblx0cmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZShyZWxhdGl2ZVRvLCByZWxhdGl2ZUFtb3VudCkge1xuXHRcdHJldHVybiBuZXcgTWUoZGltZW5zaW9uLCBkaXJlY3Rpb24sIHJlbGF0aXZlVG8sIHJlbGF0aXZlQW1vdW50KTtcblx0fTtcbn1cblxuTWUucHJvdG90eXBlLnZhbHVlID0gZnVuY3Rpb24gdmFsdWUoKSB7XG5cdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbXSk7XG5cblx0dmFyIGJhc2VWYWx1ZSA9IHRoaXMuX3JlbGF0aXZlVG8udmFsdWUoKTtcblx0dmFyIHJlbGF0aXZlVmFsdWUgPSB0aGlzLl9hbW91bnQudmFsdWUoKTtcblxuXHRpZiAodGhpcy5fZGlyZWN0aW9uID09PSBQTFVTKSByZXR1cm4gYmFzZVZhbHVlLnBsdXMocmVsYXRpdmVWYWx1ZSk7XG5cdGVsc2UgcmV0dXJuIGJhc2VWYWx1ZS5taW51cyhyZWxhdGl2ZVZhbHVlKTtcbn07XG5cbk1lLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW10pO1xuXG5cdHZhciBiYXNlID0gdGhpcy5fcmVsYXRpdmVUby50b1N0cmluZygpO1xuXHRpZiAodGhpcy5fYW1vdW50LmVxdWFscyhTaXplLmNyZWF0ZSgwKSkpIHJldHVybiBiYXNlO1xuXG5cdHZhciByZWxhdGlvbiA9IHRoaXMuX2Ftb3VudC50b1N0cmluZygpO1xuXHRpZiAodGhpcy5fZGltZW5zaW9uID09PSBYX0RJTUVOU0lPTikgcmVsYXRpb24gKz0gKHRoaXMuX2RpcmVjdGlvbiA9PT0gUExVUykgPyBcIiB0byByaWdodCBvZiBcIiA6IFwiIHRvIGxlZnQgb2YgXCI7XG5cdGVsc2UgcmVsYXRpb24gKz0gKHRoaXMuX2RpcmVjdGlvbiA9PT0gUExVUykgPyBcIiBiZWxvdyBcIiA6IFwiIGFib3ZlIFwiO1xuXG5cdHJldHVybiByZWxhdGlvbiArIGJhc2U7XG59O1xuIiwiLy8gQ29weXJpZ2h0IChjKSAyMDE0IFRpdGFuaXVtIEkuVC4gTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBGb3IgbGljZW5zZSwgc2VlIFwiUkVBRE1FXCIgb3IgXCJMSUNFTlNFXCIgZmlsZS5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgZW5zdXJlID0gcmVxdWlyZShcIi4uL3V0aWwvZW5zdXJlLmpzXCIpO1xudmFyIFNpemUgPSByZXF1aXJlKFwiLi4vdmFsdWVzL3NpemUuanNcIik7XG52YXIgRGVzY3JpcHRvciA9IHJlcXVpcmUoXCIuL2Rlc2NyaXB0b3IuanNcIik7XG52YXIgU2l6ZURlc2NyaXB0b3IgPSByZXF1aXJlKFwiLi9zaXplX2Rlc2NyaXB0b3IuanNcIik7XG52YXIgVmFsdWUgPSByZXF1aXJlKFwiLi4vdmFsdWVzL3ZhbHVlLmpzXCIpO1xudmFyIFNpemVNdWx0aXBsZSA9IHJlcXVpcmUoXCIuL3NpemVfbXVsdGlwbGUuanNcIik7XG5cbnZhciBQTFVTID0gMTtcbnZhciBNSU5VUyA9IC0xO1xuXG52YXIgTWUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFJlbGF0aXZlU2l6ZShkaXJlY3Rpb24sIHJlbGF0aXZlVG8sIGFtb3VudCkge1xuXHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgWyBOdW1iZXIsIERlc2NyaXB0b3IsIFtOdW1iZXIsIERlc2NyaXB0b3IsIFZhbHVlXSBdKTtcblxuXHR0aGlzLl9kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG5cdHRoaXMuX3JlbGF0aXZlVG8gPSByZWxhdGl2ZVRvO1xuXG5cdGlmICh0eXBlb2YgYW1vdW50ID09PSBcIm51bWJlclwiKSB7XG5cdFx0dGhpcy5fYW1vdW50ID0gU2l6ZS5jcmVhdGUoTWF0aC5hYnMoYW1vdW50KSk7XG5cdFx0aWYgKGFtb3VudCA8IDApIHRoaXMuX2RpcmVjdGlvbiAqPSAtMTtcblx0fVxuXHRlbHNlIHtcblx0XHR0aGlzLl9hbW91bnQgPSBhbW91bnQ7XG5cdH1cbn07XG5TaXplRGVzY3JpcHRvci5leHRlbmQoTWUpO1xuXG5NZS5sYXJnZXIgPSBmYWN0b3J5Rm4oUExVUyk7XG5NZS5zbWFsbGVyID0gZmFjdG9yeUZuKE1JTlVTKTtcblxuTWUucHJvdG90eXBlLnZhbHVlID0gZnVuY3Rpb24gdmFsdWUoKSB7XG5cdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbXSk7XG5cblx0dmFyIGJhc2VWYWx1ZSA9IHRoaXMuX3JlbGF0aXZlVG8udmFsdWUoKTtcblx0dmFyIHJlbGF0aXZlVmFsdWUgPSB0aGlzLl9hbW91bnQudmFsdWUoKTtcblxuXHRpZiAodGhpcy5fZGlyZWN0aW9uID09PSBQTFVTKSByZXR1cm4gYmFzZVZhbHVlLnBsdXMocmVsYXRpdmVWYWx1ZSk7XG5cdGVsc2UgcmV0dXJuIGJhc2VWYWx1ZS5taW51cyhyZWxhdGl2ZVZhbHVlKTtcbn07XG5cbk1lLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW10pO1xuXG5cdHZhciBiYXNlID0gdGhpcy5fcmVsYXRpdmVUby50b1N0cmluZygpO1xuXHRpZiAodGhpcy5fYW1vdW50LmVxdWFscyhTaXplLmNyZWF0ZSgwKSkpIHJldHVybiBiYXNlO1xuXG5cdHZhciByZWxhdGlvbiA9IHRoaXMuX2Ftb3VudC50b1N0cmluZygpO1xuXHRpZiAodGhpcy5fZGlyZWN0aW9uID09PSBQTFVTKSByZWxhdGlvbiArPSBcIiBsYXJnZXIgdGhhbiBcIjtcblx0ZWxzZSByZWxhdGlvbiArPSBcIiBzbWFsbGVyIHRoYW4gXCI7XG5cblx0cmV0dXJuIHJlbGF0aW9uICsgYmFzZTtcbn07XG5cbmZ1bmN0aW9uIGZhY3RvcnlGbihkaXJlY3Rpb24pIHtcblx0cmV0dXJuIGZ1bmN0aW9uIGZhY3RvcnkocmVsYXRpdmVUbywgYW1vdW50KSB7XG5cdFx0cmV0dXJuIG5ldyBNZShkaXJlY3Rpb24sIHJlbGF0aXZlVG8sIGFtb3VudCk7XG5cdH07XG59IiwiLy8gQ29weXJpZ2h0IChjKSAyMDE0IFRpdGFuaXVtIEkuVC4gTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBGb3IgbGljZW5zZSwgc2VlIFwiUkVBRE1FXCIgb3IgXCJMSUNFTlNFXCIgZmlsZS5cbi8qanNoaW50IG5ld2NhcDpmYWxzZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBlbnN1cmUgPSByZXF1aXJlKFwiLi4vdXRpbC9lbnN1cmUuanNcIik7XG52YXIgb29wID0gcmVxdWlyZShcIi4uL3V0aWwvb29wLmpzXCIpO1xudmFyIERlc2NyaXB0b3IgPSByZXF1aXJlKFwiLi9kZXNjcmlwdG9yLmpzXCIpO1xudmFyIFNpemUgPSByZXF1aXJlKFwiLi4vdmFsdWVzL3NpemUuanNcIik7XG5cbmZ1bmN0aW9uIFJlbGF0aXZlU2l6ZSgpIHtcblx0cmV0dXJuIHJlcXVpcmUoXCIuL3JlbGF0aXZlX3NpemUuanNcIik7ICAgXHQvLyBicmVhayBjaXJjdWxhciBkZXBlbmRlbmN5XG59XG5cbmZ1bmN0aW9uIFNpemVNdWx0aXBsZSgpIHtcblx0cmV0dXJuIHJlcXVpcmUoXCIuL3NpemVfbXVsdGlwbGUuanNcIik7ICAgXHQvLyBicmVhayBjaXJjdWxhciBkZXBlbmRlbmN5XG59XG5cbnZhciBNZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gU2l6ZURlc2NyaXB0b3IoKSB7XG5cdGVuc3VyZS51bnJlYWNoYWJsZShcIlNpemVEZXNjcmlwdG9yIGlzIGFic3RyYWN0IGFuZCBzaG91bGQgbm90IGJlIGNvbnN0cnVjdGVkIGRpcmVjdGx5LlwiKTtcbn07XG5EZXNjcmlwdG9yLmV4dGVuZChNZSk7XG5NZS5leHRlbmQgPSBvb3AuZXh0ZW5kRm4oTWUpO1xuXG5NZS5wcm90b3R5cGUucGx1cyA9IGZ1bmN0aW9uIHBsdXMoYW1vdW50KSB7XG5cdHJldHVybiBSZWxhdGl2ZVNpemUoKS5sYXJnZXIodGhpcywgYW1vdW50KTtcbn07XG5cbk1lLnByb3RvdHlwZS5taW51cyA9IGZ1bmN0aW9uIG1pbnVzKGFtb3VudCkge1xuXHRyZXR1cm4gUmVsYXRpdmVTaXplKCkuc21hbGxlcih0aGlzLCBhbW91bnQpO1xufTtcblxuTWUucHJvdG90eXBlLnRpbWVzID0gZnVuY3Rpb24gdGltZXMoYW1vdW50KSB7XG5cdHJldHVybiBTaXplTXVsdGlwbGUoKS5jcmVhdGUodGhpcywgYW1vdW50KTtcbn07XG5cbk1lLnByb3RvdHlwZS5jb252ZXJ0ID0gZnVuY3Rpb24gY29udmVydChhcmcsIHR5cGUpIHtcblx0c3dpdGNoKHR5cGUpIHtcblx0XHRjYXNlIFwibnVtYmVyXCI6IHJldHVybiBTaXplLmNyZWF0ZShhcmcpO1xuXHRcdGNhc2UgXCJzdHJpbmdcIjogcmV0dXJuIGFyZyA9PT0gXCJub25lXCIgPyBTaXplLmNyZWF0ZU5vbmUoKSA6IHVuZGVmaW5lZDtcblx0XHRkZWZhdWx0OiByZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG59O1xuIiwiLy8gQ29weXJpZ2h0IChjKSAyMDE0IFRpdGFuaXVtIEkuVC4gTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBGb3IgbGljZW5zZSwgc2VlIFwiUkVBRE1FXCIgb3IgXCJMSUNFTlNFXCIgZmlsZS5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgZW5zdXJlID0gcmVxdWlyZShcIi4uL3V0aWwvZW5zdXJlLmpzXCIpO1xudmFyIERlc2NyaXB0b3IgPSByZXF1aXJlKFwiLi9kZXNjcmlwdG9yLmpzXCIpO1xudmFyIFNpemVEZXNjcmlwdG9yID0gcmVxdWlyZShcIi4vc2l6ZV9kZXNjcmlwdG9yLmpzXCIpO1xudmFyIFNpemUgPSByZXF1aXJlKFwiLi4vdmFsdWVzL3NpemUuanNcIik7XG5cbnZhciBNZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gU2l6ZU11bHRpcGxlKHJlbGF0aXZlVG8sIG11bHRpcGxlKSB7XG5cdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbIERlc2NyaXB0b3IsIE51bWJlciBdKTtcblxuXHR0aGlzLl9yZWxhdGl2ZVRvID0gcmVsYXRpdmVUbztcblx0dGhpcy5fbXVsdGlwbGUgPSBtdWx0aXBsZTtcbn07XG5TaXplRGVzY3JpcHRvci5leHRlbmQoTWUpO1xuXG5NZS5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUocmVsYXRpdmVUbywgbXVsdGlwbGUpIHtcblx0cmV0dXJuIG5ldyBNZShyZWxhdGl2ZVRvLCBtdWx0aXBsZSk7XG59O1xuXG5NZS5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbiB2YWx1ZSgpIHtcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtdKTtcblxuXHRyZXR1cm4gdGhpcy5fcmVsYXRpdmVUby52YWx1ZSgpLnRpbWVzKHRoaXMuX211bHRpcGxlKTtcbn07XG5cbk1lLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW10pO1xuXG5cdHZhciBtdWx0aXBsZSA9IHRoaXMuX211bHRpcGxlO1xuXHR2YXIgYmFzZSA9IHRoaXMuX3JlbGF0aXZlVG8udG9TdHJpbmcoKTtcblx0aWYgKG11bHRpcGxlID09PSAxKSByZXR1cm4gYmFzZTtcblxuXHR2YXIgZGVzYztcblx0c3dpdGNoKG11bHRpcGxlKSB7XG5cdFx0Y2FzZSAxLzI6IGRlc2MgPSBcImhhbGYgb2YgXCI7IGJyZWFrO1xuXHRcdGNhc2UgMS8zOiBkZXNjID0gXCJvbmUtdGhpcmQgb2YgXCI7IGJyZWFrO1xuXHRcdGNhc2UgMi8zOiBkZXNjID0gXCJ0d28tdGhpcmRzIG9mIFwiOyBicmVhaztcblx0XHRjYXNlIDEvNDogZGVzYyA9IFwib25lLXF1YXJ0ZXIgb2YgXCI7IGJyZWFrO1xuXHRcdGNhc2UgMy80OiBkZXNjID0gXCJ0aHJlZS1xdWFydGVycyBvZiBcIjsgYnJlYWs7XG5cdFx0Y2FzZSAxLzU6IGRlc2MgPSBcIm9uZS1maWZ0aCBvZiBcIjsgYnJlYWs7XG5cdFx0Y2FzZSAyLzU6IGRlc2MgPSBcInR3by1maWZ0aHMgb2YgXCI7IGJyZWFrO1xuXHRcdGNhc2UgMy81OiBkZXNjID0gXCJ0aHJlZS1maWZ0aHMgb2YgXCI7IGJyZWFrO1xuXHRcdGNhc2UgNC81OiBkZXNjID0gXCJmb3VyLWZpZnRocyBvZiBcIjsgYnJlYWs7XG5cdFx0Y2FzZSAxLzY6IGRlc2MgPSBcIm9uZS1zaXh0aCBvZiBcIjsgYnJlYWs7XG5cdFx0Y2FzZSA1LzY6IGRlc2MgPSBcImZpdmUtc2l4dGhzIG9mIFwiOyBicmVhaztcblx0XHRjYXNlIDEvODogZGVzYyA9IFwib25lLWVpZ2h0aCBvZiBcIjsgYnJlYWs7XG5cdFx0Y2FzZSAzLzg6IGRlc2MgPSBcInRocmVlLWVpZ2h0aHMgb2YgXCI7IGJyZWFrO1xuXHRcdGNhc2UgNS84OiBkZXNjID0gXCJmaXZlLWVpZ2h0aHMgb2YgXCI7IGJyZWFrO1xuXHRcdGNhc2UgNy84OiBkZXNjID0gXCJzZXZlbi1laWdodGhzIG9mIFwiOyBicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0aWYgKG11bHRpcGxlID4gMSkgZGVzYyA9IG11bHRpcGxlICsgXCIgdGltZXMgXCI7XG5cdFx0XHRlbHNlIGRlc2MgPSAobXVsdGlwbGUgKiAxMDApICsgXCIlIG9mIFwiO1xuXHR9XG5cblx0cmV0dXJuIGRlc2MgKyBiYXNlO1xufTsiLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTQgVGl0YW5pdW0gSS5ULiBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIEZvciBsaWNlbnNlLCBzZWUgXCJSRUFETUVcIiBvciBcIkxJQ0VOU0VcIiBmaWxlLlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBlbnN1cmUgPSByZXF1aXJlKFwiLi4vdXRpbC9lbnN1cmUuanNcIik7XG52YXIgUG9zaXRpb25EZXNjcmlwdG9yID0gcmVxdWlyZShcIi4vcG9zaXRpb25fZGVzY3JpcHRvci5qc1wiKTtcbnZhciBQb3NpdGlvbiA9IHJlcXVpcmUoXCIuLi92YWx1ZXMvcG9zaXRpb24uanNcIik7XG5cbnZhciBUT1AgPSBcInRvcFwiO1xudmFyIFJJR0hUID0gXCJyaWdodFwiO1xudmFyIEJPVFRPTSA9IFwiYm90dG9tXCI7XG52YXIgTEVGVCA9IFwibGVmdFwiO1xuXG52YXIgTWUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFZpZXdwb3J0RWRnZShwb3NpdGlvbiwgZnJhbWUpIHtcblx0dmFyIFFGcmFtZSA9IHJlcXVpcmUoXCIuLi9xX2ZyYW1lLmpzXCIpOyAgICAvLyBicmVhayBjaXJjdWxhciBkZXBlbmRlbmN5XG5cdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbIFN0cmluZywgUUZyYW1lIF0pO1xuXG5cdGlmIChwb3NpdGlvbiA9PT0gTEVGVCB8fCBwb3NpdGlvbiA9PT0gUklHSFQpIFBvc2l0aW9uRGVzY3JpcHRvci54KHRoaXMpO1xuXHRlbHNlIGlmIChwb3NpdGlvbiA9PT0gVE9QIHx8IHBvc2l0aW9uID09PSBCT1RUT00pIFBvc2l0aW9uRGVzY3JpcHRvci55KHRoaXMpO1xuXHRlbHNlIGVuc3VyZS51bnJlYWNoYWJsZShcIlVua25vd24gcG9zaXRpb246IFwiICsgcG9zaXRpb24pO1xuXG5cdHRoaXMuX3Bvc2l0aW9uID0gcG9zaXRpb247XG5cdHRoaXMuX2ZyYW1lID0gZnJhbWU7XG59O1xuUG9zaXRpb25EZXNjcmlwdG9yLmV4dGVuZChNZSk7XG5cbk1lLnRvcCA9IGZhY3RvcnlGbihUT1ApO1xuTWUucmlnaHQgPSBmYWN0b3J5Rm4oUklHSFQpO1xuTWUuYm90dG9tID0gZmFjdG9yeUZuKEJPVFRPTSk7XG5NZS5sZWZ0ID0gZmFjdG9yeUZuKExFRlQpO1xuXG5NZS5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbigpIHtcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtdKTtcblxuXHR2YXIgc2Nyb2xsID0gdGhpcy5fZnJhbWUuZ2V0UmF3U2Nyb2xsUG9zaXRpb24oKTtcblx0dmFyIHggPSBQb3NpdGlvbi54KHNjcm9sbC54KTtcblx0dmFyIHkgPSBQb3NpdGlvbi55KHNjcm9sbC55KTtcblxuXHRzd2l0Y2godGhpcy5fcG9zaXRpb24pIHtcblx0XHRjYXNlIFRPUDogcmV0dXJuIHk7XG5cdFx0Y2FzZSBSSUdIVDogcmV0dXJuIHgucGx1cyh0aGlzLl9mcmFtZS52aWV3cG9ydCgpLndpZHRoLnZhbHVlKCkpO1xuXHRcdGNhc2UgQk9UVE9NOiByZXR1cm4geS5wbHVzKHRoaXMuX2ZyYW1lLnZpZXdwb3J0KCkuaGVpZ2h0LnZhbHVlKCkpO1xuXHRcdGNhc2UgTEVGVDogcmV0dXJuIHg7XG5cblx0XHRkZWZhdWx0OiBlbnN1cmUudW5yZWFjaGFibGUoKTtcblx0fVxufTtcblxuTWUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG5cdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbXSk7XG5cdHJldHVybiB0aGlzLl9wb3NpdGlvbiArIFwiIGVkZ2Ugb2Ygdmlld3BvcnRcIjtcbn07XG5cbmZ1bmN0aW9uIGZhY3RvcnlGbihwb3NpdGlvbikge1xuXHRyZXR1cm4gZnVuY3Rpb24gZmFjdG9yeShmcmFtZSkge1xuXHRcdHJldHVybiBuZXcgTWUocG9zaXRpb24sIGZyYW1lKTtcblx0fTtcbn1cbiIsIi8vIENvcHlyaWdodCAoYykgMjAxNCBUaXRhbml1bSBJLlQuIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gRm9yIGxpY2Vuc2UsIHNlZSBcIlJFQURNRVwiIG9yIFwiTElDRU5TRVwiIGZpbGUuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGVuc3VyZSA9IHJlcXVpcmUoXCIuLi91dGlsL2Vuc3VyZS5qc1wiKTtcbnZhciBTaXplRGVzY3JpcHRvciA9IHJlcXVpcmUoXCIuL3NpemVfZGVzY3JpcHRvci5qc1wiKTtcbnZhciBTaXplID0gcmVxdWlyZShcIi4uL3ZhbHVlcy9zaXplLmpzXCIpO1xudmFyIFJlbGF0aXZlU2l6ZSA9IHJlcXVpcmUoXCIuL3JlbGF0aXZlX3NpemUuanNcIik7XG52YXIgU2l6ZU11bHRpcGxlID0gcmVxdWlyZShcIi4vc2l6ZV9tdWx0aXBsZS5qc1wiKTtcblxudmFyIFhfRElNRU5TSU9OID0gXCJ4XCI7XG52YXIgWV9ESU1FTlNJT04gPSBcInlcIjtcblxudmFyIE1lID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBQYWdlU2l6ZShkaW1lbnNpb24sIGZyYW1lKSB7XG5cdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbIFN0cmluZywgT2JqZWN0IF0pO1xuXHRlbnN1cmUudGhhdChkaW1lbnNpb24gPT09IFhfRElNRU5TSU9OIHx8IGRpbWVuc2lvbiA9PT0gWV9ESU1FTlNJT04sIFwiVW5yZWNvZ25pemVkIGRpbWVuc2lvbjogXCIgKyBkaW1lbnNpb24pO1xuXG5cdHRoaXMuX2RpbWVuc2lvbiA9IGRpbWVuc2lvbjtcblx0dGhpcy5fZnJhbWUgPSBmcmFtZTtcbn07XG5TaXplRGVzY3JpcHRvci5leHRlbmQoTWUpO1xuXG5NZS54ID0gZmFjdG9yeUZuKFhfRElNRU5TSU9OKTtcbk1lLnkgPSBmYWN0b3J5Rm4oWV9ESU1FTlNJT04pO1xuXG5NZS5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbigpIHtcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtdKTtcblxuXHQvLyBVU0VGVUwgUkVBRElORzogaHR0cDovL3d3dy5xdWlya3Ntb2RlLm9yZy9tb2JpbGUvdmlld3BvcnRzLmh0bWxcblx0Ly8gYW5kIGh0dHA6Ly93d3cucXVpcmtzbW9kZS5vcmcvbW9iaWxlL3ZpZXdwb3J0czIuaHRtbFxuXG5cdC8vIEJST1dTRVJTIFRFU1RFRDogU2FmYXJpIDYuMi4wIChNYWMgT1MgWCAxMC44LjUpOyBNb2JpbGUgU2FmYXJpIDcuMC4wIChpT1MgNy4xKTsgRmlyZWZveCAzMi4wLjAgKE1hYyBPUyBYIDEwLjgpO1xuXHQvLyAgICBGaXJlZm94IDMzLjAuMCAoV2luZG93cyA3KTsgQ2hyb21lIDM4LjAuMjEyNSAoTWFjIE9TIFggMTAuOC41KTsgQ2hyb21lIDM4LjAuMjEyNSAoV2luZG93cyA3KTsgSUUgOCwgOSwgMTAsIDExXG5cblx0Ly8gV2lkdGggdGVjaG5pcXVlcyBJJ3ZlIHRyaWVkOiAoTm90ZTogcmVzdWx0cyBhcmUgZGlmZmVyZW50IGluIHF1aXJrcyBtb2RlKVxuXHQvLyBib2R5LmNsaWVudFdpZHRoXG5cdC8vIGJvZHkub2Zmc2V0V2lkdGhcblx0Ly8gYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxuXHQvLyAgICBmYWlscyBvbiBhbGwgYnJvd3NlcnM6IGRvZXNuJ3QgaW5jbHVkZSBtYXJnaW5cblx0Ly8gYm9keS5zY3JvbGxXaWR0aFxuXHQvLyAgICB3b3JrcyBvbiBTYWZhcmksIE1vYmlsZSBTYWZhcmksIENocm9tZVxuXHQvLyAgICBmYWlscyBvbiBGaXJlZm94LCBJRSA4LCA5LCAxMCwgMTE6IGRvZXNuJ3QgaW5jbHVkZSBtYXJnaW5cblx0Ly8gaHRtbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxuXHQvLyBodG1sLm9mZnNldFdpZHRoXG5cdC8vICAgIHdvcmtzIG9uIFNhZmFyaSwgTW9iaWxlIFNhZmFyaSwgQ2hyb21lLCBGaXJlZm94XG5cdC8vICAgIGZhaWxzIG9uIElFIDgsIDksIDEwOiBpbmNsdWRlcyBzY3JvbGxiYXJcblx0Ly8gaHRtbC5zY3JvbGxXaWR0aFxuXHQvLyBodG1sLmNsaWVudFdpZHRoXG5cdC8vICAgIFdPUktTISBTYWZhcmksIE1vYmlsZSBTYWZhcmksIENocm9tZSwgRmlyZWZveCwgSUUgOCwgOSwgMTAsIDExXG5cblx0Ly8gSGVpZ2h0IHRlY2huaXF1ZXMgSSd2ZSB0cmllZDogKE5vdGUgdGhhdCByZXN1bHRzIGFyZSBkaWZmZXJlbnQgaW4gcXVpcmtzIG1vZGUpXG5cdC8vIGJvZHkuY2xpZW50SGVpZ2h0XG5cdC8vIGJvZHkub2Zmc2V0SGVpZ2h0XG5cdC8vIGJvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0XG5cdC8vICAgIGZhaWxzIG9uIGFsbCBicm93c2Vyczogb25seSBpbmNsdWRlcyBoZWlnaHQgb2YgY29udGVudFxuXHQvLyBib2R5IGdldENvbXB1dGVkU3R5bGUoXCJoZWlnaHRcIilcblx0Ly8gICAgZmFpbHMgb24gYWxsIGJyb3dzZXJzOiBJRTggcmV0dXJucyBcImF1dG9cIjsgb3RoZXJzIG9ubHkgaW5jbHVkZSBoZWlnaHQgb2YgY29udGVudFxuXHQvLyBib2R5LnNjcm9sbEhlaWdodFxuXHQvLyAgICB3b3JrcyBvbiBTYWZhcmksIE1vYmlsZSBTYWZhcmksIENocm9tZTtcblx0Ly8gICAgZmFpbHMgb24gRmlyZWZveCwgSUUgOCwgOSwgMTAsIDExOiBvbmx5IGluY2x1ZGVzIGhlaWdodCBvZiBjb250ZW50XG5cdC8vIGh0bWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0XG5cdC8vIGh0bWwub2Zmc2V0SGVpZ2h0XG5cdC8vICAgIHdvcmtzIG9uIElFIDgsIDksIDEwXG5cdC8vICAgIGZhaWxzIG9uIElFIDExLCBTYWZhcmksIE1vYmlsZSBTYWZhcmksIENocm9tZTogb25seSBpbmNsdWRlcyBoZWlnaHQgb2YgY29udGVudFxuXHQvLyBodG1sLnNjcm9sbEhlaWdodFxuXHQvLyAgICB3b3JrcyBvbiBGaXJlZm94LCBJRSA4LCA5LCAxMCwgMTFcblx0Ly8gICAgZmFpbHMgb24gU2FmYXJpLCBNb2JpbGUgU2FmYXJpLCBDaHJvbWU6IG9ubHkgaW5jbHVkZXMgaGVpZ2h0IG9mIGNvbnRlbnRcblx0Ly8gaHRtbC5jbGllbnRIZWlnaHRcblx0Ly8gICAgV09SS1MhIFNhZmFyaSwgTW9iaWxlIFNhZmFyaSwgQ2hyb21lLCBGaXJlZm94LCBJRSA4LCA5LCAxMCwgMTFcblxuXHR2YXIgaHRtbCA9IHRoaXMuX2ZyYW1lLmdldChcImh0bWxcIikudG9Eb21FbGVtZW50KCk7XG5cdHZhciB2YWx1ZSA9ICh0aGlzLl9kaW1lbnNpb24gPT09IFhfRElNRU5TSU9OKSA/IGh0bWwuY2xpZW50V2lkdGggOiBodG1sLmNsaWVudEhlaWdodDtcblx0cmV0dXJuIFNpemUuY3JlYXRlKHZhbHVlKTtcbn07XG5cbk1lLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuXHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW10pO1xuXG5cdHZhciBkZXNjID0gKHRoaXMuX2RpbWVuc2lvbiA9PT0gWF9ESU1FTlNJT04pID8gXCJ3aWR0aFwiIDogXCJoZWlnaHRcIjtcblx0cmV0dXJuIGRlc2MgKyBcIiBvZiB2aWV3cG9ydFwiO1xufTtcblxuZnVuY3Rpb24gZmFjdG9yeUZuKGRpbWVuc2lvbikge1xuXHRyZXR1cm4gZnVuY3Rpb24gZmFjdG9yeShmcmFtZSkge1xuXHRcdHJldHVybiBuZXcgTWUoZGltZW5zaW9uLCBmcmFtZSk7XG5cdH07XG59IiwiLy8gQ29weXJpZ2h0IChjKSAyMDE0LTIwMTYgVGl0YW5pdW0gSS5ULiBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIEZvciBsaWNlbnNlLCBzZWUgXCJSRUFETUVcIiBvciBcIkxJQ0VOU0VcIiBmaWxlLlxuKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgZW5zdXJlID0gcmVxdWlyZShcIi4vdXRpbC9lbnN1cmUuanNcIik7XG5cdHZhciBzaGltID0gcmVxdWlyZShcIi4vdXRpbC9zaGltLmpzXCIpO1xuXHR2YXIgY2FtZWxjYXNlID0gcmVxdWlyZShcIi4uL3ZlbmRvci9jYW1lbGNhc2UtMS4wLjEtbW9kaWZpZWQuanNcIik7XG5cdHZhciBFbGVtZW50UmVuZGVyZWQgPSByZXF1aXJlKFwiLi9kZXNjcmlwdG9ycy9lbGVtZW50X3JlbmRlcmVkLmpzXCIpO1xuXHR2YXIgRWxlbWVudEVkZ2UgPSByZXF1aXJlKFwiLi9kZXNjcmlwdG9ycy9lbGVtZW50X2VkZ2UuanNcIik7XG5cdHZhciBDZW50ZXIgPSByZXF1aXJlKFwiLi9kZXNjcmlwdG9ycy9jZW50ZXIuanNcIik7XG5cdHZhciBFbGVtZW50U2l6ZSA9IHJlcXVpcmUoXCIuL2Rlc2NyaXB0b3JzL2VsZW1lbnRfc2l6ZS5qc1wiKTtcblx0dmFyIEFzc2VydGFibGUgPSByZXF1aXJlKFwiLi9hc3NlcnRhYmxlLmpzXCIpO1xuXG5cdHZhciBNZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUUVsZW1lbnQoZG9tRWxlbWVudCwgZnJhbWUsIG5pY2tuYW1lKSB7XG5cdFx0dmFyIFFGcmFtZSA9IHJlcXVpcmUoXCIuL3FfZnJhbWUuanNcIik7ICAgIC8vIGJyZWFrIGNpcmN1bGFyIGRlcGVuZGVuY3lcblx0XHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW09iamVjdCwgUUZyYW1lLCBTdHJpbmddKTtcblxuXHRcdHRoaXMuX2RvbUVsZW1lbnQgPSBkb21FbGVtZW50O1xuXHRcdHRoaXMuX25pY2tuYW1lID0gbmlja25hbWU7XG5cblx0XHR0aGlzLmZyYW1lID0gZnJhbWU7XG5cblx0XHQvLyBwcm9wZXJ0aWVzXG5cdFx0dGhpcy5yZW5kZXJlZCA9IEVsZW1lbnRSZW5kZXJlZC5jcmVhdGUodGhpcyk7XG5cblx0XHR0aGlzLnRvcCA9IEVsZW1lbnRFZGdlLnRvcCh0aGlzKTtcblx0XHR0aGlzLnJpZ2h0ID0gRWxlbWVudEVkZ2UucmlnaHQodGhpcyk7XG5cdFx0dGhpcy5ib3R0b20gPSBFbGVtZW50RWRnZS5ib3R0b20odGhpcyk7XG5cdFx0dGhpcy5sZWZ0ID0gRWxlbWVudEVkZ2UubGVmdCh0aGlzKTtcblxuXHRcdHRoaXMuY2VudGVyID0gQ2VudGVyLngodGhpcy5sZWZ0LCB0aGlzLnJpZ2h0LCBcImNlbnRlciBvZiAnXCIgKyBuaWNrbmFtZSArIFwiJ1wiKTtcblx0XHR0aGlzLm1pZGRsZSA9IENlbnRlci55KHRoaXMudG9wLCB0aGlzLmJvdHRvbSwgXCJtaWRkbGUgb2YgJ1wiICsgbmlja25hbWUgKyBcIidcIik7XG5cblx0XHR0aGlzLndpZHRoID0gRWxlbWVudFNpemUueCh0aGlzKTtcblx0XHR0aGlzLmhlaWdodCA9IEVsZW1lbnRTaXplLnkodGhpcyk7XG5cdH07XG5cdEFzc2VydGFibGUuZXh0ZW5kKE1lKTtcblxuXHRNZS5wcm90b3R5cGUuZ2V0UmF3U3R5bGUgPSBmdW5jdGlvbihzdHlsZU5hbWUpIHtcblx0XHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW1N0cmluZ10pO1xuXG5cdFx0dmFyIHN0eWxlcztcblx0XHR2YXIgcmVzdWx0O1xuXG5cdFx0Ly8gV09SS0FST1VORCBJRSA4OiBubyBnZXRDb21wdXRlZFN0eWxlKClcblx0XHRpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUpIHtcblx0XHRcdC8vIFdPUktBUk9VTkQgRmlyZWZveCA0MC4wLjM6IG11c3QgdXNlIGZyYW1lJ3MgY29udGVudFdpbmRvdyAocmVmIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTEyMDQwNjIpXG5cdFx0XHRzdHlsZXMgPSB0aGlzLmZyYW1lLnRvRG9tRWxlbWVudCgpLmNvbnRlbnRXaW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLl9kb21FbGVtZW50KTtcblx0XHRcdHJlc3VsdCA9IHN0eWxlcy5nZXRQcm9wZXJ0eVZhbHVlKHN0eWxlTmFtZSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0c3R5bGVzID0gdGhpcy5fZG9tRWxlbWVudC5jdXJyZW50U3R5bGU7XG5cdFx0XHRyZXN1bHQgPSBzdHlsZXNbY2FtZWxjYXNlKHN0eWxlTmFtZSldO1xuXHRcdH1cblx0XHRpZiAocmVzdWx0ID09PSBudWxsIHx8IHJlc3VsdCA9PT0gdW5kZWZpbmVkKSByZXN1bHQgPSBcIlwiO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0TWUucHJvdG90eXBlLmdldFJhd1Bvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG5cdFx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtdKTtcblxuXHRcdC8vIFdPUktBUk9VTkQgSUUgODogTm8gVGV4dFJlY3RhbmdsZS5oZWlnaHQgb3IgLndpZHRoXG5cdFx0dmFyIHJlY3QgPSB0aGlzLl9kb21FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRsZWZ0OiByZWN0LmxlZnQsXG5cdFx0XHRyaWdodDogcmVjdC5yaWdodCxcblx0XHRcdHdpZHRoOiByZWN0LndpZHRoICE9PSB1bmRlZmluZWQgPyByZWN0LndpZHRoIDogcmVjdC5yaWdodCAtIHJlY3QubGVmdCxcblxuXHRcdFx0dG9wOiByZWN0LnRvcCxcblx0XHRcdGJvdHRvbTogcmVjdC5ib3R0b20sXG5cdFx0XHRoZWlnaHQ6IHJlY3QuaGVpZ2h0ICE9PSB1bmRlZmluZWQgPyByZWN0LmhlaWdodCA6IHJlY3QuYm90dG9tIC0gcmVjdC50b3Bcblx0XHR9O1xuXHR9O1xuXG5cdE1lLnByb3RvdHlwZS5wYXJlbnQgPSBmdW5jdGlvbihuaWNrbmFtZSkge1xuXHRcdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbWyB1bmRlZmluZWQsIFN0cmluZyBdXSk7XG5cdFx0aWYgKG5pY2tuYW1lID09PSB1bmRlZmluZWQpIG5pY2tuYW1lID0gXCJwYXJlbnQgb2YgXCIgKyB0aGlzLl9uaWNrbmFtZTtcblxuXHRcdGlmICh0aGlzLmVxdWFscyh0aGlzLmZyYW1lLmJvZHkoKSkpIHJldHVybiBudWxsO1xuXHRcdGVsc2UgcmV0dXJuIG5ldyBNZSh0aGlzLl9kb21FbGVtZW50LnBhcmVudEVsZW1lbnQsIHRoaXMuZnJhbWUsIG5pY2tuYW1lKTtcblx0fTtcblxuXHRNZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oaHRtbCwgbmlja25hbWUpIHtcblx0XHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW1N0cmluZywgW3VuZGVmaW5lZCwgU3RyaW5nXV0pO1xuXHRcdGlmIChuaWNrbmFtZSA9PT0gdW5kZWZpbmVkKSBuaWNrbmFtZSA9IGh0bWwgKyBcIiBpbiBcIiArIHRoaXMuX25pY2tuYW1lO1xuXG5cdFx0dmFyIHRlbXBFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHR0ZW1wRWxlbWVudC5pbm5lckhUTUwgPSBzaGltLlN0cmluZy50cmltKGh0bWwpO1xuXHRcdGVuc3VyZS50aGF0KFxuXHRcdFx0dGVtcEVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDEsXG5cdFx0XHRcIkV4cGVjdGVkIG9uZSBlbGVtZW50LCBidXQgZ290IFwiICsgdGVtcEVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGggKyBcIiAoXCIgKyBodG1sICsgXCIpXCJcblx0XHQpO1xuXG5cdFx0dmFyIGluc2VydGVkRWxlbWVudCA9IHRlbXBFbGVtZW50LmNoaWxkTm9kZXNbMF07XG5cdFx0dGhpcy5fZG9tRWxlbWVudC5hcHBlbmRDaGlsZChpbnNlcnRlZEVsZW1lbnQpO1xuXHRcdHJldHVybiBuZXcgTWUoaW5zZXJ0ZWRFbGVtZW50LCB0aGlzLmZyYW1lLCBuaWNrbmFtZSk7XG5cdH07XG5cblx0TWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbXSk7XG5cdFx0c2hpbS5FbGVtZW50LnJlbW92ZSh0aGlzLl9kb21FbGVtZW50KTtcblx0fTtcblxuXHRNZS5wcm90b3R5cGUudG9Eb21FbGVtZW50ID0gZnVuY3Rpb24oKSB7XG5cdFx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtdKTtcblx0XHRyZXR1cm4gdGhpcy5fZG9tRWxlbWVudDtcblx0fTtcblxuXHRNZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0XHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW10pO1xuXHRcdHJldHVybiBcIidcIiArIHRoaXMuX25pY2tuYW1lICsgXCInXCI7XG5cdH07XG5cblx0TWUucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKHRoYXQpIHtcblx0XHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW01lXSk7XG5cdFx0cmV0dXJuIHRoaXMuX2RvbUVsZW1lbnQgPT09IHRoYXQuX2RvbUVsZW1lbnQ7XG5cdH07XG5cbn0oKSk7IiwiLy8gQ29weXJpZ2h0IChjKSAyMDE0IFRpdGFuaXVtIEkuVC4gTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBGb3IgbGljZW5zZSwgc2VlIFwiUkVBRE1FXCIgb3IgXCJMSUNFTlNFXCIgZmlsZS5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgZW5zdXJlID0gcmVxdWlyZShcIi4vdXRpbC9lbnN1cmUuanNcIik7XG52YXIgUUVsZW1lbnQgPSByZXF1aXJlKFwiLi9xX2VsZW1lbnQuanNcIik7XG5cbnZhciBNZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUUVsZW1lbnRMaXN0KG5vZGVMaXN0LCBmcmFtZSwgbmlja25hbWUpIHtcblx0dmFyIFFGcmFtZSA9IHJlcXVpcmUoXCIuL3FfZnJhbWUuanNcIik7ICAgIC8vIGJyZWFrIGNpcmN1bGFyIGRlcGVuZGVuY3lcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFsgT2JqZWN0LCBRRnJhbWUsIFN0cmluZyBdKTtcblxuXHR0aGlzLl9ub2RlTGlzdCA9IG5vZGVMaXN0O1xuXHR0aGlzLl9mcmFtZSA9IGZyYW1lO1xuXHR0aGlzLl9uaWNrbmFtZSA9IG5pY2tuYW1lO1xufTtcblxuTWUucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uIGxlbmd0aCgpIHtcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtdKTtcblxuXHRyZXR1cm4gdGhpcy5fbm9kZUxpc3QubGVuZ3RoO1xufTtcblxuTWUucHJvdG90eXBlLmF0ID0gZnVuY3Rpb24gYXQocmVxdWVzdGVkSW5kZXgsIG5pY2tuYW1lKSB7XG5cdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbIE51bWJlciwgW3VuZGVmaW5lZCwgU3RyaW5nXSBdKTtcblxuXHR2YXIgaW5kZXggPSByZXF1ZXN0ZWRJbmRleDtcblx0dmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoKCk7XG5cdGlmIChpbmRleCA8IDApIGluZGV4ID0gbGVuZ3RoICsgaW5kZXg7XG5cblx0ZW5zdXJlLnRoYXQoXG5cdFx0aW5kZXggPj0gMCAmJiBpbmRleCA8IGxlbmd0aCxcblx0XHRcIidcIiArIHRoaXMuX25pY2tuYW1lICsgXCInW1wiICsgcmVxdWVzdGVkSW5kZXggKyBcIl0gaXMgb3V0IG9mIGJvdW5kczsgbGlzdCBsZW5ndGggaXMgXCIgKyBsZW5ndGhcblx0KTtcblx0dmFyIGVsZW1lbnQgPSB0aGlzLl9ub2RlTGlzdFtpbmRleF07XG5cblx0aWYgKG5pY2tuYW1lID09PSB1bmRlZmluZWQpIG5pY2tuYW1lID0gdGhpcy5fbmlja25hbWUgKyBcIltcIiArIGluZGV4ICsgXCJdXCI7XG5cdHJldHVybiBuZXcgUUVsZW1lbnQoZWxlbWVudCwgdGhpcy5fZnJhbWUsIG5pY2tuYW1lKTtcbn07XG5cbk1lLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW10pO1xuXG5cdHJldHVybiBcIidcIiArIHRoaXMuX25pY2tuYW1lICsgXCInIGxpc3RcIjtcbn07IiwiLy8gQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUgVGl0YW5pdW0gSS5ULiBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIEZvciBsaWNlbnNlLCBzZWUgXCJSRUFETUVcIiBvciBcIkxJQ0VOU0VcIiBmaWxlLlxuKGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgZW5zdXJlID0gcmVxdWlyZShcIi4vdXRpbC9lbnN1cmUuanNcIik7XG5cdHZhciBzaGltID0gcmVxdWlyZShcIi4vdXRpbC9zaGltLmpzXCIpO1xuXHR2YXIgcXVpeG90ZSA9IHJlcXVpcmUoXCIuL3F1aXhvdGUuanNcIik7XG5cdHZhciBRRWxlbWVudCA9IHJlcXVpcmUoXCIuL3FfZWxlbWVudC5qc1wiKTtcblx0dmFyIFFFbGVtZW50TGlzdCA9IHJlcXVpcmUoXCIuL3FfZWxlbWVudF9saXN0LmpzXCIpO1xuXHR2YXIgUVZpZXdwb3J0ID0gcmVxdWlyZShcIi4vcV92aWV3cG9ydC5qc1wiKTtcblx0dmFyIFFQYWdlID0gcmVxdWlyZShcIi4vcV9wYWdlLmpzXCIpO1xuXHR2YXIgYXN5bmMgPSByZXF1aXJlKFwiLi4vdmVuZG9yL2FzeW5jLTEuNC4yLmpzXCIpO1xuXG5cdHZhciBNZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUUZyYW1lKGZyYW1lRG9tKSB7XG5cdFx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtPYmplY3RdKTtcblx0XHRlbnN1cmUudGhhdChmcmFtZURvbS50YWdOYW1lID09PSBcIklGUkFNRVwiLCBcIlFGcmFtZSBET00gZWxlbWVudCBtdXN0IGJlIGFuIGlmcmFtZVwiKTtcblxuXHRcdHRoaXMuX2RvbUVsZW1lbnQgPSBmcmFtZURvbTtcblx0XHR0aGlzLl9sb2FkZWQgPSBmYWxzZTtcblx0XHR0aGlzLl9yZW1vdmVkID0gZmFsc2U7XG5cdH07XG5cblx0ZnVuY3Rpb24gbG9hZGVkKHNlbGYsIHdpZHRoLCBoZWlnaHQsIHNyYywgc3R5bGVzaGVldHMpIHtcblx0XHRzZWxmLl9sb2FkZWQgPSB0cnVlO1xuXHRcdHNlbGYuX2RvY3VtZW50ID0gc2VsZi5fZG9tRWxlbWVudC5jb250ZW50RG9jdW1lbnQ7XG5cdFx0c2VsZi5fb3JpZ2luYWxCb2R5ID0gc2VsZi5fZG9jdW1lbnQuYm9keS5pbm5lckhUTUw7XG5cdFx0c2VsZi5fb3JpZ2luYWxXaWR0aCA9IHdpZHRoO1xuXHRcdHNlbGYuX29yaWdpbmFsSGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdHNlbGYuX29yaWdpbmFsU3JjID0gc3JjO1xuXHRcdHNlbGYuX29yaWdpbmFsU3R5bGVzaGVldHMgPSBzdHlsZXNoZWV0cztcblx0fVxuXG5cdE1lLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShwYXJlbnRFbGVtZW50LCBvcHRpb25zLCBjYWxsYmFjaykge1xuXHRcdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbT2JqZWN0LCBbT2JqZWN0LCBGdW5jdGlvbl0sIFt1bmRlZmluZWQsIEZ1bmN0aW9uXV0pO1xuXHRcdGlmIChjYWxsYmFjayA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjYWxsYmFjayA9IG9wdGlvbnM7XG5cdFx0XHRvcHRpb25zID0ge307XG5cdFx0fVxuXHRcdHZhciB3aWR0aCA9IG9wdGlvbnMud2lkdGggfHwgMjAwMDtcblx0XHR2YXIgaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQgfHwgMjAwMDtcblx0XHR2YXIgc3JjID0gb3B0aW9ucy5zcmM7XG5cdFx0dmFyIHN0eWxlc2hlZXRzID0gb3B0aW9ucy5zdHlsZXNoZWV0IHx8IFtdO1xuXHRcdGlmICghc2hpbS5BcnJheS5pc0FycmF5KHN0eWxlc2hlZXRzKSkgc3R5bGVzaGVldHMgPSBbIHN0eWxlc2hlZXRzIF07XG5cblx0XHR2YXIgZXJyID0gY2hlY2tVcmxzKHNyYywgc3R5bGVzaGVldHMpO1xuXHRcdGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpO1xuXG5cdFx0dmFyIGlmcmFtZSA9IGluc2VydElmcmFtZShwYXJlbnRFbGVtZW50LCB3aWR0aCwgaGVpZ2h0KTtcblx0XHRzaGltLkV2ZW50VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoaWZyYW1lLCBcImxvYWRcIiwgb25GcmFtZUxvYWQpO1xuXHRcdHNldElmcmFtZUNvbnRlbnQoaWZyYW1lLCBzcmMpO1xuXG5cdFx0dmFyIGZyYW1lID0gbmV3IE1lKGlmcmFtZSk7XG5cdFx0c2V0RnJhbWVMb2FkQ2FsbGJhY2soZnJhbWUsIGNhbGxiYWNrKTtcblxuXHRcdHJldHVybiBmcmFtZTtcblxuXHRcdGZ1bmN0aW9uIG9uRnJhbWVMb2FkKCkge1xuXHRcdFx0Ly8gV09SS0FST1VORCBNb2JpbGUgU2FmYXJpIDcuMC4wLCBTYWZhcmkgNi4yLjAsIENocm9tZSAzOC4wLjIxMjU6IGZyYW1lIGlzIGxvYWRlZCBzeW5jaHJvbm91c2x5XG5cdFx0XHQvLyBXZSBmb3JjZSBpdCB0byBiZSBhc3luY2hyb25vdXMgaGVyZVxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0bG9hZGVkKGZyYW1lLCB3aWR0aCwgaGVpZ2h0LCBzcmMsIHN0eWxlc2hlZXRzKTtcblx0XHRcdFx0bG9hZFN0eWxlc2hlZXRzKGZyYW1lLCBzdHlsZXNoZWV0cywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0ZnJhbWUuX2ZyYW1lTG9hZENhbGxiYWNrKG51bGwsIGZyYW1lKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9LCAwKTtcblx0XHR9XG5cdH07XG5cblx0ZnVuY3Rpb24gc2V0RnJhbWVMb2FkQ2FsbGJhY2soZnJhbWUsIGNhbGxiYWNrKSB7XG5cdFx0ZnJhbWUuX2ZyYW1lTG9hZENhbGxiYWNrID0gY2FsbGJhY2s7XG5cdH1cblxuXHRmdW5jdGlvbiBjaGVja1VybHMoc3JjLCBzdHlsZXNoZWV0cykge1xuXHRcdGlmICghdXJsRXhpc3RzKHNyYykpIHJldHVybiBlcnJvcihcInNyY1wiLCBzcmMpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNoZWV0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIHVybCA9IHN0eWxlc2hlZXRzW2ldO1xuXHRcdFx0aWYgKCF1cmxFeGlzdHModXJsKSkgcmV0dXJuIGVycm9yKFwic3R5bGVzaGVldFwiLCB1cmwpO1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXG5cdFx0ZnVuY3Rpb24gZXJyb3IobmFtZSwgdXJsKSB7XG5cdFx0XHRyZXR1cm4gbmV3IEVycm9yKFwiNDA0IGVycm9yIHdoaWxlIGxvYWRpbmcgXCIgKyBuYW1lICsgXCIgKFwiICsgdXJsICsgXCIpXCIpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHVybEV4aXN0cyh1cmwpIHtcblx0XHRpZiAodXJsID09PSB1bmRlZmluZWQpIHJldHVybiB0cnVlO1xuXG5cdFx0dmFyIGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHRodHRwLm9wZW4oJ0hFQUQnLCB1cmwsIGZhbHNlKTtcblx0XHRodHRwLnNlbmQoKTtcblx0XHRyZXR1cm4gaHR0cC5zdGF0dXMgIT09IDQwNDtcblx0fVxuXG5cdGZ1bmN0aW9uIGluc2VydElmcmFtZShwYXJlbnRFbGVtZW50LCB3aWR0aCwgaGVpZ2h0KSB7XG5cdFx0dmFyIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7XG5cdFx0aWZyYW1lLnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIHdpZHRoKTtcblx0XHRpZnJhbWUuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIGhlaWdodCk7XG5cdFx0aWZyYW1lLnNldEF0dHJpYnV0ZShcImZyYW1lYm9yZGVyXCIsIFwiMFwiKTsgICAgLy8gV09SS0FST1VORCBJRSA4OiBkb24ndCBpbmNsdWRlIGZyYW1lIGJvcmRlciBpbiBwb3NpdGlvbiBjYWxjc1xuXHRcdHBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcblx0XHRyZXR1cm4gaWZyYW1lO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0SWZyYW1lQ29udGVudChpZnJhbWUsIHNyYykge1xuXHRcdGlmIChzcmMgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0d3JpdGVTdGFuZGFyZHNNb2RlSHRtbChpZnJhbWUpO1xuXHRcdH1cdGVsc2Uge1xuXHRcdFx0c2V0SWZyYW1lU3JjKGlmcmFtZSwgc3JjKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRJZnJhbWVTcmMoaWZyYW1lLCBzcmMpIHtcblx0XHRpZnJhbWUuc2V0QXR0cmlidXRlKFwic3JjXCIsIHNyYyk7XG5cdH1cblxuXHRmdW5jdGlvbiB3cml0ZVN0YW5kYXJkc01vZGVIdG1sKGlmcmFtZSkge1xuXHRcdHZhciBzdGFuZGFyZHNNb2RlID0gXCI8IURPQ1RZUEUgaHRtbD5cXG48aHRtbD48aGVhZD48L2hlYWQ+PGJvZHk+PC9ib2R5PjwvaHRtbD5cIjtcblx0XHRpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC5vcGVuKCk7XG5cdFx0aWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQud3JpdGUoc3RhbmRhcmRzTW9kZSk7XG5cdFx0aWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQuY2xvc2UoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGxvYWRTdHlsZXNoZWV0cyhzZWxmLCB1cmxzLCBjYWxsYmFjaykge1xuXHRcdGFzeW5jLmVhY2godXJscywgYWRkTGlua1RhZywgY2FsbGJhY2spO1xuXG5cdFx0ZnVuY3Rpb24gYWRkTGlua1RhZyh1cmwsIG9uTGlua0xvYWQpIHtcblx0XHRcdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cdFx0XHRzaGltLkV2ZW50VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIobGluaywgXCJsb2FkXCIsIGZ1bmN0aW9uKGV2ZW50KSB7IG9uTGlua0xvYWQobnVsbCk7IH0pO1xuXHRcdFx0bGluay5zZXRBdHRyaWJ1dGUoXCJyZWxcIiwgXCJzdHlsZXNoZWV0XCIpO1xuXHRcdFx0bGluay5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwidGV4dC9jc3NcIik7XG5cdFx0XHRsaW5rLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgdXJsKTtcblx0XHRcdHNoaW0uRG9jdW1lbnQuaGVhZChzZWxmLl9kb2N1bWVudCkuYXBwZW5kQ2hpbGQobGluayk7XG5cdFx0fVxuXHR9XG5cblx0TWUucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oKSB7XG5cdFx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtdKTtcblx0XHRlbnN1cmVVc2FibGUodGhpcyk7XG5cblx0XHR0aGlzLl9kb2N1bWVudC5ib2R5LmlubmVySFRNTCA9IHRoaXMuX29yaWdpbmFsQm9keTtcblx0XHR0aGlzLnNjcm9sbCgwLCAwKTtcblx0XHR0aGlzLnJlc2l6ZSh0aGlzLl9vcmlnaW5hbFdpZHRoLCB0aGlzLl9vcmlnaW5hbEhlaWdodCk7XG5cdH07XG5cblx0TWUucHJvdG90eXBlLnJlbG9hZCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtGdW5jdGlvbl0pO1xuXHRcdGVuc3VyZVVzYWJsZSh0aGlzKTtcblxuXHRcdHZhciBmcmFtZSA9IHRoaXM7XG5cdFx0dmFyIGlmcmFtZSA9IHRoaXMuX2RvbUVsZW1lbnQ7XG5cdFx0dmFyIHNyYyA9IHRoaXMuX29yaWdpbmFsU3JjO1xuXG5cdFx0dGhpcy5yZXNpemUodGhpcy5fb3JpZ2luYWxXaWR0aCwgdGhpcy5fb3JpZ2luYWxIZWlnaHQpO1xuXHRcdHNldEZyYW1lTG9hZENhbGxiYWNrKGZyYW1lLCBjYWxsYmFjayk7XG5cdFx0c2V0SWZyYW1lQ29udGVudChpZnJhbWUsIHNyYyk7XG5cdH07XG5cblx0TWUucHJvdG90eXBlLnRvRG9tRWxlbWVudCA9IGZ1bmN0aW9uKCkge1xuXHRcdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbXSk7XG5cdFx0ZW5zdXJlTm90UmVtb3ZlZCh0aGlzKTtcblxuXHRcdHJldHVybiB0aGlzLl9kb21FbGVtZW50O1xuXHR9O1xuXG5cdE1lLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpIHtcblx0XHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW10pO1xuXHRcdGVuc3VyZUxvYWRlZCh0aGlzKTtcblx0XHRpZiAodGhpcy5fcmVtb3ZlZCkgcmV0dXJuO1xuXG5cdFx0dGhpcy5fZG9tRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuX2RvbUVsZW1lbnQpO1xuXHRcdHRoaXMuX3JlbW92ZWQgPSB0cnVlO1xuXHR9O1xuXG5cdE1lLnByb3RvdHlwZS52aWV3cG9ydCA9IGZ1bmN0aW9uKCkge1xuXHRcdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbXSk7XG5cdFx0ZW5zdXJlVXNhYmxlKHRoaXMpO1xuXG5cdFx0cmV0dXJuIG5ldyBRVmlld3BvcnQodGhpcyk7XG5cdH07XG5cblx0TWUucHJvdG90eXBlLnBhZ2UgPSBmdW5jdGlvbigpIHtcblx0XHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW10pO1xuXHRcdGVuc3VyZVVzYWJsZSh0aGlzKTtcblxuXHRcdHJldHVybiBuZXcgUVBhZ2UodGhpcyk7XG5cdH07XG5cblx0TWUucHJvdG90eXBlLmJvZHkgPSBmdW5jdGlvbigpIHtcblx0XHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW10pO1xuXG5cdFx0cmV0dXJuIHRoaXMuZ2V0KFwiYm9keVwiKTtcblx0fTtcblxuXHRNZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oaHRtbCwgbmlja25hbWUpIHtcblx0XHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW1N0cmluZywgW3VuZGVmaW5lZCwgU3RyaW5nXV0pO1xuXHRcdGlmIChuaWNrbmFtZSA9PT0gdW5kZWZpbmVkKSBuaWNrbmFtZSA9IGh0bWw7XG5cblx0XHRyZXR1cm4gdGhpcy5ib2R5KCkuYWRkKGh0bWwsIG5pY2tuYW1lKTtcblx0fTtcblxuXHRNZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oc2VsZWN0b3IsIG5pY2tuYW1lKSB7XG5cdFx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtTdHJpbmcsIFt1bmRlZmluZWQsIFN0cmluZ11dKTtcblx0XHRpZiAobmlja25hbWUgPT09IHVuZGVmaW5lZCkgbmlja25hbWUgPSBzZWxlY3Rvcjtcblx0XHRlbnN1cmVVc2FibGUodGhpcyk7XG5cblx0XHR2YXIgbm9kZXMgPSB0aGlzLl9kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblx0XHRlbnN1cmUudGhhdChub2Rlcy5sZW5ndGggPT09IDEsIFwiRXhwZWN0ZWQgb25lIGVsZW1lbnQgdG8gbWF0Y2ggJ1wiICsgc2VsZWN0b3IgKyBcIicsIGJ1dCBmb3VuZCBcIiArIG5vZGVzLmxlbmd0aCk7XG5cdFx0cmV0dXJuIG5ldyBRRWxlbWVudChub2Rlc1swXSwgdGhpcywgbmlja25hbWUpO1xuXHR9O1xuXG5cdE1lLnByb3RvdHlwZS5nZXRBbGwgPSBmdW5jdGlvbihzZWxlY3Rvciwgbmlja25hbWUpIHtcblx0XHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW1N0cmluZywgW3VuZGVmaW5lZCwgU3RyaW5nXV0pO1xuXHRcdGlmIChuaWNrbmFtZSA9PT0gdW5kZWZpbmVkKSBuaWNrbmFtZSA9IHNlbGVjdG9yO1xuXG5cdFx0cmV0dXJuIG5ldyBRRWxlbWVudExpc3QodGhpcy5fZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvciksIHRoaXMsIG5pY2tuYW1lKTtcblx0fTtcblxuXHRNZS5wcm90b3R5cGUuc2Nyb2xsID0gZnVuY3Rpb24gc2Nyb2xsKHgsIHkpIHtcblx0XHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW051bWJlciwgTnVtYmVyXSk7XG5cblx0XHR0aGlzLl9kb21FbGVtZW50LmNvbnRlbnRXaW5kb3cuc2Nyb2xsKHgsIHkpO1xuXHR9O1xuXG5cdE1lLnByb3RvdHlwZS5nZXRSYXdTY3JvbGxQb3NpdGlvbiA9IGZ1bmN0aW9uIGdldFJhd1Njcm9sbFBvc2l0aW9uKCkge1xuXHRcdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbXSk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0eDogc2hpbS5XaW5kb3cucGFnZVhPZmZzZXQodGhpcy5fZG9tRWxlbWVudC5jb250ZW50V2luZG93LCB0aGlzLl9kb2N1bWVudCksXG5cdFx0XHR5OiBzaGltLldpbmRvdy5wYWdlWU9mZnNldCh0aGlzLl9kb21FbGVtZW50LmNvbnRlbnRXaW5kb3csIHRoaXMuX2RvY3VtZW50KVxuXHRcdH07XG5cdH07XG5cblx0TWUucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uIHJlc2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG5cdFx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtOdW1iZXIsIE51bWJlcl0pO1xuXG5cdFx0dGhpcy5fZG9tRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBcIlwiICsgd2lkdGgpO1xuXHRcdHRoaXMuX2RvbUVsZW1lbnQuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIFwiXCIgKyBoZWlnaHQpO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGVuc3VyZVVzYWJsZShzZWxmKSB7XG5cdFx0ZW5zdXJlTG9hZGVkKHNlbGYpO1xuXHRcdGVuc3VyZU5vdFJlbW92ZWQoc2VsZik7XG5cdH1cblxuXHRmdW5jdGlvbiBlbnN1cmVMb2FkZWQoc2VsZikge1xuXHRcdGVuc3VyZS50aGF0KHNlbGYuX2xvYWRlZCwgXCJRRnJhbWUgbm90IGxvYWRlZDogV2FpdCBmb3IgZnJhbWUgY3JlYXRpb24gY2FsbGJhY2sgdG8gZXhlY3V0ZSBiZWZvcmUgdXNpbmcgZnJhbWVcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBlbnN1cmVOb3RSZW1vdmVkKHNlbGYpIHtcblx0XHRlbnN1cmUudGhhdCghc2VsZi5fcmVtb3ZlZCwgXCJBdHRlbXB0ZWQgdG8gdXNlIGZyYW1lIGFmdGVyIGl0IHdhcyByZW1vdmVkXCIpO1xuXHR9XG5cbn0pKCk7XG4iLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTQgVGl0YW5pdW0gSS5ULiBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIEZvciBsaWNlbnNlLCBzZWUgXCJSRUFETUVcIiBvciBcIkxJQ0VOU0VcIiBmaWxlLlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBlbnN1cmUgPSByZXF1aXJlKFwiLi91dGlsL2Vuc3VyZS5qc1wiKTtcbnZhciBQYWdlU2l6ZSA9IHJlcXVpcmUoXCIuL2Rlc2NyaXB0b3JzL3BhZ2Vfc2l6ZS5qc1wiKTtcbnZhciBQYWdlRWRnZSA9IHJlcXVpcmUoXCIuL2Rlc2NyaXB0b3JzL3BhZ2VfZWRnZS5qc1wiKTtcbnZhciBDZW50ZXIgPSByZXF1aXJlKFwiLi9kZXNjcmlwdG9ycy9jZW50ZXIuanNcIik7XG52YXIgQXNzZXJ0YWJsZSA9IHJlcXVpcmUoXCIuL2Fzc2VydGFibGUuanNcIik7XG5cbnZhciBNZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUVBhZ2UoZnJhbWUpIHtcblx0dmFyIFFGcmFtZSA9IHJlcXVpcmUoXCIuL3FfZnJhbWUuanNcIik7ICAgLy8gYnJlYWsgY2lyY3VsYXIgZGVwZW5kZW5jeVxuXHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgWyBRRnJhbWUgXSk7XG5cblx0Ly8gcHJvcGVydGllc1xuXHR0aGlzLndpZHRoID0gUGFnZVNpemUueChmcmFtZSk7XG5cdHRoaXMuaGVpZ2h0ID0gUGFnZVNpemUueShmcmFtZSk7XG5cblx0dGhpcy50b3AgPSBQYWdlRWRnZS50b3AoZnJhbWUpO1xuXHR0aGlzLnJpZ2h0ID0gUGFnZUVkZ2UucmlnaHQoZnJhbWUpO1xuXHR0aGlzLmJvdHRvbSA9IFBhZ2VFZGdlLmJvdHRvbShmcmFtZSk7XG5cdHRoaXMubGVmdCA9IFBhZ2VFZGdlLmxlZnQoZnJhbWUpO1xuXG5cdHRoaXMuY2VudGVyID0gQ2VudGVyLngodGhpcy5sZWZ0LCB0aGlzLnJpZ2h0LCBcImNlbnRlciBvZiBwYWdlXCIpO1xuXHR0aGlzLm1pZGRsZSA9IENlbnRlci55KHRoaXMudG9wLCB0aGlzLmJvdHRvbSwgXCJtaWRkbGUgb2YgcGFnZVwiKTtcbn07XG5Bc3NlcnRhYmxlLmV4dGVuZChNZSk7XG4iLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTQgVGl0YW5pdW0gSS5ULiBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIEZvciBsaWNlbnNlLCBzZWUgXCJSRUFETUVcIiBvciBcIkxJQ0VOU0VcIiBmaWxlLlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBlbnN1cmUgPSByZXF1aXJlKFwiLi91dGlsL2Vuc3VyZS5qc1wiKTtcbnZhciBWaWV3cG9ydFNpemUgPSByZXF1aXJlKFwiLi9kZXNjcmlwdG9ycy92aWV3cG9ydF9zaXplLmpzXCIpO1xudmFyIFZpZXdwb3J0RWRnZSA9IHJlcXVpcmUoXCIuL2Rlc2NyaXB0b3JzL3ZpZXdwb3J0X2VkZ2UuanNcIik7XG52YXIgQ2VudGVyID0gcmVxdWlyZShcIi4vZGVzY3JpcHRvcnMvY2VudGVyLmpzXCIpO1xudmFyIEFzc2VydGFibGUgPSByZXF1aXJlKFwiLi9hc3NlcnRhYmxlLmpzXCIpO1xuXG52YXIgTWUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFFWaWV3cG9ydChmcmFtZSkge1xuXHR2YXIgUUZyYW1lID0gcmVxdWlyZShcIi4vcV9mcmFtZS5qc1wiKTsgICAvLyBicmVhayBjaXJjdWxhciBkZXBlbmRlbmN5XG5cdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbIFFGcmFtZSBdKTtcblxuXHQvLyBwcm9wZXJ0aWVzXG5cdHRoaXMud2lkdGggPSBWaWV3cG9ydFNpemUueChmcmFtZSk7XG5cdHRoaXMuaGVpZ2h0ID0gVmlld3BvcnRTaXplLnkoZnJhbWUpO1xuXG5cdHRoaXMudG9wID0gVmlld3BvcnRFZGdlLnRvcChmcmFtZSk7XG5cdHRoaXMucmlnaHQgPSBWaWV3cG9ydEVkZ2UucmlnaHQoZnJhbWUpO1xuXHR0aGlzLmJvdHRvbSA9IFZpZXdwb3J0RWRnZS5ib3R0b20oZnJhbWUpO1xuXHR0aGlzLmxlZnQgPSBWaWV3cG9ydEVkZ2UubGVmdChmcmFtZSk7XG5cblx0dGhpcy5jZW50ZXIgPSBDZW50ZXIueCh0aGlzLmxlZnQsIHRoaXMucmlnaHQsIFwiY2VudGVyIG9mIHZpZXdwb3J0XCIpO1xuXHR0aGlzLm1pZGRsZSA9IENlbnRlci55KHRoaXMudG9wLCB0aGlzLmJvdHRvbSwgXCJtaWRkbGUgb2Ygdmlld3BvcnRcIik7XG59O1xuQXNzZXJ0YWJsZS5leHRlbmQoTWUpO1xuIiwiLy8gQ29weXJpZ2h0IChjKSAyMDE0IFRpdGFuaXVtIEkuVC4gTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBGb3IgbGljZW5zZSwgc2VlIFwiUkVBRE1FXCIgb3IgXCJMSUNFTlNFXCIgZmlsZS5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgZW5zdXJlID0gcmVxdWlyZShcIi4vdXRpbC9lbnN1cmUuanNcIik7XG52YXIgUUZyYW1lID0gcmVxdWlyZShcIi4vcV9mcmFtZS5qc1wiKTtcbnZhciBTaXplID0gcmVxdWlyZShcIi4vdmFsdWVzL3NpemUuanNcIik7XG5cbnZhciBmZWF0dXJlcyA9IG51bGw7XG5cbmV4cG9ydHMuY3JlYXRlRnJhbWUgPSBmdW5jdGlvbihvcHRpb25zLCBjYWxsYmFjaykge1xuXHRyZXR1cm4gUUZyYW1lLmNyZWF0ZShkb2N1bWVudC5ib2R5LCBvcHRpb25zLCBmdW5jdGlvbihlcnIsIGNhbGxiYWNrRnJhbWUpIHtcblx0XHRpZiAoZmVhdHVyZXMgPT09IG51bGwpIHtcblx0XHRcdGRldGVjdEJyb3dzZXJGZWF0dXJlcyhmdW5jdGlvbigpIHtcblx0XHRcdFx0Y2FsbGJhY2soZXJyLCBjYWxsYmFja0ZyYW1lKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGNhbGxiYWNrKGVyciwgY2FsbGJhY2tGcmFtZSk7XG5cdFx0fVxuXHR9KTtcbn07XG5cbmV4cG9ydHMuYnJvd3NlciA9IHt9O1xuXG5leHBvcnRzLmJyb3dzZXIuZW5sYXJnZXNGcmFtZVRvUGFnZVNpemUgPSBjcmVhdGVEZXRlY3Rpb25NZXRob2QoXCJlbmxhcmdlc0ZyYW1lXCIpO1xuZXhwb3J0cy5icm93c2VyLmVubGFyZ2VzRm9udHMgPSBjcmVhdGVEZXRlY3Rpb25NZXRob2QoXCJlbmxhcmdlc0ZvbnRzXCIpO1xuXG5mdW5jdGlvbiBjcmVhdGVEZXRlY3Rpb25NZXRob2QocHJvcGVydHlOYW1lKSB7XG5cdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW10pO1xuXG5cdFx0dmFyIGZlYXR1cmUgPSBmZWF0dXJlc1twcm9wZXJ0eU5hbWVdO1xuXHRcdGVuc3VyZS50aGF0KGZlYXR1cmUgIT09IHVuZGVmaW5lZCwgXCJNdXN0IGNyZWF0ZSBhIGZyYW1lIGJlZm9yZSB1c2luZyBRdWl4b3RlIGJyb3dzZXIgZmVhdHVyZSBkZXRlY3Rpb24uXCIpO1xuXHRcdHJldHVybiBmZWF0dXJlO1xuXHR9O1xufVxuXG5mdW5jdGlvbiBkZXRlY3RCcm93c2VyRmVhdHVyZXMoY2FsbGJhY2spIHtcblx0dmFyIEZSQU1FX1dJRFRIID0gMTUwMDtcblx0dmFyIEZSQU1FX0hFSUdIVCA9IDIwMDtcblxuXHRmZWF0dXJlcyA9IHt9O1xuXHR2YXIgZnJhbWUgPSBRRnJhbWUuY3JlYXRlKGRvY3VtZW50LmJvZHksIHsgd2lkdGg6IEZSQU1FX1dJRFRILCBoZWlnaHQ6IEZSQU1FX0hFSUdIVCB9LCBmdW5jdGlvbihlcnIpIHtcblx0XHRpZiAoZXJyKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkVycm9yIHdoaWxlIGNyZWF0aW5nIFF1aXhvdGUgYnJvd3NlciBmZWF0dXJlIGRldGVjdGlvbiBmcmFtZTogXCIgKyBlcnIpO1xuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKCk7XG5cdFx0fVxuXG5cdFx0dHJ5IHtcblx0XHRcdGZlYXR1cmVzLmVubGFyZ2VzRnJhbWUgPSBkZXRlY3RGcmFtZUVubGFyZ2VtZW50KGZyYW1lLCBGUkFNRV9XSURUSCk7XG5cblx0XHRcdGZyYW1lLnJlc2V0KCk7XG5cdFx0XHRkZXRlY3RGb250RW5sYXJnZW1lbnQoZnJhbWUsIEZSQU1FX1dJRFRILCBmdW5jdGlvbihyZXN1bHQpIHtcblx0XHRcdFx0ZmVhdHVyZXMuZW5sYXJnZXNGb250cyA9IHJlc3VsdDtcblx0XHRcdFx0ZnJhbWUucmVtb3ZlKCk7XG5cdFx0XHRcdHJldHVybiBjYWxsYmFjaygpO1xuXHRcdFx0fSk7XG5cblx0XHR9XG5cdFx0Y2F0Y2goZXJyMikge1xuXHRcdFx0Y29uc29sZS5sb2coXCJFcnJvciBkdXJpbmcgUXVpeG90ZSBicm93c2VyIGZlYXR1cmUgZGV0ZWN0aW9uOiBcIiArIGVycjIpO1xuXHRcdH1cblx0fSk7XG5cbn1cblxuZnVuY3Rpb24gZGV0ZWN0RnJhbWVFbmxhcmdlbWVudChmcmFtZSwgZnJhbWVXaWR0aCkge1xuXHRmcmFtZS5hZGQoXCI8ZGl2IHN0eWxlPSd3aWR0aDogXCIgKyAoZnJhbWVXaWR0aCArIDIwMCkgKyBcInB4Jz5mb3JjZSBzY3JvbGxpbmc8L2Rpdj5cIik7XG5cdHJldHVybiAhZnJhbWUudmlld3BvcnQoKS53aWR0aC52YWx1ZSgpLmVxdWFscyhTaXplLmNyZWF0ZShmcmFtZVdpZHRoKSk7XG59XG5cbmZ1bmN0aW9uIGRldGVjdEZvbnRFbmxhcmdlbWVudChmcmFtZSwgZnJhbWVXaWR0aCwgY2FsbGJhY2spIHtcblx0ZW5zdXJlLnRoYXQoZnJhbWVXaWR0aCA+PSAxNTAwLCBcIkRldGVjdG9yIGZyYW1lIHdpZHRoIG11c3QgYmUgbGFyZ2VyIHRoYW4gc2NyZWVuIHRvIGRldGVjdCBmb250IGVubGFyZ2VtZW50XCIpO1xuXG5cdC8vIFdPUktBUk9VTkQgSUUgODogd2UgdXNlIGEgPGRpdj4gYmVjYXVzZSB0aGUgPHN0eWxlPiB0YWcgY2FuJ3QgYmUgYWRkZWQgYnkgZnJhbWUuYWRkKCkuIEF0IHRoZSB0aW1lIG9mIHRoaXNcblx0Ly8gd3JpdGluZywgSSdtIG5vdCBzdXJlIGlmIHRoZSBpc3N1ZSBpcyB3aXRoIGZyYW1lLmFkZCgpIG9yIGlmIElFIGp1c3QgY2FuJ3QgcHJvZ3JhbW1hdGljYWxseSBhZGQgPHN0eWxlPiB0YWdzLlxuXHRmcmFtZS5hZGQoXCI8ZGl2PjxzdHlsZT5wIHsgZm9udC1zaXplOiAxNXB4OyB9PC9zdHlsZT48L2Rpdj5cIik7XG5cblx0dmFyIHRleHQgPSBmcmFtZS5hZGQoXCI8cD5hcmJpdHJhcnkgdGV4dDwvcD5cIik7XG5cdGZyYW1lLmFkZChcIjxwPm11c3QgaGF2ZSB0d28gcCB0YWdzIHRvIHdvcms8L3A+XCIpO1xuXG5cdC8vIFdPUktBUk9VTkQgSUUgODogbmVlZCB0byBmb3JjZSByZWZsb3cgb3IgZ2V0dGluZyBmb250LXNpemUgbWF5IGZhaWwgYmVsb3dcblx0Ly8gVGhpcyBzZWVtcyB0byBvY2N1ciB3aGVuIElFIGlzIHJ1bm5pbmcgaW4gYSBzbG93IFZpcnR1YWxCb3ggVk0uIFRoZXJlIGlzIG5vIHRlc3QgZm9yIHRoaXMgbGluZS5cblx0dmFyIGZvcmNlUmVmbG93ID0gdGV4dC5vZmZzZXRIZWlnaHQ7XG5cblx0Ly8gV09SS0FST1VORCBTYWZhcmkgOC4wLjA6IHRpbWVvdXQgcmVxdWlyZWQgYmVjYXVzZSBmb250IGlzIGVubGFyZ2VkIGFzeW5jaHJvbm91c2x5XG5cdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGZvbnRTaXplID0gdGV4dC5nZXRSYXdTdHlsZShcImZvbnQtc2l6ZVwiKTtcblx0XHRlbnN1cmUudGhhdChmb250U2l6ZSAhPT0gXCJcIiwgXCJFeHBlY3RlZCBmb250LXNpemUgdG8gYmUgYSB2YWx1ZVwiKTtcblxuXHRcdC8vIFdPUktBUk9VTkQgSUUgODogaWdub3JlcyA8c3R5bGU+IHRhZyB3ZSBhZGRlZCBhYm92ZVxuXHRcdGlmIChmb250U2l6ZSA9PT0gXCIxMnB0XCIpIHJldHVybiBjYWxsYmFjayhmYWxzZSk7XG5cblx0XHRyZXR1cm4gY2FsbGJhY2soZm9udFNpemUgIT09IFwiMTVweFwiKTtcblx0fSwgMCk7XG5cbn1cbiIsIi8vIENvcHlyaWdodCAoYykgMjAxMy0yMDE0IFRpdGFuaXVtIEkuVC4gTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBTZWUgTElDRU5TRS5UWFQgZm9yIGRldGFpbHMuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gUnVudGltZSBhc3NlcnRpb25zIGZvciBwcm9kdWN0aW9uIGNvZGUuIChDb250cmFzdCB0byBhc3NlcnQuanMsIHdoaWNoIGlzIGZvciB0ZXN0IGNvZGUuKVxuXG52YXIgc2hpbSA9IHJlcXVpcmUoXCIuL3NoaW0uanNcIik7XG52YXIgb29wID0gcmVxdWlyZShcIi4vb29wLmpzXCIpO1xuXG5leHBvcnRzLnRoYXQgPSBmdW5jdGlvbih2YXJpYWJsZSwgbWVzc2FnZSkge1xuXHRpZiAobWVzc2FnZSA9PT0gdW5kZWZpbmVkKSBtZXNzYWdlID0gXCJFeHBlY3RlZCBjb25kaXRpb24gdG8gYmUgdHJ1ZVwiO1xuXG5cdGlmICh2YXJpYWJsZSA9PT0gZmFsc2UpIHRocm93IG5ldyBFbnN1cmVFeGNlcHRpb24oZXhwb3J0cy50aGF0LCBtZXNzYWdlKTtcblx0aWYgKHZhcmlhYmxlICE9PSB0cnVlKSB0aHJvdyBuZXcgRW5zdXJlRXhjZXB0aW9uKGV4cG9ydHMudGhhdCwgXCJFeHBlY3RlZCBjb25kaXRpb24gdG8gYmUgdHJ1ZSBvciBmYWxzZVwiKTtcbn07XG5cbmV4cG9ydHMudW5yZWFjaGFibGUgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cdGlmICghbWVzc2FnZSkgbWVzc2FnZSA9IFwiVW5yZWFjaGFibGUgY29kZSBleGVjdXRlZFwiO1xuXG5cdHRocm93IG5ldyBFbnN1cmVFeGNlcHRpb24oZXhwb3J0cy51bnJlYWNoYWJsZSwgbWVzc2FnZSk7XG59O1xuXG5leHBvcnRzLnNpZ25hdHVyZSA9IGZ1bmN0aW9uKGFyZ3MsIHNpZ25hdHVyZSkge1xuXHRzaWduYXR1cmUgPSBzaWduYXR1cmUgfHwgW107XG5cdHZhciBleHBlY3RlZEFyZ0NvdW50ID0gc2lnbmF0dXJlLmxlbmd0aDtcblx0dmFyIGFjdHVhbEFyZ0NvdW50ID0gYXJncy5sZW5ndGg7XG5cblx0aWYgKGFjdHVhbEFyZ0NvdW50ID4gZXhwZWN0ZWRBcmdDb3VudCkge1xuXHRcdHRocm93IG5ldyBFbnN1cmVFeGNlcHRpb24oXG5cdFx0XHRleHBvcnRzLnNpZ25hdHVyZSxcblx0XHRcdFwiRnVuY3Rpb24gY2FsbGVkIHdpdGggdG9vIG1hbnkgYXJndW1lbnRzOiBleHBlY3RlZCBcIiArIGV4cGVjdGVkQXJnQ291bnQgKyBcIiBidXQgZ290IFwiICsgYWN0dWFsQXJnQ291bnRcblx0XHQpO1xuXHR9XG5cblx0dmFyIHR5cGUsIGFyZywgbmFtZTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzaWduYXR1cmUubGVuZ3RoOyBpKyspIHtcblx0XHR0eXBlID0gc2lnbmF0dXJlW2ldO1xuXHRcdGFyZyA9IGFyZ3NbaV07XG5cdFx0bmFtZSA9IFwiQXJndW1lbnQgXCIgKyBpO1xuXG5cdFx0aWYgKCFzaGltLkFycmF5LmlzQXJyYXkodHlwZSkpIHR5cGUgPSBbIHR5cGUgXTtcblx0XHRpZiAoIXR5cGVNYXRjaGVzKHR5cGUsIGFyZywgbmFtZSkpIHtcblx0XHRcdHZhciBtZXNzYWdlID0gbmFtZSArIFwiIGV4cGVjdGVkIFwiICsgZXhwbGFpblR5cGUodHlwZSkgKyBcIiwgYnV0IHdhcyBcIjtcblx0XHRcdHRocm93IG5ldyBFbnN1cmVFeGNlcHRpb24oZXhwb3J0cy5zaWduYXR1cmUsIG1lc3NhZ2UgKyBleHBsYWluQXJnKGFyZykpO1xuXHRcdH1cblx0fVxufTtcblxuZnVuY3Rpb24gdHlwZU1hdGNoZXModHlwZSwgYXJnKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdHlwZS5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChvbmVUeXBlTWF0Y2hlcyh0eXBlW2ldLCBhcmcpKSByZXR1cm4gdHJ1ZTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG5cblx0ZnVuY3Rpb24gb25lVHlwZU1hdGNoZXModHlwZSwgYXJnKSB7XG5cdFx0c3dpdGNoIChnZXRUeXBlKGFyZykpIHtcblx0XHRcdGNhc2UgXCJib29sZWFuXCI6IHJldHVybiB0eXBlID09PSBCb29sZWFuO1xuXHRcdFx0Y2FzZSBcInN0cmluZ1wiOiByZXR1cm4gdHlwZSA9PT0gU3RyaW5nO1xuXHRcdFx0Y2FzZSBcIm51bWJlclwiOiByZXR1cm4gdHlwZSA9PT0gTnVtYmVyO1xuXHRcdFx0Y2FzZSBcImFycmF5XCI6IHJldHVybiB0eXBlID09PSBBcnJheTtcblx0XHRcdGNhc2UgXCJmdW5jdGlvblwiOiByZXR1cm4gdHlwZSA9PT0gRnVuY3Rpb247XG5cdFx0XHRjYXNlIFwib2JqZWN0XCI6IHJldHVybiB0eXBlID09PSBPYmplY3QgfHwgYXJnIGluc3RhbmNlb2YgdHlwZTtcblx0XHRcdGNhc2UgXCJ1bmRlZmluZWRcIjogcmV0dXJuIHR5cGUgPT09IHVuZGVmaW5lZDtcblx0XHRcdGNhc2UgXCJudWxsXCI6IHJldHVybiB0eXBlID09PSBudWxsO1xuXHRcdFx0Y2FzZSBcIk5hTlwiOiByZXR1cm4gaXNOYU4odHlwZSk7XG5cblx0XHRcdGRlZmF1bHQ6IGV4cG9ydHMudW5yZWFjaGFibGUoKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gZXhwbGFpblR5cGUodHlwZSkge1xuXHR2YXIgam9pbmVyID0gXCJcIjtcblx0dmFyIHJlc3VsdCA9IFwiXCI7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdHlwZS5sZW5ndGg7IGkrKykge1xuXHRcdHJlc3VsdCArPSBqb2luZXIgKyBleHBsYWluT25lVHlwZSh0eXBlW2ldKTtcblx0XHRqb2luZXIgPSAoaSA9PT0gdHlwZS5sZW5ndGggLSAyKSA/IFwiLCBvciBcIiA6IFwiLCBcIjtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xuXG5cdGZ1bmN0aW9uIGV4cGxhaW5PbmVUeXBlKHR5cGUpIHtcblx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdGNhc2UgQm9vbGVhbjogcmV0dXJuIFwiYm9vbGVhblwiO1xuXHRcdFx0Y2FzZSBTdHJpbmc6IHJldHVybiBcInN0cmluZ1wiO1xuXHRcdFx0Y2FzZSBOdW1iZXI6IHJldHVybiBcIm51bWJlclwiO1xuXHRcdFx0Y2FzZSBBcnJheTogcmV0dXJuIFwiYXJyYXlcIjtcblx0XHRcdGNhc2UgRnVuY3Rpb246IHJldHVybiBcImZ1bmN0aW9uXCI7XG5cdFx0XHRjYXNlIG51bGw6IHJldHVybiBcIm51bGxcIjtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGlmICh0eXBlb2YgdHlwZSA9PT0gXCJudW1iZXJcIiAmJiBpc05hTih0eXBlKSkgcmV0dXJuIFwiTmFOXCI7XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBvb3AuY2xhc3NOYW1lKHR5cGUpICsgXCIgaW5zdGFuY2VcIjtcblx0XHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBleHBsYWluQXJnKGFyZykge1xuXHR2YXIgdHlwZSA9IGdldFR5cGUoYXJnKTtcblx0aWYgKHR5cGUgIT09IFwib2JqZWN0XCIpIHJldHVybiB0eXBlO1xuXG5cdHJldHVybiBvb3AuaW5zdGFuY2VOYW1lKGFyZykgKyBcIiBpbnN0YW5jZVwiO1xufVxuXG5mdW5jdGlvbiBnZXRUeXBlKHZhcmlhYmxlKSB7XG5cdHZhciB0eXBlID0gdHlwZW9mIHZhcmlhYmxlO1xuXHRpZiAodmFyaWFibGUgPT09IG51bGwpIHR5cGUgPSBcIm51bGxcIjtcblx0aWYgKHNoaW0uQXJyYXkuaXNBcnJheSh2YXJpYWJsZSkpIHR5cGUgPSBcImFycmF5XCI7XG5cdGlmICh0eXBlID09PSBcIm51bWJlclwiICYmIGlzTmFOKHZhcmlhYmxlKSkgdHlwZSA9IFwiTmFOXCI7XG5cdHJldHVybiB0eXBlO1xufVxuXG5cbi8qKioqKi9cblxudmFyIEVuc3VyZUV4Y2VwdGlvbiA9IGV4cG9ydHMuRW5zdXJlRXhjZXB0aW9uID0gZnVuY3Rpb24gRW5zdXJlRXhjZXB0aW9uKGZuVG9SZW1vdmVGcm9tU3RhY2tUcmFjZSwgbWVzc2FnZSkge1xuXHRpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIGZuVG9SZW1vdmVGcm9tU3RhY2tUcmFjZSk7XG5cdGVsc2UgdGhpcy5zdGFjayA9IChuZXcgRXJyb3IoKSkuc3RhY2s7XG5cdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG59O1xuRW5zdXJlRXhjZXB0aW9uLnByb3RvdHlwZSA9IHNoaW0uT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xuRW5zdXJlRXhjZXB0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEVuc3VyZUV4Y2VwdGlvbjtcbkVuc3VyZUV4Y2VwdGlvbi5wcm90b3R5cGUubmFtZSA9IFwiRW5zdXJlRXhjZXB0aW9uXCI7XG4iLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTQgVGl0YW5pdW0gSS5ULiBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIEZvciBsaWNlbnNlLCBzZWUgXCJSRUFETUVcIiBvciBcIkxJQ0VOU0VcIiBmaWxlLlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIGNhbid0IHVzZSBlbnN1cmUuanMgZHVlIHRvIGNpcmN1bGFyIGRlcGVuZGVuY3lcbnZhciBzaGltID0gcmVxdWlyZShcIi4vc2hpbS5qc1wiKTtcblxuZXhwb3J0cy5jbGFzc05hbWUgPSBmdW5jdGlvbihjb25zdHJ1Y3Rvcikge1xuXHRpZiAodHlwZW9mIGNvbnN0cnVjdG9yICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBFcnJvcihcIk5vdCBhIGNvbnN0cnVjdG9yXCIpO1xuXHRyZXR1cm4gc2hpbS5GdW5jdGlvbi5uYW1lKGNvbnN0cnVjdG9yKTtcbn07XG5cbmV4cG9ydHMuaW5zdGFuY2VOYW1lID0gZnVuY3Rpb24ob2JqKSB7XG5cdHZhciBwcm90b3R5cGUgPSBzaGltLk9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xuXHRpZiAocHJvdG90eXBlID09PSBudWxsKSByZXR1cm4gXCI8bm8gcHJvdG90eXBlPlwiO1xuXG5cdHZhciBjb25zdHJ1Y3RvciA9IHByb3RvdHlwZS5jb25zdHJ1Y3Rvcjtcblx0aWYgKGNvbnN0cnVjdG9yID09PSB1bmRlZmluZWQgfHwgY29uc3RydWN0b3IgPT09IG51bGwpIHJldHVybiBcIjxhbm9uPlwiO1xuXG5cdHJldHVybiBzaGltLkZ1bmN0aW9uLm5hbWUoY29uc3RydWN0b3IpO1xufTtcblxuZXhwb3J0cy5leHRlbmRGbiA9IGZ1bmN0aW9uIGV4dGVuZEZuKHBhcmVudENvbnN0cnVjdG9yKSB7XG5cdHJldHVybiBmdW5jdGlvbihjaGlsZENvbnN0cnVjdG9yKSB7XG5cdFx0Y2hpbGRDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBzaGltLk9iamVjdC5jcmVhdGUocGFyZW50Q29uc3RydWN0b3IucHJvdG90eXBlKTtcblx0XHRjaGlsZENvbnN0cnVjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNoaWxkQ29uc3RydWN0b3I7XG5cdH07XG59O1xuXG5leHBvcnRzLm1ha2VBYnN0cmFjdCA9IGZ1bmN0aW9uIG1ha2VBYnN0cmFjdChjb25zdHJ1Y3RvciwgbWV0aG9kcykge1xuXHR2YXIgbmFtZSA9IHNoaW0uRnVuY3Rpb24ubmFtZShjb25zdHJ1Y3Rvcik7XG5cdHNoaW0uQXJyYXkuZm9yRWFjaChtZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcblx0XHRjb25zdHJ1Y3Rvci5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKG5hbWUgKyBcIiBzdWJjbGFzc2VzIG11c3QgaW1wbGVtZW50IFwiICsgbWV0aG9kICsgXCIoKSBtZXRob2RcIik7XG5cdFx0fTtcblx0fSk7XG5cblx0Y29uc3RydWN0b3IucHJvdG90eXBlLmNoZWNrQWJzdHJhY3RNZXRob2RzID0gZnVuY3Rpb24gY2hlY2tBYnN0cmFjdE1ldGhvZHMoKSB7XG5cdFx0dmFyIHVuaW1wbGVtZW50ZWQgPSBbXTtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0c2hpbS5BcnJheS5mb3JFYWNoKG1ldGhvZHMsIGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRcdGlmIChzZWxmW25hbWVdID09PSBjb25zdHJ1Y3Rvci5wcm90b3R5cGVbbmFtZV0pIHVuaW1wbGVtZW50ZWQucHVzaChuYW1lICsgXCIoKVwiKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gdW5pbXBsZW1lbnRlZDtcblx0fTtcbn07IiwiLy8gQ29weXJpZ2h0IChjKSAyMDE0IFRpdGFuaXVtIEkuVC4gTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBGb3IgbGljZW5zZSwgc2VlIFwiUkVBRE1FXCIgb3IgXCJMSUNFTlNFXCIgZmlsZS5cblwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLkFycmF5ID0ge1xuXG5cdC8vIFdPUktBUk9VTkQgSUUgODogbm8gQXJyYXkuaXNBcnJheVxuXHRpc0FycmF5OiBmdW5jdGlvbiBpc0FycmF5KHRoaW5nKSB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkpIHJldHVybiBBcnJheS5pc0FycmF5KHRoaW5nKTtcblxuXHRcdHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGhpbmcpID09PSAnW29iamVjdCBBcnJheV0nO1xuXHR9LFxuXG5cdC8vIFdPUktBUk9VTkQgSUUgODogbm8gQXJyYXkuZm9yRWFjaFxuXHRldmVyeTogZnVuY3Rpb24gZXZlcnkob2JqLCBjYWxsYmFja2ZuLCB0aGlzQXJnKSB7XG5cdFx0Lypqc2hpbnQgYml0d2lzZTpmYWxzZSwgZXFlcWVxOmZhbHNlLCAtVzA0MTpmYWxzZSAqL1xuXHRcdGlmIChBcnJheS5wcm90b3R5cGUuZXZlcnkpIHJldHVybiBvYmouZXZlcnkoY2FsbGJhY2tmbiwgdGhpc0FyZyk7XG5cblx0XHQvLyBUaGlzIHdvcmthcm91bmQgYmFzZWQgb24gcG9seWZpbGwgY29kZSBmcm9tIE1ETjpcblx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9ldmVyeVxuXHRcdHZhciBULCBrO1xuXG5cdFx0aWYgKHRoaXMgPT0gbnVsbCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XG5cdFx0fVxuXG5cdFx0Ly8gMS4gTGV0IE8gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIFRvT2JqZWN0IHBhc3NpbmcgdGhlIHRoaXNcblx0XHQvLyAgICB2YWx1ZSBhcyB0aGUgYXJndW1lbnQuXG5cdFx0dmFyIE8gPSBPYmplY3QodGhpcyk7XG5cblx0XHQvLyAyLiBMZXQgbGVuVmFsdWUgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXQgaW50ZXJuYWwgbWV0aG9kXG5cdFx0Ly8gICAgb2YgTyB3aXRoIHRoZSBhcmd1bWVudCBcImxlbmd0aFwiLlxuXHRcdC8vIDMuIExldCBsZW4gYmUgVG9VaW50MzIobGVuVmFsdWUpLlxuXHRcdHZhciBsZW4gPSBPLmxlbmd0aCA+Pj4gMDtcblxuXHRcdC8vIDQuIElmIElzQ2FsbGFibGUoY2FsbGJhY2tmbikgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cblx0XHRpZiAodHlwZW9mIGNhbGxiYWNrZm4gIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoKTtcblx0XHR9XG5cblx0XHQvLyA1LiBJZiB0aGlzQXJnIHdhcyBzdXBwbGllZCwgbGV0IFQgYmUgdGhpc0FyZzsgZWxzZSBsZXQgVCBiZSB1bmRlZmluZWQuXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdFx0XHRUID0gdGhpc0FyZztcblx0XHR9XG5cblx0XHQvLyA2LiBMZXQgayBiZSAwLlxuXHRcdGsgPSAwO1xuXG5cdFx0Ly8gNy4gUmVwZWF0LCB3aGlsZSBrIDwgbGVuXG5cdFx0d2hpbGUgKGsgPCBsZW4pIHtcblxuXHRcdFx0dmFyIGtWYWx1ZTtcblxuXHRcdFx0Ly8gYS4gTGV0IFBrIGJlIFRvU3RyaW5nKGspLlxuXHRcdFx0Ly8gICBUaGlzIGlzIGltcGxpY2l0IGZvciBMSFMgb3BlcmFuZHMgb2YgdGhlIGluIG9wZXJhdG9yXG5cdFx0XHQvLyBiLiBMZXQga1ByZXNlbnQgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBIYXNQcm9wZXJ0eSBpbnRlcm5hbFxuXHRcdFx0Ly8gICAgbWV0aG9kIG9mIE8gd2l0aCBhcmd1bWVudCBQay5cblx0XHRcdC8vICAgVGhpcyBzdGVwIGNhbiBiZSBjb21iaW5lZCB3aXRoIGNcblx0XHRcdC8vIGMuIElmIGtQcmVzZW50IGlzIHRydWUsIHRoZW5cblx0XHRcdGlmIChrIGluIE8pIHtcblxuXHRcdFx0XHQvLyBpLiBMZXQga1ZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0IGludGVybmFsIG1ldGhvZFxuXHRcdFx0XHQvLyAgICBvZiBPIHdpdGggYXJndW1lbnQgUGsuXG5cdFx0XHRcdGtWYWx1ZSA9IE9ba107XG5cblx0XHRcdFx0Ly8gaWkuIExldCB0ZXN0UmVzdWx0IGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgQ2FsbCBpbnRlcm5hbCBtZXRob2Rcblx0XHRcdFx0Ly8gICAgIG9mIGNhbGxiYWNrZm4gd2l0aCBUIGFzIHRoZSB0aGlzIHZhbHVlIGFuZCBhcmd1bWVudCBsaXN0XG5cdFx0XHRcdC8vICAgICBjb250YWluaW5nIGtWYWx1ZSwgaywgYW5kIE8uXG5cdFx0XHRcdHZhciB0ZXN0UmVzdWx0ID0gY2FsbGJhY2tmbi5jYWxsKFQsIGtWYWx1ZSwgaywgTyk7XG5cblx0XHRcdFx0Ly8gaWlpLiBJZiBUb0Jvb2xlYW4odGVzdFJlc3VsdCkgaXMgZmFsc2UsIHJldHVybiBmYWxzZS5cblx0XHRcdFx0aWYgKCF0ZXN0UmVzdWx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRrKys7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXG5cdC8vIFdPUktBUk9VTkQgSUUgODogbm8gQXJyYXkuZm9yRWFjaFxuXHRmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKG9iaiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcblx0XHQvKmpzaGludCBiaXR3aXNlOmZhbHNlLCBlcWVxZXE6ZmFsc2UsIC1XMDQxOmZhbHNlICovXG5cblx0XHRpZiAoQXJyYXkucHJvdG90eXBlLmZvckVhY2gpIHJldHVybiBvYmouZm9yRWFjaChjYWxsYmFjaywgdGhpc0FyZyk7XG5cblx0XHQvLyBUaGlzIHdvcmthcm91bmQgYmFzZWQgb24gcG9seWZpbGwgY29kZSBmcm9tIE1ETjpcblx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9mb3JFYWNoXG5cblx0XHQvLyBQcm9kdWN0aW9uIHN0ZXBzIG9mIEVDTUEtMjYyLCBFZGl0aW9uIDUsIDE1LjQuNC4xOFxuXHRcdC8vIFJlZmVyZW5jZTogaHR0cDovL2VzNS5naXRodWIuaW8vI3gxNS40LjQuMThcblxuICAgIHZhciBULCBrO1xuXG4gICAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCcgdGhpcyBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XG4gICAgfVxuXG4gICAgLy8gMS4gTGV0IE8gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIFRvT2JqZWN0IHBhc3NpbmcgdGhlIHx0aGlzfCB2YWx1ZSBhcyB0aGUgYXJndW1lbnQuXG4gICAgdmFyIE8gPSBPYmplY3Qob2JqKTtcblxuICAgIC8vIDIuIExldCBsZW5WYWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldCBpbnRlcm5hbCBtZXRob2Qgb2YgTyB3aXRoIHRoZSBhcmd1bWVudCBcImxlbmd0aFwiLlxuICAgIC8vIDMuIExldCBsZW4gYmUgVG9VaW50MzIobGVuVmFsdWUpLlxuICAgIHZhciBsZW4gPSBPLmxlbmd0aCA+Pj4gMDtcblxuICAgIC8vIDQuIElmIElzQ2FsbGFibGUoY2FsbGJhY2spIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXG4gICAgLy8gU2VlOiBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3g5LjExXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGNhbGxiYWNrICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuICAgIH1cblxuICAgIC8vIDUuIElmIHRoaXNBcmcgd2FzIHN1cHBsaWVkLCBsZXQgVCBiZSB0aGlzQXJnOyBlbHNlIGxldCBUIGJlIHVuZGVmaW5lZC5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIFQgPSB0aGlzQXJnO1xuICAgIH1cblxuICAgIC8vIDYuIExldCBrIGJlIDBcbiAgICBrID0gMDtcblxuICAgIC8vIDcuIFJlcGVhdCwgd2hpbGUgayA8IGxlblxuICAgIHdoaWxlIChrIDwgbGVuKSB7XG5cbiAgICAgIHZhciBrVmFsdWU7XG5cbiAgICAgIC8vIGEuIExldCBQayBiZSBUb1N0cmluZyhrKS5cbiAgICAgIC8vICAgVGhpcyBpcyBpbXBsaWNpdCBmb3IgTEhTIG9wZXJhbmRzIG9mIHRoZSBpbiBvcGVyYXRvclxuICAgICAgLy8gYi4gTGV0IGtQcmVzZW50IGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgSGFzUHJvcGVydHkgaW50ZXJuYWwgbWV0aG9kIG9mIE8gd2l0aCBhcmd1bWVudCBQay5cbiAgICAgIC8vICAgVGhpcyBzdGVwIGNhbiBiZSBjb21iaW5lZCB3aXRoIGNcbiAgICAgIC8vIGMuIElmIGtQcmVzZW50IGlzIHRydWUsIHRoZW5cbiAgICAgIGlmIChrIGluIE8pIHtcblxuICAgICAgICAvLyBpLiBMZXQga1ZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0IGludGVybmFsIG1ldGhvZCBvZiBPIHdpdGggYXJndW1lbnQgUGsuXG4gICAgICAgIGtWYWx1ZSA9IE9ba107XG5cbiAgICAgICAgLy8gaWkuIENhbGwgdGhlIENhbGwgaW50ZXJuYWwgbWV0aG9kIG9mIGNhbGxiYWNrIHdpdGggVCBhcyB0aGUgdGhpcyB2YWx1ZSBhbmRcbiAgICAgICAgLy8gYXJndW1lbnQgbGlzdCBjb250YWluaW5nIGtWYWx1ZSwgaywgYW5kIE8uXG4gICAgICAgIGNhbGxiYWNrLmNhbGwoVCwga1ZhbHVlLCBrLCBPKTtcbiAgICAgIH1cbiAgICAgIC8vIGQuIEluY3JlYXNlIGsgYnkgMS5cbiAgICAgIGsrKztcbiAgICB9XG4gICAgLy8gOC4gcmV0dXJuIHVuZGVmaW5lZFxuXHR9XG5cbn07XG5cblxuZXhwb3J0cy5FbGVtZW50ID0ge1xuXG5cdC8vIFdPUktBUk9VTkQgSUUgOCwgSUUgOSwgSUUgMTAsIElFIDExOiBubyBFbGVtZW50LnJlbW92ZSgpXG5cdHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKGVsZW1lbnQpIHtcblx0XHRlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG5cdH1cblxufTtcblxuXG5leHBvcnRzLkV2ZW50VGFyZ2V0ID0ge1xuXG5cdC8vIFdPUktBUk9VTkQgSUUgODogbm8gRXZlbnRUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigpXG5cdGFkZEV2ZW50TGlzdGVuZXI6IGZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXIoZWxlbWVudCwgZXZlbnQsIGNhbGxiYWNrKSB7XG5cdFx0aWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikgcmV0dXJuIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2spO1xuXG5cdFx0ZWxlbWVudC5hdHRhY2hFdmVudChcIm9uXCIgKyBldmVudCwgY2FsbGJhY2spO1xuXHR9XG5cbn07XG5cblxuZXhwb3J0cy5Eb2N1bWVudCA9IHtcblxuXHQvLyBXT1JLQVJPVU5EIElFIDg6IG5vIGRvY3VtZW50LmhlYWRcblx0aGVhZDogZnVuY3Rpb24gaGVhZChkb2MpIHtcblx0XHRpZiAoZG9jLmhlYWQpIHJldHVybiBkb2MuaGVhZDtcblxuXHRcdHJldHVybiBkb2MucXVlcnlTZWxlY3RvcihcImhlYWRcIik7XG5cdH1cblxufTtcblxuXG5leHBvcnRzLkZ1bmN0aW9uID0ge1xuXG5cdC8vIFdPUktBUk9VTkQgSUUgOCwgSUUgOSwgSUUgMTAsIElFIDExOiBubyBmdW5jdGlvbi5uYW1lXG5cdG5hbWU6IGZ1bmN0aW9uIG5hbWUoZm4pIHtcblx0XHRpZiAoZm4ubmFtZSkgcmV0dXJuIGZuLm5hbWU7XG5cblx0XHQvLyBCYXNlZCBvbiBjb2RlIGJ5IEphc29uIEJ1bnRpbmcgZXQgYWwsIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMzMjQyOVxuXHRcdHZhciBmdW5jTmFtZVJlZ2V4ID0gL2Z1bmN0aW9uXFxzKyguezEsfSlcXHMqXFwoLztcblx0XHR2YXIgcmVzdWx0cyA9IChmdW5jTmFtZVJlZ2V4KS5leGVjKChmbikudG9TdHJpbmcoKSk7XG5cdFx0cmV0dXJuIChyZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoID4gMSkgPyByZXN1bHRzWzFdIDogXCI8YW5vbj5cIjtcblx0fSxcblxufTtcblxuXG5leHBvcnRzLk9iamVjdCA9IHtcblxuXHQvLyBXT1JLQVJPVU5EIElFIDg6IG5vIE9iamVjdC5jcmVhdGUoKVxuXHRjcmVhdGU6IGZ1bmN0aW9uIGNyZWF0ZShwcm90b3R5cGUpIHtcblx0XHRpZiAoT2JqZWN0LmNyZWF0ZSkgcmV0dXJuIE9iamVjdC5jcmVhdGUocHJvdG90eXBlKTtcblxuXHRcdHZhciBUZW1wID0gZnVuY3Rpb24gVGVtcCgpIHt9O1xuXHRcdFRlbXAucHJvdG90eXBlID0gcHJvdG90eXBlO1xuXHRcdHJldHVybiBuZXcgVGVtcCgpO1xuXHR9LFxuXG5cdC8vIFdPUktBUk9VTkQgSUUgODogbm8gT2JqZWN0LmdldFByb3RvdHlwZU9mXG5cdC8vIENhdXRpb246IERvZXNuJ3Qgd29yayBvbiBJRSA4IGlmIGNvbnN0cnVjdG9yIGhhcyBiZWVuIGNoYW5nZWQsIGFzIGlzIHRoZSBjYXNlIHdpdGggYSBzdWJjbGFzcy5cblx0Z2V0UHJvdG90eXBlT2Y6IGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mKG9iaikge1xuXHRcdGlmIChPYmplY3QuZ2V0UHJvdG90eXBlT2YpIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcblxuXHRcdHZhciByZXN1bHQgPSBvYmouY29uc3RydWN0b3IgPyBvYmouY29uc3RydWN0b3IucHJvdG90eXBlIDogbnVsbDtcblx0XHRyZXR1cm4gcmVzdWx0IHx8IG51bGw7XG5cdH0sXG5cblx0Ly8gV09SS0FST1VORCBJRSA4OiBObyBPYmplY3Qua2V5c1xuXHRrZXlzOiBmdW5jdGlvbiBrZXlzKG9iaikge1xuXHRcdGlmIChPYmplY3Qua2V5cykgcmV0dXJuIE9iamVjdC5rZXlzKG9iaik7XG5cblx0XHQvLyBGcm9tIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9rZXlzXG5cdCAgdmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxcblx0ICAgICAgaGFzRG9udEVudW1CdWcgPSAhKHsgdG9TdHJpbmc6IG51bGwgfSkucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyksXG5cdCAgICAgIGRvbnRFbnVtcyA9IFtcblx0ICAgICAgICAndG9TdHJpbmcnLFxuXHQgICAgICAgICd0b0xvY2FsZVN0cmluZycsXG5cdCAgICAgICAgJ3ZhbHVlT2YnLFxuXHQgICAgICAgICdoYXNPd25Qcm9wZXJ0eScsXG5cdCAgICAgICAgJ2lzUHJvdG90eXBlT2YnLFxuXHQgICAgICAgICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsXG5cdCAgICAgICAgJ2NvbnN0cnVjdG9yJ1xuXHQgICAgICBdLFxuXHQgICAgICBkb250RW51bXNMZW5ndGggPSBkb250RW51bXMubGVuZ3RoO1xuXG5cdCAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnICYmICh0eXBlb2Ygb2JqICE9PSAnZnVuY3Rpb24nIHx8IG9iaiA9PT0gbnVsbCkpIHtcblx0ICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5rZXlzIGNhbGxlZCBvbiBub24tb2JqZWN0Jyk7XG5cdCAgfVxuXG5cdCAgdmFyIHJlc3VsdCA9IFtdLCBwcm9wLCBpO1xuXG5cdCAgZm9yIChwcm9wIGluIG9iaikge1xuXHQgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkge1xuXHQgICAgICByZXN1bHQucHVzaChwcm9wKTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICBpZiAoaGFzRG9udEVudW1CdWcpIHtcblx0ICAgIGZvciAoaSA9IDA7IGkgPCBkb250RW51bXNMZW5ndGg7IGkrKykge1xuXHQgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGRvbnRFbnVtc1tpXSkpIHtcblx0ICAgICAgICByZXN1bHQucHVzaChkb250RW51bXNbaV0pO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXHQgIHJldHVybiByZXN1bHQ7XG5cdH1cblxufTtcblxuXG5leHBvcnRzLlN0cmluZyA9IHtcblxuXHQvLyBXT1JLQVJPVU5EIElFIDg6IE5vIFN0cmluZy50cmltKClcblx0dHJpbTogZnVuY3Rpb24oc3RyKSB7XG5cdFx0aWYgKHN0ci50cmltICE9PSB1bmRlZmluZWQpIHJldHVybiBzdHIudHJpbSgpO1xuXG5cdFx0Ly8gQmFzZWQgb24gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvU3RyaW5nL1RyaW1cblx0XHRyZXR1cm4gc3RyLnJlcGxhY2UoL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nLCAnJyk7XG5cdH1cblxufTtcblxuXG5leHBvcnRzLldpbmRvdyA9IHtcblxuXHQvLyBXT1JLQVJPVU5EIElFIDg6IE5vIFdpbmRvdy5wYWdlWE9mZnNldFxuXHRwYWdlWE9mZnNldDogZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCkge1xuXHRcdGlmICh3aW5kb3cucGFnZVhPZmZzZXQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIHdpbmRvdy5wYWdlWE9mZnNldDtcblxuXHRcdC8vIEJhc2VkIG9uIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XaW5kb3cuc2Nyb2xsWVxuXHRcdHZhciBpc0NTUzFDb21wYXQgPSAoKGRvY3VtZW50LmNvbXBhdE1vZGUgfHwgXCJcIikgPT09IFwiQ1NTMUNvbXBhdFwiKTtcblx0XHRyZXR1cm4gaXNDU1MxQ29tcGF0ID8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQgOiBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQ7XG5cdH0sXG5cblxuXHQvLyBXT1JLQVJPVU5EIElFIDg6IE5vIFdpbmRvdy5wYWdlWU9mZnNldFxuXHRwYWdlWU9mZnNldDogZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCkge1xuXHRcdGlmICh3aW5kb3cucGFnZVlPZmZzZXQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIHdpbmRvdy5wYWdlWU9mZnNldDtcblxuXHRcdC8vIEJhc2VkIG9uIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XaW5kb3cuc2Nyb2xsWVxuXHRcdHZhciBpc0NTUzFDb21wYXQgPSAoKGRvY3VtZW50LmNvbXBhdE1vZGUgfHwgXCJcIikgPT09IFwiQ1NTMUNvbXBhdFwiKTtcblx0XHRyZXR1cm4gaXNDU1MxQ29tcGF0ID8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCA6IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuXHR9XG5cbn07IiwiLy8gQ29weXJpZ2h0IChjKSAyMDE0LTIwMTYgVGl0YW5pdW0gSS5ULiBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIEZvciBsaWNlbnNlLCBzZWUgXCJSRUFETUVcIiBvciBcIkxJQ0VOU0VcIiBmaWxlLlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBlbnN1cmUgPSByZXF1aXJlKFwiLi4vdXRpbC9lbnN1cmUuanNcIik7XG52YXIgVmFsdWUgPSByZXF1aXJlKFwiLi92YWx1ZS5qc1wiKTtcblxudmFyIE1lID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBQaXhlbHMoYW1vdW50KSB7XG5cdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbIFsgTnVtYmVyLCBudWxsIF0gXSk7XG5cdHRoaXMuX25vbmUgPSAoYW1vdW50ID09PSBudWxsKTtcblx0dGhpcy5fYW1vdW50ID0gYW1vdW50O1xufTtcblZhbHVlLmV4dGVuZChNZSk7XG5cbk1lLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShhbW91bnQpIHtcblx0cmV0dXJuIG5ldyBNZShhbW91bnQpO1xufTtcblxuTWUuY3JlYXRlTm9uZSA9IGZ1bmN0aW9uIGNyZWF0ZU5vbmUoKSB7XG5cdHJldHVybiBuZXcgTWUobnVsbCk7XG59O1xuXG5NZS5aRVJPID0gTWUuY3JlYXRlKDApO1xuTWUuTk9ORSA9IE1lLmNyZWF0ZU5vbmUoKTtcblxuTWUucHJvdG90eXBlLmNvbXBhdGliaWxpdHkgPSBmdW5jdGlvbiBjb21wYXRpYmlsaXR5KCkge1xuXHRyZXR1cm4gWyBNZSBdO1xufTtcblxuTWUucHJvdG90eXBlLnBsdXMgPSBWYWx1ZS5zYWZlKGZ1bmN0aW9uIHBsdXMob3BlcmFuZCkge1xuXHRpZiAodGhpcy5fbm9uZSB8fCBvcGVyYW5kLl9ub25lKSByZXR1cm4gTWUuY3JlYXRlTm9uZSgpO1xuXHRyZXR1cm4gbmV3IE1lKHRoaXMuX2Ftb3VudCArIG9wZXJhbmQuX2Ftb3VudCk7XG59KTtcblxuTWUucHJvdG90eXBlLm1pbnVzID0gVmFsdWUuc2FmZShmdW5jdGlvbiBtaW51cyhvcGVyYW5kKSB7XG5cdGlmICh0aGlzLl9ub25lIHx8IG9wZXJhbmQuX25vbmUpIHJldHVybiBNZS5jcmVhdGVOb25lKCk7XG5cdHJldHVybiBuZXcgTWUodGhpcy5fYW1vdW50IC0gb3BlcmFuZC5fYW1vdW50KTtcbn0pO1xuXG5NZS5wcm90b3R5cGUudGltZXMgPSBmdW5jdGlvbiB0aW1lcyhvcGVyYW5kKSB7XG5cdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbIE51bWJlciBdKTtcblxuXHRpZiAodGhpcy5fbm9uZSkgcmV0dXJuIE1lLmNyZWF0ZU5vbmUoKTtcblx0cmV0dXJuIG5ldyBNZSh0aGlzLl9hbW91bnQgKiBvcGVyYW5kKTtcbn07XG5cbk1lLnByb3RvdHlwZS5hdmVyYWdlID0gVmFsdWUuc2FmZShmdW5jdGlvbiBhdmVyYWdlKG9wZXJhbmQpIHtcblx0aWYgKHRoaXMuX25vbmUgfHwgb3BlcmFuZC5fbm9uZSkgcmV0dXJuIE1lLmNyZWF0ZU5vbmUoKTtcblx0cmV0dXJuIG5ldyBNZSgodGhpcy5fYW1vdW50ICsgb3BlcmFuZC5fYW1vdW50KSAvIDIpO1xufSk7XG5cbk1lLnByb3RvdHlwZS5jb21wYXJlID0gVmFsdWUuc2FmZShmdW5jdGlvbiBjb21wYXJlKG9wZXJhbmQpIHtcblx0dmFyIGJvdGhIYXZlUGl4ZWxzID0gIXRoaXMuX25vbmUgJiYgIW9wZXJhbmQuX25vbmU7XG5cdHZhciBuZWl0aGVySGF2ZVBpeGVscyA9IHRoaXMuX25vbmUgJiYgb3BlcmFuZC5fbm9uZTtcblx0dmFyIG9ubHlMZWZ0SGFzUGl4ZWxzID0gIXRoaXMuX25vbmUgJiYgb3BlcmFuZC5fbm9uZTtcblxuXHRpZiAoYm90aEhhdmVQaXhlbHMpIHtcblx0XHR2YXIgZGlmZmVyZW5jZSA9IHRoaXMuX2Ftb3VudCAtIG9wZXJhbmQuX2Ftb3VudDtcblx0XHRpZiAoTWF0aC5hYnMoZGlmZmVyZW5jZSkgPD0gMikgcmV0dXJuIDA7XG5cdFx0ZWxzZSByZXR1cm4gZGlmZmVyZW5jZTtcblx0fVxuXHRlbHNlIGlmIChuZWl0aGVySGF2ZVBpeGVscykge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0fVxuXHRlbHNlIGlmIChvbmx5TGVmdEhhc1BpeGVscykge1xuXHRcdHJldHVybiAxO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHJldHVybiAtMTtcblx0fVxufSk7XG5cbk1lLm1pbiA9IGZ1bmN0aW9uKGwsIHIpIHtcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFsgTWUsIE1lIF0pO1xuXG5cdGlmIChsLl9ub25lIHx8IHIuX25vbmUpIHJldHVybiBNZS5jcmVhdGVOb25lKCk7XG5cdHJldHVybiBsLmNvbXBhcmUocikgPD0gMCA/IGwgOiByO1xufTtcblxuTWUubWF4ID0gZnVuY3Rpb24obCwgcikge1xuXHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgWyBNZSwgTWUgXSk7XG5cblx0aWYgKGwuX25vbmUgfHwgci5fbm9uZSkgcmV0dXJuIE1lLmNyZWF0ZU5vbmUoKTtcblx0cmV0dXJuIGwuY29tcGFyZShyKSA+PSAwID8gbCA6IHI7XG59O1xuXG5NZS5wcm90b3R5cGUuZGlmZiA9IFZhbHVlLnNhZmUoZnVuY3Rpb24gZGlmZihleHBlY3RlZCkge1xuXHRpZiAodGhpcy5jb21wYXJlKGV4cGVjdGVkKSA9PT0gMCkgcmV0dXJuIFwiXCI7XG5cdGlmICh0aGlzLl9ub25lIHx8IGV4cGVjdGVkLl9ub25lKSByZXR1cm4gXCJub24tbWVhc3VyYWJsZVwiO1xuXG5cdHZhciBkaWZmZXJlbmNlID0gTWF0aC5hYnModGhpcy5fYW1vdW50IC0gZXhwZWN0ZWQuX2Ftb3VudCk7XG5cblx0dmFyIGRlc2MgPSBkaWZmZXJlbmNlO1xuXHRpZiAoZGlmZmVyZW5jZSAqIDEwMCAhPT0gTWF0aC5mbG9vcihkaWZmZXJlbmNlICogMTAwKSkgZGVzYyA9IFwiYWJvdXQgXCIgKyBkaWZmZXJlbmNlLnRvRml4ZWQoMik7XG5cdHJldHVybiBkZXNjICsgXCJweFwiO1xufSk7XG5cbk1lLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW10pO1xuXHRyZXR1cm4gdGhpcy5fbm9uZSA/IFwibm8gcGl4ZWxzXCIgOiB0aGlzLl9hbW91bnQgKyBcInB4XCI7XG59O1xuIiwiLy8gQ29weXJpZ2h0IChjKSAyMDE0LTIwMTYgVGl0YW5pdW0gSS5ULiBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIEZvciBsaWNlbnNlLCBzZWUgXCJSRUFETUVcIiBvciBcIkxJQ0VOU0VcIiBmaWxlLlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBlbnN1cmUgPSByZXF1aXJlKFwiLi4vdXRpbC9lbnN1cmUuanNcIik7XG52YXIgVmFsdWUgPSByZXF1aXJlKFwiLi92YWx1ZS5qc1wiKTtcbnZhciBQaXhlbHMgPSByZXF1aXJlKFwiLi9waXhlbHMuanNcIik7XG52YXIgU2l6ZSA9IHJlcXVpcmUoXCIuL3NpemUuanNcIik7XG5cbnZhciBYX0RJTUVOU0lPTiA9IFwieFwiO1xudmFyIFlfRElNRU5TSU9OID0gXCJ5XCI7XG5cbnZhciBNZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUG9zaXRpb24oZGltZW5zaW9uLCB2YWx1ZSkge1xuXHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgWyBTdHJpbmcsIFsgTnVtYmVyLCBQaXhlbHMgXSBdKTtcblxuXHR0aGlzLl9kaW1lbnNpb24gPSBkaW1lbnNpb247XG5cdHRoaXMuX3ZhbHVlID0gKHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIikgPyBQaXhlbHMuY3JlYXRlKHZhbHVlKSA6IHZhbHVlO1xufTtcblZhbHVlLmV4dGVuZChNZSk7XG5cbk1lLnggPSBmdW5jdGlvbiB4KHZhbHVlKSB7XG5cdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbIFsgTnVtYmVyLCBQaXhlbHMgXSBdKTtcblxuXHRyZXR1cm4gbmV3IE1lKFhfRElNRU5TSU9OLCB2YWx1ZSk7XG59O1xuXG5NZS55ID0gZnVuY3Rpb24geSh2YWx1ZSkge1xuXHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgWyBbIE51bWJlciwgUGl4ZWxzIF0gXSk7XG5cblx0cmV0dXJuIG5ldyBNZShZX0RJTUVOU0lPTiwgdmFsdWUpO1xufTtcblxuTWUubm9YID0gZnVuY3Rpb24gbm9YKCkge1xuXHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW10pO1xuXG5cdHJldHVybiBuZXcgTWUoWF9ESU1FTlNJT04sIFBpeGVscy5OT05FKTtcbn07XG5cbk1lLm5vWSA9IGZ1bmN0aW9uIG5vWSgpIHtcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtdKTtcblxuXHRyZXR1cm4gbmV3IE1lKFlfRElNRU5TSU9OLCBQaXhlbHMuTk9ORSk7XG59O1xuXG5NZS5wcm90b3R5cGUuY29tcGF0aWJpbGl0eSA9IGZ1bmN0aW9uIGNvbXBhdGliaWxpdHkoKSB7XG5cdHJldHVybiBbIE1lLCBTaXplIF07XG59O1xuXG5NZS5wcm90b3R5cGUucGx1cyA9IFZhbHVlLnNhZmUoZnVuY3Rpb24gcGx1cyhvcGVyYW5kKSB7XG5cdGNoZWNrQXhpcyh0aGlzLCBvcGVyYW5kKTtcblx0cmV0dXJuIG5ldyBNZSh0aGlzLl9kaW1lbnNpb24sIHRoaXMuX3ZhbHVlLnBsdXMob3BlcmFuZC50b1BpeGVscygpKSk7XG59KTtcblxuTWUucHJvdG90eXBlLm1pbnVzID0gVmFsdWUuc2FmZShmdW5jdGlvbiBtaW51cyhvcGVyYW5kKSB7XG5cdGNoZWNrQXhpcyh0aGlzLCBvcGVyYW5kKTtcblx0cmV0dXJuIG5ldyBNZSh0aGlzLl9kaW1lbnNpb24sIHRoaXMuX3ZhbHVlLm1pbnVzKG9wZXJhbmQudG9QaXhlbHMoKSkpO1xufSk7XG5cbk1lLnByb3RvdHlwZS5taWRwb2ludCA9IFZhbHVlLnNhZmUoZnVuY3Rpb24gbWlkcG9pbnQob3BlcmFuZCkge1xuXHRjaGVja0F4aXModGhpcywgb3BlcmFuZCk7XG5cdHJldHVybiBuZXcgTWUodGhpcy5fZGltZW5zaW9uLCB0aGlzLl92YWx1ZS5hdmVyYWdlKG9wZXJhbmQudG9QaXhlbHMoKSkpO1xufSk7XG5cbk1lLnByb3RvdHlwZS5jb21wYXJlID0gVmFsdWUuc2FmZShmdW5jdGlvbiBjb21wYXJlKG9wZXJhbmQpIHtcblx0Y2hlY2tBeGlzKHRoaXMsIG9wZXJhbmQpO1xuXHRyZXR1cm4gdGhpcy5fdmFsdWUuY29tcGFyZShvcGVyYW5kLnRvUGl4ZWxzKCkpO1xufSk7XG5cbk1lLnByb3RvdHlwZS5taW4gPSBWYWx1ZS5zYWZlKGZ1bmN0aW9uIG1pbihvcGVyYW5kKSB7XG5cdGNoZWNrQXhpcyh0aGlzLCBvcGVyYW5kKTtcblx0cmV0dXJuIG5ldyBNZSh0aGlzLl9kaW1lbnNpb24sIFBpeGVscy5taW4odGhpcy5fdmFsdWUsIG9wZXJhbmQudG9QaXhlbHMoKSkpO1xufSk7XG5cbk1lLnByb3RvdHlwZS5tYXggPSBWYWx1ZS5zYWZlKGZ1bmN0aW9uIG1heChvcGVyYW5kKSB7XG5cdGNoZWNrQXhpcyh0aGlzLCBvcGVyYW5kKTtcblx0cmV0dXJuIG5ldyBNZSh0aGlzLl9kaW1lbnNpb24sIFBpeGVscy5tYXgodGhpcy5fdmFsdWUsIG9wZXJhbmQudG9QaXhlbHMoKSkpO1xufSk7XG5cbk1lLnByb3RvdHlwZS5kaWZmID0gVmFsdWUuc2FmZShmdW5jdGlvbiBkaWZmKGV4cGVjdGVkKSB7XG5cdGNoZWNrQXhpcyh0aGlzLCBleHBlY3RlZCk7XG5cblx0dmFyIGFjdHVhbFZhbHVlID0gdGhpcy5fdmFsdWU7XG5cdHZhciBleHBlY3RlZFZhbHVlID0gZXhwZWN0ZWQuX3ZhbHVlO1xuXG5cdGlmIChhY3R1YWxWYWx1ZS5lcXVhbHMoZXhwZWN0ZWRWYWx1ZSkpIHJldHVybiBcIlwiO1xuXHRlbHNlIGlmIChpc05vbmUoZXhwZWN0ZWQpICYmICFpc05vbmUodGhpcykpIHJldHVybiBcInJlbmRlcmVkIHdoZW4gbm90IGV4cGVjdGVkXCI7XG5cdGVsc2UgaWYgKCFpc05vbmUoZXhwZWN0ZWQpICYmIGlzTm9uZSh0aGlzKSkgcmV0dXJuIFwibm90IHJlbmRlcmVkXCI7XG5cblx0dmFyIGRpcmVjdGlvbjtcblx0dmFyIGNvbXBhcmlzb24gPSBhY3R1YWxWYWx1ZS5jb21wYXJlKGV4cGVjdGVkVmFsdWUpO1xuXHRpZiAodGhpcy5fZGltZW5zaW9uID09PSBYX0RJTUVOU0lPTikgZGlyZWN0aW9uID0gY29tcGFyaXNvbiA8IDAgPyBcImZ1cnRoZXIgbGVmdCB0aGFuIGV4cGVjdGVkXCIgOiBcImZ1cnRoZXIgcmlnaHQgdGhhbiBleHBlY3RlZFwiO1xuXHRlbHNlIGRpcmVjdGlvbiA9IGNvbXBhcmlzb24gPCAwID8gXCJoaWdoZXIgdGhhbiBleHBlY3RlZFwiIDogXCJsb3dlciB0aGFuIGV4cGVjdGVkXCI7XG5cblx0cmV0dXJuIGFjdHVhbFZhbHVlLmRpZmYoZXhwZWN0ZWRWYWx1ZSkgKyBcIiBcIiArIGRpcmVjdGlvbjtcbn0pO1xuXG5NZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtdKTtcblxuXHRpZiAoaXNOb25lKHRoaXMpKSByZXR1cm4gXCJub3QgcmVuZGVyZWRcIjtcblx0ZWxzZSByZXR1cm4gdGhpcy5fdmFsdWUudG9TdHJpbmcoKTtcbn07XG5cbk1lLnByb3RvdHlwZS50b1BpeGVscyA9IGZ1bmN0aW9uIHRvUGl4ZWxzKCkge1xuXHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW10pO1xuXHRyZXR1cm4gdGhpcy5fdmFsdWU7XG59O1xuXG5mdW5jdGlvbiBjaGVja0F4aXMoc2VsZiwgb3RoZXIpIHtcblx0aWYgKG90aGVyIGluc3RhbmNlb2YgTWUpIHtcblx0XHRlbnN1cmUudGhhdChzZWxmLl9kaW1lbnNpb24gPT09IG90aGVyLl9kaW1lbnNpb24sIFwiQ2FuJ3QgY29tcGFyZSBYIGNvb3JkaW5hdGUgdG8gWSBjb29yZGluYXRlXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGlzTm9uZShwb3NpdGlvbikge1xuXHRyZXR1cm4gcG9zaXRpb24uX3ZhbHVlLmVxdWFscyhQaXhlbHMuTk9ORSk7XG59IiwiLy8gQ29weXJpZ2h0IChjKSAyMDE2IFRpdGFuaXVtIEkuVC4gTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBGb3IgbGljZW5zZSwgc2VlIFwiUkVBRE1FXCIgb3IgXCJMSUNFTlNFXCIgZmlsZS5cbihmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIGVuc3VyZSA9IHJlcXVpcmUoXCIuLi91dGlsL2Vuc3VyZS5qc1wiKTtcblx0dmFyIFZhbHVlID0gcmVxdWlyZShcIi4vdmFsdWUuanNcIik7XG5cblx0dmFyIFJFTkRFUkVEID0gXCJyZW5kZXJlZFwiO1xuXHR2YXIgTk9UX1JFTkRFUkVEID0gXCJub3QgcmVuZGVyZWRcIjtcblx0dmFyIERJU1BMQVlfTk9ORSA9IFwibm90IHJlbmRlcmVkIGR1ZSB0byBkaXNwbGF5Om5vbmUgcHJvcGVydHlcIjtcblx0dmFyIERFVEFDSEVEID0gXCJub3QgcmVuZGVyZWQgZHVlIHRvIGJlaW5nIGRldGFjaGVkIGZyb20gRE9NXCI7XG5cblx0dmFyIE1lID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBSZW5kZXJTdGF0ZShzdGF0ZSkge1xuXHRcdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbIFN0cmluZyBdKTtcblxuXHRcdHRoaXMuX3N0YXRlID0gc3RhdGU7XG5cdH07XG5cdFZhbHVlLmV4dGVuZChNZSk7XG5cblx0TWUucmVuZGVyZWQgPSBmdW5jdGlvbiByZW5kZXJlZCgpIHtcblx0XHRyZXR1cm4gbmV3IE1lKFJFTkRFUkVEKTtcblx0fTtcblxuXHRNZS5ub3RSZW5kZXJlZCA9IGZ1bmN0aW9uIG5vdFJlbmRlcmVkKCkge1xuXHRcdHJldHVybiBuZXcgTWUoTk9UX1JFTkRFUkVEKTtcblx0fTtcblxuXHRNZS5kaXNwbGF5Tm9uZSA9IGZ1bmN0aW9uIGRpc3BsYXlOb25lKCkge1xuXHRcdHJldHVybiBuZXcgTWUoRElTUExBWV9OT05FKTtcblx0fTtcblxuXHRNZS5kZXRhY2hlZCA9IGZ1bmN0aW9uIGRldGFjaGVkKCkge1xuXHRcdHJldHVybiBuZXcgTWUoREVUQUNIRUQpO1xuXHR9O1xuXG5cdE1lLnByb3RvdHlwZS5jb21wYXRpYmlsaXR5ID0gZnVuY3Rpb24gY29tcGF0aWJpbGl0eSgpIHtcblx0XHRyZXR1cm4gWyBNZSBdO1xuXHR9O1xuXG5cdE1lLnByb3RvdHlwZS5kaWZmID0gVmFsdWUuc2FmZShmdW5jdGlvbiBkaWZmKGV4cGVjdGVkKSB7XG5cdFx0dmFyIHRoaXNTdGF0ZSA9IHRoaXMuX3N0YXRlO1xuXHRcdHZhciBleHBlY3RlZFN0YXRlID0gZXhwZWN0ZWQuX3N0YXRlO1xuXG5cdFx0aWYgKHRoaXNTdGF0ZSA9PT0gZXhwZWN0ZWRTdGF0ZSkgcmV0dXJuIFwiXCI7XG5cblx0XHRpZiAodGhpc1N0YXRlID09PSBSRU5ERVJFRCkgcmV0dXJuIFwiZGlmZmVyZW50IHRoYW4gZXhwZWN0ZWRcIjtcblx0XHRlbHNlIGlmIChleHBlY3RlZFN0YXRlID09PSBSRU5ERVJFRCkgcmV0dXJuIFwiZGlmZmVyZW50IHRoYW4gZXhwZWN0ZWRcIjtcblx0XHRlbHNlIGlmICh0aGlzU3RhdGUgPT09IE5PVF9SRU5ERVJFRCB8fCBleHBlY3RlZFN0YXRlID09PSBOT1RfUkVOREVSRUQpIHJldHVybiBcIlwiO1xuXHRcdGVsc2UgcmV0dXJuIFwiYWNoaWV2ZWQgZGlmZmVyZW50bHkgdGhhbiBleHBlY3RlZFwiO1xuXHR9KTtcblxuXHRNZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5fc3RhdGU7XG5cdH07XG5cbn0oKSk7IiwiLy8gQ29weXJpZ2h0IChjKSAyMDE0IFRpdGFuaXVtIEkuVC4gTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBGb3IgbGljZW5zZSwgc2VlIFwiUkVBRE1FXCIgb3IgXCJMSUNFTlNFXCIgZmlsZS5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgZW5zdXJlID0gcmVxdWlyZShcIi4uL3V0aWwvZW5zdXJlLmpzXCIpO1xudmFyIFZhbHVlID0gcmVxdWlyZShcIi4vdmFsdWUuanNcIik7XG52YXIgUGl4ZWxzID0gcmVxdWlyZShcIi4vcGl4ZWxzLmpzXCIpO1xuXG52YXIgTWUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFNpemUodmFsdWUpIHtcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFsgW051bWJlciwgUGl4ZWxzXSBdKTtcblxuXHR0aGlzLl92YWx1ZSA9ICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIpID8gUGl4ZWxzLmNyZWF0ZSh2YWx1ZSkgOiB2YWx1ZTtcbn07XG5WYWx1ZS5leHRlbmQoTWUpO1xuXG5NZS5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUodmFsdWUpIHtcblx0cmV0dXJuIG5ldyBNZSh2YWx1ZSk7XG59O1xuXG5NZS5jcmVhdGVOb25lID0gZnVuY3Rpb24gY3JlYXRlTm9uZSgpIHtcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtdKTtcblxuXHRyZXR1cm4gbmV3IE1lKFBpeGVscy5OT05FKTtcbn07XG5cbk1lLnByb3RvdHlwZS5jb21wYXRpYmlsaXR5ID0gZnVuY3Rpb24gY29tcGF0aWJpbGl0eSgpIHtcblx0cmV0dXJuIFsgTWUgXTtcbn07XG5cbk1lLnByb3RvdHlwZS5wbHVzID0gVmFsdWUuc2FmZShmdW5jdGlvbiBwbHVzKG9wZXJhbmQpIHtcblx0cmV0dXJuIG5ldyBNZSh0aGlzLl92YWx1ZS5wbHVzKG9wZXJhbmQuX3ZhbHVlKSk7XG59KTtcblxuTWUucHJvdG90eXBlLm1pbnVzID0gVmFsdWUuc2FmZShmdW5jdGlvbiBtaW51cyhvcGVyYW5kKSB7XG5cdHJldHVybiBuZXcgTWUodGhpcy5fdmFsdWUubWludXMob3BlcmFuZC5fdmFsdWUpKTtcbn0pO1xuXG5NZS5wcm90b3R5cGUudGltZXMgPSBmdW5jdGlvbiB0aW1lcyhvcGVyYW5kKSB7XG5cdHJldHVybiBuZXcgTWUodGhpcy5fdmFsdWUudGltZXMob3BlcmFuZCkpO1xufTtcblxuTWUucHJvdG90eXBlLmNvbXBhcmUgPSBWYWx1ZS5zYWZlKGZ1bmN0aW9uIGNvbXBhcmUodGhhdCkge1xuXHRyZXR1cm4gdGhpcy5fdmFsdWUuY29tcGFyZSh0aGF0Ll92YWx1ZSk7XG59KTtcblxuTWUucHJvdG90eXBlLmRpZmYgPSBWYWx1ZS5zYWZlKGZ1bmN0aW9uIGRpZmYoZXhwZWN0ZWQpIHtcblx0dmFyIGFjdHVhbFZhbHVlID0gdGhpcy5fdmFsdWU7XG5cdHZhciBleHBlY3RlZFZhbHVlID0gZXhwZWN0ZWQuX3ZhbHVlO1xuXG5cdGlmIChhY3R1YWxWYWx1ZS5lcXVhbHMoZXhwZWN0ZWRWYWx1ZSkpIHJldHVybiBcIlwiO1xuXHRpZiAoaXNOb25lKGV4cGVjdGVkKSAmJiAhaXNOb25lKHRoaXMpKSByZXR1cm4gXCJyZW5kZXJlZCB3aGVuIG5vdCBleHBlY3RlZFwiO1xuXHRpZiAoIWlzTm9uZShleHBlY3RlZCkgJiYgaXNOb25lKHRoaXMpKSByZXR1cm4gXCJub3QgcmVuZGVyZWRcIjtcblxuXHR2YXIgZGVzYyA9IGFjdHVhbFZhbHVlLmNvbXBhcmUoZXhwZWN0ZWRWYWx1ZSkgPiAwID8gXCIgbGFyZ2VyIHRoYW4gZXhwZWN0ZWRcIiA6IFwiIHNtYWxsZXIgdGhhbiBleHBlY3RlZFwiO1xuXHRyZXR1cm4gYWN0dWFsVmFsdWUuZGlmZihleHBlY3RlZFZhbHVlKSArIGRlc2M7XG59KTtcblxuTWUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdGVuc3VyZS5zaWduYXR1cmUoYXJndW1lbnRzLCBbXSk7XG5cblx0aWYgKGlzTm9uZSh0aGlzKSkgcmV0dXJuIFwibm90IHJlbmRlcmVkXCI7XG5cdGVsc2UgcmV0dXJuIHRoaXMuX3ZhbHVlLnRvU3RyaW5nKCk7XG59O1xuXG5NZS5wcm90b3R5cGUudG9QaXhlbHMgPSBmdW5jdGlvbiB0b1BpeGVscygpIHtcblx0ZW5zdXJlLnNpZ25hdHVyZShhcmd1bWVudHMsIFtdKTtcblx0cmV0dXJuIHRoaXMuX3ZhbHVlO1xufTtcblxuZnVuY3Rpb24gaXNOb25lKHNpemUpIHtcblx0cmV0dXJuIHNpemUuX3ZhbHVlLmVxdWFscyhQaXhlbHMuTk9ORSk7XG59IiwiLy8gQ29weXJpZ2h0IChjKSAyMDE0IFRpdGFuaXVtIEkuVC4gTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBGb3IgbGljZW5zZSwgc2VlIFwiUkVBRE1FXCIgb3IgXCJMSUNFTlNFXCIgZmlsZS5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgZW5zdXJlID0gcmVxdWlyZShcIi4uL3V0aWwvZW5zdXJlLmpzXCIpO1xudmFyIG9vcCA9IHJlcXVpcmUoXCIuLi91dGlsL29vcC5qc1wiKTtcbnZhciBzaGltID0gcmVxdWlyZShcIi4uL3V0aWwvc2hpbS5qc1wiKTtcblxudmFyIE1lID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBWYWx1ZSgpIHt9O1xuTWUuZXh0ZW5kID0gb29wLmV4dGVuZEZuKE1lKTtcbm9vcC5tYWtlQWJzdHJhY3QoTWUsIFtcblx0XCJjb21wYXRpYmlsaXR5XCIsXG5cdFwiZGlmZlwiLFxuXHRcInRvU3RyaW5nXCJcbl0pO1xuXG5NZS5zYWZlID0gZnVuY3Rpb24gc2FmZShmbikge1xuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0ZW5zdXJlQ29tcGF0aWJpbGl0eSh0aGlzLCB0aGlzLmNvbXBhdGliaWxpdHkoKSwgYXJndW1lbnRzKTtcblx0XHRyZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0fTtcbn07XG5cbk1lLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uIHZhbHVlKCkge1xuXHRlbnN1cmUuc2lnbmF0dXJlKGFyZ3VtZW50cywgW10pO1xuXHRyZXR1cm4gdGhpcztcbn07XG5cbk1lLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHModGhhdCkge1xuXHRyZXR1cm4gdGhpcy5kaWZmKHRoYXQpID09PSBcIlwiO1xufTtcblxuZnVuY3Rpb24gZW5zdXJlQ29tcGF0aWJpbGl0eShzZWxmLCBjb21wYXRpYmxlLCBhcmdzKSB7XG5cdHZhciBhcmc7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykgeyAgIC8vIGFyZ3MgaXMgbm90IGFuIEFycmF5LCBjYW4ndCB1c2UgZm9yRWFjaFxuXHRcdGFyZyA9IGFyZ3NbaV07XG5cdFx0Y2hlY2tPbmVBcmcoc2VsZiwgY29tcGF0aWJsZSwgYXJnKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjaGVja09uZUFyZyhzZWxmLCBjb21wYXRpYmxlLCBhcmcpIHtcblx0dmFyIHR5cGUgPSB0eXBlb2YgYXJnO1xuXHRpZiAoYXJnID09PSBudWxsKSB0eXBlID0gXCJudWxsXCI7XG5cdGlmICh0eXBlICE9PSBcIm9iamVjdFwiKSB0aHJvd0Vycm9yKHR5cGUpO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgY29tcGF0aWJsZS5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChhcmcgaW5zdGFuY2VvZiBjb21wYXRpYmxlW2ldKSByZXR1cm47XG5cdH1cblx0dGhyb3dFcnJvcihvb3AuaW5zdGFuY2VOYW1lKGFyZykpO1xuXG5cdGZ1bmN0aW9uIHRocm93RXJyb3IodHlwZSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihvb3AuaW5zdGFuY2VOYW1lKHNlbGYpICsgXCIgaXNuJ3QgY29tcGF0aWJsZSB3aXRoIFwiICsgdHlwZSk7XG5cdH1cbn0iLCIvKiFcbiAqIGFzeW5jXG4gKiBodHRwczovL2dpdGh1Yi5jb20vY2FvbGFuL2FzeW5jXG4gKlxuICogQ29weXJpZ2h0IDIwMTAtMjAxNCBDYW9sYW4gTWNNYWhvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cbihmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgYXN5bmMgPSB7fTtcbiAgICBmdW5jdGlvbiBub29wKCkge31cbiAgICBmdW5jdGlvbiBpZGVudGl0eSh2KSB7XG4gICAgICAgIHJldHVybiB2O1xuICAgIH1cbiAgICBmdW5jdGlvbiB0b0Jvb2wodikge1xuICAgICAgICByZXR1cm4gISF2O1xuICAgIH1cbiAgICBmdW5jdGlvbiBub3RJZCh2KSB7XG4gICAgICAgIHJldHVybiAhdjtcbiAgICB9XG5cbiAgICAvLyBnbG9iYWwgb24gdGhlIHNlcnZlciwgd2luZG93IGluIHRoZSBicm93c2VyXG4gICAgdmFyIHByZXZpb3VzX2FzeW5jO1xuXG4gICAgLy8gRXN0YWJsaXNoIHRoZSByb290IG9iamVjdCwgYHdpbmRvd2AgKGBzZWxmYCkgaW4gdGhlIGJyb3dzZXIsIGBnbG9iYWxgXG4gICAgLy8gb24gdGhlIHNlcnZlciwgb3IgYHRoaXNgIGluIHNvbWUgdmlydHVhbCBtYWNoaW5lcy4gV2UgdXNlIGBzZWxmYFxuICAgIC8vIGluc3RlYWQgb2YgYHdpbmRvd2AgZm9yIGBXZWJXb3JrZXJgIHN1cHBvcnQuXG4gICAgdmFyIHJvb3QgPSB0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCcgJiYgc2VsZi5zZWxmID09PSBzZWxmICYmIHNlbGYgfHxcbiAgICAgICAgICAgIHR5cGVvZiBnbG9iYWwgPT09ICdvYmplY3QnICYmIGdsb2JhbC5nbG9iYWwgPT09IGdsb2JhbCAmJiBnbG9iYWwgfHxcbiAgICAgICAgICAgIHRoaXM7XG5cbiAgICBpZiAocm9vdCAhPSBudWxsKSB7XG4gICAgICAgIHByZXZpb3VzX2FzeW5jID0gcm9vdC5hc3luYztcbiAgICB9XG5cbiAgICBhc3luYy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByb290LmFzeW5jID0gcHJldmlvdXNfYXN5bmM7XG4gICAgICAgIHJldHVybiBhc3luYztcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gb25seV9vbmNlKGZuKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChmbiA9PT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKFwiQ2FsbGJhY2sgd2FzIGFscmVhZHkgY2FsbGVkLlwiKTtcbiAgICAgICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBmbiA9IG51bGw7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX29uY2UoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGZuID09PSBudWxsKSByZXR1cm47XG4gICAgICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgZm4gPSBudWxsO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vLy8gY3Jvc3MtYnJvd3NlciBjb21wYXRpYmxpdHkgZnVuY3Rpb25zIC8vLy9cblxuICAgIHZhciBfdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4gICAgdmFyIF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBfdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH07XG5cbiAgICAvLyBQb3J0ZWQgZnJvbSB1bmRlcnNjb3JlLmpzIGlzT2JqZWN0XG4gICAgdmFyIF9pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiBvYmo7XG4gICAgICAgIHJldHVybiB0eXBlID09PSAnZnVuY3Rpb24nIHx8IHR5cGUgPT09ICdvYmplY3QnICYmICEhb2JqO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBfaXNBcnJheUxpa2UoYXJyKSB7XG4gICAgICAgIHJldHVybiBfaXNBcnJheShhcnIpIHx8IChcbiAgICAgICAgICAgIC8vIGhhcyBhIHBvc2l0aXZlIGludGVnZXIgbGVuZ3RoIHByb3BlcnR5XG4gICAgICAgICAgICB0eXBlb2YgYXJyLmxlbmd0aCA9PT0gXCJudW1iZXJcIiAmJlxuICAgICAgICAgICAgYXJyLmxlbmd0aCA+PSAwICYmXG4gICAgICAgICAgICBhcnIubGVuZ3RoICUgMSA9PT0gMFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9lYWNoKGNvbGwsIGl0ZXJhdG9yKSB7XG4gICAgICAgIHJldHVybiBfaXNBcnJheUxpa2UoY29sbCkgP1xuICAgICAgICAgICAgX2FycmF5RWFjaChjb2xsLCBpdGVyYXRvcikgOlxuICAgICAgICAgICAgX2ZvckVhY2hPZihjb2xsLCBpdGVyYXRvcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2FycmF5RWFjaChhcnIsIGl0ZXJhdG9yKSB7XG4gICAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgICAgbGVuZ3RoID0gYXJyLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgaXRlcmF0b3IoYXJyW2luZGV4XSwgaW5kZXgsIGFycik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfbWFwKGFyciwgaXRlcmF0b3IpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgICBsZW5ndGggPSBhcnIubGVuZ3RoLFxuICAgICAgICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdG9yKGFycltpbmRleF0sIGluZGV4LCBhcnIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3JhbmdlKGNvdW50KSB7XG4gICAgICAgIHJldHVybiBfbWFwKEFycmF5KGNvdW50KSwgZnVuY3Rpb24gKHYsIGkpIHsgcmV0dXJuIGk7IH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZWR1Y2UoYXJyLCBpdGVyYXRvciwgbWVtbykge1xuICAgICAgICBfYXJyYXlFYWNoKGFyciwgZnVuY3Rpb24gKHgsIGksIGEpIHtcbiAgICAgICAgICAgIG1lbW8gPSBpdGVyYXRvcihtZW1vLCB4LCBpLCBhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtZW1vO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9mb3JFYWNoT2Yob2JqZWN0LCBpdGVyYXRvcikge1xuICAgICAgICBfYXJyYXlFYWNoKF9rZXlzKG9iamVjdCksIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKG9iamVjdFtrZXldLCBrZXkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfaW5kZXhPZihhcnIsIGl0ZW0pIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhcnJbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICB2YXIgX2tleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHZhciBrZXlzID0gW107XG4gICAgICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAga2V5cy5wdXNoKGspO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBfa2V5SXRlcmF0b3IoY29sbCkge1xuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB2YXIgbGVuO1xuICAgICAgICB2YXIga2V5cztcbiAgICAgICAgaWYgKF9pc0FycmF5TGlrZShjb2xsKSkge1xuICAgICAgICAgICAgbGVuID0gY29sbC5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGkgPCBsZW4gPyBpIDogbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBrZXlzID0gX2tleXMoY29sbCk7XG4gICAgICAgICAgICBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICByZXR1cm4gaSA8IGxlbiA/IGtleXNbaV0gOiBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNpbWlsYXIgdG8gRVM2J3MgcmVzdCBwYXJhbSAoaHR0cDovL2FyaXlhLm9maWxhYnMuY29tLzIwMTMvMDMvZXM2LWFuZC1yZXN0LXBhcmFtZXRlci5odG1sKVxuICAgIC8vIFRoaXMgYWNjdW11bGF0ZXMgdGhlIGFyZ3VtZW50cyBwYXNzZWQgaW50byBhbiBhcnJheSwgYWZ0ZXIgYSBnaXZlbiBpbmRleC5cbiAgICAvLyBGcm9tIHVuZGVyc2NvcmUuanMgKGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNoa2VuYXMvdW5kZXJzY29yZS9wdWxsLzIxNDApLlxuICAgIGZ1bmN0aW9uIF9yZXN0UGFyYW0oZnVuYywgc3RhcnRJbmRleCkge1xuICAgICAgICBzdGFydEluZGV4ID0gc3RhcnRJbmRleCA9PSBudWxsID8gZnVuYy5sZW5ndGggLSAxIDogK3N0YXJ0SW5kZXg7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBNYXRoLm1heChhcmd1bWVudHMubGVuZ3RoIC0gc3RhcnRJbmRleCwgMCk7XG4gICAgICAgICAgICB2YXIgcmVzdCA9IEFycmF5KGxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgcmVzdFtpbmRleF0gPSBhcmd1bWVudHNbaW5kZXggKyBzdGFydEluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAoc3RhcnRJbmRleCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLCByZXN0KTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpcywgYXJndW1lbnRzWzBdLCByZXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEN1cnJlbnRseSB1bnVzZWQgYnV0IGhhbmRsZSBjYXNlcyBvdXRzaWRlIG9mIHRoZSBzd2l0Y2ggc3RhdGVtZW50OlxuICAgICAgICAgICAgLy8gdmFyIGFyZ3MgPSBBcnJheShzdGFydEluZGV4ICsgMSk7XG4gICAgICAgICAgICAvLyBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBzdGFydEluZGV4OyBpbmRleCsrKSB7XG4gICAgICAgICAgICAvLyAgICAgYXJnc1tpbmRleF0gPSBhcmd1bWVudHNbaW5kZXhdO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gYXJnc1tzdGFydEluZGV4XSA9IHJlc3Q7XG4gICAgICAgICAgICAvLyByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfd2l0aG91dEluZGV4KGl0ZXJhdG9yKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodmFsdWUsIGluZGV4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yKHZhbHVlLCBjYWxsYmFjayk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8vLyBleHBvcnRlZCBhc3luYyBtb2R1bGUgZnVuY3Rpb25zIC8vLy9cblxuICAgIC8vLy8gbmV4dFRpY2sgaW1wbGVtZW50YXRpb24gd2l0aCBicm93c2VyLWNvbXBhdGlibGUgZmFsbGJhY2sgLy8vL1xuXG4gICAgLy8gY2FwdHVyZSB0aGUgZ2xvYmFsIHJlZmVyZW5jZSB0byBndWFyZCBhZ2FpbnN0IGZha2VUaW1lciBtb2Nrc1xuICAgIHZhciBfc2V0SW1tZWRpYXRlID0gdHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gJ2Z1bmN0aW9uJyAmJiBzZXRJbW1lZGlhdGU7XG5cbiAgICB2YXIgX2RlbGF5ID0gX3NldEltbWVkaWF0ZSA/IGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgIC8vIG5vdCBhIGRpcmVjdCBhbGlhcyBmb3IgSUUxMCBjb21wYXRpYmlsaXR5XG4gICAgICAgIF9zZXRJbW1lZGlhdGUoZm4pO1xuICAgIH0gOiBmdW5jdGlvbihmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgcHJvY2Vzcy5uZXh0VGljayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBhc3luYy5uZXh0VGljayA9IHByb2Nlc3MubmV4dFRpY2s7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYXN5bmMubmV4dFRpY2sgPSBfZGVsYXk7XG4gICAgfVxuICAgIGFzeW5jLnNldEltbWVkaWF0ZSA9IF9zZXRJbW1lZGlhdGUgPyBfZGVsYXkgOiBhc3luYy5uZXh0VGljaztcblxuXG4gICAgYXN5bmMuZm9yRWFjaCA9XG4gICAgYXN5bmMuZWFjaCA9IGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gYXN5bmMuZWFjaE9mKGFyciwgX3dpdGhvdXRJbmRleChpdGVyYXRvciksIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgYXN5bmMuZm9yRWFjaFNlcmllcyA9XG4gICAgYXN5bmMuZWFjaFNlcmllcyA9IGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gYXN5bmMuZWFjaE9mU2VyaWVzKGFyciwgX3dpdGhvdXRJbmRleChpdGVyYXRvciksIGNhbGxiYWNrKTtcbiAgICB9O1xuXG5cbiAgICBhc3luYy5mb3JFYWNoTGltaXQgPVxuICAgIGFzeW5jLmVhY2hMaW1pdCA9IGZ1bmN0aW9uIChhcnIsIGxpbWl0LCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIF9lYWNoT2ZMaW1pdChsaW1pdCkoYXJyLCBfd2l0aG91dEluZGV4KGl0ZXJhdG9yKSwgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBhc3luYy5mb3JFYWNoT2YgPVxuICAgIGFzeW5jLmVhY2hPZiA9IGZ1bmN0aW9uIChvYmplY3QsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IF9vbmNlKGNhbGxiYWNrIHx8IG5vb3ApO1xuICAgICAgICBvYmplY3QgPSBvYmplY3QgfHwgW107XG4gICAgICAgIHZhciBzaXplID0gX2lzQXJyYXlMaWtlKG9iamVjdCkgPyBvYmplY3QubGVuZ3RoIDogX2tleXMob2JqZWN0KS5sZW5ndGg7XG4gICAgICAgIHZhciBjb21wbGV0ZWQgPSAwO1xuICAgICAgICBpZiAoIXNpemUpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgfVxuICAgICAgICBfZWFjaChvYmplY3QsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICBpdGVyYXRvcihvYmplY3Rba2V5XSwga2V5LCBvbmx5X29uY2UoZG9uZSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgZnVuY3Rpb24gZG9uZShlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29tcGxldGVkICs9IDE7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlZCA+PSBzaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBhc3luYy5mb3JFYWNoT2ZTZXJpZXMgPVxuICAgIGFzeW5jLmVhY2hPZlNlcmllcyA9IGZ1bmN0aW9uIChvYmosIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IF9vbmNlKGNhbGxiYWNrIHx8IG5vb3ApO1xuICAgICAgICBvYmogPSBvYmogfHwgW107XG4gICAgICAgIHZhciBuZXh0S2V5ID0gX2tleUl0ZXJhdG9yKG9iaik7XG4gICAgICAgIHZhciBrZXkgPSBuZXh0S2V5KCk7XG4gICAgICAgIGZ1bmN0aW9uIGl0ZXJhdGUoKSB7XG4gICAgICAgICAgICB2YXIgc3luYyA9IHRydWU7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXRlcmF0b3Iob2JqW2tleV0sIGtleSwgb25seV9vbmNlKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSBuZXh0S2V5KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzeW5jKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMuc2V0SW1tZWRpYXRlKGl0ZXJhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBzeW5jID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaXRlcmF0ZSgpO1xuICAgIH07XG5cblxuXG4gICAgYXN5bmMuZm9yRWFjaE9mTGltaXQgPVxuICAgIGFzeW5jLmVhY2hPZkxpbWl0ID0gZnVuY3Rpb24gKG9iaiwgbGltaXQsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBfZWFjaE9mTGltaXQobGltaXQpKG9iaiwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gX2VhY2hPZkxpbWl0KGxpbWl0KSB7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChvYmosIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBfb25jZShjYWxsYmFjayB8fCBub29wKTtcbiAgICAgICAgICAgIG9iaiA9IG9iaiB8fCBbXTtcbiAgICAgICAgICAgIHZhciBuZXh0S2V5ID0gX2tleUl0ZXJhdG9yKG9iaik7XG4gICAgICAgICAgICBpZiAobGltaXQgPD0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkb25lID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgcnVubmluZyA9IDA7XG4gICAgICAgICAgICB2YXIgZXJyb3JlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAoZnVuY3Rpb24gcmVwbGVuaXNoICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9uZSAmJiBydW5uaW5nIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHdoaWxlIChydW5uaW5nIDwgbGltaXQgJiYgIWVycm9yZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IG5leHRLZXkoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocnVubmluZyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcnVubmluZyArPSAxO1xuICAgICAgICAgICAgICAgICAgICBpdGVyYXRvcihvYmpba2V5XSwga2V5LCBvbmx5X29uY2UoZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcnVubmluZyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBsZW5pc2goKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBkb1BhcmFsbGVsKGZuKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAob2JqLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJldHVybiBmbihhc3luYy5lYWNoT2YsIG9iaiwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZG9QYXJhbGxlbExpbWl0KGZuKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAob2JqLCBsaW1pdCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4oX2VhY2hPZkxpbWl0KGxpbWl0KSwgb2JqLCBpdGVyYXRvciwgY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBkb1Nlcmllcyhmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG9iaiwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4oYXN5bmMuZWFjaE9mU2VyaWVzLCBvYmosIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2FzeW5jTWFwKGVhY2hmbiwgYXJyLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBfb25jZShjYWxsYmFjayB8fCBub29wKTtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZWFjaGZuKGFyciwgZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKHZhbHVlLCBmdW5jdGlvbiAoZXJyLCB2KSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0c1tpbmRleF0gPSB2O1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHRzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMubWFwID0gZG9QYXJhbGxlbChfYXN5bmNNYXApO1xuICAgIGFzeW5jLm1hcFNlcmllcyA9IGRvU2VyaWVzKF9hc3luY01hcCk7XG4gICAgYXN5bmMubWFwTGltaXQgPSBkb1BhcmFsbGVsTGltaXQoX2FzeW5jTWFwKTtcblxuICAgIC8vIHJlZHVjZSBvbmx5IGhhcyBhIHNlcmllcyB2ZXJzaW9uLCBhcyBkb2luZyByZWR1Y2UgaW4gcGFyYWxsZWwgd29uJ3RcbiAgICAvLyB3b3JrIGluIG1hbnkgc2l0dWF0aW9ucy5cbiAgICBhc3luYy5pbmplY3QgPVxuICAgIGFzeW5jLmZvbGRsID1cbiAgICBhc3luYy5yZWR1Y2UgPSBmdW5jdGlvbiAoYXJyLCBtZW1vLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgYXN5bmMuZWFjaE9mU2VyaWVzKGFyciwgZnVuY3Rpb24gKHgsIGksIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpdGVyYXRvcihtZW1vLCB4LCBmdW5jdGlvbiAoZXJyLCB2KSB7XG4gICAgICAgICAgICAgICAgbWVtbyA9IHY7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIgfHwgbnVsbCwgbWVtbyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBhc3luYy5mb2xkciA9XG4gICAgYXN5bmMucmVkdWNlUmlnaHQgPSBmdW5jdGlvbiAoYXJyLCBtZW1vLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHJldmVyc2VkID0gX21hcChhcnIsIGlkZW50aXR5KS5yZXZlcnNlKCk7XG4gICAgICAgIGFzeW5jLnJlZHVjZShyZXZlcnNlZCwgbWVtbywgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gX2ZpbHRlcihlYWNoZm4sIGFyciwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICAgIGVhY2hmbihhcnIsIGZ1bmN0aW9uICh4LCBpbmRleCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKHgsIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgaWYgKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHtpbmRleDogaW5kZXgsIHZhbHVlOiB4fSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2FsbGJhY2soX21hcChyZXN1bHRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5pbmRleCAtIGIuaW5kZXg7XG4gICAgICAgICAgICB9KSwgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geC52YWx1ZTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMuc2VsZWN0ID1cbiAgICBhc3luYy5maWx0ZXIgPSBkb1BhcmFsbGVsKF9maWx0ZXIpO1xuXG4gICAgYXN5bmMuc2VsZWN0TGltaXQgPVxuICAgIGFzeW5jLmZpbHRlckxpbWl0ID0gZG9QYXJhbGxlbExpbWl0KF9maWx0ZXIpO1xuXG4gICAgYXN5bmMuc2VsZWN0U2VyaWVzID1cbiAgICBhc3luYy5maWx0ZXJTZXJpZXMgPSBkb1NlcmllcyhfZmlsdGVyKTtcblxuICAgIGZ1bmN0aW9uIF9yZWplY3QoZWFjaGZuLCBhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBfZmlsdGVyKGVhY2hmbiwgYXJyLCBmdW5jdGlvbih2YWx1ZSwgY2IpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKHZhbHVlLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgY2IoIXYpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgYXN5bmMucmVqZWN0ID0gZG9QYXJhbGxlbChfcmVqZWN0KTtcbiAgICBhc3luYy5yZWplY3RMaW1pdCA9IGRvUGFyYWxsZWxMaW1pdChfcmVqZWN0KTtcbiAgICBhc3luYy5yZWplY3RTZXJpZXMgPSBkb1NlcmllcyhfcmVqZWN0KTtcblxuICAgIGZ1bmN0aW9uIF9jcmVhdGVUZXN0ZXIoZWFjaGZuLCBjaGVjaywgZ2V0UmVzdWx0KSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihhcnIsIGxpbWl0LCBpdGVyYXRvciwgY2IpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGRvbmUoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNiKSBjYihnZXRSZXN1bHQoZmFsc2UsIHZvaWQgMCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gaXRlcmF0ZWUoeCwgXywgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNiKSByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICBpdGVyYXRvcih4LCBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2IgJiYgY2hlY2sodikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiKGdldFJlc3VsdCh0cnVlLCB4KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYiA9IGl0ZXJhdG9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgICAgIGVhY2hmbihhcnIsIGxpbWl0LCBpdGVyYXRlZSwgZG9uZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNiID0gaXRlcmF0b3I7XG4gICAgICAgICAgICAgICAgaXRlcmF0b3IgPSBsaW1pdDtcbiAgICAgICAgICAgICAgICBlYWNoZm4oYXJyLCBpdGVyYXRlZSwgZG9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgYXN5bmMuYW55ID1cbiAgICBhc3luYy5zb21lID0gX2NyZWF0ZVRlc3Rlcihhc3luYy5lYWNoT2YsIHRvQm9vbCwgaWRlbnRpdHkpO1xuXG4gICAgYXN5bmMuc29tZUxpbWl0ID0gX2NyZWF0ZVRlc3Rlcihhc3luYy5lYWNoT2ZMaW1pdCwgdG9Cb29sLCBpZGVudGl0eSk7XG5cbiAgICBhc3luYy5hbGwgPVxuICAgIGFzeW5jLmV2ZXJ5ID0gX2NyZWF0ZVRlc3Rlcihhc3luYy5lYWNoT2YsIG5vdElkLCBub3RJZCk7XG5cbiAgICBhc3luYy5ldmVyeUxpbWl0ID0gX2NyZWF0ZVRlc3Rlcihhc3luYy5lYWNoT2ZMaW1pdCwgbm90SWQsIG5vdElkKTtcblxuICAgIGZ1bmN0aW9uIF9maW5kR2V0UmVzdWx0KHYsIHgpIHtcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICAgIGFzeW5jLmRldGVjdCA9IF9jcmVhdGVUZXN0ZXIoYXN5bmMuZWFjaE9mLCBpZGVudGl0eSwgX2ZpbmRHZXRSZXN1bHQpO1xuICAgIGFzeW5jLmRldGVjdFNlcmllcyA9IF9jcmVhdGVUZXN0ZXIoYXN5bmMuZWFjaE9mU2VyaWVzLCBpZGVudGl0eSwgX2ZpbmRHZXRSZXN1bHQpO1xuICAgIGFzeW5jLmRldGVjdExpbWl0ID0gX2NyZWF0ZVRlc3Rlcihhc3luYy5lYWNoT2ZMaW1pdCwgaWRlbnRpdHksIF9maW5kR2V0UmVzdWx0KTtcblxuICAgIGFzeW5jLnNvcnRCeSA9IGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBhc3luYy5tYXAoYXJyLCBmdW5jdGlvbiAoeCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKHgsIGZ1bmN0aW9uIChlcnIsIGNyaXRlcmlhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge3ZhbHVlOiB4LCBjcml0ZXJpYTogY3JpdGVyaWF9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgX21hcChyZXN1bHRzLnNvcnQoY29tcGFyYXRvciksIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4LnZhbHVlO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBjb21wYXJhdG9yKGxlZnQsIHJpZ2h0KSB7XG4gICAgICAgICAgICB2YXIgYSA9IGxlZnQuY3JpdGVyaWEsIGIgPSByaWdodC5jcml0ZXJpYTtcbiAgICAgICAgICAgIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogMDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBhc3luYy5hdXRvID0gZnVuY3Rpb24gKHRhc2tzLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IF9vbmNlKGNhbGxiYWNrIHx8IG5vb3ApO1xuICAgICAgICB2YXIga2V5cyA9IF9rZXlzKHRhc2tzKTtcbiAgICAgICAgdmFyIHJlbWFpbmluZ1Rhc2tzID0ga2V5cy5sZW5ndGg7XG4gICAgICAgIGlmICghcmVtYWluaW5nVGFza3MpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXN1bHRzID0ge307XG5cbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBhZGRMaXN0ZW5lcihmbikge1xuICAgICAgICAgICAgbGlzdGVuZXJzLnVuc2hpZnQoZm4pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKGZuKSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gX2luZGV4T2YobGlzdGVuZXJzLCBmbik7XG4gICAgICAgICAgICBpZiAoaWR4ID49IDApIGxpc3RlbmVycy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0YXNrQ29tcGxldGUoKSB7XG4gICAgICAgICAgICByZW1haW5pbmdUYXNrcy0tO1xuICAgICAgICAgICAgX2FycmF5RWFjaChsaXN0ZW5lcnMuc2xpY2UoMCksIGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZExpc3RlbmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghcmVtYWluaW5nVGFza3MpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgX2FycmF5RWFjaChrZXlzLCBmdW5jdGlvbiAoaykge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSBfaXNBcnJheSh0YXNrc1trXSkgPyB0YXNrc1trXTogW3Rhc2tzW2tdXTtcbiAgICAgICAgICAgIHZhciB0YXNrQ2FsbGJhY2sgPSBfcmVzdFBhcmFtKGZ1bmN0aW9uKGVyciwgYXJncykge1xuICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3MgPSBhcmdzWzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzYWZlUmVzdWx0cyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBfZm9yRWFjaE9mKHJlc3VsdHMsIGZ1bmN0aW9uKHZhbCwgcmtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2FmZVJlc3VsdHNbcmtleV0gPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzYWZlUmVzdWx0c1trXSA9IGFyZ3M7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgc2FmZVJlc3VsdHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1trXSA9IGFyZ3M7XG4gICAgICAgICAgICAgICAgICAgIGFzeW5jLnNldEltbWVkaWF0ZSh0YXNrQ29tcGxldGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIHJlcXVpcmVzID0gdGFzay5zbGljZSgwLCB0YXNrLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgLy8gcHJldmVudCBkZWFkLWxvY2tzXG4gICAgICAgICAgICB2YXIgbGVuID0gcmVxdWlyZXMubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGRlcDtcbiAgICAgICAgICAgIHdoaWxlIChsZW4tLSkge1xuICAgICAgICAgICAgICAgIGlmICghKGRlcCA9IHRhc2tzW3JlcXVpcmVzW2xlbl1dKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0hhcyBpbmV4aXN0YW50IGRlcGVuZGVuY3knKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKF9pc0FycmF5KGRlcCkgJiYgX2luZGV4T2YoZGVwLCBrKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSGFzIGN5Y2xpYyBkZXBlbmRlbmNpZXMnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiByZWFkeSgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3JlZHVjZShyZXF1aXJlcywgZnVuY3Rpb24gKGEsIHgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChhICYmIHJlc3VsdHMuaGFzT3duUHJvcGVydHkoeCkpO1xuICAgICAgICAgICAgICAgIH0sIHRydWUpICYmICFyZXN1bHRzLmhhc093blByb3BlcnR5KGspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlYWR5KCkpIHtcbiAgICAgICAgICAgICAgICB0YXNrW3Rhc2subGVuZ3RoIC0gMV0odGFza0NhbGxiYWNrLCByZXN1bHRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxpc3RlbmVyKCkge1xuICAgICAgICAgICAgICAgIGlmIChyZWFkeSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgdGFza1t0YXNrLmxlbmd0aCAtIDFdKHRhc2tDYWxsYmFjaywgcmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG5cblxuICAgIGFzeW5jLnJldHJ5ID0gZnVuY3Rpb24odGltZXMsIHRhc2ssIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBERUZBVUxUX1RJTUVTID0gNTtcbiAgICAgICAgdmFyIERFRkFVTFRfSU5URVJWQUwgPSAwO1xuXG4gICAgICAgIHZhciBhdHRlbXB0cyA9IFtdO1xuXG4gICAgICAgIHZhciBvcHRzID0ge1xuICAgICAgICAgICAgdGltZXM6IERFRkFVTFRfVElNRVMsXG4gICAgICAgICAgICBpbnRlcnZhbDogREVGQVVMVF9JTlRFUlZBTFxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHBhcnNlVGltZXMoYWNjLCB0KXtcbiAgICAgICAgICAgIGlmKHR5cGVvZiB0ID09PSAnbnVtYmVyJyl7XG4gICAgICAgICAgICAgICAgYWNjLnRpbWVzID0gcGFyc2VJbnQodCwgMTApIHx8IERFRkFVTFRfVElNRVM7XG4gICAgICAgICAgICB9IGVsc2UgaWYodHlwZW9mIHQgPT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgICAgICBhY2MudGltZXMgPSBwYXJzZUludCh0LnRpbWVzLCAxMCkgfHwgREVGQVVMVF9USU1FUztcbiAgICAgICAgICAgICAgICBhY2MuaW50ZXJ2YWwgPSBwYXJzZUludCh0LmludGVydmFsLCAxMCkgfHwgREVGQVVMVF9JTlRFUlZBTDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBhcmd1bWVudCB0eXBlIGZvciBcXCd0aW1lc1xcJzogJyArIHR5cGVvZiB0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBpZiAobGVuZ3RoIDwgMSB8fCBsZW5ndGggPiAzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnRzIC0gbXVzdCBiZSBlaXRoZXIgKHRhc2spLCAodGFzaywgY2FsbGJhY2spLCAodGltZXMsIHRhc2spIG9yICh0aW1lcywgdGFzaywgY2FsbGJhY2spJyk7XG4gICAgICAgIH0gZWxzZSBpZiAobGVuZ3RoIDw9IDIgJiYgdHlwZW9mIHRpbWVzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IHRhc2s7XG4gICAgICAgICAgICB0YXNrID0gdGltZXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB0aW1lcyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcGFyc2VUaW1lcyhvcHRzLCB0aW1lcyk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0cy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICBvcHRzLnRhc2sgPSB0YXNrO1xuXG4gICAgICAgIGZ1bmN0aW9uIHdyYXBwZWRUYXNrKHdyYXBwZWRDYWxsYmFjaywgd3JhcHBlZFJlc3VsdHMpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIHJldHJ5QXR0ZW1wdCh0YXNrLCBmaW5hbEF0dGVtcHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oc2VyaWVzQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGFzayhmdW5jdGlvbihlcnIsIHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJpZXNDYWxsYmFjayghZXJyIHx8IGZpbmFsQXR0ZW1wdCwge2VycjogZXJyLCByZXN1bHQ6IHJlc3VsdH0pO1xuICAgICAgICAgICAgICAgICAgICB9LCB3cmFwcGVkUmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gcmV0cnlJbnRlcnZhbChpbnRlcnZhbCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNlcmllc0NhbGxiYWNrKXtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWVzQ2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIGludGVydmFsKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aGlsZSAob3B0cy50aW1lcykge1xuXG4gICAgICAgICAgICAgICAgdmFyIGZpbmFsQXR0ZW1wdCA9ICEob3B0cy50aW1lcy09MSk7XG4gICAgICAgICAgICAgICAgYXR0ZW1wdHMucHVzaChyZXRyeUF0dGVtcHQob3B0cy50YXNrLCBmaW5hbEF0dGVtcHQpKTtcbiAgICAgICAgICAgICAgICBpZighZmluYWxBdHRlbXB0ICYmIG9wdHMuaW50ZXJ2YWwgPiAwKXtcbiAgICAgICAgICAgICAgICAgICAgYXR0ZW1wdHMucHVzaChyZXRyeUludGVydmFsKG9wdHMuaW50ZXJ2YWwpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFzeW5jLnNlcmllcyhhdHRlbXB0cywgZnVuY3Rpb24oZG9uZSwgZGF0YSl7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGFbZGF0YS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAod3JhcHBlZENhbGxiYWNrIHx8IG9wdHMuY2FsbGJhY2spKGRhdGEuZXJyLCBkYXRhLnJlc3VsdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIGEgY2FsbGJhY2sgaXMgcGFzc2VkLCBydW4gdGhpcyBhcyBhIGNvbnRyb2xsIGZsb3dcbiAgICAgICAgcmV0dXJuIG9wdHMuY2FsbGJhY2sgPyB3cmFwcGVkVGFzaygpIDogd3JhcHBlZFRhc2s7XG4gICAgfTtcblxuICAgIGFzeW5jLndhdGVyZmFsbCA9IGZ1bmN0aW9uICh0YXNrcywgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBfb25jZShjYWxsYmFjayB8fCBub29wKTtcbiAgICAgICAgaWYgKCFfaXNBcnJheSh0YXNrcykpIHtcbiAgICAgICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IHRvIHdhdGVyZmFsbCBtdXN0IGJlIGFuIGFycmF5IG9mIGZ1bmN0aW9ucycpO1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0YXNrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHdyYXBJdGVyYXRvcihpdGVyYXRvcikge1xuICAgICAgICAgICAgcmV0dXJuIF9yZXN0UGFyYW0oZnVuY3Rpb24gKGVyciwgYXJncykge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkobnVsbCwgW2Vycl0uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0ID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKHdyYXBJdGVyYXRvcihuZXh0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVuc3VyZUFzeW5jKGl0ZXJhdG9yKS5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB3cmFwSXRlcmF0b3IoYXN5bmMuaXRlcmF0b3IodGFza3MpKSgpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBfcGFyYWxsZWwoZWFjaGZuLCB0YXNrcywgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBub29wO1xuICAgICAgICB2YXIgcmVzdWx0cyA9IF9pc0FycmF5TGlrZSh0YXNrcykgPyBbXSA6IHt9O1xuXG4gICAgICAgIGVhY2hmbih0YXNrcywgZnVuY3Rpb24gKHRhc2ssIGtleSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRhc2soX3Jlc3RQYXJhbShmdW5jdGlvbiAoZXJyLCBhcmdzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3NbMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc3VsdHNba2V5XSA9IGFyZ3M7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHRzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMucGFyYWxsZWwgPSBmdW5jdGlvbiAodGFza3MsIGNhbGxiYWNrKSB7XG4gICAgICAgIF9wYXJhbGxlbChhc3luYy5lYWNoT2YsIHRhc2tzLCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIGFzeW5jLnBhcmFsbGVsTGltaXQgPSBmdW5jdGlvbih0YXNrcywgbGltaXQsIGNhbGxiYWNrKSB7XG4gICAgICAgIF9wYXJhbGxlbChfZWFjaE9mTGltaXQobGltaXQpLCB0YXNrcywgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBhc3luYy5zZXJpZXMgPSBmdW5jdGlvbih0YXNrcywgY2FsbGJhY2spIHtcbiAgICAgICAgX3BhcmFsbGVsKGFzeW5jLmVhY2hPZlNlcmllcywgdGFza3MsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgYXN5bmMuaXRlcmF0b3IgPSBmdW5jdGlvbiAodGFza3MpIHtcbiAgICAgICAgZnVuY3Rpb24gbWFrZUNhbGxiYWNrKGluZGV4KSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBmbigpIHtcbiAgICAgICAgICAgICAgICBpZiAodGFza3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2tzW2luZGV4XS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZm4ubmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm4ubmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGluZGV4IDwgdGFza3MubGVuZ3RoIC0gMSkgPyBtYWtlQ2FsbGJhY2soaW5kZXggKyAxKTogbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gZm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1ha2VDYWxsYmFjaygwKTtcbiAgICB9O1xuXG4gICAgYXN5bmMuYXBwbHkgPSBfcmVzdFBhcmFtKGZ1bmN0aW9uIChmbiwgYXJncykge1xuICAgICAgICByZXR1cm4gX3Jlc3RQYXJhbShmdW5jdGlvbiAoY2FsbEFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseShcbiAgICAgICAgICAgICAgICBudWxsLCBhcmdzLmNvbmNhdChjYWxsQXJncylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gX2NvbmNhdChlYWNoZm4sIGFyciwgZm4sIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgZWFjaGZuKGFyciwgZnVuY3Rpb24gKHgsIGluZGV4LCBjYikge1xuICAgICAgICAgICAgZm4oeCwgZnVuY3Rpb24gKGVyciwgeSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQoeSB8fCBbXSk7XG4gICAgICAgICAgICAgICAgY2IoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhc3luYy5jb25jYXQgPSBkb1BhcmFsbGVsKF9jb25jYXQpO1xuICAgIGFzeW5jLmNvbmNhdFNlcmllcyA9IGRvU2VyaWVzKF9jb25jYXQpO1xuXG4gICAgYXN5bmMud2hpbHN0ID0gZnVuY3Rpb24gKHRlc3QsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IG5vb3A7XG4gICAgICAgIGlmICh0ZXN0KCkpIHtcbiAgICAgICAgICAgIHZhciBuZXh0ID0gX3Jlc3RQYXJhbShmdW5jdGlvbihlcnIsIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0ZXN0LmFwcGx5KHRoaXMsIGFyZ3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZXJhdG9yKG5leHQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaXRlcmF0b3IobmV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBhc3luYy5kb1doaWxzdCA9IGZ1bmN0aW9uIChpdGVyYXRvciwgdGVzdCwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGNhbGxzID0gMDtcbiAgICAgICAgcmV0dXJuIGFzeW5jLndoaWxzdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiArK2NhbGxzIDw9IDEgfHwgdGVzdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LCBpdGVyYXRvciwgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBhc3luYy51bnRpbCA9IGZ1bmN0aW9uICh0ZXN0LCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIGFzeW5jLndoaWxzdChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAhdGVzdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LCBpdGVyYXRvciwgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBhc3luYy5kb1VudGlsID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCB0ZXN0LCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gYXN5bmMuZG9XaGlsc3QoaXRlcmF0b3IsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICF0ZXN0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgYXN5bmMuZHVyaW5nID0gZnVuY3Rpb24gKHRlc3QsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IG5vb3A7XG5cbiAgICAgICAgdmFyIG5leHQgPSBfcmVzdFBhcmFtKGZ1bmN0aW9uKGVyciwgYXJncykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFyZ3MucHVzaChjaGVjayk7XG4gICAgICAgICAgICAgICAgdGVzdC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGNoZWNrID0gZnVuY3Rpb24oZXJyLCB0cnV0aCkge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRydXRoKSB7XG4gICAgICAgICAgICAgICAgaXRlcmF0b3IobmV4dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRlc3QoY2hlY2spO1xuICAgIH07XG5cbiAgICBhc3luYy5kb0R1cmluZyA9IGZ1bmN0aW9uIChpdGVyYXRvciwgdGVzdCwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGNhbGxzID0gMDtcbiAgICAgICAgYXN5bmMuZHVyaW5nKGZ1bmN0aW9uKG5leHQpIHtcbiAgICAgICAgICAgIGlmIChjYWxscysrIDwgMSkge1xuICAgICAgICAgICAgICAgIG5leHQobnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRlc3QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gX3F1ZXVlKHdvcmtlciwgY29uY3VycmVuY3ksIHBheWxvYWQpIHtcbiAgICAgICAgaWYgKGNvbmN1cnJlbmN5ID09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmN1cnJlbmN5ID0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGNvbmN1cnJlbmN5ID09PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbmN1cnJlbmN5IG11c3Qgbm90IGJlIHplcm8nKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBfaW5zZXJ0KHEsIGRhdGEsIHBvcywgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayAhPSBudWxsICYmIHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidGFzayBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKCFfaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBbZGF0YV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihkYXRhLmxlbmd0aCA9PT0gMCAmJiBxLmlkbGUoKSkge1xuICAgICAgICAgICAgICAgIC8vIGNhbGwgZHJhaW4gaW1tZWRpYXRlbHkgaWYgdGhlcmUgYXJlIG5vIHRhc2tzXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzeW5jLnNldEltbWVkaWF0ZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcS5kcmFpbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX2FycmF5RWFjaChkYXRhLCBmdW5jdGlvbih0YXNrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhc2ssXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayB8fCBub29wXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmIChwb3MpIHtcbiAgICAgICAgICAgICAgICAgICAgcS50YXNrcy51bnNoaWZ0KGl0ZW0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHEudGFza3MucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocS50YXNrcy5sZW5ndGggPT09IHEuY29uY3VycmVuY3kpIHtcbiAgICAgICAgICAgICAgICAgICAgcS5zYXR1cmF0ZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGFzeW5jLnNldEltbWVkaWF0ZShxLnByb2Nlc3MpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIF9uZXh0KHEsIHRhc2tzKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB3b3JrZXJzIC09IDE7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICAgICAgX2FycmF5RWFjaCh0YXNrcywgZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGFzay5jYWxsYmFjay5hcHBseSh0YXNrLCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAocS50YXNrcy5sZW5ndGggKyB3b3JrZXJzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHEuZHJhaW4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcS5wcm9jZXNzKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHdvcmtlcnMgPSAwO1xuICAgICAgICB2YXIgcSA9IHtcbiAgICAgICAgICAgIHRhc2tzOiBbXSxcbiAgICAgICAgICAgIGNvbmN1cnJlbmN5OiBjb25jdXJyZW5jeSxcbiAgICAgICAgICAgIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgICAgICAgICBzYXR1cmF0ZWQ6IG5vb3AsXG4gICAgICAgICAgICBlbXB0eTogbm9vcCxcbiAgICAgICAgICAgIGRyYWluOiBub29wLFxuICAgICAgICAgICAgc3RhcnRlZDogZmFsc2UsXG4gICAgICAgICAgICBwYXVzZWQ6IGZhbHNlLFxuICAgICAgICAgICAgcHVzaDogZnVuY3Rpb24gKGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgX2luc2VydChxLCBkYXRhLCBmYWxzZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGtpbGw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBxLmRyYWluID0gbm9vcDtcbiAgICAgICAgICAgICAgICBxLnRhc2tzID0gW107XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdW5zaGlmdDogZnVuY3Rpb24gKGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgX2luc2VydChxLCBkYXRhLCB0cnVlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJvY2VzczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghcS5wYXVzZWQgJiYgd29ya2VycyA8IHEuY29uY3VycmVuY3kgJiYgcS50YXNrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUod29ya2VycyA8IHEuY29uY3VycmVuY3kgJiYgcS50YXNrcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRhc2tzID0gcS5wYXlsb2FkID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxLnRhc2tzLnNwbGljZSgwLCBxLnBheWxvYWQpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxLnRhc2tzLnNwbGljZSgwLCBxLnRhc2tzLmxlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gX21hcCh0YXNrcywgZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFzay5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxLnRhc2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHEuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtlcnMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjYiA9IG9ubHlfb25jZShfbmV4dChxLCB0YXNrcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgd29ya2VyKGRhdGEsIGNiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsZW5ndGg6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcS50YXNrcy5sZW5ndGg7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcnVubmluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3b3JrZXJzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlkbGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBxLnRhc2tzLmxlbmd0aCArIHdvcmtlcnMgPT09IDA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBxLnBhdXNlZCA9IHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzdW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHEucGF1c2VkID09PSBmYWxzZSkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICBxLnBhdXNlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciByZXN1bWVDb3VudCA9IE1hdGgubWluKHEuY29uY3VycmVuY3ksIHEudGFza3MubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAvLyBOZWVkIHRvIGNhbGwgcS5wcm9jZXNzIG9uY2UgcGVyIGNvbmN1cnJlbnRcbiAgICAgICAgICAgICAgICAvLyB3b3JrZXIgdG8gcHJlc2VydmUgZnVsbCBjb25jdXJyZW5jeSBhZnRlciBwYXVzZVxuICAgICAgICAgICAgICAgIGZvciAodmFyIHcgPSAxOyB3IDw9IHJlc3VtZUNvdW50OyB3KyspIHtcbiAgICAgICAgICAgICAgICAgICAgYXN5bmMuc2V0SW1tZWRpYXRlKHEucHJvY2Vzcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcTtcbiAgICB9XG5cbiAgICBhc3luYy5xdWV1ZSA9IGZ1bmN0aW9uICh3b3JrZXIsIGNvbmN1cnJlbmN5KSB7XG4gICAgICAgIHZhciBxID0gX3F1ZXVlKGZ1bmN0aW9uIChpdGVtcywgY2IpIHtcbiAgICAgICAgICAgIHdvcmtlcihpdGVtc1swXSwgY2IpO1xuICAgICAgICB9LCBjb25jdXJyZW5jeSwgMSk7XG5cbiAgICAgICAgcmV0dXJuIHE7XG4gICAgfTtcblxuICAgIGFzeW5jLnByaW9yaXR5UXVldWUgPSBmdW5jdGlvbiAod29ya2VyLCBjb25jdXJyZW5jeSkge1xuXG4gICAgICAgIGZ1bmN0aW9uIF9jb21wYXJlVGFza3MoYSwgYil7XG4gICAgICAgICAgICByZXR1cm4gYS5wcmlvcml0eSAtIGIucHJpb3JpdHk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfYmluYXJ5U2VhcmNoKHNlcXVlbmNlLCBpdGVtLCBjb21wYXJlKSB7XG4gICAgICAgICAgICB2YXIgYmVnID0gLTEsXG4gICAgICAgICAgICAgICAgZW5kID0gc2VxdWVuY2UubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIHdoaWxlIChiZWcgPCBlbmQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWlkID0gYmVnICsgKChlbmQgLSBiZWcgKyAxKSA+Pj4gMSk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBhcmUoaXRlbSwgc2VxdWVuY2VbbWlkXSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBiZWcgPSBtaWQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZW5kID0gbWlkIC0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYmVnO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX2luc2VydChxLCBkYXRhLCBwcmlvcml0eSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayAhPSBudWxsICYmIHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidGFzayBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKCFfaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBbZGF0YV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIGNhbGwgZHJhaW4gaW1tZWRpYXRlbHkgaWYgdGhlcmUgYXJlIG5vIHRhc2tzXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzeW5jLnNldEltbWVkaWF0ZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcS5kcmFpbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX2FycmF5RWFjaChkYXRhLCBmdW5jdGlvbih0YXNrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRhc2ssXG4gICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiBwcmlvcml0eSxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyA/IGNhbGxiYWNrIDogbm9vcFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBxLnRhc2tzLnNwbGljZShfYmluYXJ5U2VhcmNoKHEudGFza3MsIGl0ZW0sIF9jb21wYXJlVGFza3MpICsgMSwgMCwgaXRlbSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocS50YXNrcy5sZW5ndGggPT09IHEuY29uY3VycmVuY3kpIHtcbiAgICAgICAgICAgICAgICAgICAgcS5zYXR1cmF0ZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXN5bmMuc2V0SW1tZWRpYXRlKHEucHJvY2Vzcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN0YXJ0IHdpdGggYSBub3JtYWwgcXVldWVcbiAgICAgICAgdmFyIHEgPSBhc3luYy5xdWV1ZSh3b3JrZXIsIGNvbmN1cnJlbmN5KTtcblxuICAgICAgICAvLyBPdmVycmlkZSBwdXNoIHRvIGFjY2VwdCBzZWNvbmQgcGFyYW1ldGVyIHJlcHJlc2VudGluZyBwcmlvcml0eVxuICAgICAgICBxLnB1c2ggPSBmdW5jdGlvbiAoZGF0YSwgcHJpb3JpdHksIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBfaW5zZXJ0KHEsIGRhdGEsIHByaW9yaXR5LCBjYWxsYmFjayk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmVtb3ZlIHVuc2hpZnQgZnVuY3Rpb25cbiAgICAgICAgZGVsZXRlIHEudW5zaGlmdDtcblxuICAgICAgICByZXR1cm4gcTtcbiAgICB9O1xuXG4gICAgYXN5bmMuY2FyZ28gPSBmdW5jdGlvbiAod29ya2VyLCBwYXlsb2FkKSB7XG4gICAgICAgIHJldHVybiBfcXVldWUod29ya2VyLCAxLCBwYXlsb2FkKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gX2NvbnNvbGVfZm4obmFtZSkge1xuICAgICAgICByZXR1cm4gX3Jlc3RQYXJhbShmdW5jdGlvbiAoZm4sIGFyZ3MpIHtcbiAgICAgICAgICAgIGZuLmFwcGx5KG51bGwsIGFyZ3MuY29uY2F0KFtfcmVzdFBhcmFtKGZ1bmN0aW9uIChlcnIsIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb25zb2xlLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNvbnNvbGVbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hcnJheUVhY2goYXJncywgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlW25hbWVdKHgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KV0pKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFzeW5jLmxvZyA9IF9jb25zb2xlX2ZuKCdsb2cnKTtcbiAgICBhc3luYy5kaXIgPSBfY29uc29sZV9mbignZGlyJyk7XG4gICAgLyphc3luYy5pbmZvID0gX2NvbnNvbGVfZm4oJ2luZm8nKTtcbiAgICBhc3luYy53YXJuID0gX2NvbnNvbGVfZm4oJ3dhcm4nKTtcbiAgICBhc3luYy5lcnJvciA9IF9jb25zb2xlX2ZuKCdlcnJvcicpOyovXG5cbiAgICBhc3luYy5tZW1vaXplID0gZnVuY3Rpb24gKGZuLCBoYXNoZXIpIHtcbiAgICAgICAgdmFyIG1lbW8gPSB7fTtcbiAgICAgICAgdmFyIHF1ZXVlcyA9IHt9O1xuICAgICAgICBoYXNoZXIgPSBoYXNoZXIgfHwgaWRlbnRpdHk7XG4gICAgICAgIHZhciBtZW1vaXplZCA9IF9yZXN0UGFyYW0oZnVuY3Rpb24gbWVtb2l6ZWQoYXJncykge1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJncy5wb3AoKTtcbiAgICAgICAgICAgIHZhciBrZXkgPSBoYXNoZXIuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICBpZiAoa2V5IGluIG1lbW8pIHtcbiAgICAgICAgICAgICAgICBhc3luYy5zZXRJbW1lZGlhdGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShudWxsLCBtZW1vW2tleV0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoa2V5IGluIHF1ZXVlcykge1xuICAgICAgICAgICAgICAgIHF1ZXVlc1trZXldLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcXVldWVzW2tleV0gPSBbY2FsbGJhY2tdO1xuICAgICAgICAgICAgICAgIGZuLmFwcGx5KG51bGwsIGFyZ3MuY29uY2F0KFtfcmVzdFBhcmFtKGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lbW9ba2V5XSA9IGFyZ3M7XG4gICAgICAgICAgICAgICAgICAgIHZhciBxID0gcXVldWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBxdWV1ZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBxLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcVtpXS5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbWVtb2l6ZWQubWVtbyA9IG1lbW87XG4gICAgICAgIG1lbW9pemVkLnVubWVtb2l6ZWQgPSBmbjtcbiAgICAgICAgcmV0dXJuIG1lbW9pemVkO1xuICAgIH07XG5cbiAgICBhc3luYy51bm1lbW9pemUgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAoZm4udW5tZW1vaXplZCB8fCBmbikuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gX3RpbWVzKG1hcHBlcikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGNvdW50LCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIG1hcHBlcihfcmFuZ2UoY291bnQpLCBpdGVyYXRvciwgY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGFzeW5jLnRpbWVzID0gX3RpbWVzKGFzeW5jLm1hcCk7XG4gICAgYXN5bmMudGltZXNTZXJpZXMgPSBfdGltZXMoYXN5bmMubWFwU2VyaWVzKTtcbiAgICBhc3luYy50aW1lc0xpbWl0ID0gZnVuY3Rpb24gKGNvdW50LCBsaW1pdCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBhc3luYy5tYXBMaW1pdChfcmFuZ2UoY291bnQpLCBsaW1pdCwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgYXN5bmMuc2VxID0gZnVuY3Rpb24gKC8qIGZ1bmN0aW9ucy4uLiAqLykge1xuICAgICAgICB2YXIgZm5zID0gYXJndW1lbnRzO1xuICAgICAgICByZXR1cm4gX3Jlc3RQYXJhbShmdW5jdGlvbiAoYXJncykge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnBvcCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IG5vb3A7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFzeW5jLnJlZHVjZShmbnMsIGFyZ3MsIGZ1bmN0aW9uIChuZXdhcmdzLCBmbiwgY2IpIHtcbiAgICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBuZXdhcmdzLmNvbmNhdChbX3Jlc3RQYXJhbShmdW5jdGlvbiAoZXJyLCBuZXh0YXJncykge1xuICAgICAgICAgICAgICAgICAgICBjYihlcnIsIG5leHRhcmdzKTtcbiAgICAgICAgICAgICAgICB9KV0pKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXJyLCByZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhhdCwgW2Vycl0uY29uY2F0KHJlc3VsdHMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgYXN5bmMuY29tcG9zZSA9IGZ1bmN0aW9uICgvKiBmdW5jdGlvbnMuLi4gKi8pIHtcbiAgICAgICAgcmV0dXJuIGFzeW5jLnNlcS5hcHBseShudWxsLCBBcnJheS5wcm90b3R5cGUucmV2ZXJzZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgIH07XG5cblxuICAgIGZ1bmN0aW9uIF9hcHBseUVhY2goZWFjaGZuKSB7XG4gICAgICAgIHJldHVybiBfcmVzdFBhcmFtKGZ1bmN0aW9uKGZucywgYXJncykge1xuICAgICAgICAgICAgdmFyIGdvID0gX3Jlc3RQYXJhbShmdW5jdGlvbihhcmdzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3MucG9wKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVhY2hmbihmbnMsIGZ1bmN0aW9uIChmbiwgXywgY2IpIHtcbiAgICAgICAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncy5jb25jYXQoW2NiXSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2FsbGJhY2spO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoYXJncy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ28uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ287XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jLmFwcGx5RWFjaCA9IF9hcHBseUVhY2goYXN5bmMuZWFjaE9mKTtcbiAgICBhc3luYy5hcHBseUVhY2hTZXJpZXMgPSBfYXBwbHlFYWNoKGFzeW5jLmVhY2hPZlNlcmllcyk7XG5cblxuICAgIGFzeW5jLmZvcmV2ZXIgPSBmdW5jdGlvbiAoZm4sIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBkb25lID0gb25seV9vbmNlKGNhbGxiYWNrIHx8IG5vb3ApO1xuICAgICAgICB2YXIgdGFzayA9IGVuc3VyZUFzeW5jKGZuKTtcbiAgICAgICAgZnVuY3Rpb24gbmV4dChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFzayhuZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBuZXh0KCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGVuc3VyZUFzeW5jKGZuKSB7XG4gICAgICAgIHJldHVybiBfcmVzdFBhcmFtKGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmdzLnBvcCgpO1xuICAgICAgICAgICAgYXJncy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5uZXJBcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgICAgIGlmIChzeW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIGFzeW5jLnNldEltbWVkaWF0ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShudWxsLCBpbm5lckFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShudWxsLCBpbm5lckFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIHN5bmMgPSB0cnVlO1xuICAgICAgICAgICAgZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICBzeW5jID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jLmVuc3VyZUFzeW5jID0gZW5zdXJlQXN5bmM7XG5cbiAgICBhc3luYy5jb25zdGFudCA9IF9yZXN0UGFyYW0oZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICAgIHZhciBhcmdzID0gW251bGxdLmNvbmNhdCh2YWx1ZXMpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBhc3luYy53cmFwU3luYyA9XG4gICAgYXN5bmMuYXN5bmNpZnkgPSBmdW5jdGlvbiBhc3luY2lmeShmdW5jKSB7XG4gICAgICAgIHJldHVybiBfcmVzdFBhcmFtKGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmdzLnBvcCgpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiByZXN1bHQgaXMgUHJvbWlzZSBvYmplY3RcbiAgICAgICAgICAgIGlmIChfaXNPYmplY3QocmVzdWx0KSAmJiB0eXBlb2YgcmVzdWx0LnRoZW4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJlc3VsdC50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KVtcImNhdGNoXCJdKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIubWVzc2FnZSA/IGVyciA6IG5ldyBFcnJvcihlcnIpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIE5vZGUuanNcbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBhc3luYztcbiAgICB9XG4gICAgLy8gQU1EIC8gUmVxdWlyZUpTXG4gICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGFzeW5jO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gaW5jbHVkZWQgZGlyZWN0bHkgdmlhIDxzY3JpcHQ+IHRhZ1xuICAgIGVsc2Uge1xuICAgICAgICByb290LmFzeW5jID0gYXN5bmM7XG4gICAgfVxuXG59KCkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RyKSB7XG5cdGlmIChzdHIubGVuZ3RoID09PSAxKSB7XG5cdFx0cmV0dXJuIHN0cjtcblx0fVxuXG5cdHJldHVybiBzdHJcblx0LnJlcGxhY2UoL15bXy5cXC0gXSsvLCAnJylcblx0LnRvTG93ZXJDYXNlKClcblx0LnJlcGxhY2UoL1tfLlxcLSBdKyhcXHd8JCkvZywgZnVuY3Rpb24gKG0sIHAxKSB7XG5cdFx0cmV0dXJuIHAxLnRvVXBwZXJDYXNlKCk7XG5cdH0pO1xufTtcbiJdfQ==
