(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["$mwt"] = factory();
	else
		root["$mwt"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@yomguithereal/helpers/extend.js":
/*!*******************************************************!*\
  !*** ./node_modules/@yomguithereal/helpers/extend.js ***!
  \*******************************************************/
/***/ ((module) => {

/**
 * Extend function
 * ================
 *
 * Function used to push a bunch of values into an array at once.
 *
 * Its strategy is to mutate target array's length then setting the new indices
 * to be the values to add.
 *
 * A benchmark proved that it is faster than the following strategies:
 *   1) `array.push.apply(array, values)`.
 *   2) A loop of pushes.
 *   3) `array = array.concat(values)`, obviously.
 *
 * Intuitively, this is correct because when adding a lot of elements, the
 * chosen strategies does not need to handle the `arguments` object to
 * execute #.apply's variadicity and because the array know its final length
 * at the beginning, avoiding potential multiple reallocations of the underlying
 * contiguous array. Some engines may be able to optimize the loop of push
 * operations but empirically they don't seem to do so.
 */

/**
 * Extends the target array with the given values.
 *
 * @param  {array} array  - Target array.
 * @param  {array} values - Values to add.
 */
module.exports = function extend(array, values) {
  var l2 = values.length;

  if (l2 === 0)
    return;

  var l1 = array.length;

  array.length += l2;

  for (var i = 0; i < l2; i++)
    array[l1 + i] = values[i];
};


/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "./node_modules/graphology-layout-force/defaults.js":
/*!**********************************************************!*\
  !*** ./node_modules/graphology-layout-force/defaults.js ***!
  \**********************************************************/
/***/ ((module) => {

/**
 * Graphology Force Layout Defaults
 * =================================
 *
 * Default options & settings used by the library.
 */
module.exports = {
  nodeXAttribute: 'x',
  nodeYAttribute: 'y',
  isNodeFixed: 'fixed',
  shouldSkipNode: null,
  shouldSkipEdge: null,
  settings: {
    attraction: 0.0005,
    repulsion: 0.1,
    gravity: 0.0001,
    inertia: 0.6,
    maxMove: 200
  }
};


/***/ }),

/***/ "./node_modules/graphology-layout-force/helpers.js":
/*!*********************************************************!*\
  !*** ./node_modules/graphology-layout-force/helpers.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

/**
 * Graphology Force Layout Helpers
 * ================================
 *
 * Miscellaneous helper functions related to the force layout.
 */
exports.assignLayoutChanges = function (graph, nodeStates, params) {
  const {nodeXAttribute: x, nodeYAttribute: y} = params;

  graph.updateEachNodeAttributes(
    (n, attr) => {
      const state = nodeStates[n];

      if (!state || state.fixed) return attr;

      attr[x] = state.x;
      attr[y] = state.y;

      return attr;
    },
    {attributes: ['x', 'y']}
  );
};

exports.collectLayoutChanges = function (nodeStates) {
  const mapping = {};

  for (const n in nodeStates) {
    const state = nodeStates[n];

    mapping[n] = {x: state.x, y: state.y};
  }

  return mapping;
};


/***/ }),

/***/ "./node_modules/graphology-layout-force/iterate.js":
/*!*********************************************************!*\
  !*** ./node_modules/graphology-layout-force/iterate.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Graphology Force Layout Iteration
 * ==================================
 *
 * Function describing a single iteration of the force layout.
 */
const {
  createNodeValueGetter,
  createEdgeValueGetter
} = __webpack_require__(/*! graphology-utils/getters */ "./node_modules/graphology-utils/getters.js");

// const EPSILON = -Infinity;

// function isVeryCloseToZero(x) {
//   return Math.abs(x) < EPSILON;
// }

module.exports = function iterate(graph, nodeStates, params) {
  const {nodeXAttribute: xKey, nodeYAttribute: yKey} = params;
  const {attraction, repulsion, gravity, inertia, maxMove} = params.settings;

  let {shouldSkipNode, shouldSkipEdge, isNodeFixed} = params;

  isNodeFixed = createNodeValueGetter(isNodeFixed);
  shouldSkipNode = createNodeValueGetter(shouldSkipNode, false);
  shouldSkipEdge = createEdgeValueGetter(shouldSkipEdge, false);

  const nodes = graph.filterNodes((n, attr) => {
    return !shouldSkipNode.fromEntry(n, attr);
  });

  const adjustedOrder = nodes.length;

  // Check nodeStatess and inertia
  for (let i = 0; i < adjustedOrder; i++) {
    const n = nodes[i];
    const attr = graph.getNodeAttributes(n);
    const nodeState = nodeStates[n];

    if (!nodeState)
      nodeStates[n] = {
        dx: 0,
        dy: 0,
        x: attr[xKey] || 0,
        y: attr[yKey] || 0
      };
    else
      nodeStates[n] = {
        dx: nodeState.dx * inertia,
        dy: nodeState.dy * inertia,
        x: attr[xKey] || 0,
        y: attr[yKey] || 0
      };
  }

  // Repulsion
  if (repulsion)
    for (let i = 0; i < adjustedOrder; i++) {
      const n1 = nodes[i];
      const n1State = nodeStates[n1];

      for (let j = i + 1; j < adjustedOrder; j++) {
        const n2 = nodes[j];
        const n2State = nodeStates[n2];

        // Compute distance:
        const dx = n2State.x - n1State.x;
        const dy = n2State.y - n1State.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        // Repulse nodes relatively to 1 / distance:
        const repulsionX = (repulsion / distance) * dx;
        const repulsionY = (repulsion / distance) * dy;
        n1State.dx -= repulsionX;
        n1State.dy -= repulsionY;
        n2State.dx += repulsionX;
        n2State.dy += repulsionY;
      }
    }

  // Attraction
  if (attraction)
    graph.forEachEdge(
      (edge, attr, source, target, sourceAttr, targetAttr, undirected) => {
        if (source === target) return;

        if (
          shouldSkipNode.fromEntry(source, sourceAttr) ||
          shouldSkipNode.fromEntry(target, targetAttr)
        )
          return;

        if (
          shouldSkipEdge.fromEntry(
            edge,
            attr,
            source,
            target,
            sourceAttr,
            targetAttr,
            undirected
          )
        )
          return;

        const n1State = nodeStates[source];
        const n2State = nodeStates[target];

        // Compute distance:
        const dx = n2State.x - n1State.x;
        const dy = n2State.y - n1State.y;

        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        // Attract nodes relatively to their distance:
        const attractionX = attraction * distance * dx;
        const attractionY = attraction * distance * dy;
        n1State.dx += attractionX;
        n1State.dy += attractionY;
        n2State.dx -= attractionX;
        n2State.dy -= attractionY;
      }
    );

  // Gravity
  if (gravity)
    for (let i = 0; i < adjustedOrder; i++) {
      const n = nodes[i];
      const nodeState = nodeStates[n];

      // Attract nodes to [0, 0] relatively to the distance:
      const {x, y} = nodeState;
      const distance = Math.sqrt(x * x + y * y) || 1;
      nodeStates[n].dx -= x * gravity * distance;
      nodeStates[n].dy -= y * gravity * distance;
    }

  // Apply forces
  const converged = false;

  for (let i = 0; i < adjustedOrder; i++) {
    const n = nodes[i];
    const nodeState = nodeStates[n];

    const distance = Math.sqrt(
      nodeState.dx * nodeState.dx + nodeState.dy * nodeState.dy
    );

    if (distance > maxMove) {
      nodeState.dx *= maxMove / distance;
      nodeState.dy *= maxMove / distance;
    }

    // if (!isVeryCloseToZero(nodeState.dx) || !isVeryCloseToZero(nodeState.dy)) {
    //   converged = false;
    // }

    if (!isNodeFixed.fromGraph(graph, n)) {
      nodeState.x += nodeState.dx;
      nodeState.y += nodeState.dy;
      nodeState.fixed = false;
    } else {
      nodeState.fixed = true;
    }

    // NOTE: possibility to assign here to save one loop in the future
  }

  return {converged};
};


/***/ }),

/***/ "./node_modules/graphology-layout-force/worker.js":
/*!********************************************************!*\
  !*** ./node_modules/graphology-layout-force/worker.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Graphology Force Layout Worker
 * ===============================
 *
 * A worker made for running a force layout live.
 *
 * Note that it does not run in a webworker yet but respect animation frames.
 */
const isGraph = __webpack_require__(/*! graphology-utils/is-graph */ "./node_modules/graphology-utils/is-graph.js");
const resolveDefaults = __webpack_require__(/*! graphology-utils/defaults */ "./node_modules/graphology-utils/defaults.js");

const iterate = __webpack_require__(/*! ./iterate.js */ "./node_modules/graphology-layout-force/iterate.js");
const helpers = __webpack_require__(/*! ./helpers.js */ "./node_modules/graphology-layout-force/helpers.js");
const DEFAULTS = __webpack_require__(/*! ./defaults.js */ "./node_modules/graphology-layout-force/defaults.js");

function ForceSupervisor(graph, params) {
  // Validation
  if (!isGraph(graph))
    throw new Error(
      'graphology-layout-force/worker: the given graph is not a valid graphology instance.'
    );

  params = resolveDefaults(params, DEFAULTS);

  this.callbacks = {};

  if (params.onConverged) this.callbacks.onConverged = params.onConverged;

  this.graph = graph;
  this.params = params;
  this.nodeStates = {};
  this.frameID = null;
  this.running = false;
  this.killed = false;

  // TODO: hook listeners on graph to listen to dropNode, dropEdge, clear, clearEdges
}

ForceSupervisor.prototype.isRunning = function () {
  return this.running;
};

ForceSupervisor.prototype.runFrame = function () {
  let {converged} = iterate(this.graph, this.nodeStates, this.params);

  helpers.assignLayoutChanges(this.graph, this.nodeStates, this.params);

  // TODO: figure out convergence
  converged = false;

  if (converged) {
    if (this.callbacks.onConverged) this.callbacks.onConverged();
    this.stop();
  } else {
    this.frameID = window.requestAnimationFrame(() => this.runFrame());
  }
};

ForceSupervisor.prototype.stop = function () {
  this.running = false;

  if (this.frameID !== null) {
    window.cancelAnimationFrame(this.frameID);
    this.frameID = null;
  }

  return this;
};

ForceSupervisor.prototype.start = function () {
  if (this.killed)
    throw new Error('graphology-layout-force/worker.start: layout was killed.');

  if (this.running) return;

  this.running = true;
  this.runFrame();
};

ForceSupervisor.prototype.kill = function () {
  this.stop();
  delete this.nodeStates;
  this.killed = true;

  // TODO: cleanup events
};

module.exports = ForceSupervisor;


/***/ }),

/***/ "./node_modules/graphology-utils/defaults.js":
/*!***************************************************!*\
  !*** ./node_modules/graphology-utils/defaults.js ***!
  \***************************************************/
/***/ ((module) => {

/**
 * Graphology Defaults
 * ====================
 *
 * Helper function used throughout the standard lib to resolve defaults.
 */
function isLeaf(o) {
  return (
    !o ||
    typeof o !== 'object' ||
    typeof o === 'function' ||
    Array.isArray(o) ||
    o instanceof Set ||
    o instanceof Map ||
    o instanceof RegExp ||
    o instanceof Date
  );
}

function resolveDefaults(target, defaults) {
  target = target || {};

  var output = {};

  for (var k in defaults) {
    var existing = target[k];
    var def = defaults[k];

    // Recursion
    if (!isLeaf(def)) {
      output[k] = resolveDefaults(existing, def);

      continue;
    }

    // Leaf
    if (existing === undefined) {
      output[k] = def;
    } else {
      output[k] = existing;
    }
  }

  return output;
}

module.exports = resolveDefaults;


/***/ }),

/***/ "./node_modules/graphology-utils/getters.js":
/*!**************************************************!*\
  !*** ./node_modules/graphology-utils/getters.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

/**
 * Graphology Weight Getter
 * =========================
 *
 * Function creating weight getters.
 */
function coerceWeight(value) {
  // Ensuring target value is a correct number
  if (typeof value !== 'number' || isNaN(value)) return 1;

  return value;
}

function createNodeValueGetter(nameOrFunction, defaultValue) {
  var getter = {};

  var coerceToDefault = function (v) {
    if (typeof v === 'undefined') return defaultValue;

    return v;
  };

  if (typeof defaultValue === 'function') coerceToDefault = defaultValue;

  var get = function (attributes) {
    return coerceToDefault(attributes[nameOrFunction]);
  };

  var returnDefault = function () {
    return coerceToDefault(undefined);
  };

  if (typeof nameOrFunction === 'string') {
    getter.fromAttributes = get;
    getter.fromGraph = function (graph, node) {
      return get(graph.getNodeAttributes(node));
    };
    getter.fromEntry = function (node, attributes) {
      return get(attributes);
    };
  } else if (typeof nameOrFunction === 'function') {
    getter.fromAttributes = function () {
      throw new Error(
        'graphology-utils/getters/createNodeValueGetter: irrelevant usage.'
      );
    };
    getter.fromGraph = function (graph, node) {
      return coerceToDefault(
        nameOrFunction(node, graph.getNodeAttributes(node))
      );
    };
    getter.fromEntry = function (node, attributes) {
      return coerceToDefault(nameOrFunction(node, attributes));
    };
  } else {
    getter.fromAttributes = returnDefault;
    getter.fromGraph = returnDefault;
    getter.fromEntry = returnDefault;
  }

  return getter;
}

function createEdgeValueGetter(nameOrFunction, defaultValue) {
  var getter = {};

  var coerceToDefault = function (v) {
    if (typeof v === 'undefined') return defaultValue;

    return v;
  };

  if (typeof defaultValue === 'function') coerceToDefault = defaultValue;

  var get = function (attributes) {
    return coerceToDefault(attributes[nameOrFunction]);
  };

  var returnDefault = function () {
    return coerceToDefault(undefined);
  };

  if (typeof nameOrFunction === 'string') {
    getter.fromAttributes = get;
    getter.fromGraph = function (graph, edge) {
      return get(graph.getEdgeAttributes(edge));
    };
    getter.fromEntry = function (edge, attributes) {
      return get(attributes);
    };
    getter.fromPartialEntry = getter.fromEntry;
    getter.fromMinimalEntry = getter.fromEntry;
  } else if (typeof nameOrFunction === 'function') {
    getter.fromAttributes = function () {
      throw new Error(
        'graphology-utils/getters/createEdgeValueGetter: irrelevant usage.'
      );
    };
    getter.fromGraph = function (graph, edge) {
      // TODO: we can do better, check #310
      var extremities = graph.extremities(edge);
      return coerceToDefault(
        nameOrFunction(
          edge,
          graph.getEdgeAttributes(edge),
          extremities[0],
          extremities[1],
          graph.getNodeAttributes(extremities[0]),
          graph.getNodeAttributes(extremities[1]),
          graph.isUndirected(edge)
        )
      );
    };
    getter.fromEntry = function (e, a, s, t, sa, ta, u) {
      return coerceToDefault(nameOrFunction(e, a, s, t, sa, ta, u));
    };
    getter.fromPartialEntry = function (e, a, s, t) {
      return coerceToDefault(nameOrFunction(e, a, s, t));
    };
    getter.fromMinimalEntry = function (e, a) {
      return coerceToDefault(nameOrFunction(e, a));
    };
  } else {
    getter.fromAttributes = returnDefault;
    getter.fromGraph = returnDefault;
    getter.fromEntry = returnDefault;
    getter.fromMinimalEntry = returnDefault;
  }

  return getter;
}

exports.createNodeValueGetter = createNodeValueGetter;
exports.createEdgeValueGetter = createEdgeValueGetter;
exports.createEdgeWeightGetter = function (name) {
  return createEdgeValueGetter(name, coerceWeight);
};


/***/ }),

/***/ "./node_modules/graphology-utils/is-graph.js":
/*!***************************************************!*\
  !*** ./node_modules/graphology-utils/is-graph.js ***!
  \***************************************************/
/***/ ((module) => {

/**
 * Graphology isGraph
 * ===================
 *
 * Very simple function aiming at ensuring the given variable is a
 * graphology instance.
 */

/**
 * Checking the value is a graphology instance.
 *
 * @param  {any}     value - Target value.
 * @return {boolean}
 */
module.exports = function isGraph(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.addUndirectedEdgeWithKey === 'function' &&
    typeof value.dropNode === 'function' &&
    typeof value.multi === 'boolean'
  );
};


/***/ }),

/***/ "./node_modules/graphology/dist/graphology.umd.min.js":
/*!************************************************************!*\
  !*** ./node_modules/graphology/dist/graphology.umd.min.js ***!
  \************************************************************/
/***/ (function(module) {

!function(t,e){ true?module.exports=e():0}(this,(function(){"use strict";function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,r(t,e)}function n(t){return n=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},n(t)}function r(t,e){return r=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},r(t,e)}function i(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}function o(t,e,n){return o=i()?Reflect.construct.bind():function(t,e,n){var i=[null];i.push.apply(i,e);var o=new(Function.bind.apply(t,i));return n&&r(o,n.prototype),o},o.apply(null,arguments)}function a(t){var e="function"==typeof Map?new Map:void 0;return a=function(t){if(null===t||(i=t,-1===Function.toString.call(i).indexOf("[native code]")))return t;var i;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,a)}function a(){return o(t,arguments,n(this).constructor)}return a.prototype=Object.create(t.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),r(a,t)},a(t)}function c(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}var u=function(){for(var t=arguments[0],e=1,n=arguments.length;e<n;e++)if(arguments[e])for(var r in arguments[e])t[r]=arguments[e][r];return t};function d(t,e,n,r){var i=t._nodes.get(e),o=null;return i?o="mixed"===r?i.out&&i.out[n]||i.undirected&&i.undirected[n]:"directed"===r?i.out&&i.out[n]:i.undirected&&i.undirected[n]:o}function s(e){return"object"===t(e)&&null!==e&&e.constructor===Object}function h(t){var e;for(e in t)return!1;return!0}function p(t,e,n){Object.defineProperty(t,e,{enumerable:!1,configurable:!1,writable:!0,value:n})}function f(t,e,n){var r={enumerable:!0,configurable:!0};"function"==typeof n?r.get=n:(r.value=n,r.writable=!1),Object.defineProperty(t,e,r)}function l(t){return!!s(t)&&!(t.attributes&&!Array.isArray(t.attributes))}"function"==typeof Object.assign&&(u=Object.assign);var g,y={exports:{}},w="object"==typeof Reflect?Reflect:null,v=w&&"function"==typeof w.apply?w.apply:function(t,e,n){return Function.prototype.apply.call(t,e,n)};g=w&&"function"==typeof w.ownKeys?w.ownKeys:Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:function(t){return Object.getOwnPropertyNames(t)};var b=Number.isNaN||function(t){return t!=t};function m(){m.init.call(this)}y.exports=m,y.exports.once=function(t,e){return new Promise((function(n,r){function i(n){t.removeListener(e,o),r(n)}function o(){"function"==typeof t.removeListener&&t.removeListener("error",i),n([].slice.call(arguments))}U(t,e,o,{once:!0}),"error"!==e&&function(t,e,n){"function"==typeof t.on&&U(t,"error",e,n)}(t,i,{once:!0})}))},m.EventEmitter=m,m.prototype._events=void 0,m.prototype._eventsCount=0,m.prototype._maxListeners=void 0;var k=10;function _(t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t)}function G(t){return void 0===t._maxListeners?m.defaultMaxListeners:t._maxListeners}function x(t,e,n,r){var i,o,a,c;if(_(n),void 0===(o=t._events)?(o=t._events=Object.create(null),t._eventsCount=0):(void 0!==o.newListener&&(t.emit("newListener",e,n.listener?n.listener:n),o=t._events),a=o[e]),void 0===a)a=o[e]=n,++t._eventsCount;else if("function"==typeof a?a=o[e]=r?[n,a]:[a,n]:r?a.unshift(n):a.push(n),(i=G(t))>0&&a.length>i&&!a.warned){a.warned=!0;var u=new Error("Possible EventEmitter memory leak detected. "+a.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");u.name="MaxListenersExceededWarning",u.emitter=t,u.type=e,u.count=a.length,c=u,console&&console.warn&&console.warn(c)}return t}function E(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function A(t,e,n){var r={fired:!1,wrapFn:void 0,target:t,type:e,listener:n},i=E.bind(r);return i.listener=n,r.wrapFn=i,i}function L(t,e,n){var r=t._events;if(void 0===r)return[];var i=r[e];return void 0===i?[]:"function"==typeof i?n?[i.listener||i]:[i]:n?function(t){for(var e=new Array(t.length),n=0;n<e.length;++n)e[n]=t[n].listener||t[n];return e}(i):D(i,i.length)}function S(t){var e=this._events;if(void 0!==e){var n=e[t];if("function"==typeof n)return 1;if(void 0!==n)return n.length}return 0}function D(t,e){for(var n=new Array(e),r=0;r<e;++r)n[r]=t[r];return n}function U(t,e,n,r){if("function"==typeof t.on)r.once?t.once(e,n):t.on(e,n);else{if("function"!=typeof t.addEventListener)throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof t);t.addEventListener(e,(function i(o){r.once&&t.removeEventListener(e,i),n(o)}))}}function N(t){if("function"!=typeof t)throw new Error("obliterator/iterator: expecting a function!");this.next=t}Object.defineProperty(m,"defaultMaxListeners",{enumerable:!0,get:function(){return k},set:function(t){if("number"!=typeof t||t<0||b(t))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+t+".");k=t}}),m.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},m.prototype.setMaxListeners=function(t){if("number"!=typeof t||t<0||b(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this},m.prototype.getMaxListeners=function(){return G(this)},m.prototype.emit=function(t){for(var e=[],n=1;n<arguments.length;n++)e.push(arguments[n]);var r="error"===t,i=this._events;if(void 0!==i)r=r&&void 0===i.error;else if(!r)return!1;if(r){var o;if(e.length>0&&(o=e[0]),o instanceof Error)throw o;var a=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw a.context=o,a}var c=i[t];if(void 0===c)return!1;if("function"==typeof c)v(c,this,e);else{var u=c.length,d=D(c,u);for(n=0;n<u;++n)v(d[n],this,e)}return!0},m.prototype.addListener=function(t,e){return x(this,t,e,!1)},m.prototype.on=m.prototype.addListener,m.prototype.prependListener=function(t,e){return x(this,t,e,!0)},m.prototype.once=function(t,e){return _(e),this.on(t,A(this,t,e)),this},m.prototype.prependOnceListener=function(t,e){return _(e),this.prependListener(t,A(this,t,e)),this},m.prototype.removeListener=function(t,e){var n,r,i,o,a;if(_(e),void 0===(r=this._events))return this;if(void 0===(n=r[t]))return this;if(n===e||n.listener===e)0==--this._eventsCount?this._events=Object.create(null):(delete r[t],r.removeListener&&this.emit("removeListener",t,n.listener||e));else if("function"!=typeof n){for(i=-1,o=n.length-1;o>=0;o--)if(n[o]===e||n[o].listener===e){a=n[o].listener,i=o;break}if(i<0)return this;0===i?n.shift():function(t,e){for(;e+1<t.length;e++)t[e]=t[e+1];t.pop()}(n,i),1===n.length&&(r[t]=n[0]),void 0!==r.removeListener&&this.emit("removeListener",t,a||e)}return this},m.prototype.off=m.prototype.removeListener,m.prototype.removeAllListeners=function(t){var e,n,r;if(void 0===(n=this._events))return this;if(void 0===n.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==n[t]&&(0==--this._eventsCount?this._events=Object.create(null):delete n[t]),this;if(0===arguments.length){var i,o=Object.keys(n);for(r=0;r<o.length;++r)"removeListener"!==(i=o[r])&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(e=n[t]))this.removeListener(t,e);else if(void 0!==e)for(r=e.length-1;r>=0;r--)this.removeListener(t,e[r]);return this},m.prototype.listeners=function(t){return L(this,t,!0)},m.prototype.rawListeners=function(t){return L(this,t,!1)},m.listenerCount=function(t,e){return"function"==typeof t.listenerCount?t.listenerCount(e):S.call(t,e)},m.prototype.listenerCount=S,m.prototype.eventNames=function(){return this._eventsCount>0?g(this._events):[]},"undefined"!=typeof Symbol&&(N.prototype[Symbol.iterator]=function(){return this}),N.of=function(){var t=arguments,e=t.length,n=0;return new N((function(){return n>=e?{done:!0}:{done:!1,value:t[n++]}}))},N.empty=function(){return new N((function(){return{done:!0}}))},N.fromSequence=function(t){var e=0,n=t.length;return new N((function(){return e>=n?{done:!0}:{done:!1,value:t[e++]}}))},N.is=function(t){return t instanceof N||"object"==typeof t&&null!==t&&"function"==typeof t.next};var O=N,j={};j.ARRAY_BUFFER_SUPPORT="undefined"!=typeof ArrayBuffer,j.SYMBOL_SUPPORT="undefined"!=typeof Symbol;var C=O,M=j,z=M.ARRAY_BUFFER_SUPPORT,W=M.SYMBOL_SUPPORT;var P=function(t){var e=function(t){return"string"==typeof t||Array.isArray(t)||z&&ArrayBuffer.isView(t)?C.fromSequence(t):"object"!=typeof t||null===t?null:W&&"function"==typeof t[Symbol.iterator]?t[Symbol.iterator]():"function"==typeof t.next?t:null}(t);if(!e)throw new Error("obliterator: target is not iterable nor a valid iterator.");return e},R=P,K=function(t,e){for(var n,r=arguments.length>1?e:1/0,i=r!==1/0?new Array(r):[],o=0,a=R(t);;){if(o===r)return i;if((n=a.next()).done)return o!==e&&(i.length=o),i;i[o++]=n.value}},T=function(t){function n(e){var n;return(n=t.call(this)||this).name="GraphError",n.message=e,n}return e(n,t),n}(a(Error)),B=function(t){function n(e){var r;return(r=t.call(this,e)||this).name="InvalidArgumentsGraphError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(c(r),n.prototype.constructor),r}return e(n,t),n}(T),F=function(t){function n(e){var r;return(r=t.call(this,e)||this).name="NotFoundGraphError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(c(r),n.prototype.constructor),r}return e(n,t),n}(T),I=function(t){function n(e){var r;return(r=t.call(this,e)||this).name="UsageGraphError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(c(r),n.prototype.constructor),r}return e(n,t),n}(T);function Y(t,e){this.key=t,this.attributes=e,this.clear()}function q(t,e){this.key=t,this.attributes=e,this.clear()}function J(t,e){this.key=t,this.attributes=e,this.clear()}function V(t,e,n,r,i){this.key=e,this.attributes=i,this.undirected=t,this.source=n,this.target=r}Y.prototype.clear=function(){this.inDegree=0,this.outDegree=0,this.undirectedDegree=0,this.undirectedLoops=0,this.directedLoops=0,this.in={},this.out={},this.undirected={}},q.prototype.clear=function(){this.inDegree=0,this.outDegree=0,this.directedLoops=0,this.in={},this.out={}},J.prototype.clear=function(){this.undirectedDegree=0,this.undirectedLoops=0,this.undirected={}},V.prototype.attach=function(){var t="out",e="in";this.undirected&&(t=e="undirected");var n=this.source.key,r=this.target.key;this.source[t][r]=this,this.undirected&&n===r||(this.target[e][n]=this)},V.prototype.attachMulti=function(){var t="out",e="in",n=this.source.key,r=this.target.key;this.undirected&&(t=e="undirected");var i=this.source[t],o=i[r];if(void 0===o)return i[r]=this,void(this.undirected&&n===r||(this.target[e][n]=this));o.previous=this,this.next=o,i[r]=this,this.target[e][n]=this},V.prototype.detach=function(){var t=this.source.key,e=this.target.key,n="out",r="in";this.undirected&&(n=r="undirected"),delete this.source[n][e],delete this.target[r][t]},V.prototype.detachMulti=function(){var t=this.source.key,e=this.target.key,n="out",r="in";this.undirected&&(n=r="undirected"),void 0===this.previous?void 0===this.next?(delete this.source[n][e],delete this.target[r][t]):(this.next.previous=void 0,this.source[n][e]=this.next,this.target[r][t]=this.next):(this.previous.next=this.next,void 0!==this.next&&(this.next.previous=this.previous))};function H(t,e,n,r,i,o,a){var c,u,d,s;if(r=""+r,0===n){if(!(c=t._nodes.get(r)))throw new F("Graph.".concat(e,': could not find the "').concat(r,'" node in the graph.'));d=i,s=o}else if(3===n){if(i=""+i,!(u=t._edges.get(i)))throw new F("Graph.".concat(e,': could not find the "').concat(i,'" edge in the graph.'));var h=u.source.key,p=u.target.key;if(r===h)c=u.target;else{if(r!==p)throw new F("Graph.".concat(e,': the "').concat(r,'" node is not attached to the "').concat(i,'" edge (').concat(h,", ").concat(p,")."));c=u.source}d=o,s=a}else{if(!(u=t._edges.get(r)))throw new F("Graph.".concat(e,': could not find the "').concat(r,'" edge in the graph.'));c=1===n?u.source:u.target,d=i,s=o}return[c,d,s]}var Q=[{name:function(t){return"get".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=H(this,e,n,t,r,i),a=o[0],c=o[1];return a.attributes[c]}}},{name:function(t){return"get".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r){return H(this,e,n,t,r)[0].attributes}}},{name:function(t){return"has".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=H(this,e,n,t,r,i),a=o[0],c=o[1];return a.attributes.hasOwnProperty(c)}}},{name:function(t){return"set".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i,o){var a=H(this,e,n,t,r,i,o),c=a[0],u=a[1],d=a[2];return c.attributes[u]=d,this.emit("nodeAttributesUpdated",{key:c.key,type:"set",attributes:c.attributes,name:u}),this}}},{name:function(t){return"update".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i,o){var a=H(this,e,n,t,r,i,o),c=a[0],u=a[1],d=a[2];if("function"!=typeof d)throw new B("Graph.".concat(e,": updater should be a function."));var s=c.attributes,h=d(s[u]);return s[u]=h,this.emit("nodeAttributesUpdated",{key:c.key,type:"set",attributes:c.attributes,name:u}),this}}},{name:function(t){return"remove".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=H(this,e,n,t,r,i),a=o[0],c=o[1];return delete a.attributes[c],this.emit("nodeAttributesUpdated",{key:a.key,type:"remove",attributes:a.attributes,name:c}),this}}},{name:function(t){return"replace".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=H(this,e,n,t,r,i),a=o[0],c=o[1];if(!s(c))throw new B("Graph.".concat(e,": provided attributes are not a plain object."));return a.attributes=c,this.emit("nodeAttributesUpdated",{key:a.key,type:"replace",attributes:a.attributes}),this}}},{name:function(t){return"merge".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=H(this,e,n,t,r,i),a=o[0],c=o[1];if(!s(c))throw new B("Graph.".concat(e,": provided attributes are not a plain object."));return u(a.attributes,c),this.emit("nodeAttributesUpdated",{key:a.key,type:"merge",attributes:a.attributes,data:c}),this}}},{name:function(t){return"update".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=H(this,e,n,t,r,i),a=o[0],c=o[1];if("function"!=typeof c)throw new B("Graph.".concat(e,": provided updater is not a function."));return a.attributes=c(a.attributes),this.emit("nodeAttributesUpdated",{key:a.key,type:"update",attributes:a.attributes}),this}}}];var X=[{name:function(t){return"get".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new I("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new I("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=d(this,o,a,n)))throw new F("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else{if("mixed"!==n)throw new I("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new F("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return i.attributes[r]}}},{name:function(t){return"get".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t){var r;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new I("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>1){if(this.multi)throw new I("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var i=""+t,o=""+arguments[1];if(!(r=d(this,i,o,n)))throw new F("Graph.".concat(e,': could not find an edge for the given path ("').concat(i,'" - "').concat(o,'").'))}else{if("mixed"!==n)throw new I("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(r=this._edges.get(t)))throw new F("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return r.attributes}}},{name:function(t){return"has".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new I("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new I("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=d(this,o,a,n)))throw new F("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else{if("mixed"!==n)throw new I("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new F("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return i.attributes.hasOwnProperty(r)}}},{name:function(t){return"set".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new I("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>3){if(this.multi)throw new I("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var a=""+t,c=""+r;if(r=arguments[2],i=arguments[3],!(o=d(this,a,c,n)))throw new F("Graph.".concat(e,': could not find an edge for the given path ("').concat(a,'" - "').concat(c,'").'))}else{if("mixed"!==n)throw new I("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(o=this._edges.get(t)))throw new F("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return o.attributes[r]=i,this.emit("edgeAttributesUpdated",{key:o.key,type:"set",attributes:o.attributes,name:r}),this}}},{name:function(t){return"update".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new I("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>3){if(this.multi)throw new I("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var a=""+t,c=""+r;if(r=arguments[2],i=arguments[3],!(o=d(this,a,c,n)))throw new F("Graph.".concat(e,': could not find an edge for the given path ("').concat(a,'" - "').concat(c,'").'))}else{if("mixed"!==n)throw new I("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(o=this._edges.get(t)))throw new F("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}if("function"!=typeof i)throw new B("Graph.".concat(e,": updater should be a function."));return o.attributes[r]=i(o.attributes[r]),this.emit("edgeAttributesUpdated",{key:o.key,type:"set",attributes:o.attributes,name:r}),this}}},{name:function(t){return"remove".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new I("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new I("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=d(this,o,a,n)))throw new F("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else{if("mixed"!==n)throw new I("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new F("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return delete i.attributes[r],this.emit("edgeAttributesUpdated",{key:i.key,type:"remove",attributes:i.attributes,name:r}),this}}},{name:function(t){return"replace".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new I("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new I("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=d(this,o,a,n)))throw new F("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else{if("mixed"!==n)throw new I("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new F("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}if(!s(r))throw new B("Graph.".concat(e,": provided attributes are not a plain object."));return i.attributes=r,this.emit("edgeAttributesUpdated",{key:i.key,type:"replace",attributes:i.attributes}),this}}},{name:function(t){return"merge".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new I("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new I("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=d(this,o,a,n)))throw new F("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else{if("mixed"!==n)throw new I("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new F("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}if(!s(r))throw new B("Graph.".concat(e,": provided attributes are not a plain object."));return u(i.attributes,r),this.emit("edgeAttributesUpdated",{key:i.key,type:"merge",attributes:i.attributes,data:r}),this}}},{name:function(t){return"update".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new I("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new I("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=d(this,o,a,n)))throw new F("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else{if("mixed"!==n)throw new I("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new F("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}if("function"!=typeof r)throw new B("Graph.".concat(e,": provided updater is not a function."));return i.attributes=r(i.attributes),this.emit("edgeAttributesUpdated",{key:i.key,type:"update",attributes:i.attributes}),this}}}];var Z=O,$=P,tt=function(){var t=arguments,e=null,n=-1;return new Z((function(){for(var r=null;;){if(null===e){if(++n>=t.length)return{done:!0};e=$(t[n])}if(!0!==(r=e.next()).done)break;e=null}return r}))},et=[{name:"edges",type:"mixed"},{name:"inEdges",type:"directed",direction:"in"},{name:"outEdges",type:"directed",direction:"out"},{name:"inboundEdges",type:"mixed",direction:"in"},{name:"outboundEdges",type:"mixed",direction:"out"},{name:"directedEdges",type:"directed"},{name:"undirectedEdges",type:"undirected"}];function nt(t,e,n,r){var i=!1;for(var o in e)if(o!==r){var a=e[o];if(i=n(a.key,a.attributes,a.source.key,a.target.key,a.source.attributes,a.target.attributes,a.undirected),t&&i)return a.key}}function rt(t,e,n,r){var i,o,a,c=!1;for(var u in e)if(u!==r){i=e[u];do{if(o=i.source,a=i.target,c=n(i.key,i.attributes,o.key,a.key,o.attributes,a.attributes,i.undirected),t&&c)return i.key;i=i.next}while(void 0!==i)}}function it(t,e){var n,r=Object.keys(t),i=r.length,o=0;return new O((function(){do{if(n)n=n.next;else{if(o>=i)return{done:!0};var a=r[o++];if(a===e){n=void 0;continue}n=t[a]}}while(!n);return{done:!1,value:{edge:n.key,attributes:n.attributes,source:n.source.key,target:n.target.key,sourceAttributes:n.source.attributes,targetAttributes:n.target.attributes,undirected:n.undirected}}}))}function ot(t,e,n,r){var i=e[n];if(i){var o=i.source,a=i.target;return r(i.key,i.attributes,o.key,a.key,o.attributes,a.attributes,i.undirected)&&t?i.key:void 0}}function at(t,e,n,r){var i=e[n];if(i){var o=!1;do{if(o=r(i.key,i.attributes,i.source.key,i.target.key,i.source.attributes,i.target.attributes,i.undirected),t&&o)return i.key;i=i.next}while(void 0!==i)}}function ct(t,e){var n=t[e];return void 0!==n.next?new O((function(){if(!n)return{done:!0};var t={edge:n.key,attributes:n.attributes,source:n.source.key,target:n.target.key,sourceAttributes:n.source.attributes,targetAttributes:n.target.attributes,undirected:n.undirected};return n=n.next,{done:!1,value:t}})):O.of({edge:n.key,attributes:n.attributes,source:n.source.key,target:n.target.key,sourceAttributes:n.source.attributes,targetAttributes:n.target.attributes,undirected:n.undirected})}function ut(t,e){if(0===t.size)return[];if("mixed"===e||e===t.type)return"function"==typeof Array.from?Array.from(t._edges.keys()):K(t._edges.keys(),t._edges.size);for(var n,r,i="undirected"===e?t.undirectedSize:t.directedSize,o=new Array(i),a="undirected"===e,c=t._edges.values(),u=0;!0!==(n=c.next()).done;)(r=n.value).undirected===a&&(o[u++]=r.key);return o}function dt(t,e,n,r){if(0!==e.size)for(var i,o,a="mixed"!==n&&n!==e.type,c="undirected"===n,u=!1,d=e._edges.values();!0!==(i=d.next()).done;)if(o=i.value,!a||o.undirected===c){var s=o,h=s.key,p=s.attributes,f=s.source,l=s.target;if(u=r(h,p,f.key,l.key,f.attributes,l.attributes,o.undirected),t&&u)return h}}function st(t,e){if(0===t.size)return O.empty();var n="mixed"!==e&&e!==t.type,r="undirected"===e,i=t._edges.values();return new O((function(){for(var t,e;;){if((t=i.next()).done)return t;if(e=t.value,!n||e.undirected===r)break}return{value:{edge:e.key,attributes:e.attributes,source:e.source.key,target:e.target.key,sourceAttributes:e.source.attributes,targetAttributes:e.target.attributes,undirected:e.undirected},done:!1}}))}function ht(t,e,n,r,i,o){var a,c=e?rt:nt;if("undirected"!==n){if("out"!==r&&(a=c(t,i.in,o),t&&a))return a;if("in"!==r&&(a=c(t,i.out,o,r?void 0:i.key),t&&a))return a}if("directed"!==n&&(a=c(t,i.undirected,o),t&&a))return a}function pt(t,e,n,r){var i=[];return ht(!1,t,e,n,r,(function(t){i.push(t)})),i}function ft(t,e,n){var r=O.empty();return"undirected"!==t&&("out"!==e&&void 0!==n.in&&(r=tt(r,it(n.in))),"in"!==e&&void 0!==n.out&&(r=tt(r,it(n.out,e?void 0:n.key)))),"directed"!==t&&void 0!==n.undirected&&(r=tt(r,it(n.undirected))),r}function lt(t,e,n,r,i,o,a){var c,u=n?at:ot;if("undirected"!==e){if(void 0!==i.in&&"out"!==r&&(c=u(t,i.in,o,a),t&&c))return c;if(void 0!==i.out&&"in"!==r&&(r||i.key!==o)&&(c=u(t,i.out,o,a),t&&c))return c}if("directed"!==e&&void 0!==i.undirected&&(c=u(t,i.undirected,o,a),t&&c))return c}function gt(t,e,n,r,i){var o=[];return lt(!1,t,e,n,r,i,(function(t){o.push(t)})),o}function yt(t,e,n,r){var i=O.empty();return"undirected"!==t&&(void 0!==n.in&&"out"!==e&&r in n.in&&(i=tt(i,ct(n.in,r))),void 0!==n.out&&"in"!==e&&r in n.out&&(e||n.key!==r)&&(i=tt(i,ct(n.out,r)))),"directed"!==t&&void 0!==n.undirected&&r in n.undirected&&(i=tt(i,ct(n.undirected,r))),i}var wt=[{name:"neighbors",type:"mixed"},{name:"inNeighbors",type:"directed",direction:"in"},{name:"outNeighbors",type:"directed",direction:"out"},{name:"inboundNeighbors",type:"mixed",direction:"in"},{name:"outboundNeighbors",type:"mixed",direction:"out"},{name:"directedNeighbors",type:"directed"},{name:"undirectedNeighbors",type:"undirected"}];function vt(){this.A=null,this.B=null}function bt(t,e,n,r,i){for(var o in r){var a=r[o],c=a.source,u=a.target,d=c===n?u:c;if(!e||!e.has(d.key)){var s=i(d.key,d.attributes);if(t&&s)return d.key}}}function mt(t,e,n,r,i){if("mixed"!==e){if("undirected"===e)return bt(t,null,r,r.undirected,i);if("string"==typeof n)return bt(t,null,r,r[n],i)}var o,a=new vt;if("undirected"!==e){if("out"!==n){if(o=bt(t,null,r,r.in,i),t&&o)return o;a.wrap(r.in)}if("in"!==n){if(o=bt(t,a,r,r.out,i),t&&o)return o;a.wrap(r.out)}}if("directed"!==e&&(o=bt(t,a,r,r.undirected,i),t&&o))return o}function kt(t,e,n){var r=Object.keys(n),i=r.length,o=0;return new O((function(){var a=null;do{if(o>=i)return t&&t.wrap(n),{done:!0};var c=n[r[o++]],u=c.source,d=c.target;a=u===e?d:u,t&&t.has(a.key)&&(a=null)}while(null===a);return{done:!1,value:{neighbor:a.key,attributes:a.attributes}}}))}function _t(t,e){var n=e.name,r=e.type,i=e.direction;t.prototype[n]=function(t){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return[];t=""+t;var e=this._nodes.get(t);if(void 0===e)throw new F("Graph.".concat(n,': could not find the "').concat(t,'" node in the graph.'));return function(t,e,n){if("mixed"!==t){if("undirected"===t)return Object.keys(n.undirected);if("string"==typeof e)return Object.keys(n[e])}var r=[];return mt(!1,t,e,n,(function(t){r.push(t)})),r}("mixed"===r?this.type:r,i,e)}}function Gt(t,e){var n=e.name,r=e.type,i=e.direction,o=n.slice(0,-1)+"Entries";t.prototype[o]=function(t){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return O.empty();t=""+t;var e=this._nodes.get(t);if(void 0===e)throw new F("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));return function(t,e,n){if("mixed"!==t){if("undirected"===t)return kt(null,n,n.undirected);if("string"==typeof e)return kt(null,n,n[e])}var r=O.empty(),i=new vt;return"undirected"!==t&&("out"!==e&&(r=tt(r,kt(i,n,n.in))),"in"!==e&&(r=tt(r,kt(i,n,n.out)))),"directed"!==t&&(r=tt(r,kt(i,n,n.undirected))),r}("mixed"===r?this.type:r,i,e)}}function xt(t,e,n,r,i){for(var o,a,c,u,d,s,h,p=r._nodes.values(),f=r.type;!0!==(o=p.next()).done;){var l=!1;if(a=o.value,"undirected"!==f)for(c in u=a.out){d=u[c];do{if(s=d.target,l=!0,h=i(a.key,s.key,a.attributes,s.attributes,d.key,d.attributes,d.undirected),t&&h)return d;d=d.next}while(d)}if("directed"!==f)for(c in u=a.undirected)if(!(e&&a.key>c)){d=u[c];do{if((s=d.target).key!==c&&(s=d.source),l=!0,h=i(a.key,s.key,a.attributes,s.attributes,d.key,d.attributes,d.undirected),t&&h)return d;d=d.next}while(d)}if(n&&!l&&(h=i(a.key,null,a.attributes,null,null,null,null),t&&h))return null}}function Et(t){if(!s(t))throw new B('Graph.import: invalid serialized node. A serialized node should be a plain object with at least a "key" property.');if(!("key"in t))throw new B("Graph.import: serialized node is missing its key.");if("attributes"in t&&(!s(t.attributes)||null===t.attributes))throw new B("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.")}function At(t){if(!s(t))throw new B('Graph.import: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.');if(!("source"in t))throw new B("Graph.import: serialized edge is missing its source.");if(!("target"in t))throw new B("Graph.import: serialized edge is missing its target.");if("attributes"in t&&(!s(t.attributes)||null===t.attributes))throw new B("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.");if("undirected"in t&&"boolean"!=typeof t.undirected)throw new B("Graph.import: invalid undirectedness information. Undirected should be boolean or omitted.")}vt.prototype.wrap=function(t){null===this.A?this.A=t:null===this.B&&(this.B=t)},vt.prototype.has=function(t){return null!==this.A&&t in this.A||null!==this.B&&t in this.B};var Lt,St=(Lt=255&Math.floor(256*Math.random()),function(){return Lt++}),Dt=new Set(["directed","undirected","mixed"]),Ut=new Set(["domain","_events","_eventsCount","_maxListeners"]),Nt={allowSelfLoops:!0,multi:!1,type:"mixed"};function Ot(t,e,n){var r=new t.NodeDataClass(e,n);return t._nodes.set(e,r),t.emit("nodeAdded",{key:e,attributes:n}),r}function jt(t,e,n,r,i,o,a,c){if(!r&&"undirected"===t.type)throw new I("Graph.".concat(e,": you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead."));if(r&&"directed"===t.type)throw new I("Graph.".concat(e,": you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead."));if(c&&!s(c))throw new B("Graph.".concat(e,': invalid attributes. Expecting an object but got "').concat(c,'"'));if(o=""+o,a=""+a,c=c||{},!t.allowSelfLoops&&o===a)throw new I("Graph.".concat(e,': source & target are the same ("').concat(o,"\"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false."));var u=t._nodes.get(o),d=t._nodes.get(a);if(!u)throw new F("Graph.".concat(e,': source node "').concat(o,'" not found.'));if(!d)throw new F("Graph.".concat(e,': target node "').concat(a,'" not found.'));var h={key:null,undirected:r,source:o,target:a,attributes:c};if(n)i=t._edgeKeyGenerator();else if(i=""+i,t._edges.has(i))throw new I("Graph.".concat(e,': the "').concat(i,'" edge already exists in the graph.'));if(!t.multi&&(r?void 0!==u.undirected[a]:void 0!==u.out[a]))throw new I("Graph.".concat(e,': an edge linking "').concat(o,'" to "').concat(a,"\" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option."));var p=new V(r,i,u,d,c);t._edges.set(i,p);var f=o===a;return r?(u.undirectedDegree++,d.undirectedDegree++,f&&(u.undirectedLoops++,t._undirectedSelfLoopCount++)):(u.outDegree++,d.inDegree++,f&&(u.directedLoops++,t._directedSelfLoopCount++)),t.multi?p.attachMulti():p.attach(),r?t._undirectedSize++:t._directedSize++,h.key=i,t.emit("edgeAdded",h),i}function Ct(t,e,n,r,i,o,a,c,d){if(!r&&"undirected"===t.type)throw new I("Graph.".concat(e,": you cannot merge/update a directed edge to an undirected graph. Use the #.mergeEdge/#.updateEdge or #.addUndirectedEdge instead."));if(r&&"directed"===t.type)throw new I("Graph.".concat(e,": you cannot merge/update an undirected edge to a directed graph. Use the #.mergeEdge/#.updateEdge or #.addDirectedEdge instead."));if(c)if(d){if("function"!=typeof c)throw new B("Graph.".concat(e,': invalid updater function. Expecting a function but got "').concat(c,'"'))}else if(!s(c))throw new B("Graph.".concat(e,': invalid attributes. Expecting an object but got "').concat(c,'"'));var h;if(o=""+o,a=""+a,d&&(h=c,c=void 0),!t.allowSelfLoops&&o===a)throw new I("Graph.".concat(e,': source & target are the same ("').concat(o,"\"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false."));var p,f,l=t._nodes.get(o),g=t._nodes.get(a);if(!n&&(p=t._edges.get(i))){if(!(p.source.key===o&&p.target.key===a||r&&p.source.key===a&&p.target.key===o))throw new I("Graph.".concat(e,': inconsistency detected when attempting to merge the "').concat(i,'" edge with "').concat(o,'" source & "').concat(a,'" target vs. ("').concat(p.source.key,'", "').concat(p.target.key,'").'));f=p}if(f||t.multi||!l||(f=r?l.undirected[a]:l.out[a]),f){var y=[f.key,!1,!1,!1];if(d?!h:!c)return y;if(d){var w=f.attributes;f.attributes=h(w),t.emit("edgeAttributesUpdated",{type:"replace",key:f.key,attributes:f.attributes})}else u(f.attributes,c),t.emit("edgeAttributesUpdated",{type:"merge",key:f.key,attributes:f.attributes,data:c});return y}c=c||{},d&&h&&(c=h(c));var v={key:null,undirected:r,source:o,target:a,attributes:c};if(n)i=t._edgeKeyGenerator();else if(i=""+i,t._edges.has(i))throw new I("Graph.".concat(e,': the "').concat(i,'" edge already exists in the graph.'));var b=!1,m=!1;l||(l=Ot(t,o,{}),b=!0,o===a&&(g=l,m=!0)),g||(g=Ot(t,a,{}),m=!0),p=new V(r,i,l,g,c),t._edges.set(i,p);var k=o===a;return r?(l.undirectedDegree++,g.undirectedDegree++,k&&(l.undirectedLoops++,t._undirectedSelfLoopCount++)):(l.outDegree++,g.inDegree++,k&&(l.directedLoops++,t._directedSelfLoopCount++)),t.multi?p.attachMulti():p.attach(),r?t._undirectedSize++:t._directedSize++,v.key=i,t.emit("edgeAdded",v),[i,!0,b,m]}function Mt(t,e){t._edges.delete(e.key);var n=e.source,r=e.target,i=e.attributes,o=e.undirected,a=n===r;o?(n.undirectedDegree--,r.undirectedDegree--,a&&(n.undirectedLoops--,t._undirectedSelfLoopCount--)):(n.outDegree--,r.inDegree--,a&&(n.directedLoops--,t._directedSelfLoopCount--)),t.multi?e.detachMulti():e.detach(),o?t._undirectedSize--:t._directedSize--,t.emit("edgeDropped",{key:e.key,attributes:i,source:n.key,target:r.key,undirected:o})}var zt=function(n){function r(t){var e;if(e=n.call(this)||this,"boolean"!=typeof(t=u({},Nt,t)).multi)throw new B("Graph.constructor: invalid 'multi' option. Expecting a boolean but got \"".concat(t.multi,'".'));if(!Dt.has(t.type))throw new B('Graph.constructor: invalid \'type\' option. Should be one of "mixed", "directed" or "undirected" but got "'.concat(t.type,'".'));if("boolean"!=typeof t.allowSelfLoops)throw new B("Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got \"".concat(t.allowSelfLoops,'".'));var r="mixed"===t.type?Y:"directed"===t.type?q:J;p(c(e),"NodeDataClass",r);var i="geid_"+St()+"_",o=0;return p(c(e),"_attributes",{}),p(c(e),"_nodes",new Map),p(c(e),"_edges",new Map),p(c(e),"_directedSize",0),p(c(e),"_undirectedSize",0),p(c(e),"_directedSelfLoopCount",0),p(c(e),"_undirectedSelfLoopCount",0),p(c(e),"_edgeKeyGenerator",(function(){var t;do{t=i+o++}while(e._edges.has(t));return t})),p(c(e),"_options",t),Ut.forEach((function(t){return p(c(e),t,e[t])})),f(c(e),"order",(function(){return e._nodes.size})),f(c(e),"size",(function(){return e._edges.size})),f(c(e),"directedSize",(function(){return e._directedSize})),f(c(e),"undirectedSize",(function(){return e._undirectedSize})),f(c(e),"selfLoopCount",(function(){return e._directedSelfLoopCount+e._undirectedSelfLoopCount})),f(c(e),"directedSelfLoopCount",(function(){return e._directedSelfLoopCount})),f(c(e),"undirectedSelfLoopCount",(function(){return e._undirectedSelfLoopCount})),f(c(e),"multi",e._options.multi),f(c(e),"type",e._options.type),f(c(e),"allowSelfLoops",e._options.allowSelfLoops),f(c(e),"implementation",(function(){return"graphology"})),e}e(r,n);var i=r.prototype;return i._resetInstanceCounters=function(){this._directedSize=0,this._undirectedSize=0,this._directedSelfLoopCount=0,this._undirectedSelfLoopCount=0},i.hasNode=function(t){return this._nodes.has(""+t)},i.hasDirectedEdge=function(t,e){if("undirected"===this.type)return!1;if(1===arguments.length){var n=""+t,r=this._edges.get(n);return!!r&&!r.undirected}if(2===arguments.length){t=""+t,e=""+e;var i=this._nodes.get(t);return!!i&&i.out.hasOwnProperty(e)}throw new B("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length,", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."))},i.hasUndirectedEdge=function(t,e){if("directed"===this.type)return!1;if(1===arguments.length){var n=""+t,r=this._edges.get(n);return!!r&&r.undirected}if(2===arguments.length){t=""+t,e=""+e;var i=this._nodes.get(t);return!!i&&i.undirected.hasOwnProperty(e)}throw new B("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length,", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."))},i.hasEdge=function(t,e){if(1===arguments.length){var n=""+t;return this._edges.has(n)}if(2===arguments.length){t=""+t,e=""+e;var r=this._nodes.get(t);return!!r&&(void 0!==r.out&&r.out.hasOwnProperty(e)||void 0!==r.undirected&&r.undirected.hasOwnProperty(e))}throw new B("Graph.hasEdge: invalid arity (".concat(arguments.length,", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."))},i.directedEdge=function(t,e){if("undirected"!==this.type){if(t=""+t,e=""+e,this.multi)throw new I("Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.");var n=this._nodes.get(t);if(!n)throw new F('Graph.directedEdge: could not find the "'.concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new F('Graph.directedEdge: could not find the "'.concat(e,'" target node in the graph.'));var r=n.out&&n.out[e]||void 0;return r?r.key:void 0}},i.undirectedEdge=function(t,e){if("directed"!==this.type){if(t=""+t,e=""+e,this.multi)throw new I("Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.");var n=this._nodes.get(t);if(!n)throw new F('Graph.undirectedEdge: could not find the "'.concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new F('Graph.undirectedEdge: could not find the "'.concat(e,'" target node in the graph.'));var r=n.undirected&&n.undirected[e]||void 0;return r?r.key:void 0}},i.edge=function(t,e){if(this.multi)throw new I("Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.");t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new F('Graph.edge: could not find the "'.concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new F('Graph.edge: could not find the "'.concat(e,'" target node in the graph.'));var r=n.out&&n.out[e]||n.undirected&&n.undirected[e]||void 0;if(r)return r.key},i.areDirectedNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new F('Graph.areDirectedNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"undirected"!==this.type&&(e in n.in||e in n.out)},i.areOutNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new F('Graph.areOutNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"undirected"!==this.type&&e in n.out},i.areInNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new F('Graph.areInNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"undirected"!==this.type&&e in n.in},i.areUndirectedNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new F('Graph.areUndirectedNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"directed"!==this.type&&e in n.undirected},i.areNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new F('Graph.areNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"undirected"!==this.type&&(e in n.in||e in n.out)||"directed"!==this.type&&e in n.undirected},i.areInboundNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new F('Graph.areInboundNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"undirected"!==this.type&&e in n.in||"directed"!==this.type&&e in n.undirected},i.areOutboundNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new F('Graph.areOutboundNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"undirected"!==this.type&&e in n.out||"directed"!==this.type&&e in n.undirected},i.inDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.inDegree: could not find the "'.concat(t,'" node in the graph.'));return"undirected"===this.type?0:e.inDegree},i.outDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.outDegree: could not find the "'.concat(t,'" node in the graph.'));return"undirected"===this.type?0:e.outDegree},i.directedDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.directedDegree: could not find the "'.concat(t,'" node in the graph.'));return"undirected"===this.type?0:e.inDegree+e.outDegree},i.undirectedDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.undirectedDegree: could not find the "'.concat(t,'" node in the graph.'));return"directed"===this.type?0:e.undirectedDegree},i.inboundDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.inboundDegree: could not find the "'.concat(t,'" node in the graph.'));var n=0;return"directed"!==this.type&&(n+=e.undirectedDegree),"undirected"!==this.type&&(n+=e.inDegree),n},i.outboundDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.outboundDegree: could not find the "'.concat(t,'" node in the graph.'));var n=0;return"directed"!==this.type&&(n+=e.undirectedDegree),"undirected"!==this.type&&(n+=e.outDegree),n},i.degree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.degree: could not find the "'.concat(t,'" node in the graph.'));var n=0;return"directed"!==this.type&&(n+=e.undirectedDegree),"undirected"!==this.type&&(n+=e.inDegree+e.outDegree),n},i.inDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.inDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));return"undirected"===this.type?0:e.inDegree-e.directedLoops},i.outDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.outDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));return"undirected"===this.type?0:e.outDegree-e.directedLoops},i.directedDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.directedDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));return"undirected"===this.type?0:e.inDegree+e.outDegree-2*e.directedLoops},i.undirectedDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.undirectedDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));return"directed"===this.type?0:e.undirectedDegree-2*e.undirectedLoops},i.inboundDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.inboundDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));var n=0,r=0;return"directed"!==this.type&&(n+=e.undirectedDegree,r+=2*e.undirectedLoops),"undirected"!==this.type&&(n+=e.inDegree,r+=e.directedLoops),n-r},i.outboundDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.outboundDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));var n=0,r=0;return"directed"!==this.type&&(n+=e.undirectedDegree,r+=2*e.undirectedLoops),"undirected"!==this.type&&(n+=e.outDegree,r+=e.directedLoops),n-r},i.degreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new F('Graph.degreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));var n=0,r=0;return"directed"!==this.type&&(n+=e.undirectedDegree,r+=2*e.undirectedLoops),"undirected"!==this.type&&(n+=e.inDegree+e.outDegree,r+=2*e.directedLoops),n-r},i.source=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new F('Graph.source: could not find the "'.concat(t,'" edge in the graph.'));return e.source.key},i.target=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new F('Graph.target: could not find the "'.concat(t,'" edge in the graph.'));return e.target.key},i.extremities=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new F('Graph.extremities: could not find the "'.concat(t,'" edge in the graph.'));return[e.source.key,e.target.key]},i.opposite=function(t,e){t=""+t,e=""+e;var n=this._edges.get(e);if(!n)throw new F('Graph.opposite: could not find the "'.concat(e,'" edge in the graph.'));var r=n.source.key,i=n.target.key;if(t===r)return i;if(t===i)return r;throw new F('Graph.opposite: the "'.concat(t,'" node is not attached to the "').concat(e,'" edge (').concat(r,", ").concat(i,")."))},i.hasExtremity=function(t,e){t=""+t,e=""+e;var n=this._edges.get(t);if(!n)throw new F('Graph.hasExtremity: could not find the "'.concat(t,'" edge in the graph.'));return n.source.key===e||n.target.key===e},i.isUndirected=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new F('Graph.isUndirected: could not find the "'.concat(t,'" edge in the graph.'));return e.undirected},i.isDirected=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new F('Graph.isDirected: could not find the "'.concat(t,'" edge in the graph.'));return!e.undirected},i.isSelfLoop=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new F('Graph.isSelfLoop: could not find the "'.concat(t,'" edge in the graph.'));return e.source===e.target},i.addNode=function(t,e){var n=function(t,e,n){if(n&&!s(n))throw new B('Graph.addNode: invalid attributes. Expecting an object but got "'.concat(n,'"'));if(e=""+e,n=n||{},t._nodes.has(e))throw new I('Graph.addNode: the "'.concat(e,'" node already exist in the graph.'));var r=new t.NodeDataClass(e,n);return t._nodes.set(e,r),t.emit("nodeAdded",{key:e,attributes:n}),r}(this,t,e);return n.key},i.mergeNode=function(t,e){if(e&&!s(e))throw new B('Graph.mergeNode: invalid attributes. Expecting an object but got "'.concat(e,'"'));t=""+t,e=e||{};var n=this._nodes.get(t);return n?(e&&(u(n.attributes,e),this.emit("nodeAttributesUpdated",{type:"merge",key:t,attributes:n.attributes,data:e})),[t,!1]):(n=new this.NodeDataClass(t,e),this._nodes.set(t,n),this.emit("nodeAdded",{key:t,attributes:e}),[t,!0])},i.updateNode=function(t,e){if(e&&"function"!=typeof e)throw new B('Graph.updateNode: invalid updater function. Expecting a function but got "'.concat(e,'"'));t=""+t;var n=this._nodes.get(t);if(n){if(e){var r=n.attributes;n.attributes=e(r),this.emit("nodeAttributesUpdated",{type:"replace",key:t,attributes:n.attributes})}return[t,!1]}var i=e?e({}):{};return n=new this.NodeDataClass(t,i),this._nodes.set(t,n),this.emit("nodeAdded",{key:t,attributes:i}),[t,!0]},i.dropNode=function(t){t=""+t;var e,n=this._nodes.get(t);if(!n)throw new F('Graph.dropNode: could not find the "'.concat(t,'" node in the graph.'));if("undirected"!==this.type){for(var r in n.out){e=n.out[r];do{Mt(this,e),e=e.next}while(e)}for(var i in n.in){e=n.in[i];do{Mt(this,e),e=e.next}while(e)}}if("directed"!==this.type)for(var o in n.undirected){e=n.undirected[o];do{Mt(this,e),e=e.next}while(e)}this._nodes.delete(t),this.emit("nodeDropped",{key:t,attributes:n.attributes})},i.dropEdge=function(t){var e;if(arguments.length>1){var n=""+arguments[0],r=""+arguments[1];if(!(e=d(this,n,r,this.type)))throw new F('Graph.dropEdge: could not find the "'.concat(n,'" -> "').concat(r,'" edge in the graph.'))}else if(t=""+t,!(e=this._edges.get(t)))throw new F('Graph.dropEdge: could not find the "'.concat(t,'" edge in the graph.'));return Mt(this,e),this},i.dropDirectedEdge=function(t,e){if(arguments.length<2)throw new I("Graph.dropDirectedEdge: it does not make sense to try and drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");if(this.multi)throw new I("Graph.dropDirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");var n=d(this,t=""+t,e=""+e,"directed");if(!n)throw new F('Graph.dropDirectedEdge: could not find a "'.concat(t,'" -> "').concat(e,'" edge in the graph.'));return Mt(this,n),this},i.dropUndirectedEdge=function(t,e){if(arguments.length<2)throw new I("Graph.dropUndirectedEdge: it does not make sense to drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");if(this.multi)throw new I("Graph.dropUndirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");var n=d(this,t,e,"undirected");if(!n)throw new F('Graph.dropUndirectedEdge: could not find a "'.concat(t,'" -> "').concat(e,'" edge in the graph.'));return Mt(this,n),this},i.clear=function(){this._edges.clear(),this._nodes.clear(),this._resetInstanceCounters(),this.emit("cleared")},i.clearEdges=function(){for(var t,e=this._nodes.values();!0!==(t=e.next()).done;)t.value.clear();this._edges.clear(),this._resetInstanceCounters(),this.emit("edgesCleared")},i.getAttribute=function(t){return this._attributes[t]},i.getAttributes=function(){return this._attributes},i.hasAttribute=function(t){return this._attributes.hasOwnProperty(t)},i.setAttribute=function(t,e){return this._attributes[t]=e,this.emit("attributesUpdated",{type:"set",attributes:this._attributes,name:t}),this},i.updateAttribute=function(t,e){if("function"!=typeof e)throw new B("Graph.updateAttribute: updater should be a function.");var n=this._attributes[t];return this._attributes[t]=e(n),this.emit("attributesUpdated",{type:"set",attributes:this._attributes,name:t}),this},i.removeAttribute=function(t){return delete this._attributes[t],this.emit("attributesUpdated",{type:"remove",attributes:this._attributes,name:t}),this},i.replaceAttributes=function(t){if(!s(t))throw new B("Graph.replaceAttributes: provided attributes are not a plain object.");return this._attributes=t,this.emit("attributesUpdated",{type:"replace",attributes:this._attributes}),this},i.mergeAttributes=function(t){if(!s(t))throw new B("Graph.mergeAttributes: provided attributes are not a plain object.");return u(this._attributes,t),this.emit("attributesUpdated",{type:"merge",attributes:this._attributes,data:t}),this},i.updateAttributes=function(t){if("function"!=typeof t)throw new B("Graph.updateAttributes: provided updater is not a function.");return this._attributes=t(this._attributes),this.emit("attributesUpdated",{type:"update",attributes:this._attributes}),this},i.updateEachNodeAttributes=function(t,e){if("function"!=typeof t)throw new B("Graph.updateEachNodeAttributes: expecting an updater function.");if(e&&!l(e))throw new B("Graph.updateEachNodeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");for(var n,r,i=this._nodes.values();!0!==(n=i.next()).done;)(r=n.value).attributes=t(r.key,r.attributes);this.emit("eachNodeAttributesUpdated",{hints:e||null})},i.updateEachEdgeAttributes=function(t,e){if("function"!=typeof t)throw new B("Graph.updateEachEdgeAttributes: expecting an updater function.");if(e&&!l(e))throw new B("Graph.updateEachEdgeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");for(var n,r,i,o,a=this._edges.values();!0!==(n=a.next()).done;)i=(r=n.value).source,o=r.target,r.attributes=t(r.key,r.attributes,i.key,o.key,i.attributes,o.attributes,r.undirected);this.emit("eachEdgeAttributesUpdated",{hints:e||null})},i.forEachAdjacencyEntry=function(t){if("function"!=typeof t)throw new B("Graph.forEachAdjacencyEntry: expecting a callback.");xt(!1,!1,!1,this,t)},i.forEachAdjacencyEntryWithOrphans=function(t){if("function"!=typeof t)throw new B("Graph.forEachAdjacencyEntryWithOrphans: expecting a callback.");xt(!1,!1,!0,this,t)},i.forEachAssymetricAdjacencyEntry=function(t){if("function"!=typeof t)throw new B("Graph.forEachAssymetricAdjacencyEntry: expecting a callback.");xt(!1,!0,!1,this,t)},i.forEachAssymetricAdjacencyEntryWithOrphans=function(t){if("function"!=typeof t)throw new B("Graph.forEachAssymetricAdjacencyEntryWithOrphans: expecting a callback.");xt(!1,!0,!0,this,t)},i.nodes=function(){return"function"==typeof Array.from?Array.from(this._nodes.keys()):K(this._nodes.keys(),this._nodes.size)},i.forEachNode=function(t){if("function"!=typeof t)throw new B("Graph.forEachNode: expecting a callback.");for(var e,n,r=this._nodes.values();!0!==(e=r.next()).done;)t((n=e.value).key,n.attributes)},i.findNode=function(t){if("function"!=typeof t)throw new B("Graph.findNode: expecting a callback.");for(var e,n,r=this._nodes.values();!0!==(e=r.next()).done;)if(t((n=e.value).key,n.attributes))return n.key},i.mapNodes=function(t){if("function"!=typeof t)throw new B("Graph.mapNode: expecting a callback.");for(var e,n,r=this._nodes.values(),i=new Array(this.order),o=0;!0!==(e=r.next()).done;)n=e.value,i[o++]=t(n.key,n.attributes);return i},i.someNode=function(t){if("function"!=typeof t)throw new B("Graph.someNode: expecting a callback.");for(var e,n,r=this._nodes.values();!0!==(e=r.next()).done;)if(t((n=e.value).key,n.attributes))return!0;return!1},i.everyNode=function(t){if("function"!=typeof t)throw new B("Graph.everyNode: expecting a callback.");for(var e,n,r=this._nodes.values();!0!==(e=r.next()).done;)if(!t((n=e.value).key,n.attributes))return!1;return!0},i.filterNodes=function(t){if("function"!=typeof t)throw new B("Graph.filterNodes: expecting a callback.");for(var e,n,r=this._nodes.values(),i=[];!0!==(e=r.next()).done;)t((n=e.value).key,n.attributes)&&i.push(n.key);return i},i.reduceNodes=function(t,e){if("function"!=typeof t)throw new B("Graph.reduceNodes: expecting a callback.");if(arguments.length<2)throw new B("Graph.reduceNodes: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.");for(var n,r,i=e,o=this._nodes.values();!0!==(n=o.next()).done;)i=t(i,(r=n.value).key,r.attributes);return i},i.nodeEntries=function(){var t=this._nodes.values();return new O((function(){var e=t.next();if(e.done)return e;var n=e.value;return{value:{node:n.key,attributes:n.attributes},done:!1}}))},i.export=function(){var t=this,e=new Array(this._nodes.size),n=0;this._nodes.forEach((function(t,r){e[n++]=function(t,e){var n={key:t};return h(e.attributes)||(n.attributes=u({},e.attributes)),n}(r,t)}));var r=new Array(this._edges.size);return n=0,this._edges.forEach((function(e,i){r[n++]=function(t,e,n){var r={key:e,source:n.source.key,target:n.target.key};return h(n.attributes)||(r.attributes=u({},n.attributes)),"mixed"===t&&n.undirected&&(r.undirected=!0),r}(t.type,i,e)})),{options:{type:this.type,multi:this.multi,allowSelfLoops:this.allowSelfLoops},attributes:this.getAttributes(),nodes:e,edges:r}},i.import=function(t){var e,n,i,o,a,c=this,u=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(t instanceof r)return t.forEachNode((function(t,e){u?c.mergeNode(t,e):c.addNode(t,e)})),t.forEachEdge((function(t,e,n,r,i,o,a){u?a?c.mergeUndirectedEdgeWithKey(t,n,r,e):c.mergeDirectedEdgeWithKey(t,n,r,e):a?c.addUndirectedEdgeWithKey(t,n,r,e):c.addDirectedEdgeWithKey(t,n,r,e)})),this;if(!s(t))throw new B("Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.");if(t.attributes){if(!s(t.attributes))throw new B("Graph.import: invalid attributes. Expecting a plain object.");u?this.mergeAttributes(t.attributes):this.replaceAttributes(t.attributes)}if(t.nodes){if(i=t.nodes,!Array.isArray(i))throw new B("Graph.import: invalid nodes. Expecting an array.");for(e=0,n=i.length;e<n;e++){Et(o=i[e]);var d=o,h=d.key,p=d.attributes;u?this.mergeNode(h,p):this.addNode(h,p)}}if(t.edges){var f=!1;if("undirected"===this.type&&(f=!0),i=t.edges,!Array.isArray(i))throw new B("Graph.import: invalid edges. Expecting an array.");for(e=0,n=i.length;e<n;e++){At(a=i[e]);var l=a,g=l.source,y=l.target,w=l.attributes,v=l.undirected,b=void 0===v?f:v;"key"in a?(u?b?this.mergeUndirectedEdgeWithKey:this.mergeDirectedEdgeWithKey:b?this.addUndirectedEdgeWithKey:this.addDirectedEdgeWithKey).call(this,a.key,g,y,w):(u?b?this.mergeUndirectedEdge:this.mergeDirectedEdge:b?this.addUndirectedEdge:this.addDirectedEdge).call(this,g,y,w)}}return this},i.nullCopy=function(t){var e=new r(u({},this._options,t));return e.replaceAttributes(u({},this.getAttributes())),e},i.emptyCopy=function(t){var e=this.nullCopy(t);return this._nodes.forEach((function(t,n){var r=u({},t.attributes);t=new e.NodeDataClass(n,r),e._nodes.set(n,t)})),e},i.copy=function(t){if("string"==typeof(t=t||{}).type&&t.type!==this.type&&"mixed"!==t.type)throw new I('Graph.copy: cannot create an incompatible copy from "'.concat(this.type,'" type to "').concat(t.type,'" because this would mean losing information about the current graph.'));if("boolean"==typeof t.multi&&t.multi!==this.multi&&!0!==t.multi)throw new I("Graph.copy: cannot create an incompatible copy by downgrading a multi graph to a simple one because this would mean losing information about the current graph.");if("boolean"==typeof t.allowSelfLoops&&t.allowSelfLoops!==this.allowSelfLoops&&!0!==t.allowSelfLoops)throw new I("Graph.copy: cannot create an incompatible copy from a graph allowing self loops to one that does not because this would mean losing information about the current graph.");for(var e,n,r=this.emptyCopy(t),i=this._edges.values();!0!==(e=i.next()).done;)jt(r,"copy",!1,(n=e.value).undirected,n.key,n.source.key,n.target.key,u({},n.attributes));return r},i.toJSON=function(){return this.export()},i.toString=function(){return"[object Graph]"},i.inspect=function(){var e=this,n={};this._nodes.forEach((function(t,e){n[e]=t.attributes}));var r={},i={};this._edges.forEach((function(t,n){var o,a=t.undirected?"--":"->",c="",u=t.source.key,d=t.target.key;t.undirected&&u>d&&(o=u,u=d,d=o);var s="(".concat(u,")").concat(a,"(").concat(d,")");n.startsWith("geid_")?e.multi&&(void 0===i[s]?i[s]=0:i[s]++,c+="".concat(i[s],". ")):c+="[".concat(n,"]: "),r[c+=s]=t.attributes}));var o={};for(var a in this)this.hasOwnProperty(a)&&!Ut.has(a)&&"function"!=typeof this[a]&&"symbol"!==t(a)&&(o[a]=this[a]);return o.attributes=this._attributes,o.nodes=n,o.edges=r,p(o,"constructor",this.constructor),o},r}(y.exports.EventEmitter);"undefined"!=typeof Symbol&&(zt.prototype[Symbol.for("nodejs.util.inspect.custom")]=zt.prototype.inspect),[{name:function(t){return"".concat(t,"Edge")},generateKey:!0},{name:function(t){return"".concat(t,"DirectedEdge")},generateKey:!0,type:"directed"},{name:function(t){return"".concat(t,"UndirectedEdge")},generateKey:!0,type:"undirected"},{name:function(t){return"".concat(t,"EdgeWithKey")}},{name:function(t){return"".concat(t,"DirectedEdgeWithKey")},type:"directed"},{name:function(t){return"".concat(t,"UndirectedEdgeWithKey")},type:"undirected"}].forEach((function(t){["add","merge","update"].forEach((function(e){var n=t.name(e),r="add"===e?jt:Ct;t.generateKey?zt.prototype[n]=function(i,o,a){return r(this,n,!0,"undirected"===(t.type||this.type),null,i,o,a,"update"===e)}:zt.prototype[n]=function(i,o,a,c){return r(this,n,!1,"undirected"===(t.type||this.type),i,o,a,c,"update"===e)}}))})),function(t){Q.forEach((function(e){var n=e.name,r=e.attacher;r(t,n("Node"),0),r(t,n("Source"),1),r(t,n("Target"),2),r(t,n("Opposite"),3)}))}(zt),function(t){X.forEach((function(e){var n=e.name,r=e.attacher;r(t,n("Edge"),"mixed"),r(t,n("DirectedEdge"),"directed"),r(t,n("UndirectedEdge"),"undirected")}))}(zt),function(t){et.forEach((function(e){!function(t,e){var n=e.name,r=e.type,i=e.direction;t.prototype[n]=function(t,e){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return[];if(!arguments.length)return ut(this,r);if(1===arguments.length){t=""+t;var o=this._nodes.get(t);if(void 0===o)throw new F("Graph.".concat(n,': could not find the "').concat(t,'" node in the graph.'));return pt(this.multi,"mixed"===r?this.type:r,i,o)}if(2===arguments.length){t=""+t,e=""+e;var a=this._nodes.get(t);if(!a)throw new F("Graph.".concat(n,':  could not find the "').concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new F("Graph.".concat(n,':  could not find the "').concat(e,'" target node in the graph.'));return gt(r,this.multi,i,a,e)}throw new B("Graph.".concat(n,": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length,")."))}}(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o="forEach"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[o]=function(t,e,n){if("mixed"===r||"mixed"===this.type||r===this.type){if(1===arguments.length)return dt(!1,this,r,n=t);if(2===arguments.length){t=""+t,n=e;var a=this._nodes.get(t);if(void 0===a)throw new F("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));return ht(!1,this.multi,"mixed"===r?this.type:r,i,a,n)}if(3===arguments.length){t=""+t,e=""+e;var c=this._nodes.get(t);if(!c)throw new F("Graph.".concat(o,':  could not find the "').concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new F("Graph.".concat(o,':  could not find the "').concat(e,'" target node in the graph.'));return lt(!1,r,this.multi,i,c,e,n)}throw new B("Graph.".concat(o,": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length,")."))}};var a="map"+n[0].toUpperCase()+n.slice(1);t.prototype[a]=function(){var t,e=Array.prototype.slice.call(arguments),n=e.pop();if(0===e.length){var i=0;"directed"!==r&&(i+=this.undirectedSize),"undirected"!==r&&(i+=this.directedSize),t=new Array(i);var a=0;e.push((function(e,r,i,o,c,u,d){t[a++]=n(e,r,i,o,c,u,d)}))}else t=[],e.push((function(e,r,i,o,a,c,u){t.push(n(e,r,i,o,a,c,u))}));return this[o].apply(this,e),t};var c="filter"+n[0].toUpperCase()+n.slice(1);t.prototype[c]=function(){var t=Array.prototype.slice.call(arguments),e=t.pop(),n=[];return t.push((function(t,r,i,o,a,c,u){e(t,r,i,o,a,c,u)&&n.push(t)})),this[o].apply(this,t),n};var u="reduce"+n[0].toUpperCase()+n.slice(1);t.prototype[u]=function(){var t,e,n=Array.prototype.slice.call(arguments);if(n.length<2||n.length>4)throw new B("Graph.".concat(u,": invalid number of arguments (expecting 2, 3 or 4 and got ").concat(n.length,")."));if("function"==typeof n[n.length-1]&&"function"!=typeof n[n.length-2])throw new B("Graph.".concat(u,": missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array."));2===n.length?(t=n[0],e=n[1],n=[]):3===n.length?(t=n[1],e=n[2],n=[n[0]]):4===n.length&&(t=n[2],e=n[3],n=[n[0],n[1]]);var r=e;return n.push((function(e,n,i,o,a,c,u){r=t(r,e,n,i,o,a,c,u)})),this[o].apply(this,n),r}}(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o="find"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[o]=function(t,e,n){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return!1;if(1===arguments.length)return dt(!0,this,r,n=t);if(2===arguments.length){t=""+t,n=e;var a=this._nodes.get(t);if(void 0===a)throw new F("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));return ht(!0,this.multi,"mixed"===r?this.type:r,i,a,n)}if(3===arguments.length){t=""+t,e=""+e;var c=this._nodes.get(t);if(!c)throw new F("Graph.".concat(o,':  could not find the "').concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new F("Graph.".concat(o,':  could not find the "').concat(e,'" target node in the graph.'));return lt(!0,r,this.multi,i,c,e,n)}throw new B("Graph.".concat(o,": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length,")."))};var a="some"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[a]=function(){var t=Array.prototype.slice.call(arguments),e=t.pop();return t.push((function(t,n,r,i,o,a,c){return e(t,n,r,i,o,a,c)})),!!this[o].apply(this,t)};var c="every"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[c]=function(){var t=Array.prototype.slice.call(arguments),e=t.pop();return t.push((function(t,n,r,i,o,a,c){return!e(t,n,r,i,o,a,c)})),!this[o].apply(this,t)}}(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o=n.slice(0,-1)+"Entries";t.prototype[o]=function(t,e){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return O.empty();if(!arguments.length)return st(this,r);if(1===arguments.length){t=""+t;var n=this._nodes.get(t);if(!n)throw new F("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));return ft(r,i,n)}if(2===arguments.length){t=""+t,e=""+e;var a=this._nodes.get(t);if(!a)throw new F("Graph.".concat(o,':  could not find the "').concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new F("Graph.".concat(o,':  could not find the "').concat(e,'" target node in the graph.'));return yt(r,i,a,e)}throw new B("Graph.".concat(o,": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length,")."))}}(t,e)}))}(zt),function(t){wt.forEach((function(e){_t(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o="forEach"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[o]=function(t,e){if("mixed"===r||"mixed"===this.type||r===this.type){t=""+t;var n=this._nodes.get(t);if(void 0===n)throw new F("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));mt(!1,"mixed"===r?this.type:r,i,n,e)}};var a="map"+n[0].toUpperCase()+n.slice(1);t.prototype[a]=function(t,e){var n=[];return this[o](t,(function(t,r){n.push(e(t,r))})),n};var c="filter"+n[0].toUpperCase()+n.slice(1);t.prototype[c]=function(t,e){var n=[];return this[o](t,(function(t,r){e(t,r)&&n.push(t)})),n};var u="reduce"+n[0].toUpperCase()+n.slice(1);t.prototype[u]=function(t,e,n){if(arguments.length<3)throw new B("Graph.".concat(u,": missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array."));var r=n;return this[o](t,(function(t,n){r=e(r,t,n)})),r}}(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o=n[0].toUpperCase()+n.slice(1,-1),a="find"+o;t.prototype[a]=function(t,e){if("mixed"===r||"mixed"===this.type||r===this.type){t=""+t;var n=this._nodes.get(t);if(void 0===n)throw new F("Graph.".concat(a,': could not find the "').concat(t,'" node in the graph.'));return mt(!0,"mixed"===r?this.type:r,i,n,e)}};var c="some"+o;t.prototype[c]=function(t,e){return!!this[a](t,e)};var u="every"+o;t.prototype[u]=function(t,e){return!this[a](t,(function(t,n){return!e(t,n)}))}}(t,e),Gt(t,e)}))}(zt);var Wt=function(t){function n(e){var n=u({type:"directed"},e);if("multi"in n&&!1!==n.multi)throw new B("DirectedGraph.from: inconsistent indication that the graph should be multi in given options!");if("directed"!==n.type)throw new B('DirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return t.call(this,n)||this}return e(n,t),n}(zt),Pt=function(t){function n(e){var n=u({type:"undirected"},e);if("multi"in n&&!1!==n.multi)throw new B("UndirectedGraph.from: inconsistent indication that the graph should be multi in given options!");if("undirected"!==n.type)throw new B('UndirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return t.call(this,n)||this}return e(n,t),n}(zt),Rt=function(t){function n(e){var n=u({multi:!0},e);if("multi"in n&&!0!==n.multi)throw new B("MultiGraph.from: inconsistent indication that the graph should be simple in given options!");return t.call(this,n)||this}return e(n,t),n}(zt),Kt=function(t){function n(e){var n=u({type:"directed",multi:!0},e);if("multi"in n&&!0!==n.multi)throw new B("MultiDirectedGraph.from: inconsistent indication that the graph should be simple in given options!");if("directed"!==n.type)throw new B('MultiDirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return t.call(this,n)||this}return e(n,t),n}(zt),Tt=function(t){function n(e){var n=u({type:"undirected",multi:!0},e);if("multi"in n&&!0!==n.multi)throw new B("MultiUndirectedGraph.from: inconsistent indication that the graph should be simple in given options!");if("undirected"!==n.type)throw new B('MultiUndirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return t.call(this,n)||this}return e(n,t),n}(zt);function Bt(t){t.from=function(e,n){var r=u({},e.options,n),i=new t(r);return i.import(e),i}}return Bt(zt),Bt(Wt),Bt(Pt),Bt(Rt),Bt(Kt),Bt(Tt),zt.Graph=zt,zt.DirectedGraph=Wt,zt.UndirectedGraph=Pt,zt.MultiGraph=Rt,zt.MultiDirectedGraph=Kt,zt.MultiUndirectedGraph=Tt,zt.InvalidArgumentsGraphError=B,zt.NotFoundGraphError=F,zt.UsageGraphError=I,zt}));
//# sourceMappingURL=graphology.umd.min.js.map


/***/ }),

/***/ "./node_modules/sigma/core/camera.js":
/*!*******************************************!*\
  !*** ./node_modules/sigma/core/camera.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sigma.js Camera Class
 * ======================
 *
 * Class designed to store camera information & used to update it.
 * @module
 */
var animate_1 = __webpack_require__(/*! ../utils/animate */ "./node_modules/sigma/utils/animate.js");
var easings_1 = __importDefault(__webpack_require__(/*! ../utils/easings */ "./node_modules/sigma/utils/easings.js"));
var utils_1 = __webpack_require__(/*! ../utils */ "./node_modules/sigma/utils/index.js");
var types_1 = __webpack_require__(/*! ../types */ "./node_modules/sigma/types.js");
/**
 * Defaults.
 */
var DEFAULT_ZOOMING_RATIO = 1.5;
/**
 * Camera class
 *
 * @constructor
 */
var Camera = /** @class */ (function (_super) {
    __extends(Camera, _super);
    function Camera() {
        var _this = _super.call(this) || this;
        _this.x = 0.5;
        _this.y = 0.5;
        _this.angle = 0;
        _this.ratio = 1;
        _this.minRatio = null;
        _this.maxRatio = null;
        _this.nextFrame = null;
        _this.previousState = null;
        _this.enabled = true;
        // State
        _this.previousState = _this.getState();
        return _this;
    }
    /**
     * Static method used to create a Camera object with a given state.
     *
     * @param state
     * @return {Camera}
     */
    Camera.from = function (state) {
        var camera = new Camera();
        return camera.setState(state);
    };
    /**
     * Method used to enable the camera.
     *
     * @return {Camera}
     */
    Camera.prototype.enable = function () {
        this.enabled = true;
        return this;
    };
    /**
     * Method used to disable the camera.
     *
     * @return {Camera}
     */
    Camera.prototype.disable = function () {
        this.enabled = false;
        return this;
    };
    /**
     * Method used to retrieve the camera's current state.
     *
     * @return {object}
     */
    Camera.prototype.getState = function () {
        return {
            x: this.x,
            y: this.y,
            angle: this.angle,
            ratio: this.ratio,
        };
    };
    /**
     * Method used to check whether the camera has the given state.
     *
     * @return {object}
     */
    Camera.prototype.hasState = function (state) {
        return this.x === state.x && this.y === state.y && this.ratio === state.ratio && this.angle === state.angle;
    };
    /**
     * Method used to retrieve the camera's previous state.
     *
     * @return {object}
     */
    Camera.prototype.getPreviousState = function () {
        var state = this.previousState;
        if (!state)
            return null;
        return {
            x: state.x,
            y: state.y,
            angle: state.angle,
            ratio: state.ratio,
        };
    };
    /**
     * Method used to check minRatio and maxRatio values.
     *
     * @param ratio
     * @return {number}
     */
    Camera.prototype.getBoundedRatio = function (ratio) {
        var r = ratio;
        if (typeof this.minRatio === "number")
            r = Math.max(r, this.minRatio);
        if (typeof this.maxRatio === "number")
            r = Math.min(r, this.maxRatio);
        return r;
    };
    /**
     * Method used to check various things to return a legit state candidate.
     *
     * @param state
     * @return {object}
     */
    Camera.prototype.validateState = function (state) {
        var validatedState = {};
        if (typeof state.x === "number")
            validatedState.x = state.x;
        if (typeof state.y === "number")
            validatedState.y = state.y;
        if (typeof state.angle === "number")
            validatedState.angle = state.angle;
        if (typeof state.ratio === "number")
            validatedState.ratio = this.getBoundedRatio(state.ratio);
        return validatedState;
    };
    /**
     * Method used to check whether the camera is currently being animated.
     *
     * @return {boolean}
     */
    Camera.prototype.isAnimated = function () {
        return !!this.nextFrame;
    };
    /**
     * Method used to set the camera's state.
     *
     * @param  {object} state - New state.
     * @return {Camera}
     */
    Camera.prototype.setState = function (state) {
        if (!this.enabled)
            return this;
        // TODO: update by function
        // Keeping track of last state
        this.previousState = this.getState();
        var validState = this.validateState(state);
        if (typeof validState.x === "number")
            this.x = validState.x;
        if (typeof validState.y === "number")
            this.y = validState.y;
        if (typeof validState.angle === "number")
            this.angle = validState.angle;
        if (typeof validState.ratio === "number")
            this.ratio = validState.ratio;
        // Emitting
        if (!this.hasState(this.previousState))
            this.emit("updated", this.getState());
        return this;
    };
    /**
     * Method used to update the camera's state using a function.
     *
     * @param  {function} updater - Updated function taking current state and
     *                              returning next state.
     * @return {Camera}
     */
    Camera.prototype.updateState = function (updater) {
        this.setState(updater(this.getState()));
        return this;
    };
    /**
     * Method used to animate the camera.
     *
     * @param  {object}                    state      - State to reach eventually.
     * @param  {object}                    opts       - Options:
     * @param  {number}                      duration - Duration of the animation.
     * @param  {string | number => number}   easing   - Easing function or name of an existing one
     * @param  {function}                  callback   - Callback
     */
    Camera.prototype.animate = function (state, opts, callback) {
        var _this = this;
        if (!this.enabled)
            return;
        var options = Object.assign({}, animate_1.ANIMATE_DEFAULTS, opts);
        var validState = this.validateState(state);
        var easing = typeof options.easing === "function" ? options.easing : easings_1.default[options.easing];
        // State
        var start = Date.now(), initialState = this.getState();
        // Function performing the animation
        var fn = function () {
            var t = (Date.now() - start) / options.duration;
            // The animation is over:
            if (t >= 1) {
                _this.nextFrame = null;
                _this.setState(validState);
                if (_this.animationCallback) {
                    _this.animationCallback.call(null);
                    _this.animationCallback = undefined;
                }
                return;
            }
            var coefficient = easing(t);
            var newState = {};
            if (typeof validState.x === "number")
                newState.x = initialState.x + (validState.x - initialState.x) * coefficient;
            if (typeof validState.y === "number")
                newState.y = initialState.y + (validState.y - initialState.y) * coefficient;
            if (typeof validState.angle === "number")
                newState.angle = initialState.angle + (validState.angle - initialState.angle) * coefficient;
            if (typeof validState.ratio === "number")
                newState.ratio = initialState.ratio + (validState.ratio - initialState.ratio) * coefficient;
            _this.setState(newState);
            _this.nextFrame = (0, utils_1.requestFrame)(fn);
        };
        if (this.nextFrame) {
            (0, utils_1.cancelFrame)(this.nextFrame);
            if (this.animationCallback)
                this.animationCallback.call(null);
            this.nextFrame = (0, utils_1.requestFrame)(fn);
        }
        else {
            fn();
        }
        this.animationCallback = callback;
    };
    /**
     * Method used to zoom the camera.
     *
     * @param  {number|object} factorOrOptions - Factor or options.
     * @return {function}
     */
    Camera.prototype.animatedZoom = function (factorOrOptions) {
        if (!factorOrOptions) {
            this.animate({ ratio: this.ratio / DEFAULT_ZOOMING_RATIO });
        }
        else {
            if (typeof factorOrOptions === "number")
                return this.animate({ ratio: this.ratio / factorOrOptions });
            else
                this.animate({
                    ratio: this.ratio / (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO),
                }, factorOrOptions);
        }
    };
    /**
     * Method used to unzoom the camera.
     *
     * @param  {number|object} factorOrOptions - Factor or options.
     */
    Camera.prototype.animatedUnzoom = function (factorOrOptions) {
        if (!factorOrOptions) {
            this.animate({ ratio: this.ratio * DEFAULT_ZOOMING_RATIO });
        }
        else {
            if (typeof factorOrOptions === "number")
                return this.animate({ ratio: this.ratio * factorOrOptions });
            else
                this.animate({
                    ratio: this.ratio * (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO),
                }, factorOrOptions);
        }
    };
    /**
     * Method used to reset the camera.
     *
     * @param  {object} options - Options.
     */
    Camera.prototype.animatedReset = function (options) {
        this.animate({
            x: 0.5,
            y: 0.5,
            ratio: 1,
            angle: 0,
        }, options);
    };
    /**
     * Returns a new Camera instance, with the same state as the current camera.
     *
     * @return {Camera}
     */
    Camera.prototype.copy = function () {
        return Camera.from(this.getState());
    };
    return Camera;
}(types_1.TypedEventEmitter));
exports["default"] = Camera;


/***/ }),

/***/ "./node_modules/sigma/core/captors/captor.js":
/*!***************************************************!*\
  !*** ./node_modules/sigma/core/captors/captor.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getWheelDelta = exports.getTouchCoords = exports.getTouchesArray = exports.getWheelCoords = exports.getMouseCoords = exports.getPosition = void 0;
/**
 * Sigma.js Captor Class
 * ======================
 * @module
 */
var types_1 = __webpack_require__(/*! ../../types */ "./node_modules/sigma/types.js");
/**
 * Captor utils functions
 * ======================
 */
/**
 * Extract the local X and Y coordinates from a mouse event or touch object. If
 * a DOM element is given, it uses this element's offset to compute the position
 * (this allows using events that are not bound to the container itself and
 * still have a proper position).
 *
 * @param  {event}       e - A mouse event or touch object.
 * @param  {HTMLElement} dom - A DOM element to compute offset relatively to.
 * @return {number}      The local Y value of the mouse.
 */
function getPosition(e, dom) {
    var bbox = dom.getBoundingClientRect();
    return {
        x: e.clientX - bbox.left,
        y: e.clientY - bbox.top,
    };
}
exports.getPosition = getPosition;
/**
 * Convert mouse coords to sigma coords.
 *
 * @param  {event}       e   - A mouse event or touch object.
 * @param  {HTMLElement} dom - A DOM element to compute offset relatively to.
 * @return {object}
 */
function getMouseCoords(e, dom) {
    var res = __assign(__assign({}, getPosition(e, dom)), { sigmaDefaultPrevented: false, preventSigmaDefault: function () {
            res.sigmaDefaultPrevented = true;
        }, original: e });
    return res;
}
exports.getMouseCoords = getMouseCoords;
/**
 * Convert mouse wheel event coords to sigma coords.
 *
 * @param  {event}       e   - A wheel mouse event.
 * @param  {HTMLElement} dom - A DOM element to compute offset relatively to.
 * @return {object}
 */
function getWheelCoords(e, dom) {
    return __assign(__assign({}, getMouseCoords(e, dom)), { delta: getWheelDelta(e) });
}
exports.getWheelCoords = getWheelCoords;
var MAX_TOUCHES = 2;
function getTouchesArray(touches) {
    var arr = [];
    for (var i = 0, l = Math.min(touches.length, MAX_TOUCHES); i < l; i++)
        arr.push(touches[i]);
    return arr;
}
exports.getTouchesArray = getTouchesArray;
/**
 * Convert touch coords to sigma coords.
 *
 * @param  {event}       e   - A touch event.
 * @param  {HTMLElement} dom - A DOM element to compute offset relatively to.
 * @return {object}
 */
function getTouchCoords(e, dom) {
    return {
        touches: getTouchesArray(e.touches).map(function (touch) { return getPosition(touch, dom); }),
        original: e,
    };
}
exports.getTouchCoords = getTouchCoords;
/**
 * Extract the wheel delta from a mouse event or touch object.
 *
 * @param  {event}  e - A mouse event or touch object.
 * @return {number}     The wheel delta of the mouse.
 */
function getWheelDelta(e) {
    // TODO: check those ratios again to ensure a clean Chrome/Firefox compat
    if (typeof e.deltaY !== "undefined")
        return (e.deltaY * -3) / 360;
    if (typeof e.detail !== "undefined")
        return e.detail / -9;
    throw new Error("Captor: could not extract delta from event.");
}
exports.getWheelDelta = getWheelDelta;
/**
 * Abstract class representing a captor like the user's mouse or touch controls.
 */
var Captor = /** @class */ (function (_super) {
    __extends(Captor, _super);
    function Captor(container, renderer) {
        var _this = _super.call(this) || this;
        // Properties
        _this.container = container;
        _this.renderer = renderer;
        return _this;
    }
    return Captor;
}(types_1.TypedEventEmitter));
exports["default"] = Captor;


/***/ }),

/***/ "./node_modules/sigma/core/captors/mouse.js":
/*!**************************************************!*\
  !*** ./node_modules/sigma/core/captors/mouse.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var captor_1 = __importStar(__webpack_require__(/*! ./captor */ "./node_modules/sigma/core/captors/captor.js"));
/**
 * Constants.
 */
var DRAG_TIMEOUT = 100;
var DRAGGED_EVENTS_TOLERANCE = 3;
var MOUSE_INERTIA_DURATION = 200;
var MOUSE_INERTIA_RATIO = 3;
var MOUSE_ZOOM_DURATION = 250;
var ZOOMING_RATIO = 1.7;
var DOUBLE_CLICK_TIMEOUT = 300;
var DOUBLE_CLICK_ZOOMING_RATIO = 2.2;
var DOUBLE_CLICK_ZOOMING_DURATION = 200;
/**
 * Mouse captor class.
 *
 * @constructor
 */
var MouseCaptor = /** @class */ (function (_super) {
    __extends(MouseCaptor, _super);
    function MouseCaptor(container, renderer) {
        var _this = _super.call(this, container, renderer) || this;
        // State
        _this.enabled = true;
        _this.draggedEvents = 0;
        _this.downStartTime = null;
        _this.lastMouseX = null;
        _this.lastMouseY = null;
        _this.isMouseDown = false;
        _this.isMoving = false;
        _this.movingTimeout = null;
        _this.startCameraState = null;
        _this.clicks = 0;
        _this.doubleClickTimeout = null;
        _this.currentWheelDirection = 0;
        // Binding methods
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleRightClick = _this.handleRightClick.bind(_this);
        _this.handleDown = _this.handleDown.bind(_this);
        _this.handleUp = _this.handleUp.bind(_this);
        _this.handleMove = _this.handleMove.bind(_this);
        _this.handleWheel = _this.handleWheel.bind(_this);
        _this.handleOut = _this.handleOut.bind(_this);
        // Binding events
        container.addEventListener("click", _this.handleClick, false);
        container.addEventListener("contextmenu", _this.handleRightClick, false);
        container.addEventListener("mousedown", _this.handleDown, false);
        container.addEventListener("wheel", _this.handleWheel, false);
        container.addEventListener("mouseout", _this.handleOut, false);
        document.addEventListener("mousemove", _this.handleMove, false);
        document.addEventListener("mouseup", _this.handleUp, false);
        return _this;
    }
    MouseCaptor.prototype.kill = function () {
        var container = this.container;
        container.removeEventListener("click", this.handleClick);
        container.removeEventListener("contextmenu", this.handleRightClick);
        container.removeEventListener("mousedown", this.handleDown);
        container.removeEventListener("wheel", this.handleWheel);
        container.removeEventListener("mouseout", this.handleOut);
        document.removeEventListener("mousemove", this.handleMove);
        document.removeEventListener("mouseup", this.handleUp);
    };
    MouseCaptor.prototype.handleClick = function (e) {
        var _this = this;
        if (!this.enabled)
            return;
        this.clicks++;
        if (this.clicks === 2) {
            this.clicks = 0;
            if (typeof this.doubleClickTimeout === "number") {
                clearTimeout(this.doubleClickTimeout);
                this.doubleClickTimeout = null;
            }
            return this.handleDoubleClick(e);
        }
        setTimeout(function () {
            _this.clicks = 0;
            _this.doubleClickTimeout = null;
        }, DOUBLE_CLICK_TIMEOUT);
        // NOTE: this is here to prevent click events on drag
        if (this.draggedEvents < DRAGGED_EVENTS_TOLERANCE)
            this.emit("click", (0, captor_1.getMouseCoords)(e, this.container));
    };
    MouseCaptor.prototype.handleRightClick = function (e) {
        if (!this.enabled)
            return;
        this.emit("rightClick", (0, captor_1.getMouseCoords)(e, this.container));
    };
    MouseCaptor.prototype.handleDoubleClick = function (e) {
        if (!this.enabled)
            return;
        e.preventDefault();
        e.stopPropagation();
        var mouseCoords = (0, captor_1.getMouseCoords)(e, this.container);
        this.emit("doubleClick", mouseCoords);
        if (mouseCoords.sigmaDefaultPrevented)
            return;
        // default behavior
        var camera = this.renderer.getCamera();
        var newRatio = camera.getBoundedRatio(camera.getState().ratio / DOUBLE_CLICK_ZOOMING_RATIO);
        camera.animate(this.renderer.getViewportZoomedState((0, captor_1.getPosition)(e, this.container), newRatio), {
            easing: "quadraticInOut",
            duration: DOUBLE_CLICK_ZOOMING_DURATION,
        });
    };
    MouseCaptor.prototype.handleDown = function (e) {
        if (!this.enabled)
            return;
        // We only start dragging on left button
        if (e.button === 0) {
            this.startCameraState = this.renderer.getCamera().getState();
            var _a = (0, captor_1.getPosition)(e, this.container), x = _a.x, y = _a.y;
            this.lastMouseX = x;
            this.lastMouseY = y;
            this.draggedEvents = 0;
            this.downStartTime = Date.now();
            this.isMouseDown = true;
        }
        this.emit("mousedown", (0, captor_1.getMouseCoords)(e, this.container));
    };
    MouseCaptor.prototype.handleUp = function (e) {
        var _this = this;
        if (!this.enabled || !this.isMouseDown)
            return;
        var camera = this.renderer.getCamera();
        this.isMouseDown = false;
        if (typeof this.movingTimeout === "number") {
            clearTimeout(this.movingTimeout);
            this.movingTimeout = null;
        }
        var _a = (0, captor_1.getPosition)(e, this.container), x = _a.x, y = _a.y;
        var cameraState = camera.getState(), previousCameraState = camera.getPreviousState() || { x: 0, y: 0 };
        if (this.isMoving) {
            camera.animate({
                x: cameraState.x + MOUSE_INERTIA_RATIO * (cameraState.x - previousCameraState.x),
                y: cameraState.y + MOUSE_INERTIA_RATIO * (cameraState.y - previousCameraState.y),
            }, {
                duration: MOUSE_INERTIA_DURATION,
                easing: "quadraticOut",
            });
        }
        else if (this.lastMouseX !== x || this.lastMouseY !== y) {
            camera.setState({
                x: cameraState.x,
                y: cameraState.y,
            });
        }
        this.isMoving = false;
        setTimeout(function () {
            _this.draggedEvents = 0;
            // NOTE: this refresh is here to make sure `hideEdgesOnMove` can work
            // when someone releases camera pan drag after having stopped moving.
            // See commit: https://github.com/jacomyal/sigma.js/commit/cfd9197f70319109db6b675dd7c82be493ca95a2
            // See also issue: https://github.com/jacomyal/sigma.js/issues/1290
            // It could be possible to render instead of scheduling a refresh but for
            // now it seems good enough.
            _this.renderer.refresh();
        }, 0);
        this.emit("mouseup", (0, captor_1.getMouseCoords)(e, this.container));
    };
    MouseCaptor.prototype.handleMove = function (e) {
        var _this = this;
        if (!this.enabled)
            return;
        var mouseCoords = (0, captor_1.getMouseCoords)(e, this.container);
        // Always trigger a "mousemovebody" event, so that it is possible to develop
        // a drag-and-drop effect that works even when the mouse is out of the
        // container:
        this.emit("mousemovebody", mouseCoords);
        // Only trigger the "mousemove" event when the mouse is actually hovering
        // the container, to avoid weirdly hovering nodes and/or edges when the
        // mouse is not hover the container:
        if (e.target === this.container) {
            this.emit("mousemove", mouseCoords);
        }
        if (mouseCoords.sigmaDefaultPrevented)
            return;
        // Handle the case when "isMouseDown" all the time, to allow dragging the
        // stage while the mouse is not hover the container:
        if (this.isMouseDown) {
            this.isMoving = true;
            this.draggedEvents++;
            if (typeof this.movingTimeout === "number") {
                clearTimeout(this.movingTimeout);
            }
            this.movingTimeout = window.setTimeout(function () {
                _this.movingTimeout = null;
                _this.isMoving = false;
            }, DRAG_TIMEOUT);
            var camera = this.renderer.getCamera();
            var _a = (0, captor_1.getPosition)(e, this.container), eX = _a.x, eY = _a.y;
            var lastMouse = this.renderer.viewportToFramedGraph({
                x: this.lastMouseX,
                y: this.lastMouseY,
            });
            var mouse = this.renderer.viewportToFramedGraph({ x: eX, y: eY });
            var offsetX = lastMouse.x - mouse.x, offsetY = lastMouse.y - mouse.y;
            var cameraState = camera.getState();
            var x = cameraState.x + offsetX, y = cameraState.y + offsetY;
            camera.setState({ x: x, y: y });
            this.lastMouseX = eX;
            this.lastMouseY = eY;
            e.preventDefault();
            e.stopPropagation();
        }
    };
    MouseCaptor.prototype.handleWheel = function (e) {
        var _this = this;
        if (!this.enabled)
            return;
        e.preventDefault();
        e.stopPropagation();
        var delta = (0, captor_1.getWheelDelta)(e);
        if (!delta)
            return;
        var wheelCoords = (0, captor_1.getWheelCoords)(e, this.container);
        this.emit("wheel", wheelCoords);
        if (wheelCoords.sigmaDefaultPrevented)
            return;
        // Default behavior
        var ratioDiff = delta > 0 ? 1 / ZOOMING_RATIO : ZOOMING_RATIO;
        var camera = this.renderer.getCamera();
        var newRatio = camera.getBoundedRatio(camera.getState().ratio * ratioDiff);
        var wheelDirection = delta > 0 ? 1 : -1;
        var now = Date.now();
        // Cancel events that are too close too each other and in the same direction:
        if (this.currentWheelDirection === wheelDirection &&
            this.lastWheelTriggerTime &&
            now - this.lastWheelTriggerTime < MOUSE_ZOOM_DURATION / 5) {
            return;
        }
        camera.animate(this.renderer.getViewportZoomedState((0, captor_1.getPosition)(e, this.container), newRatio), {
            easing: "quadraticOut",
            duration: MOUSE_ZOOM_DURATION,
        }, function () {
            _this.currentWheelDirection = 0;
        });
        this.currentWheelDirection = wheelDirection;
        this.lastWheelTriggerTime = now;
    };
    MouseCaptor.prototype.handleOut = function () {
        // TODO: dispatch event
    };
    return MouseCaptor;
}(captor_1.default));
exports["default"] = MouseCaptor;


/***/ }),

/***/ "./node_modules/sigma/core/captors/touch.js":
/*!**************************************************!*\
  !*** ./node_modules/sigma/core/captors/touch.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var captor_1 = __importStar(__webpack_require__(/*! ./captor */ "./node_modules/sigma/core/captors/captor.js"));
var DRAG_TIMEOUT = 200;
var TOUCH_INERTIA_RATIO = 3;
var TOUCH_INERTIA_DURATION = 200;
/**
 * Touch captor class.
 *
 * @constructor
 */
var TouchCaptor = /** @class */ (function (_super) {
    __extends(TouchCaptor, _super);
    function TouchCaptor(container, renderer) {
        var _this = _super.call(this, container, renderer) || this;
        _this.enabled = true;
        _this.isMoving = false;
        _this.hasMoved = false;
        _this.touchMode = 0; // number of touches down
        _this.startTouchesPositions = [];
        // Binding methods:
        _this.handleStart = _this.handleStart.bind(_this);
        _this.handleLeave = _this.handleLeave.bind(_this);
        _this.handleMove = _this.handleMove.bind(_this);
        // Binding events
        container.addEventListener("touchstart", _this.handleStart, false);
        container.addEventListener("touchend", _this.handleLeave, false);
        container.addEventListener("touchcancel", _this.handleLeave, false);
        container.addEventListener("touchmove", _this.handleMove, false);
        return _this;
    }
    TouchCaptor.prototype.kill = function () {
        var container = this.container;
        container.removeEventListener("touchstart", this.handleStart);
        container.removeEventListener("touchend", this.handleLeave);
        container.removeEventListener("touchcancel", this.handleLeave);
        container.removeEventListener("touchmove", this.handleMove);
    };
    TouchCaptor.prototype.getDimensions = function () {
        return {
            width: this.container.offsetWidth,
            height: this.container.offsetHeight,
        };
    };
    TouchCaptor.prototype.dispatchRelatedMouseEvent = function (type, e, touch, emitter) {
        var mousePosition = touch || e.touches[0];
        var mouseEvent = new MouseEvent(type, {
            clientX: mousePosition.clientX,
            clientY: mousePosition.clientY,
            altKey: e.altKey,
            ctrlKey: e.ctrlKey,
        });
        mouseEvent.isFakeSigmaMouseEvent = true;
        (emitter || this.container).dispatchEvent(mouseEvent);
    };
    TouchCaptor.prototype.handleStart = function (e) {
        var _this = this;
        if (!this.enabled)
            return;
        // Prevent default to avoid default browser behaviors...
        e.preventDefault();
        // ...but simulate mouse behavior anyway, to get the MouseCaptor working as well:
        if (e.touches.length === 1)
            this.dispatchRelatedMouseEvent("mousedown", e);
        var touches = (0, captor_1.getTouchesArray)(e.touches);
        this.touchMode = touches.length;
        this.startCameraState = this.renderer.getCamera().getState();
        this.startTouchesPositions = touches.map(function (touch) { return (0, captor_1.getPosition)(touch, _this.container); });
        this.lastTouches = touches;
        this.lastTouchesPositions = this.startTouchesPositions;
        // When there are two touches down, let's record distance and angle as well:
        if (this.touchMode === 2) {
            var _a = __read(this.startTouchesPositions, 2), _b = _a[0], x0 = _b.x, y0 = _b.y, _c = _a[1], x1 = _c.x, y1 = _c.y;
            this.startTouchesAngle = Math.atan2(y1 - y0, x1 - x0);
            this.startTouchesDistance = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
        }
        this.emit("touchdown", (0, captor_1.getTouchCoords)(e, this.container));
    };
    TouchCaptor.prototype.handleLeave = function (e) {
        if (!this.enabled)
            return;
        // Prevent default to avoid default browser behaviors...
        e.preventDefault();
        // ...but simulate mouse behavior anyway, to get the MouseCaptor working as well:
        if (e.touches.length === 0 && this.lastTouches && this.lastTouches.length) {
            this.dispatchRelatedMouseEvent("mouseup", e, this.lastTouches[0], document);
            // ... and only click if no move was made
            if (!this.hasMoved) {
                this.dispatchRelatedMouseEvent("click", e, this.lastTouches[0]);
            }
        }
        if (this.movingTimeout) {
            this.isMoving = false;
            clearTimeout(this.movingTimeout);
        }
        switch (this.touchMode) {
            case 2:
                if (e.touches.length === 1) {
                    this.handleStart(e);
                    e.preventDefault();
                    break;
                }
            /* falls through */
            case 1:
                // TODO
                // Dispatch event
                if (this.isMoving) {
                    var camera = this.renderer.getCamera();
                    var cameraState = camera.getState(), previousCameraState = camera.getPreviousState() || { x: 0, y: 0 };
                    camera.animate({
                        x: cameraState.x + TOUCH_INERTIA_RATIO * (cameraState.x - previousCameraState.x),
                        y: cameraState.y + TOUCH_INERTIA_RATIO * (cameraState.y - previousCameraState.y),
                    }, {
                        duration: TOUCH_INERTIA_DURATION,
                        easing: "quadraticOut",
                    });
                }
                this.hasMoved = false;
                this.isMoving = false;
                this.touchMode = 0;
                break;
        }
        this.emit("touchup", (0, captor_1.getTouchCoords)(e, this.container));
    };
    TouchCaptor.prototype.handleMove = function (e) {
        var _a;
        var _this = this;
        if (!this.enabled)
            return;
        // Prevent default to avoid default browser behaviors...
        e.preventDefault();
        // ...but simulate mouse behavior anyway, to get the MouseCaptor working as well:
        if (e.touches.length === 1)
            this.dispatchRelatedMouseEvent("mousemove", e);
        var touches = (0, captor_1.getTouchesArray)(e.touches);
        var touchesPositions = touches.map(function (touch) { return (0, captor_1.getPosition)(touch, _this.container); });
        this.lastTouches = touches;
        this.lastTouchesPositions = touchesPositions;
        // If a move was initiated at some point and we get back to startpoint,
        // we should still consider that we did move (which also happens after a
        // multiple touch when only one touch remains in which case handleStart
        // is recalled within handleLeave).
        // Now, some mobile browsers report zero-distance moves so we also check that
        // one of the touches did actually move from the origin position.
        this.hasMoved || (this.hasMoved = touchesPositions.some(function (position, idx) {
            var startPosition = _this.startTouchesPositions[idx];
            return position.x !== startPosition.x || position.y !== startPosition.y;
        }));
        // If there was no move, do not trigger touch moves behavior
        if (!this.hasMoved) {
            return;
        }
        this.isMoving = true;
        if (this.movingTimeout)
            clearTimeout(this.movingTimeout);
        this.movingTimeout = window.setTimeout(function () {
            _this.isMoving = false;
        }, DRAG_TIMEOUT);
        var camera = this.renderer.getCamera();
        var startCameraState = this.startCameraState;
        switch (this.touchMode) {
            case 1: {
                var _b = this.renderer.viewportToFramedGraph((this.startTouchesPositions || [])[0]), xStart = _b.x, yStart = _b.y;
                var _c = this.renderer.viewportToFramedGraph(touchesPositions[0]), x = _c.x, y = _c.y;
                camera.setState({
                    x: startCameraState.x + xStart - x,
                    y: startCameraState.y + yStart - y,
                });
                break;
            }
            case 2: {
                /**
                 * Here is the thinking here:
                 *
                 * 1. We can find the new angle and ratio, by comparing the vector from "touch one" to "touch two" at the start
                 *    of the d'n'd and now
                 *
                 * 2. We can use `Camera#viewportToGraph` inside formula to retrieve the new camera position, using the graph
                 *    position of a touch at the beginning of the d'n'd (using `startCamera.viewportToGraph`) and the viewport
                 *    position of this same touch now
                 */
                var newCameraState = {};
                var _d = touchesPositions[0], x0 = _d.x, y0 = _d.y;
                var _e = touchesPositions[1], x1 = _e.x, y1 = _e.y;
                var angleDiff = Math.atan2(y1 - y0, x1 - x0) - this.startTouchesAngle;
                var ratioDiff = Math.hypot(y1 - y0, x1 - x0) / this.startTouchesDistance;
                // 1.
                var newRatio = camera.getBoundedRatio(startCameraState.ratio / ratioDiff);
                newCameraState.ratio = newRatio;
                newCameraState.angle = startCameraState.angle + angleDiff;
                // 2.
                var dimensions = this.getDimensions();
                var touchGraphPosition = this.renderer.viewportToFramedGraph((this.startTouchesPositions || [])[0], { cameraState: startCameraState });
                var smallestDimension = Math.min(dimensions.width, dimensions.height);
                var dx = smallestDimension / dimensions.width;
                var dy = smallestDimension / dimensions.height;
                var ratio = newRatio / smallestDimension;
                // Align with center of the graph:
                var x = x0 - smallestDimension / 2 / dx;
                var y = y0 - smallestDimension / 2 / dy;
                // Rotate:
                _a = __read([
                    x * Math.cos(-newCameraState.angle) - y * Math.sin(-newCameraState.angle),
                    y * Math.cos(-newCameraState.angle) + x * Math.sin(-newCameraState.angle),
                ], 2), x = _a[0], y = _a[1];
                newCameraState.x = touchGraphPosition.x - x * ratio;
                newCameraState.y = touchGraphPosition.y + y * ratio;
                camera.setState(newCameraState);
                break;
            }
        }
        this.emit("touchmove", (0, captor_1.getTouchCoords)(e, this.container));
    };
    return TouchCaptor;
}(captor_1.default));
exports["default"] = TouchCaptor;


/***/ }),

/***/ "./node_modules/sigma/core/labels.js":
/*!*******************************************!*\
  !*** ./node_modules/sigma/core/labels.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.edgeLabelsToDisplayFromNodes = exports.LabelGrid = void 0;
/**
 * Class representing a single candidate for the label grid selection.
 *
 * It also describes a deterministic way to compare two candidates to assess
 * which one is better.
 */
var LabelCandidate = /** @class */ (function () {
    function LabelCandidate(key, size) {
        this.key = key;
        this.size = size;
    }
    LabelCandidate.compare = function (first, second) {
        // First we compare by size
        if (first.size > second.size)
            return -1;
        if (first.size < second.size)
            return 1;
        // Then since no two nodes can have the same key, we use it to
        // deterministically tie-break by key
        if (first.key > second.key)
            return 1;
        // NOTE: this comparator cannot return 0
        return -1;
    };
    return LabelCandidate;
}());
/**
 * Class representing a 2D spatial grid divided into constant-size cells.
 */
var LabelGrid = /** @class */ (function () {
    function LabelGrid() {
        this.width = 0;
        this.height = 0;
        this.cellSize = 0;
        this.columns = 0;
        this.rows = 0;
        this.cells = {};
    }
    LabelGrid.prototype.resizeAndClear = function (dimensions, cellSize) {
        this.width = dimensions.width;
        this.height = dimensions.height;
        this.cellSize = cellSize;
        this.columns = Math.ceil(dimensions.width / cellSize);
        this.rows = Math.ceil(dimensions.height / cellSize);
        this.cells = {};
    };
    LabelGrid.prototype.getIndex = function (pos) {
        var xIndex = Math.floor(pos.x / this.cellSize);
        var yIndex = Math.floor(pos.y / this.cellSize);
        return yIndex * this.columns + xIndex;
    };
    LabelGrid.prototype.add = function (key, size, pos) {
        var candidate = new LabelCandidate(key, size);
        var index = this.getIndex(pos);
        var cell = this.cells[index];
        if (!cell) {
            cell = [];
            this.cells[index] = cell;
        }
        cell.push(candidate);
    };
    LabelGrid.prototype.organize = function () {
        for (var k in this.cells) {
            var cell = this.cells[k];
            cell.sort(LabelCandidate.compare);
        }
    };
    LabelGrid.prototype.getLabelsToDisplay = function (ratio, density) {
        // TODO: work on visible nodes to optimize? ^ -> threshold outside so that memoization works?
        // TODO: adjust threshold lower, but increase cells a bit?
        // TODO: hunt for geom issue in disguise
        // TODO: memoize while ratio does not move. method to force recompute
        var cellArea = this.cellSize * this.cellSize;
        var scaledCellArea = cellArea / ratio / ratio;
        var scaledDensity = (scaledCellArea * density) / cellArea;
        var labelsToDisplayPerCell = Math.ceil(scaledDensity);
        var labels = [];
        for (var k in this.cells) {
            var cell = this.cells[k];
            for (var i = 0; i < Math.min(labelsToDisplayPerCell, cell.length); i++) {
                labels.push(cell[i].key);
            }
        }
        return labels;
    };
    return LabelGrid;
}());
exports.LabelGrid = LabelGrid;
/**
 * Label heuristic selecting edge labels to display, based on displayed node
 * labels
 *
 * @param  {object} params                 - Parameters:
 * @param  {Set}      displayedNodeLabels  - Currently displayed node labels.
 * @param  {Set}      highlightedNodes     - Highlighted nodes.
 * @param  {Graph}    graph                - The rendered graph.
 * @param  {string}   hoveredNode          - Hovered node (optional)
 * @return {Array}                         - The selected labels.
 */
function edgeLabelsToDisplayFromNodes(params) {
    var graph = params.graph, hoveredNode = params.hoveredNode, highlightedNodes = params.highlightedNodes, displayedNodeLabels = params.displayedNodeLabels;
    var worthyEdges = [];
    // TODO: the code below can be optimized using #.forEach and batching the code per adj
    // We should display an edge's label if:
    //   - Any of its extremities is highlighted or hovered
    //   - Both of its extremities has its label shown
    graph.forEachEdge(function (edge, _, source, target) {
        if (source === hoveredNode ||
            target === hoveredNode ||
            highlightedNodes.has(source) ||
            highlightedNodes.has(target) ||
            (displayedNodeLabels.has(source) && displayedNodeLabels.has(target))) {
            worthyEdges.push(edge);
        }
    });
    return worthyEdges;
}
exports.edgeLabelsToDisplayFromNodes = edgeLabelsToDisplayFromNodes;


/***/ }),

/***/ "./node_modules/sigma/core/quadtree.js":
/*!*********************************************!*\
  !*** ./node_modules/sigma/core/quadtree.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.rectangleCollidesWithQuad = exports.squareCollidesWithQuad = exports.getCircumscribedAlignedRectangle = exports.isRectangleAligned = void 0;
/**
 * Sigma.js Quad Tree Class
 * =========================
 *
 * Class implementing the quad tree data structure used to solve hovers and
 * determine which elements are currently in the scope of the camera so that
 * we don't waste time rendering things the user cannot see anyway.
 * @module
 */
/* eslint no-nested-ternary: 0 */
/* eslint no-constant-condition: 0 */
var extend_1 = __importDefault(__webpack_require__(/*! @yomguithereal/helpers/extend */ "./node_modules/@yomguithereal/helpers/extend.js"));
/**
 * Notes:
 *
 *   - a square can be represented as topleft + width, saying for the quad blocks,
 *     to reduce overall memory usage (which is already pretty low).
 *   - this implementation of a quadtree is often called a MX-CIF quadtree.
 *   - we could explore spatial hashing (hilbert quadtrees, notably).
 */
/**
 * Constants.
 *
 * Note that since we are representing a static 4-ary tree, the indices of the
 * quadrants are the following:
 *   - TOP_LEFT:     4i + b
 *   - TOP_RIGHT:    4i + 2b
 *   - BOTTOM_LEFT:  4i + 3b
 *   - BOTTOM_RIGHT: 4i + 4b
 */
var BLOCKS = 4;
var MAX_LEVEL = 5;
// Outside block is max block index + 1, i.e.:
// BLOCKS * ((4 * (4 ** MAX_LEVEL) - 1) / 3)
var OUTSIDE_BLOCK = 5460;
var X_OFFSET = 0;
var Y_OFFSET = 1;
var WIDTH_OFFSET = 2;
var HEIGHT_OFFSET = 3;
var TOP_LEFT = 1;
var TOP_RIGHT = 2;
var BOTTOM_LEFT = 3;
var BOTTOM_RIGHT = 4;
var hasWarnedTooMuchOutside = false;
/**
 * Geometry helpers.
 */
/**
 * Function returning whether the given rectangle is axis-aligned.
 *
 * @param  {Rectangle} rect
 * @return {boolean}
 */
function isRectangleAligned(rect) {
    return rect.x1 === rect.x2 || rect.y1 === rect.y2;
}
exports.isRectangleAligned = isRectangleAligned;
/**
 * Function returning the smallest rectangle that contains the given rectangle, and that is aligned with the axis.
 *
 * @param {Rectangle} rect
 * @return {Rectangle}
 */
function getCircumscribedAlignedRectangle(rect) {
    var width = Math.sqrt(Math.pow(rect.x2 - rect.x1, 2) + Math.pow(rect.y2 - rect.y1, 2));
    var heightVector = {
        x: ((rect.y1 - rect.y2) * rect.height) / width,
        y: ((rect.x2 - rect.x1) * rect.height) / width,
    };
    // Compute all corners:
    var tl = { x: rect.x1, y: rect.y1 };
    var tr = { x: rect.x2, y: rect.y2 };
    var bl = {
        x: rect.x1 + heightVector.x,
        y: rect.y1 + heightVector.y,
    };
    var br = {
        x: rect.x2 + heightVector.x,
        y: rect.y2 + heightVector.y,
    };
    var xL = Math.min(tl.x, tr.x, bl.x, br.x);
    var xR = Math.max(tl.x, tr.x, bl.x, br.x);
    var yT = Math.min(tl.y, tr.y, bl.y, br.y);
    var yB = Math.max(tl.y, tr.y, bl.y, br.y);
    return {
        x1: xL,
        y1: yT,
        x2: xR,
        y2: yT,
        height: yB - yT,
    };
}
exports.getCircumscribedAlignedRectangle = getCircumscribedAlignedRectangle;
/**
 *
 * @param x1
 * @param y1
 * @param w
 * @param qx
 * @param qy
 * @param qw
 * @param qh
 */
function squareCollidesWithQuad(x1, y1, w, qx, qy, qw, qh) {
    return x1 < qx + qw && x1 + w > qx && y1 < qy + qh && y1 + w > qy;
}
exports.squareCollidesWithQuad = squareCollidesWithQuad;
function rectangleCollidesWithQuad(x1, y1, w, h, qx, qy, qw, qh) {
    return x1 < qx + qw && x1 + w > qx && y1 < qy + qh && y1 + h > qy;
}
exports.rectangleCollidesWithQuad = rectangleCollidesWithQuad;
function pointIsInQuad(x, y, qx, qy, qw, qh) {
    var xmp = qx + qw / 2, ymp = qy + qh / 2, top = y < ymp, left = x < xmp;
    return top ? (left ? TOP_LEFT : TOP_RIGHT) : left ? BOTTOM_LEFT : BOTTOM_RIGHT;
}
/**
 * Helper functions that are not bound to the class so an external user
 * cannot mess with them.
 */
function buildQuadrants(maxLevel, data) {
    // [block, level]
    var stack = [0, 0];
    while (stack.length) {
        var level = stack.pop(), block = stack.pop();
        var topLeftBlock = 4 * block + BLOCKS, topRightBlock = 4 * block + 2 * BLOCKS, bottomLeftBlock = 4 * block + 3 * BLOCKS, bottomRightBlock = 4 * block + 4 * BLOCKS;
        var x = data[block + X_OFFSET], y = data[block + Y_OFFSET], width = data[block + WIDTH_OFFSET], height = data[block + HEIGHT_OFFSET], hw = width / 2, hh = height / 2;
        data[topLeftBlock + X_OFFSET] = x;
        data[topLeftBlock + Y_OFFSET] = y;
        data[topLeftBlock + WIDTH_OFFSET] = hw;
        data[topLeftBlock + HEIGHT_OFFSET] = hh;
        data[topRightBlock + X_OFFSET] = x + hw;
        data[topRightBlock + Y_OFFSET] = y;
        data[topRightBlock + WIDTH_OFFSET] = hw;
        data[topRightBlock + HEIGHT_OFFSET] = hh;
        data[bottomLeftBlock + X_OFFSET] = x;
        data[bottomLeftBlock + Y_OFFSET] = y + hh;
        data[bottomLeftBlock + WIDTH_OFFSET] = hw;
        data[bottomLeftBlock + HEIGHT_OFFSET] = hh;
        data[bottomRightBlock + X_OFFSET] = x + hw;
        data[bottomRightBlock + Y_OFFSET] = y + hh;
        data[bottomRightBlock + WIDTH_OFFSET] = hw;
        data[bottomRightBlock + HEIGHT_OFFSET] = hh;
        if (level < maxLevel - 1) {
            stack.push(bottomRightBlock, level + 1);
            stack.push(bottomLeftBlock, level + 1);
            stack.push(topRightBlock, level + 1);
            stack.push(topLeftBlock, level + 1);
        }
    }
}
function insertNode(maxLevel, data, containers, key, x, y, size) {
    var x1 = x - size, y1 = y - size, w = size * 2;
    var level = 0, block = 0;
    while (true) {
        // If we reached max level
        if (level >= maxLevel) {
            containers[block] = containers[block] || [];
            containers[block].push(key);
            return;
        }
        var topLeftBlock = 4 * block + BLOCKS, topRightBlock = 4 * block + 2 * BLOCKS, bottomLeftBlock = 4 * block + 3 * BLOCKS, bottomRightBlock = 4 * block + 4 * BLOCKS;
        var collidingWithTopLeft = squareCollidesWithQuad(x1, y1, w, data[topLeftBlock + X_OFFSET], data[topLeftBlock + Y_OFFSET], data[topLeftBlock + WIDTH_OFFSET], data[topLeftBlock + HEIGHT_OFFSET]);
        var collidingWithTopRight = squareCollidesWithQuad(x1, y1, w, data[topRightBlock + X_OFFSET], data[topRightBlock + Y_OFFSET], data[topRightBlock + WIDTH_OFFSET], data[topRightBlock + HEIGHT_OFFSET]);
        var collidingWithBottomLeft = squareCollidesWithQuad(x1, y1, w, data[bottomLeftBlock + X_OFFSET], data[bottomLeftBlock + Y_OFFSET], data[bottomLeftBlock + WIDTH_OFFSET], data[bottomLeftBlock + HEIGHT_OFFSET]);
        var collidingWithBottomRight = squareCollidesWithQuad(x1, y1, w, data[bottomRightBlock + X_OFFSET], data[bottomRightBlock + Y_OFFSET], data[bottomRightBlock + WIDTH_OFFSET], data[bottomRightBlock + HEIGHT_OFFSET]);
        var collisions = [
            collidingWithTopLeft,
            collidingWithTopRight,
            collidingWithBottomLeft,
            collidingWithBottomRight,
        ].reduce(function (acc, current) {
            if (current)
                return acc + 1;
            else
                return acc;
        }, 0);
        // If we have no collision at root level, inject node in the outside block
        if (collisions === 0 && level === 0) {
            containers[OUTSIDE_BLOCK].push(key);
            if (!hasWarnedTooMuchOutside && containers[OUTSIDE_BLOCK].length >= 5) {
                hasWarnedTooMuchOutside = true;
                console.warn("sigma/quadtree.insertNode: At least 5 nodes are outside the global quadtree zone. " +
                    "You might have a problem with the normalization function or the custom bounding box.");
            }
            return;
        }
        // If we don't have at least a collision but deeper, there is an issue
        if (collisions === 0)
            throw new Error("sigma/quadtree.insertNode: no collision (level: ".concat(level, ", key: ").concat(key, ", x: ").concat(x, ", y: ").concat(y, ", size: ").concat(size, ")."));
        // If we have 3 collisions, we have a geometry problem obviously
        if (collisions === 3)
            throw new Error("sigma/quadtree.insertNode: 3 impossible collisions (level: ".concat(level, ", key: ").concat(key, ", x: ").concat(x, ", y: ").concat(y, ", size: ").concat(size, ")."));
        // If we have more that one collision, we stop here and store the node
        // in the relevant containers
        if (collisions > 1) {
            containers[block] = containers[block] || [];
            containers[block].push(key);
            return;
        }
        else {
            level++;
        }
        // Else we recurse into the correct quads
        if (collidingWithTopLeft)
            block = topLeftBlock;
        if (collidingWithTopRight)
            block = topRightBlock;
        if (collidingWithBottomLeft)
            block = bottomLeftBlock;
        if (collidingWithBottomRight)
            block = bottomRightBlock;
    }
}
function getNodesInAxisAlignedRectangleArea(maxLevel, data, containers, x1, y1, w, h) {
    // [block, level]
    var stack = [0, 0];
    var collectedNodes = [];
    var container;
    while (stack.length) {
        var level = stack.pop(), block = stack.pop();
        // Collecting nodes
        container = containers[block];
        if (container)
            (0, extend_1.default)(collectedNodes, container);
        // If we reached max level
        if (level >= maxLevel)
            continue;
        var topLeftBlock = 4 * block + BLOCKS, topRightBlock = 4 * block + 2 * BLOCKS, bottomLeftBlock = 4 * block + 3 * BLOCKS, bottomRightBlock = 4 * block + 4 * BLOCKS;
        var collidingWithTopLeft = rectangleCollidesWithQuad(x1, y1, w, h, data[topLeftBlock + X_OFFSET], data[topLeftBlock + Y_OFFSET], data[topLeftBlock + WIDTH_OFFSET], data[topLeftBlock + HEIGHT_OFFSET]);
        var collidingWithTopRight = rectangleCollidesWithQuad(x1, y1, w, h, data[topRightBlock + X_OFFSET], data[topRightBlock + Y_OFFSET], data[topRightBlock + WIDTH_OFFSET], data[topRightBlock + HEIGHT_OFFSET]);
        var collidingWithBottomLeft = rectangleCollidesWithQuad(x1, y1, w, h, data[bottomLeftBlock + X_OFFSET], data[bottomLeftBlock + Y_OFFSET], data[bottomLeftBlock + WIDTH_OFFSET], data[bottomLeftBlock + HEIGHT_OFFSET]);
        var collidingWithBottomRight = rectangleCollidesWithQuad(x1, y1, w, h, data[bottomRightBlock + X_OFFSET], data[bottomRightBlock + Y_OFFSET], data[bottomRightBlock + WIDTH_OFFSET], data[bottomRightBlock + HEIGHT_OFFSET]);
        if (collidingWithTopLeft)
            stack.push(topLeftBlock, level + 1);
        if (collidingWithTopRight)
            stack.push(topRightBlock, level + 1);
        if (collidingWithBottomLeft)
            stack.push(bottomLeftBlock, level + 1);
        if (collidingWithBottomRight)
            stack.push(bottomRightBlock, level + 1);
    }
    return collectedNodes;
}
/**
 * QuadTree class.
 *
 * @constructor
 * @param {object} boundaries - The graph boundaries.
 */
var QuadTree = /** @class */ (function () {
    function QuadTree(params) {
        var _a;
        if (params === void 0) { params = {}; }
        this.containers = (_a = {}, _a[OUTSIDE_BLOCK] = [], _a);
        this.cache = null;
        this.lastRectangle = null;
        // Allocating the underlying byte array
        var L = Math.pow(4, MAX_LEVEL);
        this.data = new Float32Array(BLOCKS * ((4 * L - 1) / 3));
        if (params.boundaries)
            this.resize(params.boundaries);
        else
            this.resize({
                x: 0,
                y: 0,
                width: 1,
                height: 1,
            });
    }
    QuadTree.prototype.add = function (key, x, y, size) {
        insertNode(MAX_LEVEL, this.data, this.containers, key, x, y, size);
        return this;
    };
    QuadTree.prototype.resize = function (boundaries) {
        this.clear();
        // Building the quadrants
        this.data[X_OFFSET] = boundaries.x;
        this.data[Y_OFFSET] = boundaries.y;
        this.data[WIDTH_OFFSET] = boundaries.width;
        this.data[HEIGHT_OFFSET] = boundaries.height;
        buildQuadrants(MAX_LEVEL, this.data);
    };
    QuadTree.prototype.clear = function () {
        var _a;
        this.containers = (_a = {}, _a[OUTSIDE_BLOCK] = [], _a);
        return this;
    };
    QuadTree.prototype.point = function (x, y) {
        var nodes = this.containers[OUTSIDE_BLOCK].slice();
        var block = 0, level = 0;
        do {
            if (this.containers[block])
                (0, extend_1.default)(nodes, this.containers[block]);
            var quad = pointIsInQuad(x, y, this.data[block + X_OFFSET], this.data[block + Y_OFFSET], this.data[block + WIDTH_OFFSET], this.data[block + HEIGHT_OFFSET]);
            block = 4 * block + quad * BLOCKS;
            level++;
        } while (level <= MAX_LEVEL);
        return nodes;
    };
    QuadTree.prototype.rectangle = function (x1, y1, x2, y2, height) {
        var lr = this.lastRectangle;
        if (lr && x1 === lr.x1 && x2 === lr.x2 && y1 === lr.y1 && y2 === lr.y2 && height === lr.height) {
            return this.cache;
        }
        this.lastRectangle = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            height: height,
        };
        // If the rectangle is shifted, we use the smallest aligned rectangle that contains the shifted one:
        if (!isRectangleAligned(this.lastRectangle))
            this.lastRectangle = getCircumscribedAlignedRectangle(this.lastRectangle);
        this.cache = getNodesInAxisAlignedRectangleArea(MAX_LEVEL, this.data, this.containers, x1, y1, Math.abs(x1 - x2) || Math.abs(y1 - y2), height);
        // Add all the nodes in the outside block, since they might be relevant, and since they should be very few:
        (0, extend_1.default)(this.cache, this.containers[OUTSIDE_BLOCK]);
        return this.cache;
    };
    return QuadTree;
}());
exports["default"] = QuadTree;


/***/ }),

/***/ "./node_modules/sigma/index.js":
/*!*************************************!*\
  !*** ./node_modules/sigma/index.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Sigma = exports.MouseCaptor = exports.QuadTree = exports.Camera = void 0;
/**
 * Sigma.js Library Endpoint
 * =========================
 *
 * The library endpoint.
 * @module
 */
var sigma_1 = __importDefault(__webpack_require__(/*! ./sigma */ "./node_modules/sigma/sigma.js"));
exports.Sigma = sigma_1.default;
var camera_1 = __importDefault(__webpack_require__(/*! ./core/camera */ "./node_modules/sigma/core/camera.js"));
exports.Camera = camera_1.default;
var quadtree_1 = __importDefault(__webpack_require__(/*! ./core/quadtree */ "./node_modules/sigma/core/quadtree.js"));
exports.QuadTree = quadtree_1.default;
var mouse_1 = __importDefault(__webpack_require__(/*! ./core/captors/mouse */ "./node_modules/sigma/core/captors/mouse.js"));
exports.MouseCaptor = mouse_1.default;
exports["default"] = sigma_1.default;


/***/ }),

/***/ "./node_modules/sigma/rendering/canvas/edge-label.js":
/*!***********************************************************!*\
  !*** ./node_modules/sigma/rendering/canvas/edge-label.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function drawEdgeLabel(context, edgeData, sourceData, targetData, settings) {
    var size = settings.edgeLabelSize, font = settings.edgeLabelFont, weight = settings.edgeLabelWeight, color = settings.edgeLabelColor.attribute
        ? edgeData[settings.edgeLabelColor.attribute] || settings.edgeLabelColor.color || "#000"
        : settings.edgeLabelColor.color;
    var label = edgeData.label;
    if (!label)
        return;
    context.fillStyle = color;
    context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
    // Computing positions without considering nodes sizes:
    var sSize = sourceData.size;
    var tSize = targetData.size;
    var sx = sourceData.x;
    var sy = sourceData.y;
    var tx = targetData.x;
    var ty = targetData.y;
    var cx = (sx + tx) / 2;
    var cy = (sy + ty) / 2;
    var dx = tx - sx;
    var dy = ty - sy;
    var d = Math.sqrt(dx * dx + dy * dy);
    if (d < sSize + tSize)
        return;
    // Adding nodes sizes:
    sx += (dx * sSize) / d;
    sy += (dy * sSize) / d;
    tx -= (dx * tSize) / d;
    ty -= (dy * tSize) / d;
    cx = (sx + tx) / 2;
    cy = (sy + ty) / 2;
    dx = tx - sx;
    dy = ty - sy;
    d = Math.sqrt(dx * dx + dy * dy);
    // Handling ellipsis
    var textLength = context.measureText(label).width;
    if (textLength > d) {
        var ellipsis = "…";
        label = label + ellipsis;
        textLength = context.measureText(label).width;
        while (textLength > d && label.length > 1) {
            label = label.slice(0, -2) + ellipsis;
            textLength = context.measureText(label).width;
        }
        if (label.length < 4)
            return;
    }
    var angle;
    if (dx > 0) {
        if (dy > 0)
            angle = Math.acos(dx / d);
        else
            angle = Math.asin(dy / d);
    }
    else {
        if (dy > 0)
            angle = Math.acos(dx / d) + Math.PI;
        else
            angle = Math.asin(dx / d) + Math.PI / 2;
    }
    context.save();
    context.translate(cx, cy);
    context.rotate(angle);
    context.fillText(label, -textLength / 2, edgeData.size / 2 + size);
    context.restore();
}
exports["default"] = drawEdgeLabel;


/***/ }),

/***/ "./node_modules/sigma/rendering/canvas/hover.js":
/*!******************************************************!*\
  !*** ./node_modules/sigma/rendering/canvas/hover.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var label_1 = __importDefault(__webpack_require__(/*! ./label */ "./node_modules/sigma/rendering/canvas/label.js"));
/**
 * Draw an hovered node.
 * - if there is no label => display a shadow on the node
 * - if the label box is bigger than node size => display a label box that contains the node with a shadow
 * - else node with shadow and the label box
 */
function drawHover(context, data, settings) {
    var size = settings.labelSize, font = settings.labelFont, weight = settings.labelWeight;
    context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
    // Then we draw the label background
    context.fillStyle = "#FFF";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 8;
    context.shadowColor = "#000";
    var PADDING = 2;
    if (typeof data.label === "string") {
        var textWidth = context.measureText(data.label).width, boxWidth = Math.round(textWidth + 5), boxHeight = Math.round(size + 2 * PADDING), radius = Math.max(data.size, size / 2) + PADDING;
        var angleRadian = Math.asin(boxHeight / 2 / radius);
        var xDeltaCoord = Math.sqrt(Math.abs(Math.pow(radius, 2) - Math.pow(boxHeight / 2, 2)));
        context.beginPath();
        context.moveTo(data.x + xDeltaCoord, data.y + boxHeight / 2);
        context.lineTo(data.x + radius + boxWidth, data.y + boxHeight / 2);
        context.lineTo(data.x + radius + boxWidth, data.y - boxHeight / 2);
        context.lineTo(data.x + xDeltaCoord, data.y - boxHeight / 2);
        context.arc(data.x, data.y, radius, angleRadian, -angleRadian);
        context.closePath();
        context.fill();
    }
    else {
        context.beginPath();
        context.arc(data.x, data.y, data.size + PADDING, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 0;
    // And finally we draw the label
    (0, label_1.default)(context, data, settings);
}
exports["default"] = drawHover;


/***/ }),

/***/ "./node_modules/sigma/rendering/canvas/label.js":
/*!******************************************************!*\
  !*** ./node_modules/sigma/rendering/canvas/label.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function drawLabel(context, data, settings) {
    if (!data.label)
        return;
    var size = settings.labelSize, font = settings.labelFont, weight = settings.labelWeight, color = settings.labelColor.attribute
        ? data[settings.labelColor.attribute] || settings.labelColor.color || "#000"
        : settings.labelColor.color;
    context.fillStyle = color;
    context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
    context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
}
exports["default"] = drawLabel;


/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/programs/common/edge.js":
/*!********************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/programs/common/edge.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createEdgeCompoundProgram = exports.AbstractEdgeProgram = void 0;
/**
 * Sigma.js WebGL Abstract Edge Program
 * =====================================
 *
 * @module
 */
var program_1 = __webpack_require__(/*! ./program */ "./node_modules/sigma/rendering/webgl/programs/common/program.js");
/**
 * Edge Program class.
 *
 * @constructor
 */
var AbstractEdgeProgram = /** @class */ (function (_super) {
    __extends(AbstractEdgeProgram, _super);
    function AbstractEdgeProgram(gl, vertexShaderSource, fragmentShaderSource, points, attributes) {
        return _super.call(this, gl, vertexShaderSource, fragmentShaderSource, points, attributes) || this;
    }
    return AbstractEdgeProgram;
}(program_1.AbstractProgram));
exports.AbstractEdgeProgram = AbstractEdgeProgram;
function createEdgeCompoundProgram(programClasses) {
    return /** @class */ (function () {
        function EdgeCompoundProgram(gl, renderer) {
            this.programs = programClasses.map(function (ProgramClass) { return new ProgramClass(gl, renderer); });
        }
        EdgeCompoundProgram.prototype.bufferData = function () {
            this.programs.forEach(function (program) { return program.bufferData(); });
        };
        EdgeCompoundProgram.prototype.allocate = function (capacity) {
            this.programs.forEach(function (program) { return program.allocate(capacity); });
        };
        EdgeCompoundProgram.prototype.bind = function () {
            // nothing todo, it's already done in each program constructor
        };
        EdgeCompoundProgram.prototype.computeIndices = function () {
            this.programs.forEach(function (program) { return program.computeIndices(); });
        };
        EdgeCompoundProgram.prototype.render = function (params) {
            this.programs.forEach(function (program) {
                program.bind();
                program.bufferData();
                program.render(params);
            });
        };
        EdgeCompoundProgram.prototype.process = function (sourceData, targetData, data, hidden, offset) {
            this.programs.forEach(function (program) { return program.process(sourceData, targetData, data, hidden, offset); });
        };
        return EdgeCompoundProgram;
    }());
}
exports.createEdgeCompoundProgram = createEdgeCompoundProgram;


/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/programs/common/node.js":
/*!********************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/programs/common/node.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createNodeCompoundProgram = exports.AbstractNodeProgram = void 0;
/**
 * Sigma.js WebGL Abstract Node Program
 * =====================================
 *
 * @module
 */
var program_1 = __webpack_require__(/*! ./program */ "./node_modules/sigma/rendering/webgl/programs/common/program.js");
/**
 * Node Program class.
 *
 * @constructor
 */
var AbstractNodeProgram = /** @class */ (function (_super) {
    __extends(AbstractNodeProgram, _super);
    function AbstractNodeProgram(gl, vertexShaderSource, fragmentShaderSource, points, attributes) {
        var _this = _super.call(this, gl, vertexShaderSource, fragmentShaderSource, points, attributes) || this;
        // Locations
        _this.positionLocation = gl.getAttribLocation(_this.program, "a_position");
        _this.sizeLocation = gl.getAttribLocation(_this.program, "a_size");
        _this.colorLocation = gl.getAttribLocation(_this.program, "a_color");
        // Uniform Location
        var matrixLocation = gl.getUniformLocation(_this.program, "u_matrix");
        if (matrixLocation === null)
            throw new Error("AbstractNodeProgram: error while getting matrixLocation");
        _this.matrixLocation = matrixLocation;
        var ratioLocation = gl.getUniformLocation(_this.program, "u_ratio");
        if (ratioLocation === null)
            throw new Error("AbstractNodeProgram: error while getting ratioLocation");
        _this.ratioLocation = ratioLocation;
        var scaleLocation = gl.getUniformLocation(_this.program, "u_scale");
        if (scaleLocation === null)
            throw new Error("AbstractNodeProgram: error while getting scaleLocation");
        _this.scaleLocation = scaleLocation;
        return _this;
    }
    AbstractNodeProgram.prototype.bind = function () {
        var gl = this.gl;
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.sizeLocation);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, this.attributes * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(this.sizeLocation, 1, gl.FLOAT, false, this.attributes * Float32Array.BYTES_PER_ELEMENT, 8);
        gl.vertexAttribPointer(this.colorLocation, 4, gl.UNSIGNED_BYTE, true, this.attributes * Float32Array.BYTES_PER_ELEMENT, 12);
    };
    return AbstractNodeProgram;
}(program_1.AbstractProgram));
exports.AbstractNodeProgram = AbstractNodeProgram;
/**
 * Helper function combining two or more programs into a single compound one.
 * Note that this is more a quick & easy way to combine program than a really
 * performant option. More performant programs can be written entirely.
 *
 * @param  {array}    programClasses - Program classes to combine.
 * @return {function}
 */
function createNodeCompoundProgram(programClasses) {
    return /** @class */ (function () {
        function NodeCompoundProgram(gl, renderer) {
            this.programs = programClasses.map(function (ProgramClass) { return new ProgramClass(gl, renderer); });
        }
        NodeCompoundProgram.prototype.bufferData = function () {
            this.programs.forEach(function (program) { return program.bufferData(); });
        };
        NodeCompoundProgram.prototype.allocate = function (capacity) {
            this.programs.forEach(function (program) { return program.allocate(capacity); });
        };
        NodeCompoundProgram.prototype.bind = function () {
            // nothing todo, it's already done in each program constructor
        };
        NodeCompoundProgram.prototype.render = function (params) {
            this.programs.forEach(function (program) {
                program.bind();
                program.bufferData();
                program.render(params);
            });
        };
        NodeCompoundProgram.prototype.process = function (data, hidden, offset) {
            this.programs.forEach(function (program) { return program.process(data, hidden, offset); });
        };
        return NodeCompoundProgram;
    }());
}
exports.createNodeCompoundProgram = createNodeCompoundProgram;


/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/programs/common/program.js":
/*!***********************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/programs/common/program.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractProgram = void 0;
/**
 * Sigma.js WebGL Renderer Program
 * ================================
 *
 * Class representing a single WebGL program used by sigma's WebGL renderer.
 * @module
 */
var utils_1 = __webpack_require__(/*! ../../shaders/utils */ "./node_modules/sigma/rendering/webgl/shaders/utils.js");
/**
 * Abstract Program class.
 *
 * @constructor
 */
var AbstractProgram = /** @class */ (function () {
    function AbstractProgram(gl, vertexShaderSource, fragmentShaderSource, points, attributes) {
        this.array = new Float32Array();
        this.points = points;
        this.attributes = attributes;
        this.gl = gl;
        this.vertexShaderSource = vertexShaderSource;
        this.fragmentShaderSource = fragmentShaderSource;
        var buffer = gl.createBuffer();
        if (buffer === null)
            throw new Error("AbstractProgram: error while creating the buffer");
        this.buffer = buffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.vertexShader = (0, utils_1.loadVertexShader)(gl, this.vertexShaderSource);
        this.fragmentShader = (0, utils_1.loadFragmentShader)(gl, this.fragmentShaderSource);
        this.program = (0, utils_1.loadProgram)(gl, [this.vertexShader, this.fragmentShader]);
    }
    AbstractProgram.prototype.bufferData = function () {
        var gl = this.gl;
        gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
    };
    AbstractProgram.prototype.allocate = function (capacity) {
        this.array = new Float32Array(this.points * this.attributes * capacity);
    };
    AbstractProgram.prototype.hasNothingToRender = function () {
        return this.array.length === 0;
    };
    return AbstractProgram;
}());
exports.AbstractProgram = AbstractProgram;


/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/programs/edge.arrow.js":
/*!*******************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/programs/edge.arrow.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sigma.js WebGL Renderer Edge Arrow Program
 * ===========================================
 *
 * Compound program rendering edges as an arrow from the source to the target.
 * @module
 */
var edge_1 = __webpack_require__(/*! ./common/edge */ "./node_modules/sigma/rendering/webgl/programs/common/edge.js");
var edge_arrowHead_1 = __importDefault(__webpack_require__(/*! ./edge.arrowHead */ "./node_modules/sigma/rendering/webgl/programs/edge.arrowHead.js"));
var edge_clamped_1 = __importDefault(__webpack_require__(/*! ./edge.clamped */ "./node_modules/sigma/rendering/webgl/programs/edge.clamped.js"));
var EdgeArrowProgram = (0, edge_1.createEdgeCompoundProgram)([edge_clamped_1.default, edge_arrowHead_1.default]);
exports["default"] = EdgeArrowProgram;


/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/programs/edge.arrowHead.js":
/*!***********************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/programs/edge.arrowHead.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(/*! ../../../utils */ "./node_modules/sigma/utils/index.js");
var edge_arrowHead_vert_glsl_1 = __importDefault(__webpack_require__(/*! ../shaders/edge.arrowHead.vert.glsl.js */ "./node_modules/sigma/rendering/webgl/shaders/edge.arrowHead.vert.glsl.js"));
var edge_arrowHead_frag_glsl_1 = __importDefault(__webpack_require__(/*! ../shaders/edge.arrowHead.frag.glsl.js */ "./node_modules/sigma/rendering/webgl/shaders/edge.arrowHead.frag.glsl.js"));
var edge_1 = __webpack_require__(/*! ./common/edge */ "./node_modules/sigma/rendering/webgl/programs/common/edge.js");
var POINTS = 3, ATTRIBUTES = 9, STRIDE = POINTS * ATTRIBUTES;
var EdgeArrowHeadProgram = /** @class */ (function (_super) {
    __extends(EdgeArrowHeadProgram, _super);
    function EdgeArrowHeadProgram(gl) {
        var _this = _super.call(this, gl, edge_arrowHead_vert_glsl_1.default, edge_arrowHead_frag_glsl_1.default, POINTS, ATTRIBUTES) || this;
        // Locations
        _this.positionLocation = gl.getAttribLocation(_this.program, "a_position");
        _this.colorLocation = gl.getAttribLocation(_this.program, "a_color");
        _this.normalLocation = gl.getAttribLocation(_this.program, "a_normal");
        _this.radiusLocation = gl.getAttribLocation(_this.program, "a_radius");
        _this.barycentricLocation = gl.getAttribLocation(_this.program, "a_barycentric");
        // Uniform locations
        var matrixLocation = gl.getUniformLocation(_this.program, "u_matrix");
        if (matrixLocation === null)
            throw new Error("EdgeArrowHeadProgram: error while getting matrixLocation");
        _this.matrixLocation = matrixLocation;
        var sqrtZoomRatioLocation = gl.getUniformLocation(_this.program, "u_sqrtZoomRatio");
        if (sqrtZoomRatioLocation === null)
            throw new Error("EdgeArrowHeadProgram: error while getting sqrtZoomRatioLocation");
        _this.sqrtZoomRatioLocation = sqrtZoomRatioLocation;
        var correctionRatioLocation = gl.getUniformLocation(_this.program, "u_correctionRatio");
        if (correctionRatioLocation === null)
            throw new Error("EdgeArrowHeadProgram: error while getting correctionRatioLocation");
        _this.correctionRatioLocation = correctionRatioLocation;
        _this.bind();
        return _this;
    }
    EdgeArrowHeadProgram.prototype.bind = function () {
        var gl = this.gl;
        // Bindings
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.normalLocation);
        gl.enableVertexAttribArray(this.radiusLocation);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.enableVertexAttribArray(this.barycentricLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(this.normalLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
        gl.vertexAttribPointer(this.radiusLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
        gl.vertexAttribPointer(this.colorLocation, 4, gl.UNSIGNED_BYTE, true, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 20);
        // TODO: maybe we can optimize here by packing this in a bit mask
        gl.vertexAttribPointer(this.barycentricLocation, 3, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 24);
    };
    EdgeArrowHeadProgram.prototype.computeIndices = function () {
        // nothing to do
    };
    EdgeArrowHeadProgram.prototype.process = function (sourceData, targetData, data, hidden, offset) {
        if (hidden) {
            for (var i_1 = offset * STRIDE, l = i_1 + STRIDE; i_1 < l; i_1++)
                this.array[i_1] = 0;
            return;
        }
        var thickness = data.size || 1, radius = targetData.size || 1, x1 = sourceData.x, y1 = sourceData.y, x2 = targetData.x, y2 = targetData.y, color = (0, utils_1.floatColor)(data.color);
        // Computing normals
        var dx = x2 - x1, dy = y2 - y1;
        var len = dx * dx + dy * dy, n1 = 0, n2 = 0;
        if (len) {
            len = 1 / Math.sqrt(len);
            n1 = -dy * len * thickness;
            n2 = dx * len * thickness;
        }
        var i = POINTS * ATTRIBUTES * offset;
        var array = this.array;
        // First point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = radius;
        array[i++] = color;
        array[i++] = 1;
        array[i++] = 0;
        array[i++] = 0;
        // Second point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = radius;
        array[i++] = color;
        array[i++] = 0;
        array[i++] = 1;
        array[i++] = 0;
        // Third point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = radius;
        array[i++] = color;
        array[i++] = 0;
        array[i++] = 0;
        array[i] = 1;
    };
    EdgeArrowHeadProgram.prototype.render = function (params) {
        if (this.hasNothingToRender())
            return;
        var gl = this.gl;
        var program = this.program;
        gl.useProgram(program);
        // Binding uniforms
        gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
        gl.uniform1f(this.sqrtZoomRatioLocation, Math.sqrt(params.ratio));
        gl.uniform1f(this.correctionRatioLocation, params.correctionRatio);
        // Drawing:
        gl.drawArrays(gl.TRIANGLES, 0, this.array.length / ATTRIBUTES);
    };
    return EdgeArrowHeadProgram;
}(edge_1.AbstractEdgeProgram));
exports["default"] = EdgeArrowHeadProgram;


/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/programs/edge.clamped.js":
/*!*********************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/programs/edge.clamped.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var edge_1 = __webpack_require__(/*! ./common/edge */ "./node_modules/sigma/rendering/webgl/programs/common/edge.js");
var utils_1 = __webpack_require__(/*! ../../../utils */ "./node_modules/sigma/utils/index.js");
var edge_clamped_vert_glsl_1 = __importDefault(__webpack_require__(/*! ../shaders/edge.clamped.vert.glsl.js */ "./node_modules/sigma/rendering/webgl/shaders/edge.clamped.vert.glsl.js"));
var edge_frag_glsl_1 = __importDefault(__webpack_require__(/*! ../shaders/edge.frag.glsl.js */ "./node_modules/sigma/rendering/webgl/shaders/edge.frag.glsl.js"));
var POINTS = 4, ATTRIBUTES = 6, STRIDE = POINTS * ATTRIBUTES;
var EdgeClampedProgram = /** @class */ (function (_super) {
    __extends(EdgeClampedProgram, _super);
    function EdgeClampedProgram(gl) {
        var _this = _super.call(this, gl, edge_clamped_vert_glsl_1.default, edge_frag_glsl_1.default, POINTS, ATTRIBUTES) || this;
        // Initializing indices buffer
        var indicesBuffer = gl.createBuffer();
        if (indicesBuffer === null)
            throw new Error("EdgeClampedProgram: error while getting resolutionLocation");
        _this.indicesBuffer = indicesBuffer;
        // Locations:
        _this.positionLocation = gl.getAttribLocation(_this.program, "a_position");
        _this.colorLocation = gl.getAttribLocation(_this.program, "a_color");
        _this.normalLocation = gl.getAttribLocation(_this.program, "a_normal");
        _this.radiusLocation = gl.getAttribLocation(_this.program, "a_radius");
        // Uniform locations
        var matrixLocation = gl.getUniformLocation(_this.program, "u_matrix");
        if (matrixLocation === null)
            throw new Error("EdgeClampedProgram: error while getting matrixLocation");
        _this.matrixLocation = matrixLocation;
        var sqrtZoomRatioLocation = gl.getUniformLocation(_this.program, "u_sqrtZoomRatio");
        if (sqrtZoomRatioLocation === null)
            throw new Error("EdgeClampedProgram: error while getting cameraRatioLocation");
        _this.sqrtZoomRatioLocation = sqrtZoomRatioLocation;
        var correctionRatioLocation = gl.getUniformLocation(_this.program, "u_correctionRatio");
        if (correctionRatioLocation === null)
            throw new Error("EdgeClampedProgram: error while getting viewportRatioLocation");
        _this.correctionRatioLocation = correctionRatioLocation;
        // Enabling the OES_element_index_uint extension
        // NOTE: on older GPUs, this means that really large graphs won't
        // have all their edges rendered. But it seems that the
        // `OES_element_index_uint` is quite everywhere so we'll handle
        // the potential issue if it really arises.
        // NOTE: when using webgl2, the extension is enabled by default
        _this.canUse32BitsIndices = (0, utils_1.canUse32BitsIndices)(gl);
        _this.IndicesArray = _this.canUse32BitsIndices ? Uint32Array : Uint16Array;
        _this.indicesArray = new _this.IndicesArray();
        _this.indicesType = _this.canUse32BitsIndices ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
        _this.bind();
        return _this;
    }
    EdgeClampedProgram.prototype.bind = function () {
        var gl = this.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        // Bindings
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.normalLocation);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.enableVertexAttribArray(this.radiusLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(this.normalLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
        gl.vertexAttribPointer(this.colorLocation, 4, gl.UNSIGNED_BYTE, true, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
        gl.vertexAttribPointer(this.radiusLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 20);
    };
    EdgeClampedProgram.prototype.process = function (sourceData, targetData, data, hidden, offset) {
        if (hidden) {
            for (var i_1 = offset * STRIDE, l = i_1 + STRIDE; i_1 < l; i_1++)
                this.array[i_1] = 0;
            return;
        }
        var thickness = data.size || 1, x1 = sourceData.x, y1 = sourceData.y, x2 = targetData.x, y2 = targetData.y, radius = targetData.size || 1, color = (0, utils_1.floatColor)(data.color);
        // Computing normals
        var dx = x2 - x1, dy = y2 - y1;
        var len = dx * dx + dy * dy, n1 = 0, n2 = 0;
        if (len) {
            len = 1 / Math.sqrt(len);
            n1 = -dy * len * thickness;
            n2 = dx * len * thickness;
        }
        var i = POINTS * ATTRIBUTES * offset;
        var array = this.array;
        // First point
        array[i++] = x1;
        array[i++] = y1;
        array[i++] = n1;
        array[i++] = n2;
        array[i++] = color;
        array[i++] = 0;
        // First point flipped
        array[i++] = x1;
        array[i++] = y1;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = color;
        array[i++] = 0;
        // Second point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = n1;
        array[i++] = n2;
        array[i++] = color;
        array[i++] = radius;
        // Second point flipped
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = color;
        array[i] = -radius;
    };
    EdgeClampedProgram.prototype.computeIndices = function () {
        var l = this.array.length / ATTRIBUTES;
        var size = l + l / 2;
        var indices = new this.IndicesArray(size);
        for (var i = 0, c = 0; i < l; i += 4) {
            indices[c++] = i;
            indices[c++] = i + 1;
            indices[c++] = i + 2;
            indices[c++] = i + 2;
            indices[c++] = i + 1;
            indices[c++] = i + 3;
        }
        this.indicesArray = indices;
    };
    EdgeClampedProgram.prototype.bufferData = function () {
        _super.prototype.bufferData.call(this);
        // Indices data
        var gl = this.gl;
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicesArray, gl.STATIC_DRAW);
    };
    EdgeClampedProgram.prototype.render = function (params) {
        if (this.hasNothingToRender())
            return;
        var gl = this.gl;
        var program = this.program;
        gl.useProgram(program);
        // Binding uniforms
        gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
        gl.uniform1f(this.sqrtZoomRatioLocation, Math.sqrt(params.ratio));
        gl.uniform1f(this.correctionRatioLocation, params.correctionRatio);
        // Drawing:
        gl.drawElements(gl.TRIANGLES, this.indicesArray.length, this.indicesType, 0);
    };
    return EdgeClampedProgram;
}(edge_1.AbstractEdgeProgram));
exports["default"] = EdgeClampedProgram;


/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/programs/edge.js":
/*!*************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/programs/edge.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sigma.js WebGL Renderer Edge Program
 * =====================================
 *
 * Program rendering edges as thick lines using four points translated
 * orthogonally from the source & target's centers by half thickness.
 *
 * Rendering two triangles by using only four points is made possible through
 * the use of indices.
 *
 * This method should be faster than the 6 points / 2 triangles approach and
 * should handle thickness better than with gl.LINES.
 *
 * This version of the shader balances geometry computation evenly between
 * the CPU & GPU (normals are computed on the CPU side).
 * @module
 */
var utils_1 = __webpack_require__(/*! ../../../utils */ "./node_modules/sigma/utils/index.js");
var edge_vert_glsl_1 = __importDefault(__webpack_require__(/*! ../shaders/edge.vert.glsl.js */ "./node_modules/sigma/rendering/webgl/shaders/edge.vert.glsl.js"));
var edge_frag_glsl_1 = __importDefault(__webpack_require__(/*! ../shaders/edge.frag.glsl.js */ "./node_modules/sigma/rendering/webgl/shaders/edge.frag.glsl.js"));
var edge_1 = __webpack_require__(/*! ./common/edge */ "./node_modules/sigma/rendering/webgl/programs/common/edge.js");
var POINTS = 4, ATTRIBUTES = 5, STRIDE = POINTS * ATTRIBUTES;
var EdgeProgram = /** @class */ (function (_super) {
    __extends(EdgeProgram, _super);
    function EdgeProgram(gl) {
        var _this = _super.call(this, gl, edge_vert_glsl_1.default, edge_frag_glsl_1.default, POINTS, ATTRIBUTES) || this;
        // Initializing indices buffer
        var indicesBuffer = gl.createBuffer();
        if (indicesBuffer === null)
            throw new Error("EdgeProgram: error while creating indicesBuffer");
        _this.indicesBuffer = indicesBuffer;
        // Locations
        _this.positionLocation = gl.getAttribLocation(_this.program, "a_position");
        _this.colorLocation = gl.getAttribLocation(_this.program, "a_color");
        _this.normalLocation = gl.getAttribLocation(_this.program, "a_normal");
        var matrixLocation = gl.getUniformLocation(_this.program, "u_matrix");
        if (matrixLocation === null)
            throw new Error("EdgeProgram: error while getting matrixLocation");
        _this.matrixLocation = matrixLocation;
        var correctionRatioLocation = gl.getUniformLocation(_this.program, "u_correctionRatio");
        if (correctionRatioLocation === null)
            throw new Error("EdgeProgram: error while getting correctionRatioLocation");
        _this.correctionRatioLocation = correctionRatioLocation;
        var sqrtZoomRatioLocation = gl.getUniformLocation(_this.program, "u_sqrtZoomRatio");
        if (sqrtZoomRatioLocation === null)
            throw new Error("EdgeProgram: error while getting sqrtZoomRatioLocation");
        _this.sqrtZoomRatioLocation = sqrtZoomRatioLocation;
        // Enabling the OES_element_index_uint extension
        // NOTE: on older GPUs, this means that really large graphs won't
        // have all their edges rendered. But it seems that the
        // `OES_element_index_uint` is quite everywhere so we'll handle
        // the potential issue if it really arises.
        // NOTE: when using webgl2, the extension is enabled by default
        _this.canUse32BitsIndices = (0, utils_1.canUse32BitsIndices)(gl);
        _this.IndicesArray = _this.canUse32BitsIndices ? Uint32Array : Uint16Array;
        _this.indicesArray = new _this.IndicesArray();
        _this.indicesType = _this.canUse32BitsIndices ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
        _this.bind();
        return _this;
    }
    EdgeProgram.prototype.bind = function () {
        var gl = this.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        // Bindings
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.normalLocation);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(this.normalLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
        gl.vertexAttribPointer(this.colorLocation, 4, gl.UNSIGNED_BYTE, true, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
    };
    EdgeProgram.prototype.computeIndices = function () {
        var l = this.array.length / ATTRIBUTES;
        var size = l + l / 2;
        var indices = new this.IndicesArray(size);
        for (var i = 0, c = 0; i < l; i += 4) {
            indices[c++] = i;
            indices[c++] = i + 1;
            indices[c++] = i + 2;
            indices[c++] = i + 2;
            indices[c++] = i + 1;
            indices[c++] = i + 3;
        }
        this.indicesArray = indices;
    };
    EdgeProgram.prototype.bufferData = function () {
        _super.prototype.bufferData.call(this);
        // Indices data
        var gl = this.gl;
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicesArray, gl.STATIC_DRAW);
    };
    EdgeProgram.prototype.process = function (sourceData, targetData, data, hidden, offset) {
        if (hidden) {
            for (var i_1 = offset * STRIDE, l = i_1 + STRIDE; i_1 < l; i_1++)
                this.array[i_1] = 0;
            return;
        }
        var thickness = data.size || 1, x1 = sourceData.x, y1 = sourceData.y, x2 = targetData.x, y2 = targetData.y, color = (0, utils_1.floatColor)(data.color);
        // Computing normals
        var dx = x2 - x1, dy = y2 - y1;
        var len = dx * dx + dy * dy, n1 = 0, n2 = 0;
        if (len) {
            len = 1 / Math.sqrt(len);
            n1 = -dy * len * thickness;
            n2 = dx * len * thickness;
        }
        var i = POINTS * ATTRIBUTES * offset;
        var array = this.array;
        // First point
        array[i++] = x1;
        array[i++] = y1;
        array[i++] = n1;
        array[i++] = n2;
        array[i++] = color;
        // First point flipped
        array[i++] = x1;
        array[i++] = y1;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = color;
        // Second point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = n1;
        array[i++] = n2;
        array[i++] = color;
        // Second point flipped
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i] = color;
    };
    EdgeProgram.prototype.render = function (params) {
        if (this.hasNothingToRender())
            return;
        var gl = this.gl;
        var program = this.program;
        gl.useProgram(program);
        gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
        gl.uniform1f(this.sqrtZoomRatioLocation, Math.sqrt(params.ratio));
        gl.uniform1f(this.correctionRatioLocation, params.correctionRatio);
        // Drawing:
        gl.drawElements(gl.TRIANGLES, this.indicesArray.length, this.indicesType, 0);
    };
    return EdgeProgram;
}(edge_1.AbstractEdgeProgram));
exports["default"] = EdgeProgram;


/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/programs/node.fast.js":
/*!******************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/programs/node.fast.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(/*! ../../../utils */ "./node_modules/sigma/utils/index.js");
var node_fast_vert_glsl_1 = __importDefault(__webpack_require__(/*! ../shaders/node.fast.vert.glsl.js */ "./node_modules/sigma/rendering/webgl/shaders/node.fast.vert.glsl.js"));
var node_fast_frag_glsl_1 = __importDefault(__webpack_require__(/*! ../shaders/node.fast.frag.glsl.js */ "./node_modules/sigma/rendering/webgl/shaders/node.fast.frag.glsl.js"));
var node_1 = __webpack_require__(/*! ./common/node */ "./node_modules/sigma/rendering/webgl/programs/common/node.js");
var POINTS = 1, ATTRIBUTES = 4;
var NodeFastProgram = /** @class */ (function (_super) {
    __extends(NodeFastProgram, _super);
    function NodeFastProgram(gl) {
        var _this = _super.call(this, gl, node_fast_vert_glsl_1.default, node_fast_frag_glsl_1.default, POINTS, ATTRIBUTES) || this;
        _this.bind();
        return _this;
    }
    NodeFastProgram.prototype.process = function (data, hidden, offset) {
        var array = this.array;
        var i = offset * POINTS * ATTRIBUTES;
        if (hidden) {
            array[i++] = 0;
            array[i++] = 0;
            array[i++] = 0;
            array[i++] = 0;
            return;
        }
        var color = (0, utils_1.floatColor)(data.color);
        array[i++] = data.x;
        array[i++] = data.y;
        array[i++] = data.size;
        array[i] = color;
    };
    NodeFastProgram.prototype.render = function (params) {
        if (this.hasNothingToRender())
            return;
        var gl = this.gl;
        var program = this.program;
        gl.useProgram(program);
        gl.uniform1f(this.ratioLocation, 1 / Math.sqrt(params.ratio));
        gl.uniform1f(this.scaleLocation, params.scalingRatio);
        gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
        gl.drawArrays(gl.POINTS, 0, this.array.length / ATTRIBUTES);
    };
    return NodeFastProgram;
}(node_1.AbstractNodeProgram));
exports["default"] = NodeFastProgram;


/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/shaders/edge.arrowHead.frag.glsl.js":
/*!********************************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/shaders/edge.arrowHead.frag.glsl.js ***!
  \********************************************************************************/
/***/ ((module) => {

(()=>{"use strict";var e={d:(o,r)=>{for(var t in r)e.o(r,t)&&!e.o(o,t)&&Object.defineProperty(o,t,{enumerable:!0,get:r[t]})},o:(e,o)=>Object.prototype.hasOwnProperty.call(e,o),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},o={};e.r(o),e.d(o,{default:()=>r});const r="precision mediump float;\n\nvarying vec4 v_color;\n\nvoid main(void) {\n  gl_FragColor = v_color;\n}\n";module.exports=o})();

/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/shaders/edge.arrowHead.vert.glsl.js":
/*!********************************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/shaders/edge.arrowHead.vert.glsl.js ***!
  \********************************************************************************/
/***/ ((module) => {

(()=>{"use strict";var a={d:(e,t)=>{for(var o in t)a.o(t,o)&&!a.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},o:(a,e)=>Object.prototype.hasOwnProperty.call(a,e),r:a=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(a,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(a,"__esModule",{value:!0})}},e={};a.r(e),a.d(e,{default:()=>t});const t="attribute vec2 a_position;\nattribute vec2 a_normal;\nattribute float a_radius;\nattribute vec4 a_color;\nattribute vec3 a_barycentric;\n\nuniform mat3 u_matrix;\nuniform float u_sqrtZoomRatio;\nuniform float u_correctionRatio;\n\nvarying vec4 v_color;\n\nconst float minThickness = 1.7;\nconst float bias = 255.0 / 254.0;\nconst float arrowHeadWidthLengthRatio = 0.66;\nconst float arrowHeadLengthThicknessRatio = 2.5;\n\nvoid main() {\n  float normalLength = length(a_normal);\n  vec2 unitNormal = a_normal / normalLength;\n\n  // These first computations are taken from edge.vert.glsl and\n  // edge.clamped.vert.glsl. Please read it to get better comments on what's\n  // happening:\n  float pixelsThickness = max(normalLength, minThickness * u_sqrtZoomRatio);\n  float webGLThickness = pixelsThickness * u_correctionRatio;\n  float adaptedWebGLThickness = webGLThickness * u_sqrtZoomRatio;\n  float adaptedWebGLNodeRadius = a_radius * 2.0 * u_correctionRatio * u_sqrtZoomRatio;\n  float adaptedWebGLArrowHeadLength = adaptedWebGLThickness * 2.0 * arrowHeadLengthThicknessRatio;\n  float adaptedWebGLArrowHeadHalfWidth = adaptedWebGLArrowHeadLength * arrowHeadWidthLengthRatio / 2.0;\n\n  float da = a_barycentric.x;\n  float db = a_barycentric.y;\n  float dc = a_barycentric.z;\n\n  vec2 delta = vec2(\n      da * (adaptedWebGLNodeRadius * unitNormal.y)\n    + db * ((adaptedWebGLNodeRadius + adaptedWebGLArrowHeadLength) * unitNormal.y + adaptedWebGLArrowHeadHalfWidth * unitNormal.x)\n    + dc * ((adaptedWebGLNodeRadius + adaptedWebGLArrowHeadLength) * unitNormal.y - adaptedWebGLArrowHeadHalfWidth * unitNormal.x),\n\n      da * (-adaptedWebGLNodeRadius * unitNormal.x)\n    + db * (-(adaptedWebGLNodeRadius + adaptedWebGLArrowHeadLength) * unitNormal.x + adaptedWebGLArrowHeadHalfWidth * unitNormal.y)\n    + dc * (-(adaptedWebGLNodeRadius + adaptedWebGLArrowHeadLength) * unitNormal.x - adaptedWebGLArrowHeadHalfWidth * unitNormal.y)\n  );\n\n  vec2 position = (u_matrix * vec3(a_position + delta, 1)).xy;\n\n  gl_Position = vec4(position, 0, 1);\n\n  // Extract the color:\n  v_color = a_color;\n  v_color.a *= bias;\n}\n";module.exports=e})();

/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/shaders/edge.clamped.vert.glsl.js":
/*!******************************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/shaders/edge.clamped.vert.glsl.js ***!
  \******************************************************************************/
/***/ ((module) => {

(()=>{"use strict";var e={d:(o,n)=>{for(var t in n)e.o(n,t)&&!e.o(o,t)&&Object.defineProperty(o,t,{enumerable:!0,get:n[t]})},o:(e,o)=>Object.prototype.hasOwnProperty.call(e,o),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},o={};e.r(o),e.d(o,{default:()=>n});const n="attribute vec4 a_color;\nattribute vec2 a_normal;\nattribute vec2 a_position;\nattribute float a_radius;\n\nuniform mat3 u_matrix;\nuniform float u_sqrtZoomRatio;\nuniform float u_correctionRatio;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\n\nconst float minThickness = 1.7;\nconst float bias = 255.0 / 254.0;\nconst float arrowHeadLengthThicknessRatio = 2.5;\n\nvoid main() {\n  float normalLength = length(a_normal);\n  vec2 unitNormal = a_normal / normalLength;\n\n  // These first computations are taken from edge.vert.glsl. Please read it to\n  // get better comments on what's happening:\n  float pixelsThickness = max(normalLength, minThickness * u_sqrtZoomRatio);\n  float webGLThickness = pixelsThickness * u_correctionRatio;\n  float adaptedWebGLThickness = webGLThickness * u_sqrtZoomRatio;\n\n  // Here, we move the point to leave space for the arrow head:\n  float direction = sign(a_radius);\n  float adaptedWebGLNodeRadius = direction * a_radius * 2.0 * u_correctionRatio * u_sqrtZoomRatio;\n  float adaptedWebGLArrowHeadLength = adaptedWebGLThickness * 2.0 * arrowHeadLengthThicknessRatio;\n\n  vec2 compensationVector = vec2(-direction * unitNormal.y, direction * unitNormal.x) * (adaptedWebGLNodeRadius + adaptedWebGLArrowHeadLength);\n\n  // Here is the proper position of the vertex\n  gl_Position = vec4((u_matrix * vec3(a_position + unitNormal * adaptedWebGLThickness + compensationVector, 1)).xy, 0, 1);\n\n  v_thickness = webGLThickness / u_sqrtZoomRatio;\n\n  v_normal = unitNormal;\n  v_color = a_color;\n  v_color.a *= bias;\n}\n";module.exports=o})();

/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/shaders/edge.frag.glsl.js":
/*!**********************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/shaders/edge.frag.glsl.js ***!
  \**********************************************************************/
/***/ ((module) => {

(()=>{"use strict";var e={d:(n,t)=>{for(var o in t)e.o(t,o)&&!e.o(n,o)&&Object.defineProperty(n,o,{enumerable:!0,get:t[o]})},o:(e,n)=>Object.prototype.hasOwnProperty.call(e,n),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},n={};e.r(n),e.d(n,{default:()=>t});const t="precision mediump float;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\n\nconst float feather = 0.001;\nconst vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);\n\nvoid main(void) {\n  float dist = length(v_normal) * v_thickness;\n\n  float t = smoothstep(\n    v_thickness - feather,\n    v_thickness,\n    dist\n  );\n\n  gl_FragColor = mix(v_color, transparent, t);\n}\n";module.exports=n})();

/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/shaders/edge.vert.glsl.js":
/*!**********************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/shaders/edge.vert.glsl.js ***!
  \**********************************************************************/
/***/ ((module) => {

(()=>{"use strict";var e={d:(n,o)=>{for(var t in o)e.o(o,t)&&!e.o(n,t)&&Object.defineProperty(n,t,{enumerable:!0,get:o[t]})},o:(e,n)=>Object.prototype.hasOwnProperty.call(e,n),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},n={};e.r(n),e.d(n,{default:()=>o});const o='attribute vec4 a_color;\nattribute vec2 a_normal;\nattribute vec2 a_position;\n\nuniform mat3 u_matrix;\nuniform float u_sqrtZoomRatio;\nuniform float u_correctionRatio;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\n\nconst float minThickness = 1.7;\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n  float normalLength = length(a_normal);\n  vec2 unitNormal = a_normal / normalLength;\n\n  // We require edges to be at least `minThickness` pixels thick *on screen*\n  // (so we need to compensate the SQRT zoom ratio):\n  float pixelsThickness = max(normalLength, minThickness * u_sqrtZoomRatio);\n\n  // Then, we need to retrieve the normalized thickness of the edge in the WebGL\n  // referential (in a ([0, 1], [0, 1]) space), using our "magic" correction\n  // ratio:\n  float webGLThickness = pixelsThickness * u_correctionRatio;\n\n  // Finally, we adapt the edge thickness to the "SQRT rule" in sigma (so that\n  // items are not too big when zoomed in, and not too small when zoomed out).\n  // The exact computation should be `adapted = value * zoom / sqrt(zoom)`, but\n  // it\'s simpler like this:\n  float adaptedWebGLThickness = webGLThickness * u_sqrtZoomRatio;\n\n  // Here is the proper position of the vertex\n  gl_Position = vec4((u_matrix * vec3(a_position + unitNormal * adaptedWebGLThickness, 1)).xy, 0, 1);\n\n  // For the fragment shader though, we need a thickness that takes the "magic"\n  // correction ratio into account (as in webGLThickness), but so that the\n  // antialiasing effect does not depend on the zoom level. So here\'s yet\n  // another thickness version:\n  v_thickness = webGLThickness / u_sqrtZoomRatio;\n\n  v_normal = unitNormal;\n  v_color = a_color;\n  v_color.a *= bias;\n}\n';module.exports=n})();

/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/shaders/node.fast.frag.glsl.js":
/*!***************************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/shaders/node.fast.frag.glsl.js ***!
  \***************************************************************************/
/***/ ((module) => {

(()=>{"use strict";var e={d:(n,o)=>{for(var t in o)e.o(o,t)&&!e.o(n,t)&&Object.defineProperty(n,t,{enumerable:!0,get:o[t]})},o:(e,n)=>Object.prototype.hasOwnProperty.call(e,n),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},n={};e.r(n),e.d(n,{default:()=>o});const o="precision mediump float;\n\nvarying vec4 v_color;\nvarying float v_border;\n\nconst float radius = 0.5;\nconst vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);\n\nvoid main(void) {\n  vec2 m = gl_PointCoord - vec2(0.5, 0.5);\n  float dist = radius - length(m);\n\n  float t = 0.0;\n  if (dist > v_border)\n    t = 1.0;\n  else if (dist > 0.0)\n    t = dist / v_border;\n\n  gl_FragColor = mix(transparent, v_color, t);\n}\n";module.exports=n})();

/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/shaders/node.fast.vert.glsl.js":
/*!***************************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/shaders/node.fast.vert.glsl.js ***!
  \***************************************************************************/
/***/ ((module) => {

(()=>{"use strict";var o={d:(t,e)=>{for(var n in e)o.o(e,n)&&!o.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},o:(o,t)=>Object.prototype.hasOwnProperty.call(o,t),r:o=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(o,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(o,"__esModule",{value:!0})}},t={};o.r(t),o.d(t,{default:()=>e});const e="attribute vec2 a_position;\nattribute float a_size;\nattribute vec4 a_color;\n\nuniform float u_ratio;\nuniform float u_scale;\nuniform mat3 u_matrix;\n\nvarying vec4 v_color;\nvarying float v_border;\n\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n  gl_Position = vec4(\n    (u_matrix * vec3(a_position, 1)).xy,\n    0,\n    1\n  );\n\n  // Multiply the point size twice:\n  //  - x SCALING_RATIO to correct the canvas scaling\n  //  - x 2 to correct the formulae\n  gl_PointSize = a_size * u_ratio * u_scale * 2.0;\n\n  v_border = (1.0 / u_ratio) * (0.5 / a_size);\n\n  // Extract the color:\n  v_color = a_color;\n  v_color.a *= bias;\n}\n";module.exports=t})();

/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/shaders/utils.js":
/*!*************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/shaders/utils.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * Sigma.js Shader Utils
 * ======================
 *
 * Code used to load sigma's shaders.
 * @module
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadProgram = exports.loadFragmentShader = exports.loadVertexShader = void 0;
/**
 * Function used to load a shader.
 */
function loadShader(type, gl, source) {
    var glType = type === "VERTEX" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
    // Creating the shader
    var shader = gl.createShader(glType);
    if (shader === null) {
        throw new Error("loadShader: error while creating the shader");
    }
    // Loading source
    gl.shaderSource(shader, source);
    // Compiling the shader
    gl.compileShader(shader);
    // Retrieving compilation status
    var successfullyCompiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    // Throwing if something went awry
    if (!successfullyCompiled) {
        var infoLog = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error("loadShader: error while compiling the shader:\n".concat(infoLog, "\n").concat(source));
    }
    return shader;
}
function loadVertexShader(gl, source) {
    return loadShader("VERTEX", gl, source);
}
exports.loadVertexShader = loadVertexShader;
function loadFragmentShader(gl, source) {
    return loadShader("FRAGMENT", gl, source);
}
exports.loadFragmentShader = loadFragmentShader;
/**
 * Function used to load a program.
 */
function loadProgram(gl, shaders) {
    var program = gl.createProgram();
    if (program === null) {
        throw new Error("loadProgram: error while creating the program.");
    }
    var i, l;
    // Attaching the shaders
    for (i = 0, l = shaders.length; i < l; i++)
        gl.attachShader(program, shaders[i]);
    gl.linkProgram(program);
    // Checking status
    var successfullyLinked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!successfullyLinked) {
        gl.deleteProgram(program);
        throw new Error("loadProgram: error while linking the program.");
    }
    return program;
}
exports.loadProgram = loadProgram;


/***/ }),

/***/ "./node_modules/sigma/settings.js":
/*!****************************************!*\
  !*** ./node_modules/sigma/settings.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveSettings = exports.validateSettings = exports.DEFAULT_EDGE_PROGRAM_CLASSES = exports.DEFAULT_NODE_PROGRAM_CLASSES = exports.DEFAULT_SETTINGS = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./node_modules/sigma/utils/index.js");
var label_1 = __importDefault(__webpack_require__(/*! ./rendering/canvas/label */ "./node_modules/sigma/rendering/canvas/label.js"));
var hover_1 = __importDefault(__webpack_require__(/*! ./rendering/canvas/hover */ "./node_modules/sigma/rendering/canvas/hover.js"));
var edge_label_1 = __importDefault(__webpack_require__(/*! ./rendering/canvas/edge-label */ "./node_modules/sigma/rendering/canvas/edge-label.js"));
var node_fast_1 = __importDefault(__webpack_require__(/*! ./rendering/webgl/programs/node.fast */ "./node_modules/sigma/rendering/webgl/programs/node.fast.js"));
var edge_1 = __importDefault(__webpack_require__(/*! ./rendering/webgl/programs/edge */ "./node_modules/sigma/rendering/webgl/programs/edge.js"));
var edge_arrow_1 = __importDefault(__webpack_require__(/*! ./rendering/webgl/programs/edge.arrow */ "./node_modules/sigma/rendering/webgl/programs/edge.arrow.js"));
exports.DEFAULT_SETTINGS = {
    // Performance
    hideEdgesOnMove: false,
    hideLabelsOnMove: false,
    renderLabels: true,
    renderEdgeLabels: false,
    enableEdgeClickEvents: false,
    enableEdgeWheelEvents: false,
    enableEdgeHoverEvents: false,
    // Component rendering
    defaultNodeColor: "#999",
    defaultNodeType: "circle",
    defaultEdgeColor: "#ccc",
    defaultEdgeType: "line",
    labelFont: "Arial",
    labelSize: 14,
    labelWeight: "normal",
    labelColor: { color: "#000" },
    edgeLabelFont: "Arial",
    edgeLabelSize: 14,
    edgeLabelWeight: "normal",
    edgeLabelColor: { attribute: "color" },
    stagePadding: 30,
    // Labels
    labelDensity: 1,
    labelGridCellSize: 100,
    labelRenderedSizeThreshold: 6,
    // Reducers
    nodeReducer: null,
    edgeReducer: null,
    // Features
    zIndex: false,
    minCameraRatio: null,
    maxCameraRatio: null,
    // Renderers
    labelRenderer: label_1.default,
    hoverRenderer: hover_1.default,
    edgeLabelRenderer: edge_label_1.default,
    // Lifecycle
    allowInvalidContainer: false,
    // Program classes
    nodeProgramClasses: {},
    nodeHoverProgramClasses: {},
    edgeProgramClasses: {},
};
exports.DEFAULT_NODE_PROGRAM_CLASSES = {
    circle: node_fast_1.default,
};
exports.DEFAULT_EDGE_PROGRAM_CLASSES = {
    arrow: edge_arrow_1.default,
    line: edge_1.default,
};
function validateSettings(settings) {
    if (typeof settings.labelDensity !== "number" || settings.labelDensity < 0) {
        throw new Error("Settings: invalid `labelDensity`. Expecting a positive number.");
    }
    var minCameraRatio = settings.minCameraRatio, maxCameraRatio = settings.maxCameraRatio;
    if (typeof minCameraRatio === "number" && typeof maxCameraRatio === "number" && maxCameraRatio < minCameraRatio) {
        throw new Error("Settings: invalid camera ratio boundaries. Expecting `maxCameraRatio` to be greater than `minCameraRatio`.");
    }
}
exports.validateSettings = validateSettings;
function resolveSettings(settings) {
    var resolvedSettings = (0, utils_1.assign)({}, exports.DEFAULT_SETTINGS, settings);
    resolvedSettings.nodeProgramClasses = (0, utils_1.assign)({}, exports.DEFAULT_NODE_PROGRAM_CLASSES, resolvedSettings.nodeProgramClasses);
    resolvedSettings.edgeProgramClasses = (0, utils_1.assign)({}, exports.DEFAULT_EDGE_PROGRAM_CLASSES, resolvedSettings.edgeProgramClasses);
    return resolvedSettings;
}
exports.resolveSettings = resolveSettings;


/***/ }),

/***/ "./node_modules/sigma/sigma.js":
/*!*************************************!*\
  !*** ./node_modules/sigma/sigma.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var extend_1 = __importDefault(__webpack_require__(/*! @yomguithereal/helpers/extend */ "./node_modules/@yomguithereal/helpers/extend.js"));
var camera_1 = __importDefault(__webpack_require__(/*! ./core/camera */ "./node_modules/sigma/core/camera.js"));
var mouse_1 = __importDefault(__webpack_require__(/*! ./core/captors/mouse */ "./node_modules/sigma/core/captors/mouse.js"));
var quadtree_1 = __importDefault(__webpack_require__(/*! ./core/quadtree */ "./node_modules/sigma/core/quadtree.js"));
var types_1 = __webpack_require__(/*! ./types */ "./node_modules/sigma/types.js");
var utils_1 = __webpack_require__(/*! ./utils */ "./node_modules/sigma/utils/index.js");
var labels_1 = __webpack_require__(/*! ./core/labels */ "./node_modules/sigma/core/labels.js");
var settings_1 = __webpack_require__(/*! ./settings */ "./node_modules/sigma/settings.js");
var touch_1 = __importDefault(__webpack_require__(/*! ./core/captors/touch */ "./node_modules/sigma/core/captors/touch.js"));
var matrices_1 = __webpack_require__(/*! ./utils/matrices */ "./node_modules/sigma/utils/matrices.js");
var edge_collisions_1 = __webpack_require__(/*! ./utils/edge-collisions */ "./node_modules/sigma/utils/edge-collisions.js");
/**
 * Constants.
 */
var X_LABEL_MARGIN = 150;
var Y_LABEL_MARGIN = 50;
/**
 * Important functions.
 */
function applyNodeDefaults(settings, key, data) {
    if (!data.hasOwnProperty("x") || !data.hasOwnProperty("y"))
        throw new Error("Sigma: could not find a valid position (x, y) for node \"".concat(key, "\". All your nodes must have a number \"x\" and \"y\". Maybe your forgot to apply a layout or your \"nodeReducer\" is not returning the correct data?"));
    if (!data.color)
        data.color = settings.defaultNodeColor;
    if (!data.label && data.label !== "")
        data.label = null;
    if (data.label !== undefined && data.label !== null)
        data.label = "" + data.label;
    else
        data.label = null;
    if (!data.size)
        data.size = 2;
    if (!data.hasOwnProperty("hidden"))
        data.hidden = false;
    if (!data.hasOwnProperty("highlighted"))
        data.highlighted = false;
    if (!data.hasOwnProperty("forceLabel"))
        data.forceLabel = false;
    if (!data.type || data.type === "")
        data.type = settings.defaultNodeType;
    if (!data.zIndex)
        data.zIndex = 0;
    return data;
}
function applyEdgeDefaults(settings, key, data) {
    if (!data.color)
        data.color = settings.defaultEdgeColor;
    if (!data.label)
        data.label = "";
    if (!data.size)
        data.size = 0.5;
    if (!data.hasOwnProperty("hidden"))
        data.hidden = false;
    if (!data.hasOwnProperty("forceLabel"))
        data.forceLabel = false;
    if (!data.type || data.type === "")
        data.type = settings.defaultEdgeType;
    if (!data.zIndex)
        data.zIndex = 0;
    return data;
}
/**
 * Main class.
 *
 * @constructor
 * @param {Graph}       graph     - Graph to render.
 * @param {HTMLElement} container - DOM container in which to render.
 * @param {object}      settings  - Optional settings.
 */
var Sigma = /** @class */ (function (_super) {
    __extends(Sigma, _super);
    function Sigma(graph, container, settings) {
        if (settings === void 0) { settings = {}; }
        var _this = _super.call(this) || this;
        _this.elements = {};
        _this.canvasContexts = {};
        _this.webGLContexts = {};
        _this.activeListeners = {};
        _this.quadtree = new quadtree_1.default();
        _this.labelGrid = new labels_1.LabelGrid();
        _this.nodeDataCache = {};
        _this.edgeDataCache = {};
        _this.nodesWithForcedLabels = [];
        _this.edgesWithForcedLabels = [];
        _this.nodeExtent = { x: [0, 1], y: [0, 1] };
        _this.matrix = (0, matrices_1.identity)();
        _this.invMatrix = (0, matrices_1.identity)();
        _this.correctionRatio = 1;
        _this.customBBox = null;
        _this.normalizationFunction = (0, utils_1.createNormalizationFunction)({
            x: [0, 1],
            y: [0, 1],
        });
        // Cache:
        _this.cameraSizeRatio = 1;
        // Starting dimensions and pixel ratio
        _this.width = 0;
        _this.height = 0;
        _this.pixelRatio = (0, utils_1.getPixelRatio)();
        // State
        _this.displayedLabels = new Set();
        _this.highlightedNodes = new Set();
        _this.hoveredNode = null;
        _this.hoveredEdge = null;
        _this.renderFrame = null;
        _this.renderHighlightedNodesFrame = null;
        _this.needToProcess = false;
        _this.needToSoftProcess = false;
        _this.checkEdgesEventsFrame = null;
        // Programs
        _this.nodePrograms = {};
        _this.nodeHoverPrograms = {};
        _this.edgePrograms = {};
        // Resolving settings
        _this.settings = (0, settings_1.resolveSettings)(settings);
        // Validating
        (0, settings_1.validateSettings)(_this.settings);
        (0, utils_1.validateGraph)(graph);
        if (!(container instanceof HTMLElement))
            throw new Error("Sigma: container should be an html element.");
        // Properties
        _this.graph = graph;
        _this.container = container;
        // Initializing contexts
        _this.createWebGLContext("edges", { preserveDrawingBuffer: true });
        _this.createCanvasContext("edgeLabels");
        _this.createWebGLContext("nodes");
        _this.createCanvasContext("labels");
        _this.createCanvasContext("hovers");
        _this.createWebGLContext("hoverNodes");
        _this.createCanvasContext("mouse");
        // Blending
        for (var key in _this.webGLContexts) {
            var gl = _this.webGLContexts[key];
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.enable(gl.BLEND);
        }
        // Loading programs
        for (var type in _this.settings.nodeProgramClasses) {
            var NodeProgramClass = _this.settings.nodeProgramClasses[type];
            _this.nodePrograms[type] = new NodeProgramClass(_this.webGLContexts.nodes, _this);
            var NodeHoverProgram = NodeProgramClass;
            if (type in _this.settings.nodeHoverProgramClasses) {
                NodeHoverProgram = _this.settings.nodeHoverProgramClasses[type];
            }
            _this.nodeHoverPrograms[type] = new NodeHoverProgram(_this.webGLContexts.hoverNodes, _this);
        }
        for (var type in _this.settings.edgeProgramClasses) {
            var EdgeProgramClass = _this.settings.edgeProgramClasses[type];
            _this.edgePrograms[type] = new EdgeProgramClass(_this.webGLContexts.edges, _this);
        }
        // Initial resize
        _this.resize();
        // Initializing the camera
        _this.camera = new camera_1.default();
        // Binding camera events
        _this.bindCameraHandlers();
        // Initializing captors
        _this.mouseCaptor = new mouse_1.default(_this.elements.mouse, _this);
        _this.touchCaptor = new touch_1.default(_this.elements.mouse, _this);
        // Binding event handlers
        _this.bindEventHandlers();
        // Binding graph handlers
        _this.bindGraphHandlers();
        // Trigger eventual settings-related things
        _this.handleSettingsUpdate();
        // Processing data for the first time & render
        _this.process();
        _this.render();
        return _this;
    }
    /**---------------------------------------------------------------------------
     * Internal methods.
     **---------------------------------------------------------------------------
     */
    /**
     * Internal function used to create a canvas element.
     * @param  {string} id - Context's id.
     * @return {Sigma}
     */
    Sigma.prototype.createCanvas = function (id) {
        var canvas = (0, utils_1.createElement)("canvas", {
            position: "absolute",
        }, {
            class: "sigma-".concat(id),
        });
        this.elements[id] = canvas;
        this.container.appendChild(canvas);
        return canvas;
    };
    /**
     * Internal function used to create a canvas context and add the relevant
     * DOM elements.
     *
     * @param  {string} id - Context's id.
     * @return {Sigma}
     */
    Sigma.prototype.createCanvasContext = function (id) {
        var canvas = this.createCanvas(id);
        var contextOptions = {
            preserveDrawingBuffer: false,
            antialias: false,
        };
        this.canvasContexts[id] = canvas.getContext("2d", contextOptions);
        return this;
    };
    /**
     * Internal function used to create a canvas context and add the relevant
     * DOM elements.
     *
     * @param  {string}  id      - Context's id.
     * @param  {object?} options - #getContext params to override (optional)
     * @return {Sigma}
     */
    Sigma.prototype.createWebGLContext = function (id, options) {
        var canvas = this.createCanvas(id);
        var contextOptions = __assign({ preserveDrawingBuffer: false, antialias: false }, (options || {}));
        var context;
        // First we try webgl2 for an easy performance boost
        context = canvas.getContext("webgl2", contextOptions);
        // Else we fall back to webgl
        if (!context)
            context = canvas.getContext("webgl", contextOptions);
        // Edge, I am looking right at you...
        if (!context)
            context = canvas.getContext("experimental-webgl", contextOptions);
        this.webGLContexts[id] = context;
        return this;
    };
    /**
     * Method binding camera handlers.
     *
     * @return {Sigma}
     */
    Sigma.prototype.bindCameraHandlers = function () {
        var _this = this;
        this.activeListeners.camera = function () {
            _this._scheduleRefresh();
        };
        this.camera.on("updated", this.activeListeners.camera);
        return this;
    };
    /**
     * Method that checks whether or not a node collides with a given position.
     */
    Sigma.prototype.mouseIsOnNode = function (_a, _b, size) {
        var x = _a.x, y = _a.y;
        var nodeX = _b.x, nodeY = _b.y;
        return (x > nodeX - size &&
            x < nodeX + size &&
            y > nodeY - size &&
            y < nodeY + size &&
            Math.sqrt(Math.pow(x - nodeX, 2) + Math.pow(y - nodeY, 2)) < size);
    };
    /**
     * Method that returns all nodes in quad at a given position.
     */
    Sigma.prototype.getQuadNodes = function (position) {
        var mouseGraphPosition = this.viewportToFramedGraph(position);
        return this.quadtree.point(mouseGraphPosition.x, 1 - mouseGraphPosition.y);
    };
    /**
     * Method that returns the closest node to a given position.
     */
    Sigma.prototype.getNodeAtPosition = function (position) {
        var x = position.x, y = position.y;
        var quadNodes = this.getQuadNodes(position);
        // We will hover the node whose center is closest to mouse
        var minDistance = Infinity, nodeAtPosition = null;
        for (var i = 0, l = quadNodes.length; i < l; i++) {
            var node = quadNodes[i];
            var data = this.nodeDataCache[node];
            var nodePosition = this.framedGraphToViewport(data);
            var size = this.scaleSize(data.size);
            if (!data.hidden && this.mouseIsOnNode(position, nodePosition, size)) {
                var distance = Math.sqrt(Math.pow(x - nodePosition.x, 2) + Math.pow(y - nodePosition.y, 2));
                // TODO: sort by min size also for cases where center is the same
                if (distance < minDistance) {
                    minDistance = distance;
                    nodeAtPosition = node;
                }
            }
        }
        return nodeAtPosition;
    };
    /**
     * Method binding event handlers.
     *
     * @return {Sigma}
     */
    Sigma.prototype.bindEventHandlers = function () {
        var _this = this;
        // Handling window resize
        this.activeListeners.handleResize = function () {
            _this.needToSoftProcess = true;
            _this._scheduleRefresh();
        };
        window.addEventListener("resize", this.activeListeners.handleResize);
        // Handling mouse move
        this.activeListeners.handleMove = function (e) {
            var baseEvent = {
                event: e,
                preventSigmaDefault: function () {
                    e.preventSigmaDefault();
                },
            };
            var nodeToHover = _this.getNodeAtPosition(e);
            if (nodeToHover && _this.hoveredNode !== nodeToHover && !_this.nodeDataCache[nodeToHover].hidden) {
                // Handling passing from one node to the other directly
                if (_this.hoveredNode)
                    _this.emit("leaveNode", __assign(__assign({}, baseEvent), { node: _this.hoveredNode }));
                _this.hoveredNode = nodeToHover;
                _this.emit("enterNode", __assign(__assign({}, baseEvent), { node: nodeToHover }));
                _this.scheduleHighlightedNodesRender();
                return;
            }
            // Checking if the hovered node is still hovered
            if (_this.hoveredNode) {
                var data = _this.nodeDataCache[_this.hoveredNode];
                var pos = _this.framedGraphToViewport(data);
                var size = _this.scaleSize(data.size);
                if (!_this.mouseIsOnNode(e, pos, size)) {
                    var node = _this.hoveredNode;
                    _this.hoveredNode = null;
                    _this.emit("leaveNode", __assign(__assign({}, baseEvent), { node: node }));
                    _this.scheduleHighlightedNodesRender();
                    return;
                }
            }
            if (_this.settings.enableEdgeHoverEvents === true) {
                _this.checkEdgeHoverEvents(baseEvent);
            }
            else if (_this.settings.enableEdgeHoverEvents === "debounce") {
                if (!_this.checkEdgesEventsFrame)
                    _this.checkEdgesEventsFrame = (0, utils_1.requestFrame)(function () {
                        _this.checkEdgeHoverEvents(baseEvent);
                        _this.checkEdgesEventsFrame = null;
                    });
            }
        };
        // Handling click
        var createMouseListener = function (eventType) {
            return function (e) {
                var baseEvent = {
                    event: e,
                    preventSigmaDefault: function () {
                        e.preventSigmaDefault();
                    },
                };
                var isFakeSigmaMouseEvent = e.original.isFakeSigmaMouseEvent;
                var nodeAtPosition = isFakeSigmaMouseEvent ? _this.getNodeAtPosition(e) : _this.hoveredNode;
                if (nodeAtPosition)
                    return _this.emit("".concat(eventType, "Node"), __assign(__assign({}, baseEvent), { node: nodeAtPosition }));
                if (eventType === "wheel" ? _this.settings.enableEdgeWheelEvents : _this.settings.enableEdgeClickEvents) {
                    var edge = _this.getEdgeAtPoint(e.x, e.y);
                    if (edge)
                        return _this.emit("".concat(eventType, "Edge"), __assign(__assign({}, baseEvent), { edge: edge }));
                }
                return _this.emit("".concat(eventType, "Stage"), baseEvent);
            };
        };
        this.activeListeners.handleClick = createMouseListener("click");
        this.activeListeners.handleRightClick = createMouseListener("rightClick");
        this.activeListeners.handleDoubleClick = createMouseListener("doubleClick");
        this.activeListeners.handleWheel = createMouseListener("wheel");
        this.activeListeners.handleDown = createMouseListener("down");
        this.mouseCaptor.on("mousemove", this.activeListeners.handleMove);
        this.mouseCaptor.on("click", this.activeListeners.handleClick);
        this.mouseCaptor.on("rightClick", this.activeListeners.handleRightClick);
        this.mouseCaptor.on("doubleClick", this.activeListeners.handleDoubleClick);
        this.mouseCaptor.on("wheel", this.activeListeners.handleWheel);
        this.mouseCaptor.on("mousedown", this.activeListeners.handleDown);
        // TODO
        // Deal with Touch captor events
        return this;
    };
    /**
     * Method binding graph handlers
     *
     * @return {Sigma}
     */
    Sigma.prototype.bindGraphHandlers = function () {
        var _this = this;
        var graph = this.graph;
        this.activeListeners.graphUpdate = function () {
            _this.needToProcess = true;
            _this._scheduleRefresh();
        };
        this.activeListeners.softGraphUpdate = function () {
            _this.needToSoftProcess = true;
            _this._scheduleRefresh();
        };
        this.activeListeners.dropNodeGraphUpdate = function (e) {
            delete _this.nodeDataCache[e.key];
            if (_this.hoveredNode === e.key)
                _this.hoveredNode = null;
            _this.activeListeners.graphUpdate();
        };
        this.activeListeners.dropEdgeGraphUpdate = function (e) {
            delete _this.edgeDataCache[e.key];
            if (_this.hoveredEdge === e.key)
                _this.hoveredEdge = null;
            _this.activeListeners.graphUpdate();
        };
        this.activeListeners.clearEdgesGraphUpdate = function () {
            _this.edgeDataCache = {};
            _this.hoveredEdge = null;
            _this.activeListeners.graphUpdate();
        };
        this.activeListeners.clearGraphUpdate = function () {
            _this.nodeDataCache = {};
            _this.hoveredNode = null;
            _this.activeListeners.clearEdgesGraphUpdate();
        };
        graph.on("nodeAdded", this.activeListeners.graphUpdate);
        graph.on("nodeDropped", this.activeListeners.dropNodeGraphUpdate);
        graph.on("nodeAttributesUpdated", this.activeListeners.softGraphUpdate);
        graph.on("eachNodeAttributesUpdated", this.activeListeners.graphUpdate);
        graph.on("edgeAdded", this.activeListeners.graphUpdate);
        graph.on("edgeDropped", this.activeListeners.dropEdgeGraphUpdate);
        graph.on("edgeAttributesUpdated", this.activeListeners.softGraphUpdate);
        graph.on("eachEdgeAttributesUpdated", this.activeListeners.graphUpdate);
        graph.on("edgesCleared", this.activeListeners.clearEdgesGraphUpdate);
        graph.on("cleared", this.activeListeners.clearGraphUpdate);
        return this;
    };
    /**
     * Method used to unbind handlers from the graph.
     *
     * @return {undefined}
     */
    Sigma.prototype.unbindGraphHandlers = function () {
        var graph = this.graph;
        graph.removeListener("nodeAdded", this.activeListeners.graphUpdate);
        graph.removeListener("nodeDropped", this.activeListeners.dropNodeGraphUpdate);
        graph.removeListener("nodeAttributesUpdated", this.activeListeners.softGraphUpdate);
        graph.removeListener("eachNodeAttributesUpdated", this.activeListeners.graphUpdate);
        graph.removeListener("edgeAdded", this.activeListeners.graphUpdate);
        graph.removeListener("edgeDropped", this.activeListeners.dropEdgeGraphUpdate);
        graph.removeListener("edgeAttributesUpdated", this.activeListeners.softGraphUpdate);
        graph.removeListener("eachEdgeAttributesUpdated", this.activeListeners.graphUpdate);
        graph.removeListener("edgesCleared", this.activeListeners.clearEdgesGraphUpdate);
        graph.removeListener("cleared", this.activeListeners.clearGraphUpdate);
    };
    /**
     * Method dealing with "leaveEdge" and "enterEdge" events.
     *
     * @return {Sigma}
     */
    Sigma.prototype.checkEdgeHoverEvents = function (payload) {
        var edgeToHover = this.hoveredNode ? null : this.getEdgeAtPoint(payload.event.x, payload.event.y);
        if (edgeToHover !== this.hoveredEdge) {
            if (this.hoveredEdge)
                this.emit("leaveEdge", __assign(__assign({}, payload), { edge: this.hoveredEdge }));
            if (edgeToHover)
                this.emit("enterEdge", __assign(__assign({}, payload), { edge: edgeToHover }));
            this.hoveredEdge = edgeToHover;
        }
        return this;
    };
    /**
     * Method looking for an edge colliding with a given point at (x, y). Returns
     * the key of the edge if any, or null else.
     */
    Sigma.prototype.getEdgeAtPoint = function (x, y) {
        var e_1, _a;
        var _this = this;
        var _b = this, edgeDataCache = _b.edgeDataCache, nodeDataCache = _b.nodeDataCache;
        // Check first that pixel is colored:
        // Note that mouse positions must be corrected by pixel ratio to correctly
        // index the drawing buffer.
        if (!(0, edge_collisions_1.isPixelColored)(this.webGLContexts.edges, x * this.pixelRatio, y * this.pixelRatio))
            return null;
        // Check for each edge if it collides with the point:
        var _c = this.viewportToGraph({ x: x, y: y }), graphX = _c.x, graphY = _c.y;
        // To translate edge thicknesses to the graph system, we observe by how much
        // the length of a non-null edge is transformed to between the graph system
        // and the viewport system:
        var transformationRatio = 0;
        this.graph.someEdge(function (key, _, sourceId, targetId, _a, _b) {
            var xs = _a.x, ys = _a.y;
            var xt = _b.x, yt = _b.y;
            if (edgeDataCache[key].hidden || nodeDataCache[sourceId].hidden || nodeDataCache[targetId].hidden)
                return false;
            if (xs !== xt || ys !== yt) {
                var graphLength = Math.sqrt(Math.pow(xt - xs, 2) + Math.pow(yt - ys, 2));
                var _c = _this.graphToViewport({ x: xs, y: ys }), vp_xs = _c.x, vp_ys = _c.y;
                var _d = _this.graphToViewport({ x: xt, y: yt }), vp_xt = _d.x, vp_yt = _d.y;
                var viewportLength = Math.sqrt(Math.pow(vp_xt - vp_xs, 2) + Math.pow(vp_yt - vp_ys, 2));
                transformationRatio = graphLength / viewportLength;
                return true;
            }
        });
        // If no non-null edge has been found, return null:
        if (!transformationRatio)
            return null;
        // Now we can look for matching edges:
        var edges = this.graph.filterEdges(function (key, edgeAttributes, sourceId, targetId, sourcePosition, targetPosition) {
            if (edgeDataCache[key].hidden || nodeDataCache[sourceId].hidden || nodeDataCache[targetId].hidden)
                return false;
            if ((0, edge_collisions_1.doEdgeCollideWithPoint)(graphX, graphY, sourcePosition.x, sourcePosition.y, targetPosition.x, targetPosition.y, 
            // Adapt the edge size to the zoom ratio:
            (edgeDataCache[key].size * transformationRatio) / _this.cameraSizeRatio)) {
                return true;
            }
        });
        if (edges.length === 0)
            return null; // no edges found
        // if none of the edges have a zIndex, selected the most recently created one to match the rendering order
        var selectedEdge = edges[edges.length - 1];
        // otherwise select edge with highest zIndex
        var highestZIndex = -Infinity;
        try {
            for (var edges_1 = __values(edges), edges_1_1 = edges_1.next(); !edges_1_1.done; edges_1_1 = edges_1.next()) {
                var edge = edges_1_1.value;
                var zIndex = this.graph.getEdgeAttribute(edge, "zIndex");
                if (zIndex >= highestZIndex) {
                    selectedEdge = edge;
                    highestZIndex = zIndex;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (edges_1_1 && !edges_1_1.done && (_a = edges_1.return)) _a.call(edges_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return selectedEdge;
    };
    /**
     * Method used to process the whole graph's data.
     *
     * @return {Sigma}
     */
    Sigma.prototype.process = function (keepArrays) {
        var _this = this;
        if (keepArrays === void 0) { keepArrays = false; }
        var graph = this.graph;
        var settings = this.settings;
        var dimensions = this.getDimensions();
        var nodeZExtent = [Infinity, -Infinity];
        var edgeZExtent = [Infinity, -Infinity];
        // Clearing the quad
        this.quadtree.clear();
        // Resetting the label grid
        // TODO: it's probably better to do this explicitly or on resizes for layout and anims
        this.labelGrid.resizeAndClear(dimensions, settings.labelGridCellSize);
        // Clear the highlightedNodes
        this.highlightedNodes = new Set();
        // Computing extents
        this.nodeExtent = (0, utils_1.graphExtent)(graph);
        // Resetting `forceLabel` indices
        this.nodesWithForcedLabels = [];
        this.edgesWithForcedLabels = [];
        // NOTE: it is important to compute this matrix after computing the node's extent
        // because #.getGraphDimensions relies on it
        var nullCamera = new camera_1.default();
        var nullCameraMatrix = (0, utils_1.matrixFromCamera)(nullCamera.getState(), this.getDimensions(), this.getGraphDimensions(), this.getSetting("stagePadding") || 0);
        // Rescaling function
        this.normalizationFunction = (0, utils_1.createNormalizationFunction)(this.customBBox || this.nodeExtent);
        var nodesPerPrograms = {};
        var nodes = graph.nodes();
        for (var i = 0, l = nodes.length; i < l; i++) {
            var node = nodes[i];
            // Node display data resolution:
            //   1. First we get the node's attributes
            //   2. We optionally reduce them using the function provided by the user
            //      Note that this function must return a total object and won't be merged
            //   3. We apply our defaults, while running some vital checks
            //   4. We apply the normalization function
            // We shallow copy node data to avoid dangerous behaviors from reducers
            var attr = Object.assign({}, graph.getNodeAttributes(node));
            if (settings.nodeReducer)
                attr = settings.nodeReducer(node, attr);
            var data = applyNodeDefaults(this.settings, node, attr);
            nodesPerPrograms[data.type] = (nodesPerPrograms[data.type] || 0) + 1;
            this.nodeDataCache[node] = data;
            this.normalizationFunction.applyTo(data);
            if (data.forceLabel)
                this.nodesWithForcedLabels.push(node);
            if (this.settings.zIndex) {
                if (data.zIndex < nodeZExtent[0])
                    nodeZExtent[0] = data.zIndex;
                if (data.zIndex > nodeZExtent[1])
                    nodeZExtent[1] = data.zIndex;
            }
        }
        for (var type in this.nodePrograms) {
            if (!this.nodePrograms.hasOwnProperty(type)) {
                throw new Error("Sigma: could not find a suitable program for node type \"".concat(type, "\"!"));
            }
            if (!keepArrays)
                this.nodePrograms[type].allocate(nodesPerPrograms[type] || 0);
            // We reset that count here, so that we can reuse it while calling the Program#process methods:
            nodesPerPrograms[type] = 0;
        }
        // Handling node z-index
        // TODO: z-index needs us to compute display data before hand
        if (this.settings.zIndex && nodeZExtent[0] !== nodeZExtent[1])
            nodes = (0, utils_1.zIndexOrdering)(nodeZExtent, function (node) { return _this.nodeDataCache[node].zIndex; }, nodes);
        for (var i = 0, l = nodes.length; i < l; i++) {
            var node = nodes[i];
            var data = this.nodeDataCache[node];
            this.quadtree.add(node, data.x, 1 - data.y, data.size / this.width);
            if (typeof data.label === "string" && !data.hidden)
                this.labelGrid.add(node, data.size, this.framedGraphToViewport(data, { matrix: nullCameraMatrix }));
            var nodeProgram = this.nodePrograms[data.type];
            if (!nodeProgram)
                throw new Error("Sigma: could not find a suitable program for node type \"".concat(data.type, "\"!"));
            nodeProgram.process(data, data.hidden, nodesPerPrograms[data.type]++);
            // Save the node in the highlighted set if needed
            if (data.highlighted && !data.hidden)
                this.highlightedNodes.add(node);
        }
        this.labelGrid.organize();
        var edgesPerPrograms = {};
        var edges = graph.edges();
        for (var i = 0, l = edges.length; i < l; i++) {
            var edge = edges[i];
            // Edge display data resolution:
            //   1. First we get the edge's attributes
            //   2. We optionally reduce them using the function provided by the user
            //      Note that this function must return a total object and won't be merged
            //   3. We apply our defaults, while running some vital checks
            // We shallow copy edge data to avoid dangerous behaviors from reducers
            var attr = Object.assign({}, graph.getEdgeAttributes(edge));
            if (settings.edgeReducer)
                attr = settings.edgeReducer(edge, attr);
            var data = applyEdgeDefaults(this.settings, edge, attr);
            edgesPerPrograms[data.type] = (edgesPerPrograms[data.type] || 0) + 1;
            this.edgeDataCache[edge] = data;
            if (data.forceLabel && !data.hidden)
                this.edgesWithForcedLabels.push(edge);
            if (this.settings.zIndex) {
                if (data.zIndex < edgeZExtent[0])
                    edgeZExtent[0] = data.zIndex;
                if (data.zIndex > edgeZExtent[1])
                    edgeZExtent[1] = data.zIndex;
            }
        }
        for (var type in this.edgePrograms) {
            if (!this.edgePrograms.hasOwnProperty(type)) {
                throw new Error("Sigma: could not find a suitable program for edge type \"".concat(type, "\"!"));
            }
            if (!keepArrays)
                this.edgePrograms[type].allocate(edgesPerPrograms[type] || 0);
            // We reset that count here, so that we can reuse it while calling the Program#process methods:
            edgesPerPrograms[type] = 0;
        }
        // Handling edge z-index
        if (this.settings.zIndex && edgeZExtent[0] !== edgeZExtent[1])
            edges = (0, utils_1.zIndexOrdering)(edgeZExtent, function (edge) { return _this.edgeDataCache[edge].zIndex; }, edges);
        for (var i = 0, l = edges.length; i < l; i++) {
            var edge = edges[i];
            var data = this.edgeDataCache[edge];
            var extremities = graph.extremities(edge), sourceData = this.nodeDataCache[extremities[0]], targetData = this.nodeDataCache[extremities[1]];
            var hidden = data.hidden || sourceData.hidden || targetData.hidden;
            this.edgePrograms[data.type].process(sourceData, targetData, data, hidden, edgesPerPrograms[data.type]++);
        }
        for (var type in this.edgePrograms) {
            var program = this.edgePrograms[type];
            if (!keepArrays && typeof program.computeIndices === "function")
                program.computeIndices();
        }
        return this;
    };
    /**
     * Method that backports potential settings updates where it's needed.
     * @private
     */
    Sigma.prototype.handleSettingsUpdate = function () {
        this.camera.minRatio = this.settings.minCameraRatio;
        this.camera.maxRatio = this.settings.maxCameraRatio;
        this.camera.setState(this.camera.validateState(this.camera.getState()));
        return this;
    };
    /**
     * Method that decides whether to reprocess graph or not, and then render the
     * graph.
     *
     * @return {Sigma}
     */
    Sigma.prototype._refresh = function () {
        // Do we need to process data?
        if (this.needToProcess) {
            this.process();
        }
        else if (this.needToSoftProcess) {
            this.process(true);
        }
        // Resetting state
        this.needToProcess = false;
        this.needToSoftProcess = false;
        // Rendering
        this.render();
        return this;
    };
    /**
     * Method that schedules a `_refresh` call if none has been scheduled yet. It
     * will then be processed next available frame.
     *
     * @return {Sigma}
     */
    Sigma.prototype._scheduleRefresh = function () {
        var _this = this;
        if (!this.renderFrame) {
            this.renderFrame = (0, utils_1.requestFrame)(function () {
                _this._refresh();
                _this.renderFrame = null;
            });
        }
        return this;
    };
    /**
     * Method used to render labels.
     *
     * @return {Sigma}
     */
    Sigma.prototype.renderLabels = function () {
        if (!this.settings.renderLabels)
            return this;
        var cameraState = this.camera.getState();
        // Selecting labels to draw
        var labelsToDisplay = this.labelGrid.getLabelsToDisplay(cameraState.ratio, this.settings.labelDensity);
        (0, extend_1.default)(labelsToDisplay, this.nodesWithForcedLabels);
        this.displayedLabels = new Set();
        // Drawing labels
        var context = this.canvasContexts.labels;
        for (var i = 0, l = labelsToDisplay.length; i < l; i++) {
            var node = labelsToDisplay[i];
            var data = this.nodeDataCache[node];
            // If the node was already drawn (like if it is eligible AND has
            // `forceLabel`), we don't want to draw it again
            // NOTE: we can do better probably
            if (this.displayedLabels.has(node))
                continue;
            // If the node is hidden, we don't need to display its label obviously
            if (data.hidden)
                continue;
            var _a = this.framedGraphToViewport(data), x = _a.x, y = _a.y;
            // NOTE: we can cache the labels we need to render until the camera's ratio changes
            var size = this.scaleSize(data.size);
            // Is node big enough?
            if (!data.forceLabel && size < this.settings.labelRenderedSizeThreshold)
                continue;
            // Is node actually on screen (with some margin)
            // NOTE: we used to rely on the quadtree for this, but the coordinates
            // conversion make it unreliable and at that point we already converted
            // to viewport coordinates and since the label grid already culls the
            // number of potential labels to display this looks like a good
            // performance compromise.
            // NOTE: labelGrid.getLabelsToDisplay could probably optimize by not
            // considering cells obviously outside of the range of the current
            // view rectangle.
            if (x < -X_LABEL_MARGIN ||
                x > this.width + X_LABEL_MARGIN ||
                y < -Y_LABEL_MARGIN ||
                y > this.height + Y_LABEL_MARGIN)
                continue;
            // Because displayed edge labels depend directly on actually rendered node
            // labels, we need to only add to this.displayedLabels nodes whose label
            // is rendered.
            // This makes this.displayedLabels depend on viewport, which might become
            // an issue once we start memoizing getLabelsToDisplay.
            this.displayedLabels.add(node);
            this.settings.labelRenderer(context, __assign(__assign({ key: node }, data), { size: size, x: x, y: y }), this.settings);
        }
        return this;
    };
    /**
     * Method used to render edge labels, based on which node labels were
     * rendered.
     *
     * @return {Sigma}
     */
    Sigma.prototype.renderEdgeLabels = function () {
        if (!this.settings.renderEdgeLabels)
            return this;
        var context = this.canvasContexts.edgeLabels;
        // Clearing
        context.clearRect(0, 0, this.width, this.height);
        var edgeLabelsToDisplay = (0, labels_1.edgeLabelsToDisplayFromNodes)({
            graph: this.graph,
            hoveredNode: this.hoveredNode,
            displayedNodeLabels: this.displayedLabels,
            highlightedNodes: this.highlightedNodes,
        }).concat(this.edgesWithForcedLabels);
        var displayedLabels = new Set();
        for (var i = 0, l = edgeLabelsToDisplay.length; i < l; i++) {
            var edge = edgeLabelsToDisplay[i], extremities = this.graph.extremities(edge), sourceData = this.nodeDataCache[extremities[0]], targetData = this.nodeDataCache[extremities[1]], edgeData = this.edgeDataCache[edge];
            // If the edge was already drawn (like if it is eligible AND has
            // `forceLabel`), we don't want to draw it again
            if (displayedLabels.has(edge))
                continue;
            // If the edge is hidden we don't need to display its label
            // NOTE: the test on sourceData & targetData is probably paranoid at this point?
            if (edgeData.hidden || sourceData.hidden || targetData.hidden) {
                continue;
            }
            this.settings.edgeLabelRenderer(context, __assign(__assign({ key: edge }, edgeData), { size: this.scaleSize(edgeData.size) }), __assign(__assign(__assign({ key: extremities[0] }, sourceData), this.framedGraphToViewport(sourceData)), { size: this.scaleSize(sourceData.size) }), __assign(__assign(__assign({ key: extremities[1] }, targetData), this.framedGraphToViewport(targetData)), { size: this.scaleSize(targetData.size) }), this.settings);
            displayedLabels.add(edge);
        }
        return this;
    };
    /**
     * Method used to render the highlighted nodes.
     *
     * @return {Sigma}
     */
    Sigma.prototype.renderHighlightedNodes = function () {
        var _this = this;
        var context = this.canvasContexts.hovers;
        // Clearing
        context.clearRect(0, 0, this.width, this.height);
        // Rendering
        var render = function (node) {
            var data = _this.nodeDataCache[node];
            var _a = _this.framedGraphToViewport(data), x = _a.x, y = _a.y;
            var size = _this.scaleSize(data.size);
            _this.settings.hoverRenderer(context, __assign(__assign({ key: node }, data), { size: size, x: x, y: y }), _this.settings);
        };
        var nodesToRender = [];
        if (this.hoveredNode && !this.nodeDataCache[this.hoveredNode].hidden) {
            nodesToRender.push(this.hoveredNode);
        }
        this.highlightedNodes.forEach(function (node) {
            // The hovered node has already been highlighted
            if (node !== _this.hoveredNode)
                nodesToRender.push(node);
        });
        // Draw labels:
        nodesToRender.forEach(function (node) { return render(node); });
        // Draw WebGL nodes on top of the labels:
        var nodesPerPrograms = {};
        // 1. Count nodes per type:
        nodesToRender.forEach(function (node) {
            var type = _this.nodeDataCache[node].type;
            nodesPerPrograms[type] = (nodesPerPrograms[type] || 0) + 1;
        });
        // 2. Allocate for each type for the proper number of nodes
        for (var type in this.nodeHoverPrograms) {
            this.nodeHoverPrograms[type].allocate(nodesPerPrograms[type] || 0);
            // Also reset count, to use when rendering:
            nodesPerPrograms[type] = 0;
        }
        // 3. Process all nodes to render:
        nodesToRender.forEach(function (node) {
            var data = _this.nodeDataCache[node];
            _this.nodeHoverPrograms[data.type].process(data, data.hidden, nodesPerPrograms[data.type]++);
        });
        // 4. Clear hovered nodes layer:
        this.webGLContexts.hoverNodes.clear(this.webGLContexts.hoverNodes.COLOR_BUFFER_BIT);
        // 5. Render:
        for (var type in this.nodeHoverPrograms) {
            var program = this.nodeHoverPrograms[type];
            program.bind();
            program.bufferData();
            program.render({
                matrix: this.matrix,
                width: this.width,
                height: this.height,
                ratio: this.camera.ratio,
                correctionRatio: this.correctionRatio / this.camera.ratio,
                scalingRatio: this.pixelRatio,
            });
        }
    };
    /**
     * Method used to schedule a hover render.
     *
     */
    Sigma.prototype.scheduleHighlightedNodesRender = function () {
        var _this = this;
        if (this.renderHighlightedNodesFrame || this.renderFrame)
            return;
        this.renderHighlightedNodesFrame = (0, utils_1.requestFrame)(function () {
            // Resetting state
            _this.renderHighlightedNodesFrame = null;
            // Rendering
            _this.renderHighlightedNodes();
            _this.renderEdgeLabels();
        });
    };
    /**
     * Method used to render.
     *
     * @return {Sigma}
     */
    Sigma.prototype.render = function () {
        var _this = this;
        this.emit("beforeRender");
        var exitRender = function () {
            _this.emit("afterRender");
            return _this;
        };
        // If a render was scheduled, we cancel it
        if (this.renderFrame) {
            (0, utils_1.cancelFrame)(this.renderFrame);
            this.renderFrame = null;
            this.needToProcess = false;
            this.needToSoftProcess = false;
        }
        // First we need to resize
        this.resize();
        // Clearing the canvases
        this.clear();
        // Recomputing useful camera-related values:
        this.updateCachedValues();
        // If we have no nodes we can stop right there
        if (!this.graph.order)
            return exitRender();
        // TODO: improve this heuristic or move to the captor itself?
        // TODO: deal with the touch captor here as well
        var mouseCaptor = this.mouseCaptor;
        var moving = this.camera.isAnimated() ||
            mouseCaptor.isMoving ||
            mouseCaptor.draggedEvents ||
            mouseCaptor.currentWheelDirection;
        // Then we need to extract a matrix from the camera
        var cameraState = this.camera.getState();
        var viewportDimensions = this.getDimensions();
        var graphDimensions = this.getGraphDimensions();
        var padding = this.getSetting("stagePadding") || 0;
        this.matrix = (0, utils_1.matrixFromCamera)(cameraState, viewportDimensions, graphDimensions, padding);
        this.invMatrix = (0, utils_1.matrixFromCamera)(cameraState, viewportDimensions, graphDimensions, padding, true);
        this.correctionRatio = (0, utils_1.getMatrixImpact)(this.matrix, cameraState, viewportDimensions);
        // Drawing nodes
        for (var type in this.nodePrograms) {
            var program = this.nodePrograms[type];
            program.bind();
            program.bufferData();
            program.render({
                matrix: this.matrix,
                width: this.width,
                height: this.height,
                ratio: cameraState.ratio,
                correctionRatio: this.correctionRatio / cameraState.ratio,
                scalingRatio: this.pixelRatio,
            });
        }
        // Drawing edges
        if (!this.settings.hideEdgesOnMove || !moving) {
            for (var type in this.edgePrograms) {
                var program = this.edgePrograms[type];
                program.bind();
                program.bufferData();
                program.render({
                    matrix: this.matrix,
                    width: this.width,
                    height: this.height,
                    ratio: cameraState.ratio,
                    correctionRatio: this.correctionRatio / cameraState.ratio,
                    scalingRatio: this.pixelRatio,
                });
            }
        }
        // Do not display labels on move per setting
        if (this.settings.hideLabelsOnMove && moving)
            return exitRender();
        this.renderLabels();
        this.renderEdgeLabels();
        this.renderHighlightedNodes();
        return exitRender();
    };
    /**
     * Internal method used to update expensive and therefore cached values
     * each time the camera state is updated.
     */
    Sigma.prototype.updateCachedValues = function () {
        var ratio = this.camera.getState().ratio;
        this.cameraSizeRatio = Math.sqrt(ratio);
    };
    /**---------------------------------------------------------------------------
     * Public API.
     **---------------------------------------------------------------------------
     */
    /**
     * Method returning the renderer's camera.
     *
     * @return {Camera}
     */
    Sigma.prototype.getCamera = function () {
        return this.camera;
    };
    /**
     * Method returning the container DOM element.
     *
     * @return {HTMLElement}
     */
    Sigma.prototype.getContainer = function () {
        return this.container;
    };
    /**
     * Method returning the renderer's graph.
     *
     * @return {Graph}
     */
    Sigma.prototype.getGraph = function () {
        return this.graph;
    };
    /**
     * Method used to set the renderer's graph.
     *
     * @return {Graph}
     */
    Sigma.prototype.setGraph = function (graph) {
        if (graph === this.graph)
            return;
        // Unbinding handlers on the current graph
        this.unbindGraphHandlers();
        // Clearing the graph data caches
        this.nodeDataCache = {};
        this.edgeDataCache = {};
        // Cleaning renderer state tied to the current graph
        this.displayedLabels.clear();
        this.highlightedNodes.clear();
        this.hoveredNode = null;
        this.hoveredEdge = null;
        this.nodesWithForcedLabels.length = 0;
        this.edgesWithForcedLabels.length = 0;
        if (this.checkEdgesEventsFrame !== null) {
            (0, utils_1.cancelFrame)(this.checkEdgesEventsFrame);
            this.checkEdgesEventsFrame = null;
        }
        // Installing new graph
        this.graph = graph;
        // Binding new handlers
        this.bindGraphHandlers();
        // Re-rendering now to avoid discrepancies from now to next frame
        this.process();
        this.render();
    };
    /**
     * Method returning the mouse captor.
     *
     * @return {MouseCaptor}
     */
    Sigma.prototype.getMouseCaptor = function () {
        return this.mouseCaptor;
    };
    /**
     * Method returning the touch captor.
     *
     * @return {TouchCaptor}
     */
    Sigma.prototype.getTouchCaptor = function () {
        return this.touchCaptor;
    };
    /**
     * Method returning the current renderer's dimensions.
     *
     * @return {Dimensions}
     */
    Sigma.prototype.getDimensions = function () {
        return { width: this.width, height: this.height };
    };
    /**
     * Method returning the current graph's dimensions.
     *
     * @return {Dimensions}
     */
    Sigma.prototype.getGraphDimensions = function () {
        var extent = this.customBBox || this.nodeExtent;
        return {
            width: extent.x[1] - extent.x[0] || 1,
            height: extent.y[1] - extent.y[0] || 1,
        };
    };
    /**
     * Method used to get all the sigma node attributes.
     * It's usefull for example to get the position of a node
     * and to get values that are set by the nodeReducer
     *
     * @param  {string} key - The node's key.
     * @return {NodeDisplayData | undefined} A copy of the desired node's attribute or undefined if not found
     */
    Sigma.prototype.getNodeDisplayData = function (key) {
        var node = this.nodeDataCache[key];
        return node ? Object.assign({}, node) : undefined;
    };
    /**
     * Method used to get all the sigma edge attributes.
     * It's usefull for example to get values that are set by the edgeReducer.
     *
     * @param  {string} key - The edge's key.
     * @return {EdgeDisplayData | undefined} A copy of the desired edge's attribute or undefined if not found
     */
    Sigma.prototype.getEdgeDisplayData = function (key) {
        var edge = this.edgeDataCache[key];
        return edge ? Object.assign({}, edge) : undefined;
    };
    /**
     * Method returning a copy of the settings collection.
     *
     * @return {Settings} A copy of the settings collection.
     */
    Sigma.prototype.getSettings = function () {
        return __assign({}, this.settings);
    };
    /**
     * Method returning the current value for a given setting key.
     *
     * @param  {string} key - The setting key to get.
     * @return {any} The value attached to this setting key or undefined if not found
     */
    Sigma.prototype.getSetting = function (key) {
        return this.settings[key];
    };
    /**
     * Method setting the value of a given setting key. Note that this will schedule
     * a new render next frame.
     *
     * @param  {string} key - The setting key to set.
     * @param  {any}    value - The value to set.
     * @return {Sigma}
     */
    Sigma.prototype.setSetting = function (key, value) {
        this.settings[key] = value;
        (0, settings_1.validateSettings)(this.settings);
        this.handleSettingsUpdate();
        this.needToProcess = true; // TODO: some keys may work with only needToSoftProcess or even nothing
        this._scheduleRefresh();
        return this;
    };
    /**
     * Method updating the value of a given setting key using the provided function.
     * Note that this will schedule a new render next frame.
     *
     * @param  {string}   key     - The setting key to set.
     * @param  {function} updater - The update function.
     * @return {Sigma}
     */
    Sigma.prototype.updateSetting = function (key, updater) {
        this.settings[key] = updater(this.settings[key]);
        (0, settings_1.validateSettings)(this.settings);
        this.handleSettingsUpdate();
        this.needToProcess = true; // TODO: some keys may work with only needToSoftProcess or even nothing
        this._scheduleRefresh();
        return this;
    };
    /**
     * Method used to resize the renderer.
     *
     * @return {Sigma}
     */
    Sigma.prototype.resize = function () {
        var previousWidth = this.width, previousHeight = this.height;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.pixelRatio = (0, utils_1.getPixelRatio)();
        if (this.width === 0) {
            if (this.settings.allowInvalidContainer)
                this.width = 1;
            else
                throw new Error("Sigma: Container has no width. You can set the allowInvalidContainer setting to true to stop seeing this error.");
        }
        if (this.height === 0) {
            if (this.settings.allowInvalidContainer)
                this.height = 1;
            else
                throw new Error("Sigma: Container has no height. You can set the allowInvalidContainer setting to true to stop seeing this error.");
        }
        // If nothing has changed, we can stop right here
        if (previousWidth === this.width && previousHeight === this.height)
            return this;
        this.emit("resize");
        // Sizing dom elements
        for (var id in this.elements) {
            var element = this.elements[id];
            element.style.width = this.width + "px";
            element.style.height = this.height + "px";
        }
        // Sizing canvas contexts
        for (var id in this.canvasContexts) {
            this.elements[id].setAttribute("width", this.width * this.pixelRatio + "px");
            this.elements[id].setAttribute("height", this.height * this.pixelRatio + "px");
            if (this.pixelRatio !== 1)
                this.canvasContexts[id].scale(this.pixelRatio, this.pixelRatio);
        }
        // Sizing WebGL contexts
        for (var id in this.webGLContexts) {
            this.elements[id].setAttribute("width", this.width * this.pixelRatio + "px");
            this.elements[id].setAttribute("height", this.height * this.pixelRatio + "px");
            this.webGLContexts[id].viewport(0, 0, this.width * this.pixelRatio, this.height * this.pixelRatio);
        }
        return this;
    };
    /**
     * Method used to clear all the canvases.
     *
     * @return {Sigma}
     */
    Sigma.prototype.clear = function () {
        this.webGLContexts.nodes.clear(this.webGLContexts.nodes.COLOR_BUFFER_BIT);
        this.webGLContexts.edges.clear(this.webGLContexts.edges.COLOR_BUFFER_BIT);
        this.webGLContexts.hoverNodes.clear(this.webGLContexts.hoverNodes.COLOR_BUFFER_BIT);
        this.canvasContexts.labels.clearRect(0, 0, this.width, this.height);
        this.canvasContexts.hovers.clearRect(0, 0, this.width, this.height);
        this.canvasContexts.edgeLabels.clearRect(0, 0, this.width, this.height);
        return this;
    };
    /**
     * Method used to refresh all computed data.
     *
     * @return {Sigma}
     */
    Sigma.prototype.refresh = function () {
        this.needToProcess = true;
        this._refresh();
        return this;
    };
    /**
     * Method used to refresh all computed data, at the next available frame.
     * If this method has already been called this frame, then it will only render once at the next available frame.
     *
     * @return {Sigma}
     */
    Sigma.prototype.scheduleRefresh = function () {
        this.needToProcess = true;
        this._scheduleRefresh();
        return this;
    };
    /**
     * Method used to (un)zoom, while preserving the position of a viewport point.
     * Used for instance to zoom "on the mouse cursor".
     *
     * @param viewportTarget
     * @param newRatio
     * @return {CameraState}
     */
    Sigma.prototype.getViewportZoomedState = function (viewportTarget, newRatio) {
        var _a = this.camera.getState(), ratio = _a.ratio, angle = _a.angle, x = _a.x, y = _a.y;
        // TODO: handle max zoom
        var ratioDiff = newRatio / ratio;
        var center = {
            x: this.width / 2,
            y: this.height / 2,
        };
        var graphMousePosition = this.viewportToFramedGraph(viewportTarget);
        var graphCenterPosition = this.viewportToFramedGraph(center);
        return {
            angle: angle,
            x: (graphMousePosition.x - graphCenterPosition.x) * (1 - ratioDiff) + x,
            y: (graphMousePosition.y - graphCenterPosition.y) * (1 - ratioDiff) + y,
            ratio: newRatio,
        };
    };
    /**
     * Method returning the abstract rectangle containing the graph according
     * to the camera's state.
     *
     * @return {object} - The view's rectangle.
     */
    Sigma.prototype.viewRectangle = function () {
        // TODO: reduce relative margin?
        var marginX = (0 * this.width) / 8, marginY = (0 * this.height) / 8;
        var p1 = this.viewportToFramedGraph({ x: 0 - marginX, y: 0 - marginY }), p2 = this.viewportToFramedGraph({ x: this.width + marginX, y: 0 - marginY }), h = this.viewportToFramedGraph({ x: 0, y: this.height + marginY });
        return {
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
            height: p2.y - h.y,
        };
    };
    /**
     * Method returning the coordinates of a point from the framed graph system to the viewport system. It allows
     * overriding anything that is used to get the translation matrix, or even the matrix itself.
     *
     * Be careful if overriding dimensions, padding or cameraState, as the computation of the matrix is not the lightest
     * of computations.
     */
    Sigma.prototype.framedGraphToViewport = function (coordinates, override) {
        if (override === void 0) { override = {}; }
        var recomputeMatrix = !!override.cameraState || !!override.viewportDimensions || !!override.graphDimensions;
        var matrix = override.matrix
            ? override.matrix
            : recomputeMatrix
                ? (0, utils_1.matrixFromCamera)(override.cameraState || this.camera.getState(), override.viewportDimensions || this.getDimensions(), override.graphDimensions || this.getGraphDimensions(), override.padding || this.getSetting("stagePadding") || 0)
                : this.matrix;
        var viewportPos = (0, matrices_1.multiplyVec2)(matrix, coordinates);
        return {
            x: ((1 + viewportPos.x) * this.width) / 2,
            y: ((1 - viewportPos.y) * this.height) / 2,
        };
    };
    /**
     * Method returning the coordinates of a point from the viewport system to the framed graph system. It allows
     * overriding anything that is used to get the translation matrix, or even the matrix itself.
     *
     * Be careful if overriding dimensions, padding or cameraState, as the computation of the matrix is not the lightest
     * of computations.
     */
    Sigma.prototype.viewportToFramedGraph = function (coordinates, override) {
        if (override === void 0) { override = {}; }
        var recomputeMatrix = !!override.cameraState || !!override.viewportDimensions || !override.graphDimensions;
        var invMatrix = override.matrix
            ? override.matrix
            : recomputeMatrix
                ? (0, utils_1.matrixFromCamera)(override.cameraState || this.camera.getState(), override.viewportDimensions || this.getDimensions(), override.graphDimensions || this.getGraphDimensions(), override.padding || this.getSetting("stagePadding") || 0, true)
                : this.invMatrix;
        var res = (0, matrices_1.multiplyVec2)(invMatrix, {
            x: (coordinates.x / this.width) * 2 - 1,
            y: 1 - (coordinates.y / this.height) * 2,
        });
        if (isNaN(res.x))
            res.x = 0;
        if (isNaN(res.y))
            res.y = 0;
        return res;
    };
    /**
     * Method used to translate a point's coordinates from the viewport system (pixel distance from the top-left of the
     * stage) to the graph system (the reference system of data as they are in the given graph instance).
     *
     * This method accepts an optional camera which can be useful if you need to translate coordinates
     * based on a different view than the one being currently being displayed on screen.
     *
     * @param {Coordinates}                  viewportPoint
     * @param {CoordinateConversionOverride} override
     */
    Sigma.prototype.viewportToGraph = function (viewportPoint, override) {
        if (override === void 0) { override = {}; }
        return this.normalizationFunction.inverse(this.viewportToFramedGraph(viewportPoint, override));
    };
    /**
     * Method used to translate a point's coordinates from the graph system (the reference system of data as they are in
     * the given graph instance) to the viewport system (pixel distance from the top-left of the stage).
     *
     * This method accepts an optional camera which can be useful if you need to translate coordinates
     * based on a different view than the one being currently being displayed on screen.
     *
     * @param {Coordinates}                  graphPoint
     * @param {CoordinateConversionOverride} override
     */
    Sigma.prototype.graphToViewport = function (graphPoint, override) {
        if (override === void 0) { override = {}; }
        return this.framedGraphToViewport(this.normalizationFunction(graphPoint), override);
    };
    /**
     * Method returning the graph's bounding box.
     *
     * @return {{ x: Extent, y: Extent }}
     */
    Sigma.prototype.getBBox = function () {
        return (0, utils_1.graphExtent)(this.graph);
    };
    /**
     * Method returning the graph's custom bounding box, if any.
     *
     * @return {{ x: Extent, y: Extent } | null}
     */
    Sigma.prototype.getCustomBBox = function () {
        return this.customBBox;
    };
    /**
     * Method used to override the graph's bounding box with a custom one. Give `null` as the argument to stop overriding.
     *
     * @return {Sigma}
     */
    Sigma.prototype.setCustomBBox = function (customBBox) {
        this.customBBox = customBBox;
        this._scheduleRefresh();
        return this;
    };
    /**
     * Method used to shut the container & release event listeners.
     *
     * @return {undefined}
     */
    Sigma.prototype.kill = function () {
        // Emitting "kill" events so that plugins and such can cleanup
        this.emit("kill");
        // Releasing events
        this.removeAllListeners();
        // Releasing camera handlers
        this.camera.removeListener("updated", this.activeListeners.camera);
        // Releasing DOM events & captors
        window.removeEventListener("resize", this.activeListeners.handleResize);
        this.mouseCaptor.kill();
        this.touchCaptor.kill();
        // Releasing graph handlers
        this.unbindGraphHandlers();
        // Releasing cache & state
        this.quadtree = new quadtree_1.default();
        this.nodeDataCache = {};
        this.edgeDataCache = {};
        this.nodesWithForcedLabels = [];
        this.edgesWithForcedLabels = [];
        this.highlightedNodes.clear();
        // Clearing frames
        if (this.renderFrame) {
            (0, utils_1.cancelFrame)(this.renderFrame);
            this.renderFrame = null;
        }
        if (this.renderHighlightedNodesFrame) {
            (0, utils_1.cancelFrame)(this.renderHighlightedNodesFrame);
            this.renderHighlightedNodesFrame = null;
        }
        // Destroying canvases
        var container = this.container;
        while (container.firstChild)
            container.removeChild(container.firstChild);
    };
    /**
     * Method used to scale the given size according to the camera's ratio, i.e.
     * zooming state.
     *
     * @param  {number} size - The size to scale (node size, edge thickness etc.).
     * @return {number}      - The scaled size.
     */
    Sigma.prototype.scaleSize = function (size) {
        return size / this.cameraSizeRatio;
    };
    /**
     * Method that returns the collection of all used canvases.
     * At the moment, the instantiated canvases are the following, and in the
     * following order in the DOM:
     * - `edges`
     * - `nodes`
     * - `edgeLabels`
     * - `labels`
     * - `hovers`
     * - `hoverNodes`
     * - `mouse`
     *
     * @return {PlainObject<HTMLCanvasElement>} - The collection of canvases.
     */
    Sigma.prototype.getCanvases = function () {
        return __assign({}, this.elements);
    };
    return Sigma;
}(types_1.TypedEventEmitter));
exports["default"] = Sigma;


/***/ }),

/***/ "./node_modules/sigma/types.js":
/*!*************************************!*\
  !*** ./node_modules/sigma/types.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypedEventEmitter = void 0;
/**
 * Sigma.js Types
 * ===============
 *
 * Various type declarations used throughout the library.
 * @module
 */
var events_1 = __webpack_require__(/*! events */ "./node_modules/events/events.js");
var TypedEventEmitter = /** @class */ (function (_super) {
    __extends(TypedEventEmitter, _super);
    function TypedEventEmitter() {
        var _this = _super.call(this) || this;
        _this.rawEmitter = _this;
        return _this;
    }
    return TypedEventEmitter;
}(events_1.EventEmitter));
exports.TypedEventEmitter = TypedEventEmitter;


/***/ }),

/***/ "./node_modules/sigma/utils/animate.js":
/*!*********************************************!*\
  !*** ./node_modules/sigma/utils/animate.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.animateNodes = exports.ANIMATE_DEFAULTS = void 0;
var index_1 = __webpack_require__(/*! ./index */ "./node_modules/sigma/utils/index.js");
var easings_1 = __importDefault(__webpack_require__(/*! ./easings */ "./node_modules/sigma/utils/easings.js"));
exports.ANIMATE_DEFAULTS = {
    easing: "quadraticInOut",
    duration: 150,
};
/**
 * Function used to animate the nodes.
 */
function animateNodes(graph, targets, opts, callback) {
    var options = Object.assign({}, exports.ANIMATE_DEFAULTS, opts);
    var easing = typeof options.easing === "function" ? options.easing : easings_1.default[options.easing];
    var start = Date.now();
    var startPositions = {};
    for (var node in targets) {
        var attrs = targets[node];
        startPositions[node] = {};
        for (var k in attrs)
            startPositions[node][k] = graph.getNodeAttribute(node, k);
    }
    var frame = null;
    var step = function () {
        frame = null;
        var p = (Date.now() - start) / options.duration;
        if (p >= 1) {
            // Animation is done
            for (var node in targets) {
                var attrs = targets[node];
                // We use given values to avoid precision issues and for convenience
                for (var k in attrs)
                    graph.setNodeAttribute(node, k, attrs[k]);
            }
            if (typeof callback === "function")
                callback();
            return;
        }
        p = easing(p);
        for (var node in targets) {
            var attrs = targets[node];
            var s = startPositions[node];
            for (var k in attrs)
                graph.setNodeAttribute(node, k, attrs[k] * p + s[k] * (1 - p));
        }
        frame = (0, index_1.requestFrame)(step);
    };
    step();
    return function () {
        if (frame)
            (0, index_1.cancelFrame)(frame);
    };
}
exports.animateNodes = animateNodes;


/***/ }),

/***/ "./node_modules/sigma/utils/data.js":
/*!******************************************!*\
  !*** ./node_modules/sigma/utils/data.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HTML_COLORS = void 0;
exports.HTML_COLORS = {
    black: "#000000",
    silver: "#C0C0C0",
    gray: "#808080",
    grey: "#808080",
    white: "#FFFFFF",
    maroon: "#800000",
    red: "#FF0000",
    purple: "#800080",
    fuchsia: "#FF00FF",
    green: "#008000",
    lime: "#00FF00",
    olive: "#808000",
    yellow: "#FFFF00",
    navy: "#000080",
    blue: "#0000FF",
    teal: "#008080",
    aqua: "#00FFFF",
    darkblue: "#00008B",
    mediumblue: "#0000CD",
    darkgreen: "#006400",
    darkcyan: "#008B8B",
    deepskyblue: "#00BFFF",
    darkturquoise: "#00CED1",
    mediumspringgreen: "#00FA9A",
    springgreen: "#00FF7F",
    cyan: "#00FFFF",
    midnightblue: "#191970",
    dodgerblue: "#1E90FF",
    lightseagreen: "#20B2AA",
    forestgreen: "#228B22",
    seagreen: "#2E8B57",
    darkslategray: "#2F4F4F",
    darkslategrey: "#2F4F4F",
    limegreen: "#32CD32",
    mediumseagreen: "#3CB371",
    turquoise: "#40E0D0",
    royalblue: "#4169E1",
    steelblue: "#4682B4",
    darkslateblue: "#483D8B",
    mediumturquoise: "#48D1CC",
    indigo: "#4B0082",
    darkolivegreen: "#556B2F",
    cadetblue: "#5F9EA0",
    cornflowerblue: "#6495ED",
    rebeccapurple: "#663399",
    mediumaquamarine: "#66CDAA",
    dimgray: "#696969",
    dimgrey: "#696969",
    slateblue: "#6A5ACD",
    olivedrab: "#6B8E23",
    slategray: "#708090",
    slategrey: "#708090",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    mediumslateblue: "#7B68EE",
    lawngreen: "#7CFC00",
    chartreuse: "#7FFF00",
    aquamarine: "#7FFFD4",
    skyblue: "#87CEEB",
    lightskyblue: "#87CEFA",
    blueviolet: "#8A2BE2",
    darkred: "#8B0000",
    darkmagenta: "#8B008B",
    saddlebrown: "#8B4513",
    darkseagreen: "#8FBC8F",
    lightgreen: "#90EE90",
    mediumpurple: "#9370DB",
    darkviolet: "#9400D3",
    palegreen: "#98FB98",
    darkorchid: "#9932CC",
    yellowgreen: "#9ACD32",
    sienna: "#A0522D",
    brown: "#A52A2A",
    darkgray: "#A9A9A9",
    darkgrey: "#A9A9A9",
    lightblue: "#ADD8E6",
    greenyellow: "#ADFF2F",
    paleturquoise: "#AFEEEE",
    lightsteelblue: "#B0C4DE",
    powderblue: "#B0E0E6",
    firebrick: "#B22222",
    darkgoldenrod: "#B8860B",
    mediumorchid: "#BA55D3",
    rosybrown: "#BC8F8F",
    darkkhaki: "#BDB76B",
    mediumvioletred: "#C71585",
    indianred: "#CD5C5C",
    peru: "#CD853F",
    chocolate: "#D2691E",
    tan: "#D2B48C",
    lightgray: "#D3D3D3",
    lightgrey: "#D3D3D3",
    thistle: "#D8BFD8",
    orchid: "#DA70D6",
    goldenrod: "#DAA520",
    palevioletred: "#DB7093",
    crimson: "#DC143C",
    gainsboro: "#DCDCDC",
    plum: "#DDA0DD",
    burlywood: "#DEB887",
    lightcyan: "#E0FFFF",
    lavender: "#E6E6FA",
    darksalmon: "#E9967A",
    violet: "#EE82EE",
    palegoldenrod: "#EEE8AA",
    lightcoral: "#F08080",
    khaki: "#F0E68C",
    aliceblue: "#F0F8FF",
    honeydew: "#F0FFF0",
    azure: "#F0FFFF",
    sandybrown: "#F4A460",
    wheat: "#F5DEB3",
    beige: "#F5F5DC",
    whitesmoke: "#F5F5F5",
    mintcream: "#F5FFFA",
    ghostwhite: "#F8F8FF",
    salmon: "#FA8072",
    antiquewhite: "#FAEBD7",
    linen: "#FAF0E6",
    lightgoldenrodyellow: "#FAFAD2",
    oldlace: "#FDF5E6",
    magenta: "#FF00FF",
    deeppink: "#FF1493",
    orangered: "#FF4500",
    tomato: "#FF6347",
    hotpink: "#FF69B4",
    coral: "#FF7F50",
    darkorange: "#FF8C00",
    lightsalmon: "#FFA07A",
    orange: "#FFA500",
    lightpink: "#FFB6C1",
    pink: "#FFC0CB",
    gold: "#FFD700",
    peachpuff: "#FFDAB9",
    navajowhite: "#FFDEAD",
    moccasin: "#FFE4B5",
    bisque: "#FFE4C4",
    mistyrose: "#FFE4E1",
    blanchedalmond: "#FFEBCD",
    papayawhip: "#FFEFD5",
    lavenderblush: "#FFF0F5",
    seashell: "#FFF5EE",
    cornsilk: "#FFF8DC",
    lemonchiffon: "#FFFACD",
    floralwhite: "#FFFAF0",
    snow: "#FFFAFA",
    lightyellow: "#FFFFE0",
    ivory: "#FFFFF0",
};


/***/ }),

/***/ "./node_modules/sigma/utils/easings.js":
/*!*********************************************!*\
  !*** ./node_modules/sigma/utils/easings.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cubicInOut = exports.cubicOut = exports.cubicIn = exports.quadraticInOut = exports.quadraticOut = exports.quadraticIn = exports.linear = void 0;
/**
 * Sigma.js Easings
 * =================
 *
 * Handy collection of easing functions.
 * @module
 */
var linear = function (k) { return k; };
exports.linear = linear;
var quadraticIn = function (k) { return k * k; };
exports.quadraticIn = quadraticIn;
var quadraticOut = function (k) { return k * (2 - k); };
exports.quadraticOut = quadraticOut;
var quadraticInOut = function (k) {
    if ((k *= 2) < 1)
        return 0.5 * k * k;
    return -0.5 * (--k * (k - 2) - 1);
};
exports.quadraticInOut = quadraticInOut;
var cubicIn = function (k) { return k * k * k; };
exports.cubicIn = cubicIn;
var cubicOut = function (k) { return --k * k * k + 1; };
exports.cubicOut = cubicOut;
var cubicInOut = function (k) {
    if ((k *= 2) < 1)
        return 0.5 * k * k * k;
    return 0.5 * ((k -= 2) * k * k + 2);
};
exports.cubicInOut = cubicInOut;
var easings = {
    linear: exports.linear,
    quadraticIn: exports.quadraticIn,
    quadraticOut: exports.quadraticOut,
    quadraticInOut: exports.quadraticInOut,
    cubicIn: exports.cubicIn,
    cubicOut: exports.cubicOut,
    cubicInOut: exports.cubicInOut,
};
exports["default"] = easings;


/***/ }),

/***/ "./node_modules/sigma/utils/edge-collisions.js":
/*!*****************************************************!*\
  !*** ./node_modules/sigma/utils/edge-collisions.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.doEdgeCollideWithPoint = exports.isPixelColored = void 0;
/**
 * This helper returns true is the pixel at (x,y) in the given WebGL context is
 * colored, and false else.
 */
function isPixelColored(gl, x, y) {
    var pixels = new Uint8Array(4);
    gl.readPixels(x, gl.drawingBufferHeight - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return pixels[3] > 0;
}
exports.isPixelColored = isPixelColored;
/**
 * This helper checks whether or not a point (x, y) collides with an
 * edge, connecting a source (xS, yS) to a target (xT, yT) with a thickness in
 * pixels.
 */
function doEdgeCollideWithPoint(x, y, xS, yS, xT, yT, thickness) {
    // Check first if point is out of the rectangle which opposite corners are the
    // source and the target, rectangle we expand by `thickness` in every
    // directions:
    if (x < xS - thickness && x < xT - thickness)
        return false;
    if (y < yS - thickness && y < yT - thickness)
        return false;
    if (x > xS + thickness && x > xT + thickness)
        return false;
    if (y > yS + thickness && y > yT + thickness)
        return false;
    // Check actual collision now: Since we now the point is in this big rectangle
    // we "just" need to check that the distance between the point and the line
    // connecting the source and the target is less than `thickness`:
    // https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
    var distance = Math.abs((xT - xS) * (yS - y) - (xS - x) * (yT - yS)) / Math.sqrt(Math.pow(xT - xS, 2) + Math.pow(yT - yS, 2));
    return distance < thickness / 2;
}
exports.doEdgeCollideWithPoint = doEdgeCollideWithPoint;


/***/ }),

/***/ "./node_modules/sigma/utils/index.js":
/*!*******************************************!*\
  !*** ./node_modules/sigma/utils/index.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateGraph = exports.canUse32BitsIndices = exports.extractPixel = exports.getMatrixImpact = exports.matrixFromCamera = exports.getCorrectionRatio = exports.floatColor = exports.floatArrayColor = exports.parseColor = exports.zIndexOrdering = exports.createNormalizationFunction = exports.graphExtent = exports.getPixelRatio = exports.createElement = exports.cancelFrame = exports.requestFrame = exports.assignDeep = exports.assign = exports.isPlainObject = void 0;
var is_graph_1 = __importDefault(__webpack_require__(/*! graphology-utils/is-graph */ "./node_modules/graphology-utils/is-graph.js"));
var matrices_1 = __webpack_require__(/*! ./matrices */ "./node_modules/sigma/utils/matrices.js");
var data_1 = __webpack_require__(/*! ./data */ "./node_modules/sigma/utils/data.js");
/**
 * Checks whether the given value is a plain object.
 *
 * @param  {mixed}   value - Target value.
 * @return {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
function isPlainObject(value) {
    return typeof value === "object" && value !== null && value.constructor === Object;
}
exports.isPlainObject = isPlainObject;
/**
 * Helper to use Object.assign with more than two objects.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
function assign(target) {
    var objects = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        objects[_i - 1] = arguments[_i];
    }
    target = target || {};
    for (var i = 0, l = objects.length; i < l; i++) {
        var o = objects[i];
        if (!o)
            continue;
        Object.assign(target, o);
    }
    return target;
}
exports.assign = assign;
/**
 * Very simple recursive Object.assign-like function.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
function assignDeep(target) {
    var objects = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        objects[_i - 1] = arguments[_i];
    }
    target = target || {};
    for (var i = 0, l = objects.length; i < l; i++) {
        var o = objects[i];
        if (!o)
            continue;
        for (var k in o) {
            if (isPlainObject(o[k])) {
                target[k] = assignDeep(target[k], o[k]);
            }
            else {
                target[k] = o[k];
            }
        }
    }
    return target;
}
exports.assignDeep = assignDeep;
/**
 * Just some dirty trick to make requestAnimationFrame and cancelAnimationFrame "work" in Node.js, for unit tests:
 */
exports.requestFrame = typeof requestAnimationFrame !== "undefined"
    ? function (callback) { return requestAnimationFrame(callback); }
    : function (callback) { return setTimeout(callback, 0); };
exports.cancelFrame = typeof cancelAnimationFrame !== "undefined"
    ? function (requestID) { return cancelAnimationFrame(requestID); }
    : function (requestID) { return clearTimeout(requestID); };
/**
 * Function used to create DOM elements easily.
 *
 * @param  {string} tag        - Tag name of the element to create.
 * @param  {object} style      - Styles map.
 * @param  {object} attributes - Attributes map.
 * @return {HTMLElement}
 */
function createElement(tag, style, attributes) {
    var element = document.createElement(tag);
    if (style) {
        for (var k in style) {
            element.style[k] = style[k];
        }
    }
    if (attributes) {
        for (var k in attributes) {
            element.setAttribute(k, attributes[k]);
        }
    }
    return element;
}
exports.createElement = createElement;
/**
 * Function returning the browser's pixel ratio.
 *
 * @return {number}
 */
function getPixelRatio() {
    if (typeof window.devicePixelRatio !== "undefined")
        return window.devicePixelRatio;
    return 1;
}
exports.getPixelRatio = getPixelRatio;
/**
 * Function returning the graph's node extent in x & y.
 *
 * @param  {Graph}
 * @return {object}
 */
function graphExtent(graph) {
    if (!graph.order)
        return { x: [0, 1], y: [0, 1] };
    var xMin = Infinity;
    var xMax = -Infinity;
    var yMin = Infinity;
    var yMax = -Infinity;
    graph.forEachNode(function (_, attr) {
        var x = attr.x, y = attr.y;
        if (x < xMin)
            xMin = x;
        if (x > xMax)
            xMax = x;
        if (y < yMin)
            yMin = y;
        if (y > yMax)
            yMax = y;
    });
    return { x: [xMin, xMax], y: [yMin, yMax] };
}
exports.graphExtent = graphExtent;
function createNormalizationFunction(extent) {
    var _a = __read(extent.x, 2), minX = _a[0], maxX = _a[1], _b = __read(extent.y, 2), minY = _b[0], maxY = _b[1];
    var ratio = Math.max(maxX - minX, maxY - minY), dX = (maxX + minX) / 2, dY = (maxY + minY) / 2;
    if (ratio === 0 || Math.abs(ratio) === Infinity || isNaN(ratio))
        ratio = 1;
    if (isNaN(dX))
        dX = 0;
    if (isNaN(dY))
        dY = 0;
    var fn = function (data) {
        return {
            x: 0.5 + (data.x - dX) / ratio,
            y: 0.5 + (data.y - dY) / ratio,
        };
    };
    // TODO: possibility to apply this in batch over array of indices
    fn.applyTo = function (data) {
        data.x = 0.5 + (data.x - dX) / ratio;
        data.y = 0.5 + (data.y - dY) / ratio;
    };
    fn.inverse = function (data) {
        return {
            x: dX + ratio * (data.x - 0.5),
            y: dY + ratio * (data.y - 0.5),
        };
    };
    fn.ratio = ratio;
    return fn;
}
exports.createNormalizationFunction = createNormalizationFunction;
/**
 * Function ordering the given elements in reverse z-order so they drawn
 * the correct way.
 *
 * @param  {number}   extent   - [min, max] z values.
 * @param  {function} getter   - Z attribute getter function.
 * @param  {array}    elements - The array to sort.
 * @return {array} - The sorted array.
 */
function zIndexOrdering(extent, getter, elements) {
    // If k is > n, we'll use a standard sort
    return elements.sort(function (a, b) {
        var zA = getter(a) || 0, zB = getter(b) || 0;
        if (zA < zB)
            return -1;
        if (zA > zB)
            return 1;
        return 0;
    });
    // TODO: counting sort optimization
}
exports.zIndexOrdering = zIndexOrdering;
/**
 * WebGL utils
 * ===========
 */
/**
 * Memoized function returning a float-encoded color from various string
 * formats describing colors.
 */
var INT8 = new Int8Array(4);
var INT32 = new Int32Array(INT8.buffer, 0, 1);
var FLOAT32 = new Float32Array(INT8.buffer, 0, 1);
var RGBA_TEST_REGEX = /^\s*rgba?\s*\(/;
var RGBA_EXTRACT_REGEX = /^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)(?:\s*,\s*(.*)?)?\)\s*$/;
function parseColor(val) {
    var r = 0; // byte
    var g = 0; // byte
    var b = 0; // byte
    var a = 1; // float
    // Handling hexadecimal notation
    if (val[0] === "#") {
        if (val.length === 4) {
            r = parseInt(val.charAt(1) + val.charAt(1), 16);
            g = parseInt(val.charAt(2) + val.charAt(2), 16);
            b = parseInt(val.charAt(3) + val.charAt(3), 16);
        }
        else {
            r = parseInt(val.charAt(1) + val.charAt(2), 16);
            g = parseInt(val.charAt(3) + val.charAt(4), 16);
            b = parseInt(val.charAt(5) + val.charAt(6), 16);
        }
        if (val.length === 9) {
            a = parseInt(val.charAt(7) + val.charAt(8), 16) / 255;
        }
    }
    // Handling rgb notation
    else if (RGBA_TEST_REGEX.test(val)) {
        var match = val.match(RGBA_EXTRACT_REGEX);
        if (match) {
            r = +match[1];
            g = +match[2];
            b = +match[3];
            if (match[4])
                a = +match[4];
        }
    }
    return { r: r, g: g, b: b, a: a };
}
exports.parseColor = parseColor;
var FLOAT_COLOR_CACHE = {};
for (var htmlColor in data_1.HTML_COLORS) {
    FLOAT_COLOR_CACHE[htmlColor] = floatColor(data_1.HTML_COLORS[htmlColor]);
    // Replicating cache for hex values for free
    FLOAT_COLOR_CACHE[data_1.HTML_COLORS[htmlColor]] = FLOAT_COLOR_CACHE[htmlColor];
}
function floatArrayColor(val) {
    val = data_1.HTML_COLORS[val] || val;
    // NOTE: this variant is not cached because it is mostly used for uniforms
    var _a = parseColor(val), r = _a.r, g = _a.g, b = _a.b, a = _a.a;
    return new Float32Array([r / 255, g / 255, b / 255, a]);
}
exports.floatArrayColor = floatArrayColor;
function floatColor(val) {
    // If the color is already computed, we yield it
    if (typeof FLOAT_COLOR_CACHE[val] !== "undefined")
        return FLOAT_COLOR_CACHE[val];
    var parsed = parseColor(val);
    var r = parsed.r, g = parsed.g, b = parsed.b;
    var a = parsed.a;
    a = (a * 255) | 0;
    INT32[0] = ((a << 24) | (b << 16) | (g << 8) | r) & 0xfeffffff;
    var color = FLOAT32[0];
    FLOAT_COLOR_CACHE[val] = color;
    return color;
}
exports.floatColor = floatColor;
/**
 * In sigma, the graph is normalized into a [0, 1], [0, 1] square, before being given to the various renderers. This
 * helps dealing with quadtree in particular.
 * But at some point, we need to rescale it so that it takes the best place in the screen, ie. we always want to see two
 * nodes "touching" opposite sides of the graph, with the camera being at its default state.
 *
 * This function determines this ratio.
 */
function getCorrectionRatio(viewportDimensions, graphDimensions) {
    var viewportRatio = viewportDimensions.height / viewportDimensions.width;
    var graphRatio = graphDimensions.height / graphDimensions.width;
    // If the stage and the graphs are in different directions (such as the graph being wider that tall while the stage
    // is taller than wide), we can stop here to have indeed nodes touching opposite sides:
    if ((viewportRatio < 1 && graphRatio > 1) || (viewportRatio > 1 && graphRatio < 1)) {
        return 1;
    }
    // Else, we need to fit the graph inside the stage:
    // 1. If the graph is "squarer" (ie. with a ratio closer to 1), we need to make the largest sides touch;
    // 2. If the stage is "squarer", we need to make the smallest sides touch.
    return Math.min(Math.max(graphRatio, 1 / graphRatio), Math.max(1 / viewportRatio, viewportRatio));
}
exports.getCorrectionRatio = getCorrectionRatio;
/**
 * Function returning a matrix from the current state of the camera.
 */
// TODO: it's possible to optimize this drastically!
function matrixFromCamera(state, viewportDimensions, graphDimensions, padding, inverse) {
    var angle = state.angle, ratio = state.ratio, x = state.x, y = state.y;
    var width = viewportDimensions.width, height = viewportDimensions.height;
    var matrix = (0, matrices_1.identity)();
    var smallestDimension = Math.min(width, height) - 2 * padding;
    var correctionRatio = getCorrectionRatio(viewportDimensions, graphDimensions);
    if (!inverse) {
        (0, matrices_1.multiply)(matrix, (0, matrices_1.scale)((0, matrices_1.identity)(), 2 * (smallestDimension / width) * correctionRatio, 2 * (smallestDimension / height) * correctionRatio));
        (0, matrices_1.multiply)(matrix, (0, matrices_1.rotate)((0, matrices_1.identity)(), -angle));
        (0, matrices_1.multiply)(matrix, (0, matrices_1.scale)((0, matrices_1.identity)(), 1 / ratio));
        (0, matrices_1.multiply)(matrix, (0, matrices_1.translate)((0, matrices_1.identity)(), -x, -y));
    }
    else {
        (0, matrices_1.multiply)(matrix, (0, matrices_1.translate)((0, matrices_1.identity)(), x, y));
        (0, matrices_1.multiply)(matrix, (0, matrices_1.scale)((0, matrices_1.identity)(), ratio));
        (0, matrices_1.multiply)(matrix, (0, matrices_1.rotate)((0, matrices_1.identity)(), angle));
        (0, matrices_1.multiply)(matrix, (0, matrices_1.scale)((0, matrices_1.identity)(), width / smallestDimension / 2 / correctionRatio, height / smallestDimension / 2 / correctionRatio));
    }
    return matrix;
}
exports.matrixFromCamera = matrixFromCamera;
/**
 * All these transformations we apply on the matrix to get it rescale the graph
 * as we want make it very hard to get pixel-perfect distances in WebGL. This
 * function returns a factor that properly cancels the matrix effect on lengths.
 *
 * [jacomyal]
 * To be fully honest, I can't really explain happens here... I notice that the
 * following ratio works (ie. it correctly compensates the matrix impact on all
 * camera states I could try):
 * > `R = size(V) / size(M * V) / W`
 * as long as `M * V` is in the direction of W (ie. parallel to (Ox)). It works
 * as well with H and a vector that transforms into something parallel to (Oy).
 *
 * Also, note that we use `angle` and not `-angle` (that would seem logical,
 * since we want to anticipate the rotation), because of the fact that in WebGL,
 * the image is vertically swapped.
 */
function getMatrixImpact(matrix, cameraState, viewportDimensions) {
    var _a = (0, matrices_1.multiplyVec2)(matrix, { x: Math.cos(cameraState.angle), y: Math.sin(cameraState.angle) }, 0), x = _a.x, y = _a.y;
    return 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / viewportDimensions.width;
}
exports.getMatrixImpact = getMatrixImpact;
/**
 * Function extracting the color at the given pixel.
 */
function extractPixel(gl, x, y, array) {
    var data = array || new Uint8Array(4);
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
    return data;
}
exports.extractPixel = extractPixel;
/**
 * Function used to know whether given webgl context can use 32 bits indices.
 */
function canUse32BitsIndices(gl) {
    var webgl2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;
    return webgl2 || !!gl.getExtension("OES_element_index_uint");
}
exports.canUse32BitsIndices = canUse32BitsIndices;
/**
 * Check if the graph variable is a valid graph, and if sigma can render it.
 */
function validateGraph(graph) {
    // check if it's a valid graphology instance
    if (!(0, is_graph_1.default)(graph))
        throw new Error("Sigma: invalid graph instance.");
    // check if nodes have x/y attributes
    graph.forEachNode(function (key, attributes) {
        if (!Number.isFinite(attributes.x) || !Number.isFinite(attributes.y)) {
            throw new Error("Sigma: Coordinates of node ".concat(key, " are invalid. A node must have a numeric 'x' and 'y' attribute."));
        }
    });
}
exports.validateGraph = validateGraph;


/***/ }),

/***/ "./node_modules/sigma/utils/matrices.js":
/*!**********************************************!*\
  !*** ./node_modules/sigma/utils/matrices.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.multiplyVec2 = exports.multiply = exports.translate = exports.rotate = exports.scale = exports.identity = void 0;
function identity() {
    return Float32Array.of(1, 0, 0, 0, 1, 0, 0, 0, 1);
}
exports.identity = identity;
// TODO: optimize
function scale(m, x, y) {
    m[0] = x;
    m[4] = typeof y === "number" ? y : x;
    return m;
}
exports.scale = scale;
function rotate(m, r) {
    var s = Math.sin(r), c = Math.cos(r);
    m[0] = c;
    m[1] = s;
    m[3] = -s;
    m[4] = c;
    return m;
}
exports.rotate = rotate;
function translate(m, x, y) {
    m[6] = x;
    m[7] = y;
    return m;
}
exports.translate = translate;
function multiply(a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2];
    var a10 = a[3], a11 = a[4], a12 = a[5];
    var a20 = a[6], a21 = a[7], a22 = a[8];
    var b00 = b[0], b01 = b[1], b02 = b[2];
    var b10 = b[3], b11 = b[4], b12 = b[5];
    var b20 = b[6], b21 = b[7], b22 = b[8];
    a[0] = b00 * a00 + b01 * a10 + b02 * a20;
    a[1] = b00 * a01 + b01 * a11 + b02 * a21;
    a[2] = b00 * a02 + b01 * a12 + b02 * a22;
    a[3] = b10 * a00 + b11 * a10 + b12 * a20;
    a[4] = b10 * a01 + b11 * a11 + b12 * a21;
    a[5] = b10 * a02 + b11 * a12 + b12 * a22;
    a[6] = b20 * a00 + b21 * a10 + b22 * a20;
    a[7] = b20 * a01 + b21 * a11 + b22 * a21;
    a[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return a;
}
exports.multiply = multiply;
function multiplyVec2(a, b, z) {
    if (z === void 0) { z = 1; }
    var a00 = a[0];
    var a01 = a[1];
    var a10 = a[3];
    var a11 = a[4];
    var a20 = a[6];
    var a21 = a[7];
    var b0 = b.x;
    var b1 = b.y;
    return { x: b0 * a00 + b1 * a10 + a20 * z, y: b0 * a01 + b1 * a11 + a21 * z };
}
exports.multiplyVec2 = multiplyVec2;


/***/ }),

/***/ "./src/GraphX.ts":
/*!***********************!*\
  !*** ./src/GraphX.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var graphology__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphology */ "./node_modules/graphology/dist/graphology.umd.min.js");
/* harmony import */ var graphology__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphology__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var graphology_layout_force_worker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! graphology-layout-force/worker */ "./node_modules/graphology-layout-force/worker.js");
/* harmony import */ var graphology_layout_force_worker__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(graphology_layout_force_worker__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var sigma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sigma */ "./node_modules/sigma/index.js");
/* harmony import */ var sigma__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(sigma__WEBPACK_IMPORTED_MODULE_2__);



var GraphX = /** @class */ (function () {
    function GraphX(container, options, renderSettings) {
        // flags renderer
        this.isDragging = false;
        this.draggedNode = null;
        this.instance = new (graphology__WEBPACK_IMPORTED_MODULE_0___default())(options);
        this.container = container;
        this.render(renderSettings);
    }
    GraphX.prototype.addNode = function (node, attributes) {
        this.instance.addNode(node, attributes);
        return this;
    };
    GraphX.prototype.dropNode = function (node) {
        this.instance.dropNode(node);
        return this;
    };
    GraphX.prototype.addEdge = function (source, target, attributes) {
        this.instance.addEdge(source, target, attributes);
        return this;
    };
    GraphX.prototype.addEdgeWithKey = function (edge, source, target) {
        this.instance.addEdgeWithKey(edge, source, target);
        return this;
    };
    GraphX.prototype.dropEdge = function (edgeName1, edgeName2) {
        this.instance.dropEdge(edgeName1, edgeName2);
        return this;
    };
    GraphX.prototype.render = function (renderSettings) {
        this.renderer = new (sigma__WEBPACK_IMPORTED_MODULE_2___default())(this.instance, this.container, renderSettings);
        this.layout = new (graphology_layout_force_worker__WEBPACK_IMPORTED_MODULE_1___default())(this.instance, { isNodeFixed: function (_, attr) { return attr.highlighted; } });
        this.layout.start();
    };
    GraphX.prototype.clear = function () {
        this.instance.clear();
        return this;
    };
    GraphX.prototype.clearEdges = function () {
        this.instance.clearEdges();
        return this;
    };
    // ITERATION  (not returning instance)
    GraphX.prototype.nodes = function () {
        return this.instance.nodes();
    };
    GraphX.prototype.forEachNode = function (callback) {
        return this.instance.forEachNode(callback);
    };
    GraphX.prototype.filterNodes = function (callback) {
        return this.instance.filterNodes(callback);
    };
    GraphX.prototype.mapNodes = function (callback) {
        return this.instance.mapNodes(callback);
    };
    GraphX.prototype.edges = function () {
        return this.instance.edges();
    };
    GraphX.prototype.forEachEdge = function (callback) {
        return this.instance.forEachEdge(callback);
    };
    GraphX.prototype.filterEdges = function (callback) {
        return this.instance.filterEdges(callback);
    };
    GraphX.prototype.mapEdges = function (callback) {
        return this.instance.mapEdges(callback);
    };
    // READ (not returning instance)
    GraphX.prototype.hasNode = function (node) {
        return this.instance.hasNode(node);
    };
    GraphX.prototype.hasEdge = function (edge) {
        return this.instance.hasEdge(edge);
    };
    GraphX.prototype.degree = function (edge) {
        return this.instance.degree(edge);
    };
    GraphX.prototype.inDegree = function (edge) {
        return this.instance.inDegree(edge);
    };
    GraphX.prototype.outDegree = function (edge) {
        return this.instance.outDegree(edge);
    };
    GraphX.prototype.source = function (edge) {
        return this.instance.source(edge);
    };
    GraphX.prototype.target = function (edge) {
        return this.instance.target(edge);
    };
    GraphX.prototype.hasExtremity = function (edge, node) {
        return this.instance.hasExtremity(edge, node);
    };
    GraphX.prototype.order = function () {
        return this.instance.order;
    };
    GraphX.prototype.getNodeAttributes = function (node) {
        return this.instance.getNodeAttributes(node);
    };
    // SERIALIZATION  (not returning instance)
    GraphX.prototype.copy = function () {
        return this.instance.copy();
    };
    GraphX.prototype.export = function () {
        return this.instance.export();
    };
    GraphX.prototype.import = function (data, merge) {
        this.instance.import(data, merge);
    };
    GraphX.prototype.toJSON = function () {
        return this.instance.toJSON();
    };
    // RENDER FUNCS
    GraphX.prototype.getCamera = function () {
        return this.renderer.getCamera();
    };
    GraphX.prototype.on = function (eventName, listener) {
        this.renderer.on(eventName, listener);
    };
    GraphX.prototype.off = function (eventName, listener) {
        this.renderer.off(eventName, listener);
    };
    GraphX.prototype.onMouseCaptor = function (type, listener) {
        this.renderer.getMouseCaptor().on(type, listener);
    };
    GraphX.prototype.offMouseCaptor = function (type, listener) {
        this.renderer.getMouseCaptor().off(type, listener);
    };
    GraphX.prototype.enableElasticAnimation = function () {
        var _this = this;
        // On mouse down on a node
        //  - we enable the drag mode
        //  - save in the dragged node in the state
        //  - highlight the node
        //  - disable the camera so its state is not updated
        this.renderer.on("downNode", function (e) {
            _this.isDragging = true;
            _this.draggedNode = e.node;
            _this.instance.setNodeAttribute(_this.draggedNode, "highlighted", true);
        });
        // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
        this.renderer.getMouseCaptor().on("mousemovebody", function (e) {
            if (!_this.isDragging || !_this.draggedNode)
                return;
            // Get new position of node
            var pos = _this.renderer.viewportToGraph(e);
            _this.instance.setNodeAttribute(_this.draggedNode, "x", pos.x);
            _this.instance.setNodeAttribute(_this.draggedNode, "y", pos.y);
            // Prevent sigma to move camera:
            e.preventSigmaDefault();
            e.original.preventDefault();
            e.original.stopPropagation();
        });
        // On mouse up, we reset the autoscale and the dragging mode
        this.renderer.getMouseCaptor().on("mouseup", function () {
            if (_this.draggedNode) {
                _this.instance.removeNodeAttribute(_this.draggedNode, "highlighted");
            }
            _this.isDragging = false;
            _this.draggedNode = null;
        });
        // Disable the autoscale at the first down interaction
        this.renderer.getMouseCaptor().on("mousedown", function () {
            if (!_this.renderer.getCustomBBox())
                _this.renderer.setCustomBBox(_this.renderer.getBBox());
        });
    };
    return GraphX;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GraphX);


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GraphX": () => (/* reexport safe */ _GraphX__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "chroma": () => (/* reexport module object */ chroma_js__WEBPACK_IMPORTED_MODULE_1__)
/* harmony export */ });
/* harmony import */ var _GraphX__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GraphX */ "./src/GraphX.ts");
/* harmony import */ var chroma_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! chroma-js */ "./node_modules/chroma-js/chroma.js");
/* harmony import */ var chroma_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(chroma_js__WEBPACK_IMPORTED_MODULE_1__);


//  const container1 = document.getElementById("container1") as HTMLElement;
//  console.log(container1);
// (new GraphX(container1))
// .addNode("John", { x: 0, y: 10, size: 10, label: "John", color: "blue" })
// .addNode("Mary", { x: 10, y: 0, size: 6, label: "Mary", color: "red" })
// .addEdge("John","Mary");
// const container2 = document.getElementById("container2") as HTMLElement;
// console.log(container2);
// (new GraphX(container2))
// .addNode("Bruce", { x: 0, y: 10, size: 10, label: "Bruce", color: "blue" })
// .addNode("Mik", { x: 10, y: 0, size: 6, label: "Mik", color: "red" })
// .addEdge("Bruce","Mik");



/***/ }),

/***/ "./node_modules/chroma-js/chroma.js":
/*!******************************************!*\
  !*** ./node_modules/chroma-js/chroma.js ***!
  \******************************************/
/***/ (function(module) {

/**
 * chroma.js - JavaScript library for color conversions
 *
 * Copyright (c) 2011-2019, Gregor Aisch
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. The name Gregor Aisch may not be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * -------------------------------------------------------
 *
 * chroma.js includes colors from colorbrewer2.org, which are released under
 * the following license:
 *
 * Copyright (c) 2002 Cynthia Brewer, Mark Harrower,
 * and The Pennsylvania State University.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * ------------------------------------------------------
 *
 * Named colors are taken from X11 Color Names.
 * http://www.w3.org/TR/css3-color/#svg-color
 *
 * @preserve
 */

(function (global, factory) {
     true ? module.exports = factory() :
    0;
})(this, (function () { 'use strict';

    var limit$2 = function (x, min, max) {
        if ( min === void 0 ) min=0;
        if ( max === void 0 ) max=1;

        return x < min ? min : x > max ? max : x;
    };

    var limit$1 = limit$2;

    var clip_rgb$3 = function (rgb) {
        rgb._clipped = false;
        rgb._unclipped = rgb.slice(0);
        for (var i=0; i<=3; i++) {
            if (i < 3) {
                if (rgb[i] < 0 || rgb[i] > 255) { rgb._clipped = true; }
                rgb[i] = limit$1(rgb[i], 0, 255);
            } else if (i === 3) {
                rgb[i] = limit$1(rgb[i], 0, 1);
            }
        }
        return rgb;
    };

    // ported from jQuery's $.type
    var classToType = {};
    for (var i$1 = 0, list$1 = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Undefined', 'Null']; i$1 < list$1.length; i$1 += 1) {
        var name = list$1[i$1];

        classToType[("[object " + name + "]")] = name.toLowerCase();
    }
    var type$p = function(obj) {
        return classToType[Object.prototype.toString.call(obj)] || "object";
    };

    var type$o = type$p;

    var unpack$B = function (args, keyOrder) {
        if ( keyOrder === void 0 ) keyOrder=null;

    	// if called with more than 3 arguments, we return the arguments
        if (args.length >= 3) { return Array.prototype.slice.call(args); }
        // with less than 3 args we check if first arg is object
        // and use the keyOrder string to extract and sort properties
    	if (type$o(args[0]) == 'object' && keyOrder) {
    		return keyOrder.split('')
    			.filter(function (k) { return args[0][k] !== undefined; })
    			.map(function (k) { return args[0][k]; });
    	}
    	// otherwise we just return the first argument
    	// (which we suppose is an array of args)
        return args[0];
    };

    var type$n = type$p;

    var last$4 = function (args) {
        if (args.length < 2) { return null; }
        var l = args.length-1;
        if (type$n(args[l]) == 'string') { return args[l].toLowerCase(); }
        return null;
    };

    var PI$2 = Math.PI;

    var utils = {
    	clip_rgb: clip_rgb$3,
    	limit: limit$2,
    	type: type$p,
    	unpack: unpack$B,
    	last: last$4,
    	PI: PI$2,
    	TWOPI: PI$2*2,
    	PITHIRD: PI$2/3,
    	DEG2RAD: PI$2 / 180,
    	RAD2DEG: 180 / PI$2
    };

    var input$h = {
    	format: {},
    	autodetect: []
    };

    var last$3 = utils.last;
    var clip_rgb$2 = utils.clip_rgb;
    var type$m = utils.type;
    var _input = input$h;

    var Color$D = function Color() {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var me = this;
        if (type$m(args[0]) === 'object' &&
            args[0].constructor &&
            args[0].constructor === this.constructor) {
            // the argument is already a Color instance
            return args[0];
        }

        // last argument could be the mode
        var mode = last$3(args);
        var autodetect = false;

        if (!mode) {
            autodetect = true;
            if (!_input.sorted) {
                _input.autodetect = _input.autodetect.sort(function (a,b) { return b.p - a.p; });
                _input.sorted = true;
            }
            // auto-detect format
            for (var i = 0, list = _input.autodetect; i < list.length; i += 1) {
                var chk = list[i];

                mode = chk.test.apply(chk, args);
                if (mode) { break; }
            }
        }

        if (_input.format[mode]) {
            var rgb = _input.format[mode].apply(null, autodetect ? args : args.slice(0,-1));
            me._rgb = clip_rgb$2(rgb);
        } else {
            throw new Error('unknown format: '+args);
        }

        // add alpha channel
        if (me._rgb.length === 3) { me._rgb.push(1); }
    };

    Color$D.prototype.toString = function toString () {
        if (type$m(this.hex) == 'function') { return this.hex(); }
        return ("[" + (this._rgb.join(',')) + "]");
    };

    var Color_1 = Color$D;

    var chroma$k = function () {
    	var args = [], len = arguments.length;
    	while ( len-- ) args[ len ] = arguments[ len ];

    	return new (Function.prototype.bind.apply( chroma$k.Color, [ null ].concat( args) ));
    };

    chroma$k.Color = Color_1;
    chroma$k.version = '2.4.2';

    var chroma_1 = chroma$k;

    var unpack$A = utils.unpack;
    var max$2 = Math.max;

    var rgb2cmyk$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$A(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        r = r / 255;
        g = g / 255;
        b = b / 255;
        var k = 1 - max$2(r,max$2(g,b));
        var f = k < 1 ? 1 / (1-k) : 0;
        var c = (1-r-k) * f;
        var m = (1-g-k) * f;
        var y = (1-b-k) * f;
        return [c,m,y,k];
    };

    var rgb2cmyk_1 = rgb2cmyk$1;

    var unpack$z = utils.unpack;

    var cmyk2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$z(args, 'cmyk');
        var c = args[0];
        var m = args[1];
        var y = args[2];
        var k = args[3];
        var alpha = args.length > 4 ? args[4] : 1;
        if (k === 1) { return [0,0,0,alpha]; }
        return [
            c >= 1 ? 0 : 255 * (1-c) * (1-k), // r
            m >= 1 ? 0 : 255 * (1-m) * (1-k), // g
            y >= 1 ? 0 : 255 * (1-y) * (1-k), // b
            alpha
        ];
    };

    var cmyk2rgb_1 = cmyk2rgb;

    var chroma$j = chroma_1;
    var Color$C = Color_1;
    var input$g = input$h;
    var unpack$y = utils.unpack;
    var type$l = utils.type;

    var rgb2cmyk = rgb2cmyk_1;

    Color$C.prototype.cmyk = function() {
        return rgb2cmyk(this._rgb);
    };

    chroma$j.cmyk = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$C, [ null ].concat( args, ['cmyk']) ));
    };

    input$g.format.cmyk = cmyk2rgb_1;

    input$g.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$y(args, 'cmyk');
            if (type$l(args) === 'array' && args.length === 4) {
                return 'cmyk';
            }
        }
    });

    var unpack$x = utils.unpack;
    var last$2 = utils.last;
    var rnd = function (a) { return Math.round(a*100)/100; };

    /*
     * supported arguments:
     * - hsl2css(h,s,l)
     * - hsl2css(h,s,l,a)
     * - hsl2css([h,s,l], mode)
     * - hsl2css([h,s,l,a], mode)
     * - hsl2css({h,s,l,a}, mode)
     */
    var hsl2css$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var hsla = unpack$x(args, 'hsla');
        var mode = last$2(args) || 'lsa';
        hsla[0] = rnd(hsla[0] || 0);
        hsla[1] = rnd(hsla[1]*100) + '%';
        hsla[2] = rnd(hsla[2]*100) + '%';
        if (mode === 'hsla' || (hsla.length > 3 && hsla[3]<1)) {
            hsla[3] = hsla.length > 3 ? hsla[3] : 1;
            mode = 'hsla';
        } else {
            hsla.length = 3;
        }
        return (mode + "(" + (hsla.join(',')) + ")");
    };

    var hsl2css_1 = hsl2css$1;

    var unpack$w = utils.unpack;

    /*
     * supported arguments:
     * - rgb2hsl(r,g,b)
     * - rgb2hsl(r,g,b,a)
     * - rgb2hsl([r,g,b])
     * - rgb2hsl([r,g,b,a])
     * - rgb2hsl({r,g,b,a})
     */
    var rgb2hsl$3 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$w(args, 'rgba');
        var r = args[0];
        var g = args[1];
        var b = args[2];

        r /= 255;
        g /= 255;
        b /= 255;

        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);

        var l = (max + min) / 2;
        var s, h;

        if (max === min){
            s = 0;
            h = Number.NaN;
        } else {
            s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
        }

        if (r == max) { h = (g - b) / (max - min); }
        else if (g == max) { h = 2 + (b - r) / (max - min); }
        else if (b == max) { h = 4 + (r - g) / (max - min); }

        h *= 60;
        if (h < 0) { h += 360; }
        if (args.length>3 && args[3]!==undefined) { return [h,s,l,args[3]]; }
        return [h,s,l];
    };

    var rgb2hsl_1 = rgb2hsl$3;

    var unpack$v = utils.unpack;
    var last$1 = utils.last;
    var hsl2css = hsl2css_1;
    var rgb2hsl$2 = rgb2hsl_1;
    var round$6 = Math.round;

    /*
     * supported arguments:
     * - rgb2css(r,g,b)
     * - rgb2css(r,g,b,a)
     * - rgb2css([r,g,b], mode)
     * - rgb2css([r,g,b,a], mode)
     * - rgb2css({r,g,b,a}, mode)
     */
    var rgb2css$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgba = unpack$v(args, 'rgba');
        var mode = last$1(args) || 'rgb';
        if (mode.substr(0,3) == 'hsl') {
            return hsl2css(rgb2hsl$2(rgba), mode);
        }
        rgba[0] = round$6(rgba[0]);
        rgba[1] = round$6(rgba[1]);
        rgba[2] = round$6(rgba[2]);
        if (mode === 'rgba' || (rgba.length > 3 && rgba[3]<1)) {
            rgba[3] = rgba.length > 3 ? rgba[3] : 1;
            mode = 'rgba';
        }
        return (mode + "(" + (rgba.slice(0,mode==='rgb'?3:4).join(',')) + ")");
    };

    var rgb2css_1 = rgb2css$1;

    var unpack$u = utils.unpack;
    var round$5 = Math.round;

    var hsl2rgb$1 = function () {
        var assign;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        args = unpack$u(args, 'hsl');
        var h = args[0];
        var s = args[1];
        var l = args[2];
        var r,g,b;
        if (s === 0) {
            r = g = b = l*255;
        } else {
            var t3 = [0,0,0];
            var c = [0,0,0];
            var t2 = l < 0.5 ? l * (1+s) : l+s-l*s;
            var t1 = 2 * l - t2;
            var h_ = h / 360;
            t3[0] = h_ + 1/3;
            t3[1] = h_;
            t3[2] = h_ - 1/3;
            for (var i=0; i<3; i++) {
                if (t3[i] < 0) { t3[i] += 1; }
                if (t3[i] > 1) { t3[i] -= 1; }
                if (6 * t3[i] < 1)
                    { c[i] = t1 + (t2 - t1) * 6 * t3[i]; }
                else if (2 * t3[i] < 1)
                    { c[i] = t2; }
                else if (3 * t3[i] < 2)
                    { c[i] = t1 + (t2 - t1) * ((2 / 3) - t3[i]) * 6; }
                else
                    { c[i] = t1; }
            }
            (assign = [round$5(c[0]*255),round$5(c[1]*255),round$5(c[2]*255)], r = assign[0], g = assign[1], b = assign[2]);
        }
        if (args.length > 3) {
            // keep alpha channel
            return [r,g,b,args[3]];
        }
        return [r,g,b,1];
    };

    var hsl2rgb_1 = hsl2rgb$1;

    var hsl2rgb = hsl2rgb_1;
    var input$f = input$h;

    var RE_RGB = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/;
    var RE_RGBA = /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/;
    var RE_RGB_PCT = /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
    var RE_RGBA_PCT = /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;
    var RE_HSL = /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
    var RE_HSLA = /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;

    var round$4 = Math.round;

    var css2rgb$1 = function (css) {
        css = css.toLowerCase().trim();
        var m;

        if (input$f.format.named) {
            try {
                return input$f.format.named(css);
            } catch (e) {
                // eslint-disable-next-line
            }
        }

        // rgb(250,20,0)
        if ((m = css.match(RE_RGB))) {
            var rgb = m.slice(1,4);
            for (var i=0; i<3; i++) {
                rgb[i] = +rgb[i];
            }
            rgb[3] = 1;  // default alpha
            return rgb;
        }

        // rgba(250,20,0,0.4)
        if ((m = css.match(RE_RGBA))) {
            var rgb$1 = m.slice(1,5);
            for (var i$1=0; i$1<4; i$1++) {
                rgb$1[i$1] = +rgb$1[i$1];
            }
            return rgb$1;
        }

        // rgb(100%,0%,0%)
        if ((m = css.match(RE_RGB_PCT))) {
            var rgb$2 = m.slice(1,4);
            for (var i$2=0; i$2<3; i$2++) {
                rgb$2[i$2] = round$4(rgb$2[i$2] * 2.55);
            }
            rgb$2[3] = 1;  // default alpha
            return rgb$2;
        }

        // rgba(100%,0%,0%,0.4)
        if ((m = css.match(RE_RGBA_PCT))) {
            var rgb$3 = m.slice(1,5);
            for (var i$3=0; i$3<3; i$3++) {
                rgb$3[i$3] = round$4(rgb$3[i$3] * 2.55);
            }
            rgb$3[3] = +rgb$3[3];
            return rgb$3;
        }

        // hsl(0,100%,50%)
        if ((m = css.match(RE_HSL))) {
            var hsl = m.slice(1,4);
            hsl[1] *= 0.01;
            hsl[2] *= 0.01;
            var rgb$4 = hsl2rgb(hsl);
            rgb$4[3] = 1;
            return rgb$4;
        }

        // hsla(0,100%,50%,0.5)
        if ((m = css.match(RE_HSLA))) {
            var hsl$1 = m.slice(1,4);
            hsl$1[1] *= 0.01;
            hsl$1[2] *= 0.01;
            var rgb$5 = hsl2rgb(hsl$1);
            rgb$5[3] = +m[4];  // default alpha = 1
            return rgb$5;
        }
    };

    css2rgb$1.test = function (s) {
        return RE_RGB.test(s) ||
            RE_RGBA.test(s) ||
            RE_RGB_PCT.test(s) ||
            RE_RGBA_PCT.test(s) ||
            RE_HSL.test(s) ||
            RE_HSLA.test(s);
    };

    var css2rgb_1 = css2rgb$1;

    var chroma$i = chroma_1;
    var Color$B = Color_1;
    var input$e = input$h;
    var type$k = utils.type;

    var rgb2css = rgb2css_1;
    var css2rgb = css2rgb_1;

    Color$B.prototype.css = function(mode) {
        return rgb2css(this._rgb, mode);
    };

    chroma$i.css = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$B, [ null ].concat( args, ['css']) ));
    };

    input$e.format.css = css2rgb;

    input$e.autodetect.push({
        p: 5,
        test: function (h) {
            var rest = [], len = arguments.length - 1;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

            if (!rest.length && type$k(h) === 'string' && css2rgb.test(h)) {
                return 'css';
            }
        }
    });

    var Color$A = Color_1;
    var chroma$h = chroma_1;
    var input$d = input$h;
    var unpack$t = utils.unpack;

    input$d.format.gl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgb = unpack$t(args, 'rgba');
        rgb[0] *= 255;
        rgb[1] *= 255;
        rgb[2] *= 255;
        return rgb;
    };

    chroma$h.gl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$A, [ null ].concat( args, ['gl']) ));
    };

    Color$A.prototype.gl = function() {
        var rgb = this._rgb;
        return [rgb[0]/255, rgb[1]/255, rgb[2]/255, rgb[3]];
    };

    var unpack$s = utils.unpack;

    var rgb2hcg$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$s(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);
        var delta = max - min;
        var c = delta * 100 / 255;
        var _g = min / (255 - delta) * 100;
        var h;
        if (delta === 0) {
            h = Number.NaN;
        } else {
            if (r === max) { h = (g - b) / delta; }
            if (g === max) { h = 2+(b - r) / delta; }
            if (b === max) { h = 4+(r - g) / delta; }
            h *= 60;
            if (h < 0) { h += 360; }
        }
        return [h, c, _g];
    };

    var rgb2hcg_1 = rgb2hcg$1;

    var unpack$r = utils.unpack;
    var floor$3 = Math.floor;

    /*
     * this is basically just HSV with some minor tweaks
     *
     * hue.. [0..360]
     * chroma .. [0..1]
     * grayness .. [0..1]
     */

    var hcg2rgb = function () {
        var assign, assign$1, assign$2, assign$3, assign$4, assign$5;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        args = unpack$r(args, 'hcg');
        var h = args[0];
        var c = args[1];
        var _g = args[2];
        var r,g,b;
        _g = _g * 255;
        var _c = c * 255;
        if (c === 0) {
            r = g = b = _g;
        } else {
            if (h === 360) { h = 0; }
            if (h > 360) { h -= 360; }
            if (h < 0) { h += 360; }
            h /= 60;
            var i = floor$3(h);
            var f = h - i;
            var p = _g * (1 - c);
            var q = p + _c * (1 - f);
            var t = p + _c * f;
            var v = p + _c;
            switch (i) {
                case 0: (assign = [v, t, p], r = assign[0], g = assign[1], b = assign[2]); break
                case 1: (assign$1 = [q, v, p], r = assign$1[0], g = assign$1[1], b = assign$1[2]); break
                case 2: (assign$2 = [p, v, t], r = assign$2[0], g = assign$2[1], b = assign$2[2]); break
                case 3: (assign$3 = [p, q, v], r = assign$3[0], g = assign$3[1], b = assign$3[2]); break
                case 4: (assign$4 = [t, p, v], r = assign$4[0], g = assign$4[1], b = assign$4[2]); break
                case 5: (assign$5 = [v, p, q], r = assign$5[0], g = assign$5[1], b = assign$5[2]); break
            }
        }
        return [r, g, b, args.length > 3 ? args[3] : 1];
    };

    var hcg2rgb_1 = hcg2rgb;

    var unpack$q = utils.unpack;
    var type$j = utils.type;
    var chroma$g = chroma_1;
    var Color$z = Color_1;
    var input$c = input$h;

    var rgb2hcg = rgb2hcg_1;

    Color$z.prototype.hcg = function() {
        return rgb2hcg(this._rgb);
    };

    chroma$g.hcg = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$z, [ null ].concat( args, ['hcg']) ));
    };

    input$c.format.hcg = hcg2rgb_1;

    input$c.autodetect.push({
        p: 1,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$q(args, 'hcg');
            if (type$j(args) === 'array' && args.length === 3) {
                return 'hcg';
            }
        }
    });

    var unpack$p = utils.unpack;
    var last = utils.last;
    var round$3 = Math.round;

    var rgb2hex$2 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$p(args, 'rgba');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var a = ref[3];
        var mode = last(args) || 'auto';
        if (a === undefined) { a = 1; }
        if (mode === 'auto') {
            mode = a < 1 ? 'rgba' : 'rgb';
        }
        r = round$3(r);
        g = round$3(g);
        b = round$3(b);
        var u = r << 16 | g << 8 | b;
        var str = "000000" + u.toString(16); //#.toUpperCase();
        str = str.substr(str.length - 6);
        var hxa = '0' + round$3(a * 255).toString(16);
        hxa = hxa.substr(hxa.length - 2);
        switch (mode.toLowerCase()) {
            case 'rgba': return ("#" + str + hxa);
            case 'argb': return ("#" + hxa + str);
            default: return ("#" + str);
        }
    };

    var rgb2hex_1 = rgb2hex$2;

    var RE_HEX = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    var RE_HEXA = /^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/;

    var hex2rgb$1 = function (hex) {
        if (hex.match(RE_HEX)) {
            // remove optional leading #
            if (hex.length === 4 || hex.length === 7) {
                hex = hex.substr(1);
            }
            // expand short-notation to full six-digit
            if (hex.length === 3) {
                hex = hex.split('');
                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
            }
            var u = parseInt(hex, 16);
            var r = u >> 16;
            var g = u >> 8 & 0xFF;
            var b = u & 0xFF;
            return [r,g,b,1];
        }

        // match rgba hex format, eg #FF000077
        if (hex.match(RE_HEXA)) {
            if (hex.length === 5 || hex.length === 9) {
                // remove optional leading #
                hex = hex.substr(1);
            }
            // expand short-notation to full eight-digit
            if (hex.length === 4) {
                hex = hex.split('');
                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
            }
            var u$1 = parseInt(hex, 16);
            var r$1 = u$1 >> 24 & 0xFF;
            var g$1 = u$1 >> 16 & 0xFF;
            var b$1 = u$1 >> 8 & 0xFF;
            var a = Math.round((u$1 & 0xFF) / 0xFF * 100) / 100;
            return [r$1,g$1,b$1,a];
        }

        // we used to check for css colors here
        // if _input.css? and rgb = _input.css hex
        //     return rgb

        throw new Error(("unknown hex color: " + hex));
    };

    var hex2rgb_1 = hex2rgb$1;

    var chroma$f = chroma_1;
    var Color$y = Color_1;
    var type$i = utils.type;
    var input$b = input$h;

    var rgb2hex$1 = rgb2hex_1;

    Color$y.prototype.hex = function(mode) {
        return rgb2hex$1(this._rgb, mode);
    };

    chroma$f.hex = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$y, [ null ].concat( args, ['hex']) ));
    };

    input$b.format.hex = hex2rgb_1;
    input$b.autodetect.push({
        p: 4,
        test: function (h) {
            var rest = [], len = arguments.length - 1;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

            if (!rest.length && type$i(h) === 'string' && [3,4,5,6,7,8,9].indexOf(h.length) >= 0) {
                return 'hex';
            }
        }
    });

    var unpack$o = utils.unpack;
    var TWOPI$2 = utils.TWOPI;
    var min$2 = Math.min;
    var sqrt$4 = Math.sqrt;
    var acos = Math.acos;

    var rgb2hsi$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        /*
        borrowed from here:
        http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/rgb2hsi.cpp
        */
        var ref = unpack$o(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        r /= 255;
        g /= 255;
        b /= 255;
        var h;
        var min_ = min$2(r,g,b);
        var i = (r+g+b) / 3;
        var s = i > 0 ? 1 - min_/i : 0;
        if (s === 0) {
            h = NaN;
        } else {
            h = ((r-g)+(r-b)) / 2;
            h /= sqrt$4((r-g)*(r-g) + (r-b)*(g-b));
            h = acos(h);
            if (b > g) {
                h = TWOPI$2 - h;
            }
            h /= TWOPI$2;
        }
        return [h*360,s,i];
    };

    var rgb2hsi_1 = rgb2hsi$1;

    var unpack$n = utils.unpack;
    var limit = utils.limit;
    var TWOPI$1 = utils.TWOPI;
    var PITHIRD = utils.PITHIRD;
    var cos$4 = Math.cos;

    /*
     * hue [0..360]
     * saturation [0..1]
     * intensity [0..1]
     */
    var hsi2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        /*
        borrowed from here:
        http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/hsi2rgb.cpp
        */
        args = unpack$n(args, 'hsi');
        var h = args[0];
        var s = args[1];
        var i = args[2];
        var r,g,b;

        if (isNaN(h)) { h = 0; }
        if (isNaN(s)) { s = 0; }
        // normalize hue
        if (h > 360) { h -= 360; }
        if (h < 0) { h += 360; }
        h /= 360;
        if (h < 1/3) {
            b = (1-s)/3;
            r = (1+s*cos$4(TWOPI$1*h)/cos$4(PITHIRD-TWOPI$1*h))/3;
            g = 1 - (b+r);
        } else if (h < 2/3) {
            h -= 1/3;
            r = (1-s)/3;
            g = (1+s*cos$4(TWOPI$1*h)/cos$4(PITHIRD-TWOPI$1*h))/3;
            b = 1 - (r+g);
        } else {
            h -= 2/3;
            g = (1-s)/3;
            b = (1+s*cos$4(TWOPI$1*h)/cos$4(PITHIRD-TWOPI$1*h))/3;
            r = 1 - (g+b);
        }
        r = limit(i*r*3);
        g = limit(i*g*3);
        b = limit(i*b*3);
        return [r*255, g*255, b*255, args.length > 3 ? args[3] : 1];
    };

    var hsi2rgb_1 = hsi2rgb;

    var unpack$m = utils.unpack;
    var type$h = utils.type;
    var chroma$e = chroma_1;
    var Color$x = Color_1;
    var input$a = input$h;

    var rgb2hsi = rgb2hsi_1;

    Color$x.prototype.hsi = function() {
        return rgb2hsi(this._rgb);
    };

    chroma$e.hsi = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$x, [ null ].concat( args, ['hsi']) ));
    };

    input$a.format.hsi = hsi2rgb_1;

    input$a.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$m(args, 'hsi');
            if (type$h(args) === 'array' && args.length === 3) {
                return 'hsi';
            }
        }
    });

    var unpack$l = utils.unpack;
    var type$g = utils.type;
    var chroma$d = chroma_1;
    var Color$w = Color_1;
    var input$9 = input$h;

    var rgb2hsl$1 = rgb2hsl_1;

    Color$w.prototype.hsl = function() {
        return rgb2hsl$1(this._rgb);
    };

    chroma$d.hsl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$w, [ null ].concat( args, ['hsl']) ));
    };

    input$9.format.hsl = hsl2rgb_1;

    input$9.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$l(args, 'hsl');
            if (type$g(args) === 'array' && args.length === 3) {
                return 'hsl';
            }
        }
    });

    var unpack$k = utils.unpack;
    var min$1 = Math.min;
    var max$1 = Math.max;

    /*
     * supported arguments:
     * - rgb2hsv(r,g,b)
     * - rgb2hsv([r,g,b])
     * - rgb2hsv({r,g,b})
     */
    var rgb2hsl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$k(args, 'rgb');
        var r = args[0];
        var g = args[1];
        var b = args[2];
        var min_ = min$1(r, g, b);
        var max_ = max$1(r, g, b);
        var delta = max_ - min_;
        var h,s,v;
        v = max_ / 255.0;
        if (max_ === 0) {
            h = Number.NaN;
            s = 0;
        } else {
            s = delta / max_;
            if (r === max_) { h = (g - b) / delta; }
            if (g === max_) { h = 2+(b - r) / delta; }
            if (b === max_) { h = 4+(r - g) / delta; }
            h *= 60;
            if (h < 0) { h += 360; }
        }
        return [h, s, v]
    };

    var rgb2hsv$1 = rgb2hsl;

    var unpack$j = utils.unpack;
    var floor$2 = Math.floor;

    var hsv2rgb = function () {
        var assign, assign$1, assign$2, assign$3, assign$4, assign$5;

        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        args = unpack$j(args, 'hsv');
        var h = args[0];
        var s = args[1];
        var v = args[2];
        var r,g,b;
        v *= 255;
        if (s === 0) {
            r = g = b = v;
        } else {
            if (h === 360) { h = 0; }
            if (h > 360) { h -= 360; }
            if (h < 0) { h += 360; }
            h /= 60;

            var i = floor$2(h);
            var f = h - i;
            var p = v * (1 - s);
            var q = v * (1 - s * f);
            var t = v * (1 - s * (1 - f));

            switch (i) {
                case 0: (assign = [v, t, p], r = assign[0], g = assign[1], b = assign[2]); break
                case 1: (assign$1 = [q, v, p], r = assign$1[0], g = assign$1[1], b = assign$1[2]); break
                case 2: (assign$2 = [p, v, t], r = assign$2[0], g = assign$2[1], b = assign$2[2]); break
                case 3: (assign$3 = [p, q, v], r = assign$3[0], g = assign$3[1], b = assign$3[2]); break
                case 4: (assign$4 = [t, p, v], r = assign$4[0], g = assign$4[1], b = assign$4[2]); break
                case 5: (assign$5 = [v, p, q], r = assign$5[0], g = assign$5[1], b = assign$5[2]); break
            }
        }
        return [r,g,b,args.length > 3?args[3]:1];
    };

    var hsv2rgb_1 = hsv2rgb;

    var unpack$i = utils.unpack;
    var type$f = utils.type;
    var chroma$c = chroma_1;
    var Color$v = Color_1;
    var input$8 = input$h;

    var rgb2hsv = rgb2hsv$1;

    Color$v.prototype.hsv = function() {
        return rgb2hsv(this._rgb);
    };

    chroma$c.hsv = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$v, [ null ].concat( args, ['hsv']) ));
    };

    input$8.format.hsv = hsv2rgb_1;

    input$8.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$i(args, 'hsv');
            if (type$f(args) === 'array' && args.length === 3) {
                return 'hsv';
            }
        }
    });

    var labConstants = {
        // Corresponds roughly to RGB brighter/darker
        Kn: 18,

        // D65 standard referent
        Xn: 0.950470,
        Yn: 1,
        Zn: 1.088830,

        t0: 0.137931034,  // 4 / 29
        t1: 0.206896552,  // 6 / 29
        t2: 0.12841855,   // 3 * t1 * t1
        t3: 0.008856452,  // t1 * t1 * t1
    };

    var LAB_CONSTANTS$3 = labConstants;
    var unpack$h = utils.unpack;
    var pow$a = Math.pow;

    var rgb2lab$2 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$h(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = rgb2xyz(r,g,b);
        var x = ref$1[0];
        var y = ref$1[1];
        var z = ref$1[2];
        var l = 116 * y - 16;
        return [l < 0 ? 0 : l, 500 * (x - y), 200 * (y - z)];
    };

    var rgb_xyz = function (r) {
        if ((r /= 255) <= 0.04045) { return r / 12.92; }
        return pow$a((r + 0.055) / 1.055, 2.4);
    };

    var xyz_lab = function (t) {
        if (t > LAB_CONSTANTS$3.t3) { return pow$a(t, 1 / 3); }
        return t / LAB_CONSTANTS$3.t2 + LAB_CONSTANTS$3.t0;
    };

    var rgb2xyz = function (r,g,b) {
        r = rgb_xyz(r);
        g = rgb_xyz(g);
        b = rgb_xyz(b);
        var x = xyz_lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / LAB_CONSTANTS$3.Xn);
        var y = xyz_lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / LAB_CONSTANTS$3.Yn);
        var z = xyz_lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / LAB_CONSTANTS$3.Zn);
        return [x,y,z];
    };

    var rgb2lab_1 = rgb2lab$2;

    var LAB_CONSTANTS$2 = labConstants;
    var unpack$g = utils.unpack;
    var pow$9 = Math.pow;

    /*
     * L* [0..100]
     * a [-100..100]
     * b [-100..100]
     */
    var lab2rgb$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$g(args, 'lab');
        var l = args[0];
        var a = args[1];
        var b = args[2];
        var x,y,z, r,g,b_;

        y = (l + 16) / 116;
        x = isNaN(a) ? y : y + a / 500;
        z = isNaN(b) ? y : y - b / 200;

        y = LAB_CONSTANTS$2.Yn * lab_xyz(y);
        x = LAB_CONSTANTS$2.Xn * lab_xyz(x);
        z = LAB_CONSTANTS$2.Zn * lab_xyz(z);

        r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);  // D65 -> sRGB
        g = xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
        b_ = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);

        return [r,g,b_,args.length > 3 ? args[3] : 1];
    };

    var xyz_rgb = function (r) {
        return 255 * (r <= 0.00304 ? 12.92 * r : 1.055 * pow$9(r, 1 / 2.4) - 0.055)
    };

    var lab_xyz = function (t) {
        return t > LAB_CONSTANTS$2.t1 ? t * t * t : LAB_CONSTANTS$2.t2 * (t - LAB_CONSTANTS$2.t0)
    };

    var lab2rgb_1 = lab2rgb$1;

    var unpack$f = utils.unpack;
    var type$e = utils.type;
    var chroma$b = chroma_1;
    var Color$u = Color_1;
    var input$7 = input$h;

    var rgb2lab$1 = rgb2lab_1;

    Color$u.prototype.lab = function() {
        return rgb2lab$1(this._rgb);
    };

    chroma$b.lab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$u, [ null ].concat( args, ['lab']) ));
    };

    input$7.format.lab = lab2rgb_1;

    input$7.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$f(args, 'lab');
            if (type$e(args) === 'array' && args.length === 3) {
                return 'lab';
            }
        }
    });

    var unpack$e = utils.unpack;
    var RAD2DEG = utils.RAD2DEG;
    var sqrt$3 = Math.sqrt;
    var atan2$2 = Math.atan2;
    var round$2 = Math.round;

    var lab2lch$2 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$e(args, 'lab');
        var l = ref[0];
        var a = ref[1];
        var b = ref[2];
        var c = sqrt$3(a * a + b * b);
        var h = (atan2$2(b, a) * RAD2DEG + 360) % 360;
        if (round$2(c*10000) === 0) { h = Number.NaN; }
        return [l, c, h];
    };

    var lab2lch_1 = lab2lch$2;

    var unpack$d = utils.unpack;
    var rgb2lab = rgb2lab_1;
    var lab2lch$1 = lab2lch_1;

    var rgb2lch$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$d(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = rgb2lab(r,g,b);
        var l = ref$1[0];
        var a = ref$1[1];
        var b_ = ref$1[2];
        return lab2lch$1(l,a,b_);
    };

    var rgb2lch_1 = rgb2lch$1;

    var unpack$c = utils.unpack;
    var DEG2RAD = utils.DEG2RAD;
    var sin$3 = Math.sin;
    var cos$3 = Math.cos;

    var lch2lab$2 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        /*
        Convert from a qualitative parameter h and a quantitative parameter l to a 24-bit pixel.
        These formulas were invented by David Dalrymple to obtain maximum contrast without going
        out of gamut if the parameters are in the range 0-1.

        A saturation multiplier was added by Gregor Aisch
        */
        var ref = unpack$c(args, 'lch');
        var l = ref[0];
        var c = ref[1];
        var h = ref[2];
        if (isNaN(h)) { h = 0; }
        h = h * DEG2RAD;
        return [l, cos$3(h) * c, sin$3(h) * c]
    };

    var lch2lab_1 = lch2lab$2;

    var unpack$b = utils.unpack;
    var lch2lab$1 = lch2lab_1;
    var lab2rgb = lab2rgb_1;

    var lch2rgb$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$b(args, 'lch');
        var l = args[0];
        var c = args[1];
        var h = args[2];
        var ref = lch2lab$1 (l,c,h);
        var L = ref[0];
        var a = ref[1];
        var b_ = ref[2];
        var ref$1 = lab2rgb (L,a,b_);
        var r = ref$1[0];
        var g = ref$1[1];
        var b = ref$1[2];
        return [r, g, b, args.length > 3 ? args[3] : 1];
    };

    var lch2rgb_1 = lch2rgb$1;

    var unpack$a = utils.unpack;
    var lch2rgb = lch2rgb_1;

    var hcl2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var hcl = unpack$a(args, 'hcl').reverse();
        return lch2rgb.apply(void 0, hcl);
    };

    var hcl2rgb_1 = hcl2rgb;

    var unpack$9 = utils.unpack;
    var type$d = utils.type;
    var chroma$a = chroma_1;
    var Color$t = Color_1;
    var input$6 = input$h;

    var rgb2lch = rgb2lch_1;

    Color$t.prototype.lch = function() { return rgb2lch(this._rgb); };
    Color$t.prototype.hcl = function() { return rgb2lch(this._rgb).reverse(); };

    chroma$a.lch = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$t, [ null ].concat( args, ['lch']) ));
    };
    chroma$a.hcl = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$t, [ null ].concat( args, ['hcl']) ));
    };

    input$6.format.lch = lch2rgb_1;
    input$6.format.hcl = hcl2rgb_1;

    ['lch','hcl'].forEach(function (m) { return input$6.autodetect.push({
        p: 2,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$9(args, m);
            if (type$d(args) === 'array' && args.length === 3) {
                return m;
            }
        }
    }); });

    /**
    	X11 color names

    	http://www.w3.org/TR/css3-color/#svg-color
    */

    var w3cx11$1 = {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflower: '#6495ed',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkgrey: '#a9a9a9',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkslategrey: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dimgrey: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        gold: '#ffd700',
        goldenrod: '#daa520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        grey: '#808080',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        indianred: '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        laserlemon: '#ffff54',
        lavender: '#e6e6fa',
        lavenderblush: '#fff0f5',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrod: '#fafad2',
        lightgoldenrodyellow: '#fafad2',
        lightgray: '#d3d3d3',
        lightgreen: '#90ee90',
        lightgrey: '#d3d3d3',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightslategrey: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        maroon2: '#7f0000',
        maroon3: '#b03060',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370db',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#db7093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        purple2: '#7f007f',
        purple3: '#a020f0',
        rebeccapurple: '#663399',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        slategrey: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32'
    };

    var w3cx11_1 = w3cx11$1;

    var Color$s = Color_1;
    var input$5 = input$h;
    var type$c = utils.type;

    var w3cx11 = w3cx11_1;
    var hex2rgb = hex2rgb_1;
    var rgb2hex = rgb2hex_1;

    Color$s.prototype.name = function() {
        var hex = rgb2hex(this._rgb, 'rgb');
        for (var i = 0, list = Object.keys(w3cx11); i < list.length; i += 1) {
            var n = list[i];

            if (w3cx11[n] === hex) { return n.toLowerCase(); }
        }
        return hex;
    };

    input$5.format.named = function (name) {
        name = name.toLowerCase();
        if (w3cx11[name]) { return hex2rgb(w3cx11[name]); }
        throw new Error('unknown color name: '+name);
    };

    input$5.autodetect.push({
        p: 5,
        test: function (h) {
            var rest = [], len = arguments.length - 1;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

            if (!rest.length && type$c(h) === 'string' && w3cx11[h.toLowerCase()]) {
                return 'named';
            }
        }
    });

    var unpack$8 = utils.unpack;

    var rgb2num$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$8(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        return (r << 16) + (g << 8) + b;
    };

    var rgb2num_1 = rgb2num$1;

    var type$b = utils.type;

    var num2rgb = function (num) {
        if (type$b(num) == "number" && num >= 0 && num <= 0xFFFFFF) {
            var r = num >> 16;
            var g = (num >> 8) & 0xFF;
            var b = num & 0xFF;
            return [r,g,b,1];
        }
        throw new Error("unknown num color: "+num);
    };

    var num2rgb_1 = num2rgb;

    var chroma$9 = chroma_1;
    var Color$r = Color_1;
    var input$4 = input$h;
    var type$a = utils.type;

    var rgb2num = rgb2num_1;

    Color$r.prototype.num = function() {
        return rgb2num(this._rgb);
    };

    chroma$9.num = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$r, [ null ].concat( args, ['num']) ));
    };

    input$4.format.num = num2rgb_1;

    input$4.autodetect.push({
        p: 5,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            if (args.length === 1 && type$a(args[0]) === 'number' && args[0] >= 0 && args[0] <= 0xFFFFFF) {
                return 'num';
            }
        }
    });

    var chroma$8 = chroma_1;
    var Color$q = Color_1;
    var input$3 = input$h;
    var unpack$7 = utils.unpack;
    var type$9 = utils.type;
    var round$1 = Math.round;

    Color$q.prototype.rgb = function(rnd) {
        if ( rnd === void 0 ) rnd=true;

        if (rnd === false) { return this._rgb.slice(0,3); }
        return this._rgb.slice(0,3).map(round$1);
    };

    Color$q.prototype.rgba = function(rnd) {
        if ( rnd === void 0 ) rnd=true;

        return this._rgb.slice(0,4).map(function (v,i) {
            return i<3 ? (rnd === false ? v : round$1(v)) : v;
        });
    };

    chroma$8.rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$q, [ null ].concat( args, ['rgb']) ));
    };

    input$3.format.rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgba = unpack$7(args, 'rgba');
        if (rgba[3] === undefined) { rgba[3] = 1; }
        return rgba;
    };

    input$3.autodetect.push({
        p: 3,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$7(args, 'rgba');
            if (type$9(args) === 'array' && (args.length === 3 ||
                args.length === 4 && type$9(args[3]) == 'number' && args[3] >= 0 && args[3] <= 1)) {
                return 'rgb';
            }
        }
    });

    /*
     * Based on implementation by Neil Bartlett
     * https://github.com/neilbartlett/color-temperature
     */

    var log$1 = Math.log;

    var temperature2rgb$1 = function (kelvin) {
        var temp = kelvin / 100;
        var r,g,b;
        if (temp < 66) {
            r = 255;
            g = temp < 6 ? 0 : -155.25485562709179 - 0.44596950469579133 * (g = temp-2) + 104.49216199393888 * log$1(g);
            b = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b = temp-10) + 115.67994401066147 * log$1(b);
        } else {
            r = 351.97690566805693 + 0.114206453784165 * (r = temp-55) - 40.25366309332127 * log$1(r);
            g = 325.4494125711974 + 0.07943456536662342 * (g = temp-50) - 28.0852963507957 * log$1(g);
            b = 255;
        }
        return [r,g,b,1];
    };

    var temperature2rgb_1 = temperature2rgb$1;

    /*
     * Based on implementation by Neil Bartlett
     * https://github.com/neilbartlett/color-temperature
     **/

    var temperature2rgb = temperature2rgb_1;
    var unpack$6 = utils.unpack;
    var round = Math.round;

    var rgb2temperature$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var rgb = unpack$6(args, 'rgb');
        var r = rgb[0], b = rgb[2];
        var minTemp = 1000;
        var maxTemp = 40000;
        var eps = 0.4;
        var temp;
        while (maxTemp - minTemp > eps) {
            temp = (maxTemp + minTemp) * 0.5;
            var rgb$1 = temperature2rgb(temp);
            if ((rgb$1[2] / rgb$1[0]) >= (b / r)) {
                maxTemp = temp;
            } else {
                minTemp = temp;
            }
        }
        return round(temp);
    };

    var rgb2temperature_1 = rgb2temperature$1;

    var chroma$7 = chroma_1;
    var Color$p = Color_1;
    var input$2 = input$h;

    var rgb2temperature = rgb2temperature_1;

    Color$p.prototype.temp =
    Color$p.prototype.kelvin =
    Color$p.prototype.temperature = function() {
        return rgb2temperature(this._rgb);
    };

    chroma$7.temp =
    chroma$7.kelvin =
    chroma$7.temperature = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$p, [ null ].concat( args, ['temp']) ));
    };

    input$2.format.temp =
    input$2.format.kelvin =
    input$2.format.temperature = temperature2rgb_1;

    var unpack$5 = utils.unpack;
    var cbrt = Math.cbrt;
    var pow$8 = Math.pow;
    var sign$1 = Math.sign;

    var rgb2oklab$2 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        // OKLab color space implementation taken from
        // https://bottosson.github.io/posts/oklab/
        var ref = unpack$5(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = [rgb2lrgb(r / 255), rgb2lrgb(g / 255), rgb2lrgb(b / 255)];
        var lr = ref$1[0];
        var lg = ref$1[1];
        var lb = ref$1[2];
        var l = cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
        var m = cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
        var s = cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

        return [
            0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
            1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
            0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
        ];
    };

    var rgb2oklab_1 = rgb2oklab$2;

    function rgb2lrgb(c) {
        var abs = Math.abs(c);
        if (abs < 0.04045) {
            return c / 12.92;
        }
        return (sign$1(c) || 1) * pow$8((abs + 0.055) / 1.055, 2.4);
    }

    var unpack$4 = utils.unpack;
    var pow$7 = Math.pow;
    var sign = Math.sign;

    /*
     * L* [0..100]
     * a [-100..100]
     * b [-100..100]
     */
    var oklab2rgb$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$4(args, 'lab');
        var L = args[0];
        var a = args[1];
        var b = args[2];

        var l = pow$7(L + 0.3963377774 * a + 0.2158037573 * b, 3);
        var m = pow$7(L - 0.1055613458 * a - 0.0638541728 * b, 3);
        var s = pow$7(L - 0.0894841775 * a - 1.291485548 * b, 3);

        return [
            255 * lrgb2rgb(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
            255 * lrgb2rgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
            255 * lrgb2rgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
            args.length > 3 ? args[3] : 1
        ];
    };

    var oklab2rgb_1 = oklab2rgb$1;

    function lrgb2rgb(c) {
        var abs = Math.abs(c);
        if (abs > 0.0031308) {
            return (sign(c) || 1) * (1.055 * pow$7(abs, 1 / 2.4) - 0.055);
        }
        return c * 12.92;
    }

    var unpack$3 = utils.unpack;
    var type$8 = utils.type;
    var chroma$6 = chroma_1;
    var Color$o = Color_1;
    var input$1 = input$h;

    var rgb2oklab$1 = rgb2oklab_1;

    Color$o.prototype.oklab = function () {
        return rgb2oklab$1(this._rgb);
    };

    chroma$6.oklab = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$o, [ null ].concat( args, ['oklab']) ));
    };

    input$1.format.oklab = oklab2rgb_1;

    input$1.autodetect.push({
        p: 3,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack$3(args, 'oklab');
            if (type$8(args) === 'array' && args.length === 3) {
                return 'oklab';
            }
        }
    });

    var unpack$2 = utils.unpack;
    var rgb2oklab = rgb2oklab_1;
    var lab2lch = lab2lch_1;

    var rgb2oklch$1 = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var ref = unpack$2(args, 'rgb');
        var r = ref[0];
        var g = ref[1];
        var b = ref[2];
        var ref$1 = rgb2oklab(r, g, b);
        var l = ref$1[0];
        var a = ref$1[1];
        var b_ = ref$1[2];
        return lab2lch(l, a, b_);
    };

    var rgb2oklch_1 = rgb2oklch$1;

    var unpack$1 = utils.unpack;
    var lch2lab = lch2lab_1;
    var oklab2rgb = oklab2rgb_1;

    var oklch2rgb = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = unpack$1(args, 'lch');
        var l = args[0];
        var c = args[1];
        var h = args[2];
        var ref = lch2lab(l, c, h);
        var L = ref[0];
        var a = ref[1];
        var b_ = ref[2];
        var ref$1 = oklab2rgb(L, a, b_);
        var r = ref$1[0];
        var g = ref$1[1];
        var b = ref$1[2];
        return [r, g, b, args.length > 3 ? args[3] : 1];
    };

    var oklch2rgb_1 = oklch2rgb;

    var unpack = utils.unpack;
    var type$7 = utils.type;
    var chroma$5 = chroma_1;
    var Color$n = Color_1;
    var input = input$h;

    var rgb2oklch = rgb2oklch_1;

    Color$n.prototype.oklch = function () {
        return rgb2oklch(this._rgb);
    };

    chroma$5.oklch = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new (Function.prototype.bind.apply( Color$n, [ null ].concat( args, ['oklch']) ));
    };

    input.format.oklch = oklch2rgb_1;

    input.autodetect.push({
        p: 3,
        test: function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            args = unpack(args, 'oklch');
            if (type$7(args) === 'array' && args.length === 3) {
                return 'oklch';
            }
        }
    });

    var Color$m = Color_1;
    var type$6 = utils.type;

    Color$m.prototype.alpha = function(a, mutate) {
        if ( mutate === void 0 ) mutate=false;

        if (a !== undefined && type$6(a) === 'number') {
            if (mutate) {
                this._rgb[3] = a;
                return this;
            }
            return new Color$m([this._rgb[0], this._rgb[1], this._rgb[2], a], 'rgb');
        }
        return this._rgb[3];
    };

    var Color$l = Color_1;

    Color$l.prototype.clipped = function() {
        return this._rgb._clipped || false;
    };

    var Color$k = Color_1;
    var LAB_CONSTANTS$1 = labConstants;

    Color$k.prototype.darken = function(amount) {
    	if ( amount === void 0 ) amount=1;

    	var me = this;
    	var lab = me.lab();
    	lab[0] -= LAB_CONSTANTS$1.Kn * amount;
    	return new Color$k(lab, 'lab').alpha(me.alpha(), true);
    };

    Color$k.prototype.brighten = function(amount) {
    	if ( amount === void 0 ) amount=1;

    	return this.darken(-amount);
    };

    Color$k.prototype.darker = Color$k.prototype.darken;
    Color$k.prototype.brighter = Color$k.prototype.brighten;

    var Color$j = Color_1;

    Color$j.prototype.get = function (mc) {
        var ref = mc.split('.');
        var mode = ref[0];
        var channel = ref[1];
        var src = this[mode]();
        if (channel) {
            var i = mode.indexOf(channel) - (mode.substr(0, 2) === 'ok' ? 2 : 0);
            if (i > -1) { return src[i]; }
            throw new Error(("unknown channel " + channel + " in mode " + mode));
        } else {
            return src;
        }
    };

    var Color$i = Color_1;
    var type$5 = utils.type;
    var pow$6 = Math.pow;

    var EPS = 1e-7;
    var MAX_ITER = 20;

    Color$i.prototype.luminance = function(lum) {
        if (lum !== undefined && type$5(lum) === 'number') {
            if (lum === 0) {
                // return pure black
                return new Color$i([0,0,0,this._rgb[3]], 'rgb');
            }
            if (lum === 1) {
                // return pure white
                return new Color$i([255,255,255,this._rgb[3]], 'rgb');
            }
            // compute new color using...
            var cur_lum = this.luminance();
            var mode = 'rgb';
            var max_iter = MAX_ITER;

            var test = function (low, high) {
                var mid = low.interpolate(high, 0.5, mode);
                var lm = mid.luminance();
                if (Math.abs(lum - lm) < EPS || !max_iter--) {
                    // close enough
                    return mid;
                }
                return lm > lum ? test(low, mid) : test(mid, high);
            };

            var rgb = (cur_lum > lum ? test(new Color$i([0,0,0]), this) : test(this, new Color$i([255,255,255]))).rgb();
            return new Color$i(rgb.concat( [this._rgb[3]]));
        }
        return rgb2luminance.apply(void 0, (this._rgb).slice(0,3));
    };


    var rgb2luminance = function (r,g,b) {
        // relative luminance
        // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        r = luminance_x(r);
        g = luminance_x(g);
        b = luminance_x(b);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    var luminance_x = function (x) {
        x /= 255;
        return x <= 0.03928 ? x/12.92 : pow$6((x+0.055)/1.055, 2.4);
    };

    var interpolator$1 = {};

    var Color$h = Color_1;
    var type$4 = utils.type;
    var interpolator = interpolator$1;

    var mix$1 = function (col1, col2, f) {
        if ( f === void 0 ) f=0.5;
        var rest = [], len = arguments.length - 3;
        while ( len-- > 0 ) rest[ len ] = arguments[ len + 3 ];

        var mode = rest[0] || 'lrgb';
        if (!interpolator[mode] && !rest.length) {
            // fall back to the first supported mode
            mode = Object.keys(interpolator)[0];
        }
        if (!interpolator[mode]) {
            throw new Error(("interpolation mode " + mode + " is not defined"));
        }
        if (type$4(col1) !== 'object') { col1 = new Color$h(col1); }
        if (type$4(col2) !== 'object') { col2 = new Color$h(col2); }
        return interpolator[mode](col1, col2, f)
            .alpha(col1.alpha() + f * (col2.alpha() - col1.alpha()));
    };

    var Color$g = Color_1;
    var mix = mix$1;

    Color$g.prototype.mix =
    Color$g.prototype.interpolate = function(col2, f) {
    	if ( f === void 0 ) f=0.5;
    	var rest = [], len = arguments.length - 2;
    	while ( len-- > 0 ) rest[ len ] = arguments[ len + 2 ];

    	return mix.apply(void 0, [ this, col2, f ].concat( rest ));
    };

    var Color$f = Color_1;

    Color$f.prototype.premultiply = function(mutate) {
    	if ( mutate === void 0 ) mutate=false;

    	var rgb = this._rgb;
    	var a = rgb[3];
    	if (mutate) {
    		this._rgb = [rgb[0]*a, rgb[1]*a, rgb[2]*a, a];
    		return this;
    	} else {
    		return new Color$f([rgb[0]*a, rgb[1]*a, rgb[2]*a, a], 'rgb');
    	}
    };

    var Color$e = Color_1;
    var LAB_CONSTANTS = labConstants;

    Color$e.prototype.saturate = function(amount) {
    	if ( amount === void 0 ) amount=1;

    	var me = this;
    	var lch = me.lch();
    	lch[1] += LAB_CONSTANTS.Kn * amount;
    	if (lch[1] < 0) { lch[1] = 0; }
    	return new Color$e(lch, 'lch').alpha(me.alpha(), true);
    };

    Color$e.prototype.desaturate = function(amount) {
    	if ( amount === void 0 ) amount=1;

    	return this.saturate(-amount);
    };

    var Color$d = Color_1;
    var type$3 = utils.type;

    Color$d.prototype.set = function (mc, value, mutate) {
        if ( mutate === void 0 ) mutate = false;

        var ref = mc.split('.');
        var mode = ref[0];
        var channel = ref[1];
        var src = this[mode]();
        if (channel) {
            var i = mode.indexOf(channel) - (mode.substr(0, 2) === 'ok' ? 2 : 0);
            if (i > -1) {
                if (type$3(value) == 'string') {
                    switch (value.charAt(0)) {
                        case '+':
                            src[i] += +value;
                            break;
                        case '-':
                            src[i] += +value;
                            break;
                        case '*':
                            src[i] *= +value.substr(1);
                            break;
                        case '/':
                            src[i] /= +value.substr(1);
                            break;
                        default:
                            src[i] = +value;
                    }
                } else if (type$3(value) === 'number') {
                    src[i] = value;
                } else {
                    throw new Error("unsupported value for Color.set");
                }
                var out = new Color$d(src, mode);
                if (mutate) {
                    this._rgb = out._rgb;
                    return this;
                }
                return out;
            }
            throw new Error(("unknown channel " + channel + " in mode " + mode));
        } else {
            return src;
        }
    };

    var Color$c = Color_1;

    var rgb = function (col1, col2, f) {
        var xyz0 = col1._rgb;
        var xyz1 = col2._rgb;
        return new Color$c(
            xyz0[0] + f * (xyz1[0]-xyz0[0]),
            xyz0[1] + f * (xyz1[1]-xyz0[1]),
            xyz0[2] + f * (xyz1[2]-xyz0[2]),
            'rgb'
        )
    };

    // register interpolator
    interpolator$1.rgb = rgb;

    var Color$b = Color_1;
    var sqrt$2 = Math.sqrt;
    var pow$5 = Math.pow;

    var lrgb = function (col1, col2, f) {
        var ref = col1._rgb;
        var x1 = ref[0];
        var y1 = ref[1];
        var z1 = ref[2];
        var ref$1 = col2._rgb;
        var x2 = ref$1[0];
        var y2 = ref$1[1];
        var z2 = ref$1[2];
        return new Color$b(
            sqrt$2(pow$5(x1,2) * (1-f) + pow$5(x2,2) * f),
            sqrt$2(pow$5(y1,2) * (1-f) + pow$5(y2,2) * f),
            sqrt$2(pow$5(z1,2) * (1-f) + pow$5(z2,2) * f),
            'rgb'
        )
    };

    // register interpolator
    interpolator$1.lrgb = lrgb;

    var Color$a = Color_1;

    var lab = function (col1, col2, f) {
        var xyz0 = col1.lab();
        var xyz1 = col2.lab();
        return new Color$a(
            xyz0[0] + f * (xyz1[0]-xyz0[0]),
            xyz0[1] + f * (xyz1[1]-xyz0[1]),
            xyz0[2] + f * (xyz1[2]-xyz0[2]),
            'lab'
        )
    };

    // register interpolator
    interpolator$1.lab = lab;

    var Color$9 = Color_1;

    var _hsx = function (col1, col2, f, m) {
        var assign, assign$1;

        var xyz0, xyz1;
        if (m === 'hsl') {
            xyz0 = col1.hsl();
            xyz1 = col2.hsl();
        } else if (m === 'hsv') {
            xyz0 = col1.hsv();
            xyz1 = col2.hsv();
        } else if (m === 'hcg') {
            xyz0 = col1.hcg();
            xyz1 = col2.hcg();
        } else if (m === 'hsi') {
            xyz0 = col1.hsi();
            xyz1 = col2.hsi();
        } else if (m === 'lch' || m === 'hcl') {
            m = 'hcl';
            xyz0 = col1.hcl();
            xyz1 = col2.hcl();
        } else if (m === 'oklch') {
            xyz0 = col1.oklch().reverse();
            xyz1 = col2.oklch().reverse();
        }

        var hue0, hue1, sat0, sat1, lbv0, lbv1;
        if (m.substr(0, 1) === 'h' || m === 'oklch') {
            (assign = xyz0, hue0 = assign[0], sat0 = assign[1], lbv0 = assign[2]);
            (assign$1 = xyz1, hue1 = assign$1[0], sat1 = assign$1[1], lbv1 = assign$1[2]);
        }

        var sat, hue, lbv, dh;

        if (!isNaN(hue0) && !isNaN(hue1)) {
            // both colors have hue
            if (hue1 > hue0 && hue1 - hue0 > 180) {
                dh = hue1 - (hue0 + 360);
            } else if (hue1 < hue0 && hue0 - hue1 > 180) {
                dh = hue1 + 360 - hue0;
            } else {
                dh = hue1 - hue0;
            }
            hue = hue0 + f * dh;
        } else if (!isNaN(hue0)) {
            hue = hue0;
            if ((lbv1 == 1 || lbv1 == 0) && m != 'hsv') { sat = sat0; }
        } else if (!isNaN(hue1)) {
            hue = hue1;
            if ((lbv0 == 1 || lbv0 == 0) && m != 'hsv') { sat = sat1; }
        } else {
            hue = Number.NaN;
        }

        if (sat === undefined) { sat = sat0 + f * (sat1 - sat0); }
        lbv = lbv0 + f * (lbv1 - lbv0);
        return m === 'oklch' ? new Color$9([lbv, sat, hue], m) : new Color$9([hue, sat, lbv], m);
    };

    var interpolate_hsx$5 = _hsx;

    var lch = function (col1, col2, f) {
    	return interpolate_hsx$5(col1, col2, f, 'lch');
    };

    // register interpolator
    interpolator$1.lch = lch;
    interpolator$1.hcl = lch;

    var Color$8 = Color_1;

    var num = function (col1, col2, f) {
        var c1 = col1.num();
        var c2 = col2.num();
        return new Color$8(c1 + f * (c2-c1), 'num')
    };

    // register interpolator
    interpolator$1.num = num;

    var interpolate_hsx$4 = _hsx;

    var hcg = function (col1, col2, f) {
    	return interpolate_hsx$4(col1, col2, f, 'hcg');
    };

    // register interpolator
    interpolator$1.hcg = hcg;

    var interpolate_hsx$3 = _hsx;

    var hsi = function (col1, col2, f) {
    	return interpolate_hsx$3(col1, col2, f, 'hsi');
    };

    // register interpolator
    interpolator$1.hsi = hsi;

    var interpolate_hsx$2 = _hsx;

    var hsl = function (col1, col2, f) {
    	return interpolate_hsx$2(col1, col2, f, 'hsl');
    };

    // register interpolator
    interpolator$1.hsl = hsl;

    var interpolate_hsx$1 = _hsx;

    var hsv = function (col1, col2, f) {
    	return interpolate_hsx$1(col1, col2, f, 'hsv');
    };

    // register interpolator
    interpolator$1.hsv = hsv;

    var Color$7 = Color_1;

    var oklab = function (col1, col2, f) {
        var xyz0 = col1.oklab();
        var xyz1 = col2.oklab();
        return new Color$7(
            xyz0[0] + f * (xyz1[0] - xyz0[0]),
            xyz0[1] + f * (xyz1[1] - xyz0[1]),
            xyz0[2] + f * (xyz1[2] - xyz0[2]),
            'oklab'
        );
    };

    // register interpolator
    interpolator$1.oklab = oklab;

    var interpolate_hsx = _hsx;

    var oklch = function (col1, col2, f) {
        return interpolate_hsx(col1, col2, f, 'oklch');
    };

    // register interpolator
    interpolator$1.oklch = oklch;

    var Color$6 = Color_1;
    var clip_rgb$1 = utils.clip_rgb;
    var pow$4 = Math.pow;
    var sqrt$1 = Math.sqrt;
    var PI$1 = Math.PI;
    var cos$2 = Math.cos;
    var sin$2 = Math.sin;
    var atan2$1 = Math.atan2;

    var average = function (colors, mode, weights) {
        if ( mode === void 0 ) mode='lrgb';
        if ( weights === void 0 ) weights=null;

        var l = colors.length;
        if (!weights) { weights = Array.from(new Array(l)).map(function () { return 1; }); }
        // normalize weights
        var k = l / weights.reduce(function(a, b) { return a + b; });
        weights.forEach(function (w,i) { weights[i] *= k; });
        // convert colors to Color objects
        colors = colors.map(function (c) { return new Color$6(c); });
        if (mode === 'lrgb') {
            return _average_lrgb(colors, weights)
        }
        var first = colors.shift();
        var xyz = first.get(mode);
        var cnt = [];
        var dx = 0;
        var dy = 0;
        // initial color
        for (var i=0; i<xyz.length; i++) {
            xyz[i] = (xyz[i] || 0) * weights[0];
            cnt.push(isNaN(xyz[i]) ? 0 : weights[0]);
            if (mode.charAt(i) === 'h' && !isNaN(xyz[i])) {
                var A = xyz[i] / 180 * PI$1;
                dx += cos$2(A) * weights[0];
                dy += sin$2(A) * weights[0];
            }
        }

        var alpha = first.alpha() * weights[0];
        colors.forEach(function (c,ci) {
            var xyz2 = c.get(mode);
            alpha += c.alpha() * weights[ci+1];
            for (var i=0; i<xyz.length; i++) {
                if (!isNaN(xyz2[i])) {
                    cnt[i] += weights[ci+1];
                    if (mode.charAt(i) === 'h') {
                        var A = xyz2[i] / 180 * PI$1;
                        dx += cos$2(A) * weights[ci+1];
                        dy += sin$2(A) * weights[ci+1];
                    } else {
                        xyz[i] += xyz2[i] * weights[ci+1];
                    }
                }
            }
        });

        for (var i$1=0; i$1<xyz.length; i$1++) {
            if (mode.charAt(i$1) === 'h') {
                var A$1 = atan2$1(dy / cnt[i$1], dx / cnt[i$1]) / PI$1 * 180;
                while (A$1 < 0) { A$1 += 360; }
                while (A$1 >= 360) { A$1 -= 360; }
                xyz[i$1] = A$1;
            } else {
                xyz[i$1] = xyz[i$1]/cnt[i$1];
            }
        }
        alpha /= l;
        return (new Color$6(xyz, mode)).alpha(alpha > 0.99999 ? 1 : alpha, true);
    };


    var _average_lrgb = function (colors, weights) {
        var l = colors.length;
        var xyz = [0,0,0,0];
        for (var i=0; i < colors.length; i++) {
            var col = colors[i];
            var f = weights[i] / l;
            var rgb = col._rgb;
            xyz[0] += pow$4(rgb[0],2) * f;
            xyz[1] += pow$4(rgb[1],2) * f;
            xyz[2] += pow$4(rgb[2],2) * f;
            xyz[3] += rgb[3] * f;
        }
        xyz[0] = sqrt$1(xyz[0]);
        xyz[1] = sqrt$1(xyz[1]);
        xyz[2] = sqrt$1(xyz[2]);
        if (xyz[3] > 0.9999999) { xyz[3] = 1; }
        return new Color$6(clip_rgb$1(xyz));
    };

    // minimal multi-purpose interface

    // @requires utils color analyze

    var chroma$4 = chroma_1;
    var type$2 = utils.type;

    var pow$3 = Math.pow;

    var scale$2 = function(colors) {

        // constructor
        var _mode = 'rgb';
        var _nacol = chroma$4('#ccc');
        var _spread = 0;
        // const _fixed = false;
        var _domain = [0, 1];
        var _pos = [];
        var _padding = [0,0];
        var _classes = false;
        var _colors = [];
        var _out = false;
        var _min = 0;
        var _max = 1;
        var _correctLightness = false;
        var _colorCache = {};
        var _useCache = true;
        var _gamma = 1;

        // private methods

        var setColors = function(colors) {
            colors = colors || ['#fff', '#000'];
            if (colors && type$2(colors) === 'string' && chroma$4.brewer &&
                chroma$4.brewer[colors.toLowerCase()]) {
                colors = chroma$4.brewer[colors.toLowerCase()];
            }
            if (type$2(colors) === 'array') {
                // handle single color
                if (colors.length === 1) {
                    colors = [colors[0], colors[0]];
                }
                // make a copy of the colors
                colors = colors.slice(0);
                // convert to chroma classes
                for (var c=0; c<colors.length; c++) {
                    colors[c] = chroma$4(colors[c]);
                }
                // auto-fill color position
                _pos.length = 0;
                for (var c$1=0; c$1<colors.length; c$1++) {
                    _pos.push(c$1/(colors.length-1));
                }
            }
            resetCache();
            return _colors = colors;
        };

        var getClass = function(value) {
            if (_classes != null) {
                var n = _classes.length-1;
                var i = 0;
                while (i < n && value >= _classes[i]) {
                    i++;
                }
                return i-1;
            }
            return 0;
        };

        var tMapLightness = function (t) { return t; };
        var tMapDomain = function (t) { return t; };

        // const classifyValue = function(value) {
        //     let val = value;
        //     if (_classes.length > 2) {
        //         const n = _classes.length-1;
        //         const i = getClass(value);
        //         const minc = _classes[0] + ((_classes[1]-_classes[0]) * (0 + (_spread * 0.5)));  // center of 1st class
        //         const maxc = _classes[n-1] + ((_classes[n]-_classes[n-1]) * (1 - (_spread * 0.5)));  // center of last class
        //         val = _min + ((((_classes[i] + ((_classes[i+1] - _classes[i]) * 0.5)) - minc) / (maxc-minc)) * (_max - _min));
        //     }
        //     return val;
        // };

        var getColor = function(val, bypassMap) {
            var col, t;
            if (bypassMap == null) { bypassMap = false; }
            if (isNaN(val) || (val === null)) { return _nacol; }
            if (!bypassMap) {
                if (_classes && (_classes.length > 2)) {
                    // find the class
                    var c = getClass(val);
                    t = c / (_classes.length-2);
                } else if (_max !== _min) {
                    // just interpolate between min/max
                    t = (val - _min) / (_max - _min);
                } else {
                    t = 1;
                }
            } else {
                t = val;
            }

            // domain map
            t = tMapDomain(t);

            if (!bypassMap) {
                t = tMapLightness(t);  // lightness correction
            }

            if (_gamma !== 1) { t = pow$3(t, _gamma); }

            t = _padding[0] + (t * (1 - _padding[0] - _padding[1]));

            t = Math.min(1, Math.max(0, t));

            var k = Math.floor(t * 10000);

            if (_useCache && _colorCache[k]) {
                col = _colorCache[k];
            } else {
                if (type$2(_colors) === 'array') {
                    //for i in [0.._pos.length-1]
                    for (var i=0; i<_pos.length; i++) {
                        var p = _pos[i];
                        if (t <= p) {
                            col = _colors[i];
                            break;
                        }
                        if ((t >= p) && (i === (_pos.length-1))) {
                            col = _colors[i];
                            break;
                        }
                        if (t > p && t < _pos[i+1]) {
                            t = (t-p)/(_pos[i+1]-p);
                            col = chroma$4.interpolate(_colors[i], _colors[i+1], t, _mode);
                            break;
                        }
                    }
                } else if (type$2(_colors) === 'function') {
                    col = _colors(t);
                }
                if (_useCache) { _colorCache[k] = col; }
            }
            return col;
        };

        var resetCache = function () { return _colorCache = {}; };

        setColors(colors);

        // public interface

        var f = function(v) {
            var c = chroma$4(getColor(v));
            if (_out && c[_out]) { return c[_out](); } else { return c; }
        };

        f.classes = function(classes) {
            if (classes != null) {
                if (type$2(classes) === 'array') {
                    _classes = classes;
                    _domain = [classes[0], classes[classes.length-1]];
                } else {
                    var d = chroma$4.analyze(_domain);
                    if (classes === 0) {
                        _classes = [d.min, d.max];
                    } else {
                        _classes = chroma$4.limits(d, 'e', classes);
                    }
                }
                return f;
            }
            return _classes;
        };


        f.domain = function(domain) {
            if (!arguments.length) {
                return _domain;
            }
            _min = domain[0];
            _max = domain[domain.length-1];
            _pos = [];
            var k = _colors.length;
            if ((domain.length === k) && (_min !== _max)) {
                // update positions
                for (var i = 0, list = Array.from(domain); i < list.length; i += 1) {
                    var d = list[i];

                  _pos.push((d-_min) / (_max-_min));
                }
            } else {
                for (var c=0; c<k; c++) {
                    _pos.push(c/(k-1));
                }
                if (domain.length > 2) {
                    // set domain map
                    var tOut = domain.map(function (d,i) { return i/(domain.length-1); });
                    var tBreaks = domain.map(function (d) { return (d - _min) / (_max - _min); });
                    if (!tBreaks.every(function (val, i) { return tOut[i] === val; })) {
                        tMapDomain = function (t) {
                            if (t <= 0 || t >= 1) { return t; }
                            var i = 0;
                            while (t >= tBreaks[i+1]) { i++; }
                            var f = (t - tBreaks[i]) / (tBreaks[i+1] - tBreaks[i]);
                            var out = tOut[i] + f * (tOut[i+1] - tOut[i]);
                            return out;
                        };
                    }

                }
            }
            _domain = [_min, _max];
            return f;
        };

        f.mode = function(_m) {
            if (!arguments.length) {
                return _mode;
            }
            _mode = _m;
            resetCache();
            return f;
        };

        f.range = function(colors, _pos) {
            setColors(colors);
            return f;
        };

        f.out = function(_o) {
            _out = _o;
            return f;
        };

        f.spread = function(val) {
            if (!arguments.length) {
                return _spread;
            }
            _spread = val;
            return f;
        };

        f.correctLightness = function(v) {
            if (v == null) { v = true; }
            _correctLightness = v;
            resetCache();
            if (_correctLightness) {
                tMapLightness = function(t) {
                    var L0 = getColor(0, true).lab()[0];
                    var L1 = getColor(1, true).lab()[0];
                    var pol = L0 > L1;
                    var L_actual = getColor(t, true).lab()[0];
                    var L_ideal = L0 + ((L1 - L0) * t);
                    var L_diff = L_actual - L_ideal;
                    var t0 = 0;
                    var t1 = 1;
                    var max_iter = 20;
                    while ((Math.abs(L_diff) > 1e-2) && (max_iter-- > 0)) {
                        (function() {
                            if (pol) { L_diff *= -1; }
                            if (L_diff < 0) {
                                t0 = t;
                                t += (t1 - t) * 0.5;
                            } else {
                                t1 = t;
                                t += (t0 - t) * 0.5;
                            }
                            L_actual = getColor(t, true).lab()[0];
                            return L_diff = L_actual - L_ideal;
                        })();
                    }
                    return t;
                };
            } else {
                tMapLightness = function (t) { return t; };
            }
            return f;
        };

        f.padding = function(p) {
            if (p != null) {
                if (type$2(p) === 'number') {
                    p = [p,p];
                }
                _padding = p;
                return f;
            } else {
                return _padding;
            }
        };

        f.colors = function(numColors, out) {
            // If no arguments are given, return the original colors that were provided
            if (arguments.length < 2) { out = 'hex'; }
            var result = [];

            if (arguments.length === 0) {
                result = _colors.slice(0);

            } else if (numColors === 1) {
                result = [f(0.5)];

            } else if (numColors > 1) {
                var dm = _domain[0];
                var dd = _domain[1] - dm;
                result = __range__(0, numColors, false).map(function (i) { return f( dm + ((i/(numColors-1)) * dd) ); });

            } else { // returns all colors based on the defined classes
                colors = [];
                var samples = [];
                if (_classes && (_classes.length > 2)) {
                    for (var i = 1, end = _classes.length, asc = 1 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
                        samples.push((_classes[i-1]+_classes[i])*0.5);
                    }
                } else {
                    samples = _domain;
                }
                result = samples.map(function (v) { return f(v); });
            }

            if (chroma$4[out]) {
                result = result.map(function (c) { return c[out](); });
            }
            return result;
        };

        f.cache = function(c) {
            if (c != null) {
                _useCache = c;
                return f;
            } else {
                return _useCache;
            }
        };

        f.gamma = function(g) {
            if (g != null) {
                _gamma = g;
                return f;
            } else {
                return _gamma;
            }
        };

        f.nodata = function(d) {
            if (d != null) {
                _nacol = chroma$4(d);
                return f;
            } else {
                return _nacol;
            }
        };

        return f;
    };

    function __range__(left, right, inclusive) {
      var range = [];
      var ascending = left < right;
      var end = !inclusive ? right : ascending ? right + 1 : right - 1;
      for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
        range.push(i);
      }
      return range;
    }

    //
    // interpolates between a set of colors uzing a bezier spline
    //

    // @requires utils lab
    var Color$5 = Color_1;

    var scale$1 = scale$2;

    // nth row of the pascal triangle
    var binom_row = function(n) {
        var row = [1, 1];
        for (var i = 1; i < n; i++) {
            var newrow = [1];
            for (var j = 1; j <= row.length; j++) {
                newrow[j] = (row[j] || 0) + row[j - 1];
            }
            row = newrow;
        }
        return row;
    };

    var bezier = function(colors) {
        var assign, assign$1, assign$2;

        var I, lab0, lab1, lab2;
        colors = colors.map(function (c) { return new Color$5(c); });
        if (colors.length === 2) {
            // linear interpolation
            (assign = colors.map(function (c) { return c.lab(); }), lab0 = assign[0], lab1 = assign[1]);
            I = function(t) {
                var lab = ([0, 1, 2].map(function (i) { return lab0[i] + (t * (lab1[i] - lab0[i])); }));
                return new Color$5(lab, 'lab');
            };
        } else if (colors.length === 3) {
            // quadratic bezier interpolation
            (assign$1 = colors.map(function (c) { return c.lab(); }), lab0 = assign$1[0], lab1 = assign$1[1], lab2 = assign$1[2]);
            I = function(t) {
                var lab = ([0, 1, 2].map(function (i) { return ((1-t)*(1-t) * lab0[i]) + (2 * (1-t) * t * lab1[i]) + (t * t * lab2[i]); }));
                return new Color$5(lab, 'lab');
            };
        } else if (colors.length === 4) {
            // cubic bezier interpolation
            var lab3;
            (assign$2 = colors.map(function (c) { return c.lab(); }), lab0 = assign$2[0], lab1 = assign$2[1], lab2 = assign$2[2], lab3 = assign$2[3]);
            I = function(t) {
                var lab = ([0, 1, 2].map(function (i) { return ((1-t)*(1-t)*(1-t) * lab0[i]) + (3 * (1-t) * (1-t) * t * lab1[i]) + (3 * (1-t) * t * t * lab2[i]) + (t*t*t * lab3[i]); }));
                return new Color$5(lab, 'lab');
            };
        } else if (colors.length >= 5) {
            // general case (degree n bezier)
            var labs, row, n;
            labs = colors.map(function (c) { return c.lab(); });
            n = colors.length - 1;
            row = binom_row(n);
            I = function (t) {
                var u = 1 - t;
                var lab = ([0, 1, 2].map(function (i) { return labs.reduce(function (sum, el, j) { return (sum + row[j] * Math.pow( u, (n - j) ) * Math.pow( t, j ) * el[i]); }, 0); }));
                return new Color$5(lab, 'lab');
            };
        } else {
            throw new RangeError("No point in running bezier with only one color.")
        }
        return I;
    };

    var bezier_1 = function (colors) {
        var f = bezier(colors);
        f.scale = function () { return scale$1(f); };
        return f;
    };

    /*
     * interpolates between a set of colors uzing a bezier spline
     * blend mode formulas taken from http://www.venture-ware.com/kevin/coding/lets-learn-math-photoshop-blend-modes/
     */

    var chroma$3 = chroma_1;

    var blend = function (bottom, top, mode) {
        if (!blend[mode]) {
            throw new Error('unknown blend mode ' + mode);
        }
        return blend[mode](bottom, top);
    };

    var blend_f = function (f) { return function (bottom,top) {
            var c0 = chroma$3(top).rgb();
            var c1 = chroma$3(bottom).rgb();
            return chroma$3.rgb(f(c0, c1));
        }; };

    var each = function (f) { return function (c0, c1) {
            var out = [];
            out[0] = f(c0[0], c1[0]);
            out[1] = f(c0[1], c1[1]);
            out[2] = f(c0[2], c1[2]);
            return out;
        }; };

    var normal = function (a) { return a; };
    var multiply = function (a,b) { return a * b / 255; };
    var darken = function (a,b) { return a > b ? b : a; };
    var lighten = function (a,b) { return a > b ? a : b; };
    var screen = function (a,b) { return 255 * (1 - (1-a/255) * (1-b/255)); };
    var overlay = function (a,b) { return b < 128 ? 2 * a * b / 255 : 255 * (1 - 2 * (1 - a / 255 ) * ( 1 - b / 255 )); };
    var burn = function (a,b) { return 255 * (1 - (1 - b / 255) / (a/255)); };
    var dodge = function (a,b) {
        if (a === 255) { return 255; }
        a = 255 * (b / 255) / (1 - a / 255);
        return a > 255 ? 255 : a
    };

    // # add = (a,b) ->
    // #     if (a + b > 255) then 255 else a + b

    blend.normal = blend_f(each(normal));
    blend.multiply = blend_f(each(multiply));
    blend.screen = blend_f(each(screen));
    blend.overlay = blend_f(each(overlay));
    blend.darken = blend_f(each(darken));
    blend.lighten = blend_f(each(lighten));
    blend.dodge = blend_f(each(dodge));
    blend.burn = blend_f(each(burn));
    // blend.add = blend_f(each(add));

    var blend_1 = blend;

    // cubehelix interpolation
    // based on D.A. Green "A colour scheme for the display of astronomical intensity images"
    // http://astron-soc.in/bulletin/11June/289392011.pdf

    var type$1 = utils.type;
    var clip_rgb = utils.clip_rgb;
    var TWOPI = utils.TWOPI;
    var pow$2 = Math.pow;
    var sin$1 = Math.sin;
    var cos$1 = Math.cos;
    var chroma$2 = chroma_1;

    var cubehelix = function(start, rotations, hue, gamma, lightness) {
        if ( start === void 0 ) start=300;
        if ( rotations === void 0 ) rotations=-1.5;
        if ( hue === void 0 ) hue=1;
        if ( gamma === void 0 ) gamma=1;
        if ( lightness === void 0 ) lightness=[0,1];

        var dh = 0, dl;
        if (type$1(lightness) === 'array') {
            dl = lightness[1] - lightness[0];
        } else {
            dl = 0;
            lightness = [lightness, lightness];
        }

        var f = function(fract) {
            var a = TWOPI * (((start+120)/360) + (rotations * fract));
            var l = pow$2(lightness[0] + (dl * fract), gamma);
            var h = dh !== 0 ? hue[0] + (fract * dh) : hue;
            var amp = (h * l * (1-l)) / 2;
            var cos_a = cos$1(a);
            var sin_a = sin$1(a);
            var r = l + (amp * ((-0.14861 * cos_a) + (1.78277* sin_a)));
            var g = l + (amp * ((-0.29227 * cos_a) - (0.90649* sin_a)));
            var b = l + (amp * (+1.97294 * cos_a));
            return chroma$2(clip_rgb([r*255,g*255,b*255,1]));
        };

        f.start = function(s) {
            if ((s == null)) { return start; }
            start = s;
            return f;
        };

        f.rotations = function(r) {
            if ((r == null)) { return rotations; }
            rotations = r;
            return f;
        };

        f.gamma = function(g) {
            if ((g == null)) { return gamma; }
            gamma = g;
            return f;
        };

        f.hue = function(h) {
            if ((h == null)) { return hue; }
            hue = h;
            if (type$1(hue) === 'array') {
                dh = hue[1] - hue[0];
                if (dh === 0) { hue = hue[1]; }
            } else {
                dh = 0;
            }
            return f;
        };

        f.lightness = function(h) {
            if ((h == null)) { return lightness; }
            if (type$1(h) === 'array') {
                lightness = h;
                dl = h[1] - h[0];
            } else {
                lightness = [h,h];
                dl = 0;
            }
            return f;
        };

        f.scale = function () { return chroma$2.scale(f); };

        f.hue(hue);

        return f;
    };

    var Color$4 = Color_1;
    var digits = '0123456789abcdef';

    var floor$1 = Math.floor;
    var random = Math.random;

    var random_1 = function () {
        var code = '#';
        for (var i=0; i<6; i++) {
            code += digits.charAt(floor$1(random() * 16));
        }
        return new Color$4(code, 'hex');
    };

    var type = type$p;
    var log = Math.log;
    var pow$1 = Math.pow;
    var floor = Math.floor;
    var abs$1 = Math.abs;


    var analyze = function (data, key) {
        if ( key === void 0 ) key=null;

        var r = {
            min: Number.MAX_VALUE,
            max: Number.MAX_VALUE*-1,
            sum: 0,
            values: [],
            count: 0
        };
        if (type(data) === 'object') {
            data = Object.values(data);
        }
        data.forEach(function (val) {
            if (key && type(val) === 'object') { val = val[key]; }
            if (val !== undefined && val !== null && !isNaN(val)) {
                r.values.push(val);
                r.sum += val;
                if (val < r.min) { r.min = val; }
                if (val > r.max) { r.max = val; }
                r.count += 1;
            }
        });

        r.domain = [r.min, r.max];

        r.limits = function (mode, num) { return limits(r, mode, num); };

        return r;
    };


    var limits = function (data, mode, num) {
        if ( mode === void 0 ) mode='equal';
        if ( num === void 0 ) num=7;

        if (type(data) == 'array') {
            data = analyze(data);
        }
        var min = data.min;
        var max = data.max;
        var values = data.values.sort(function (a,b) { return a-b; });

        if (num === 1) { return [min,max]; }

        var limits = [];

        if (mode.substr(0,1) === 'c') { // continuous
            limits.push(min);
            limits.push(max);
        }

        if (mode.substr(0,1) === 'e') { // equal interval
            limits.push(min);
            for (var i=1; i<num; i++) {
                limits.push(min+((i/num)*(max-min)));
            }
            limits.push(max);
        }

        else if (mode.substr(0,1) === 'l') { // log scale
            if (min <= 0) {
                throw new Error('Logarithmic scales are only possible for values > 0');
            }
            var min_log = Math.LOG10E * log(min);
            var max_log = Math.LOG10E * log(max);
            limits.push(min);
            for (var i$1=1; i$1<num; i$1++) {
                limits.push(pow$1(10, min_log + ((i$1/num) * (max_log - min_log))));
            }
            limits.push(max);
        }

        else if (mode.substr(0,1) === 'q') { // quantile scale
            limits.push(min);
            for (var i$2=1; i$2<num; i$2++) {
                var p = ((values.length-1) * i$2)/num;
                var pb = floor(p);
                if (pb === p) {
                    limits.push(values[pb]);
                } else { // p > pb
                    var pr = p - pb;
                    limits.push((values[pb]*(1-pr)) + (values[pb+1]*pr));
                }
            }
            limits.push(max);

        }

        else if (mode.substr(0,1) === 'k') { // k-means clustering
            /*
            implementation based on
            http://code.google.com/p/figue/source/browse/trunk/figue.js#336
            simplified for 1-d input values
            */
            var cluster;
            var n = values.length;
            var assignments = new Array(n);
            var clusterSizes = new Array(num);
            var repeat = true;
            var nb_iters = 0;
            var centroids = null;

            // get seed values
            centroids = [];
            centroids.push(min);
            for (var i$3=1; i$3<num; i$3++) {
                centroids.push(min + ((i$3/num) * (max-min)));
            }
            centroids.push(max);

            while (repeat) {
                // assignment step
                for (var j=0; j<num; j++) {
                    clusterSizes[j] = 0;
                }
                for (var i$4=0; i$4<n; i$4++) {
                    var value = values[i$4];
                    var mindist = Number.MAX_VALUE;
                    var best = (void 0);
                    for (var j$1=0; j$1<num; j$1++) {
                        var dist = abs$1(centroids[j$1]-value);
                        if (dist < mindist) {
                            mindist = dist;
                            best = j$1;
                        }
                        clusterSizes[best]++;
                        assignments[i$4] = best;
                    }
                }

                // update centroids step
                var newCentroids = new Array(num);
                for (var j$2=0; j$2<num; j$2++) {
                    newCentroids[j$2] = null;
                }
                for (var i$5=0; i$5<n; i$5++) {
                    cluster = assignments[i$5];
                    if (newCentroids[cluster] === null) {
                        newCentroids[cluster] = values[i$5];
                    } else {
                        newCentroids[cluster] += values[i$5];
                    }
                }
                for (var j$3=0; j$3<num; j$3++) {
                    newCentroids[j$3] *= 1/clusterSizes[j$3];
                }

                // check convergence
                repeat = false;
                for (var j$4=0; j$4<num; j$4++) {
                    if (newCentroids[j$4] !== centroids[j$4]) {
                        repeat = true;
                        break;
                    }
                }

                centroids = newCentroids;
                nb_iters++;

                if (nb_iters > 200) {
                    repeat = false;
                }
            }

            // finished k-means clustering
            // the next part is borrowed from gabrielflor.it
            var kClusters = {};
            for (var j$5=0; j$5<num; j$5++) {
                kClusters[j$5] = [];
            }
            for (var i$6=0; i$6<n; i$6++) {
                cluster = assignments[i$6];
                kClusters[cluster].push(values[i$6]);
            }
            var tmpKMeansBreaks = [];
            for (var j$6=0; j$6<num; j$6++) {
                tmpKMeansBreaks.push(kClusters[j$6][0]);
                tmpKMeansBreaks.push(kClusters[j$6][kClusters[j$6].length-1]);
            }
            tmpKMeansBreaks = tmpKMeansBreaks.sort(function (a,b){ return a-b; });
            limits.push(tmpKMeansBreaks[0]);
            for (var i$7=1; i$7 < tmpKMeansBreaks.length; i$7+= 2) {
                var v = tmpKMeansBreaks[i$7];
                if (!isNaN(v) && (limits.indexOf(v) === -1)) {
                    limits.push(v);
                }
            }
        }
        return limits;
    };

    var analyze_1 = {analyze: analyze, limits: limits};

    var Color$3 = Color_1;


    var contrast = function (a, b) {
        // WCAG contrast ratio
        // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
        a = new Color$3(a);
        b = new Color$3(b);
        var l1 = a.luminance();
        var l2 = b.luminance();
        return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
    };

    var Color$2 = Color_1;
    var sqrt = Math.sqrt;
    var pow = Math.pow;
    var min = Math.min;
    var max = Math.max;
    var atan2 = Math.atan2;
    var abs = Math.abs;
    var cos = Math.cos;
    var sin = Math.sin;
    var exp = Math.exp;
    var PI = Math.PI;

    var deltaE = function(a, b, Kl, Kc, Kh) {
        if ( Kl === void 0 ) Kl=1;
        if ( Kc === void 0 ) Kc=1;
        if ( Kh === void 0 ) Kh=1;

        // Delta E (CIE 2000)
        // see http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html
        var rad2deg = function(rad) {
            return 360 * rad / (2 * PI);
        };
        var deg2rad = function(deg) {
            return (2 * PI * deg) / 360;
        };
        a = new Color$2(a);
        b = new Color$2(b);
        var ref = Array.from(a.lab());
        var L1 = ref[0];
        var a1 = ref[1];
        var b1 = ref[2];
        var ref$1 = Array.from(b.lab());
        var L2 = ref$1[0];
        var a2 = ref$1[1];
        var b2 = ref$1[2];
        var avgL = (L1 + L2)/2;
        var C1 = sqrt(pow(a1, 2) + pow(b1, 2));
        var C2 = sqrt(pow(a2, 2) + pow(b2, 2));
        var avgC = (C1 + C2)/2;
        var G = 0.5*(1-sqrt(pow(avgC, 7)/(pow(avgC, 7) + pow(25, 7))));
        var a1p = a1*(1+G);
        var a2p = a2*(1+G);
        var C1p = sqrt(pow(a1p, 2) + pow(b1, 2));
        var C2p = sqrt(pow(a2p, 2) + pow(b2, 2));
        var avgCp = (C1p + C2p)/2;
        var arctan1 = rad2deg(atan2(b1, a1p));
        var arctan2 = rad2deg(atan2(b2, a2p));
        var h1p = arctan1 >= 0 ? arctan1 : arctan1 + 360;
        var h2p = arctan2 >= 0 ? arctan2 : arctan2 + 360;
        var avgHp = abs(h1p - h2p) > 180 ? (h1p + h2p + 360)/2 : (h1p + h2p)/2;
        var T = 1 - 0.17*cos(deg2rad(avgHp - 30)) + 0.24*cos(deg2rad(2*avgHp)) + 0.32*cos(deg2rad(3*avgHp + 6)) - 0.2*cos(deg2rad(4*avgHp - 63));
        var deltaHp = h2p - h1p;
        deltaHp = abs(deltaHp) <= 180 ? deltaHp : h2p <= h1p ? deltaHp + 360 : deltaHp - 360;
        deltaHp = 2*sqrt(C1p*C2p)*sin(deg2rad(deltaHp)/2);
        var deltaL = L2 - L1;
        var deltaCp = C2p - C1p;    
        var sl = 1 + (0.015*pow(avgL - 50, 2))/sqrt(20 + pow(avgL - 50, 2));
        var sc = 1 + 0.045*avgCp;
        var sh = 1 + 0.015*avgCp*T;
        var deltaTheta = 30*exp(-pow((avgHp - 275)/25, 2));
        var Rc = 2*sqrt(pow(avgCp, 7)/(pow(avgCp, 7) + pow(25, 7)));
        var Rt = -Rc*sin(2*deg2rad(deltaTheta));
        var result = sqrt(pow(deltaL/(Kl*sl), 2) + pow(deltaCp/(Kc*sc), 2) + pow(deltaHp/(Kh*sh), 2) + Rt*(deltaCp/(Kc*sc))*(deltaHp/(Kh*sh)));
        return max(0, min(100, result));
    };

    var Color$1 = Color_1;

    // simple Euclidean distance
    var distance = function(a, b, mode) {
        if ( mode === void 0 ) mode='lab';

        // Delta E (CIE 1976)
        // see http://www.brucelindbloom.com/index.html?Equations.html
        a = new Color$1(a);
        b = new Color$1(b);
        var l1 = a.get(mode);
        var l2 = b.get(mode);
        var sum_sq = 0;
        for (var i in l1) {
            var d = (l1[i] || 0) - (l2[i] || 0);
            sum_sq += d*d;
        }
        return Math.sqrt(sum_sq);
    };

    var Color = Color_1;

    var valid = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        try {
            new (Function.prototype.bind.apply( Color, [ null ].concat( args) ));
            return true;
        } catch (e) {
            return false;
        }
    };

    // some pre-defined color scales:
    var chroma$1 = chroma_1;

    var scale = scale$2;

    var scales = {
    	cool: function cool() { return scale([chroma$1.hsl(180,1,.9), chroma$1.hsl(250,.7,.4)]) },
    	hot: function hot() { return scale(['#000','#f00','#ff0','#fff']).mode('rgb') }
    };

    /**
        ColorBrewer colors for chroma.js

        Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The
        Pennsylvania State University.

        Licensed under the Apache License, Version 2.0 (the "License");
        you may not use this file except in compliance with the License.
        You may obtain a copy of the License at
        http://www.apache.org/licenses/LICENSE-2.0

        Unless required by applicable law or agreed to in writing, software distributed
        under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
        CONDITIONS OF ANY KIND, either express or implied. See the License for the
        specific language governing permissions and limitations under the License.
    */

    var colorbrewer = {
        // sequential
        OrRd: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'],
        PuBu: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'],
        BuPu: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'],
        Oranges: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
        BuGn: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'],
        YlOrBr: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'],
        YlGn: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
        Reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
        RdPu: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'],
        Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
        YlGnBu: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
        Purples: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
        GnBu: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'],
        Greys: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
        YlOrRd: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
        PuRd: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'],
        Blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
        PuBuGn: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'],
        Viridis: ['#440154', '#482777', '#3f4a8a', '#31678e', '#26838f', '#1f9d8a', '#6cce5a', '#b6de2b', '#fee825'],

        // diverging

        Spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
        RdYlGn: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'],
        RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
        PiYG: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'],
        PRGn: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
        RdYlBu: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
        BrBG: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
        RdGy: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'],
        PuOr: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],

        // qualitative

        Set2: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
        Accent: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
        Set1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
        Set3: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'],
        Dark2: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
        Paired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
        Pastel2: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'],
        Pastel1: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2'],
    };

    // add lowercase aliases for case-insensitive matches
    for (var i = 0, list = Object.keys(colorbrewer); i < list.length; i += 1) {
        var key = list[i];

        colorbrewer[key.toLowerCase()] = colorbrewer[key];
    }

    var colorbrewer_1 = colorbrewer;

    var chroma = chroma_1;

    // feel free to comment out anything to rollup
    // a smaller chroma.js built

    // io --> convert colors

















    // operators --> modify existing Colors










    // interpolators












    // generators -- > create new colors
    chroma.average = average;
    chroma.bezier = bezier_1;
    chroma.blend = blend_1;
    chroma.cubehelix = cubehelix;
    chroma.mix = chroma.interpolate = mix$1;
    chroma.random = random_1;
    chroma.scale = scale$2;

    // other utility methods
    chroma.analyze = analyze_1.analyze;
    chroma.contrast = contrast;
    chroma.deltaE = deltaE;
    chroma.distance = distance;
    chroma.limits = analyze_1.limits;
    chroma.valid = valid;

    // scale
    chroma.scales = scales;

    // colors
    chroma.colors = w3cx11_1;
    chroma.brewer = colorbrewer_1;

    var chroma_js = chroma;

    return chroma_js;

}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__("./src/GraphX.ts");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});