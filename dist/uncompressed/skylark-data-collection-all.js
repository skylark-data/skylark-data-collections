/**
 * skylark-data-collection - The skylark collection utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-langx/_attach',[],function(){
    return  function attach(obj1,path,obj2) {
        if (typeof path == "string") {
            path = path.split(".");//[path]
        };
        var length = path.length,
            ns=obj1,
            i=0,
            name = path[i++];

        while (i < length) {
            ns = ns[name] = ns[name] || {};
            name = path[i++];
        }

        return ns[name] = obj2;
    }
});
define('skylark-langx/skylark',[
    "./_attach"
], function(_attach) {
    var skylark = {
    	attach : function(path,obj) {
    		return _attach(skylark,path,obj);
    	}
    };
    return skylark;
});

define('skylark-data-collection/collections',[
	"skylark-langx/skylark"
],function(skylark){
	return skylark.attach("data.collections",{});
});
define('skylark-langx/types',[
],function(){
    var toString = {}.toString;
    
    var type = (function() {
        var class2type = {};

        // Populate the class2type map
        "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function(name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        });

        return function type(obj) {
            return obj == null ? String(obj) :
                class2type[toString.call(obj)] || "object";
        };
    })();

    function isArray(object) {
        return object && object.constructor === Array;
    }


    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function/string/element and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * isArrayLike([1, 2, 3])
     * // => true
     *
     * isArrayLike(document.body.children)
     * // => false
     *
     * isArrayLike('abc')
     * // => true
     *
     * isArrayLike(Function)
     * // => false
     */    
    function isArrayLike(obj) {
        return !isString(obj) && !isHtmlNode(obj) && typeof obj.length == 'number' && !isFunction(obj);
    }

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
     * @example
     *
     * isBoolean(false)
     * // => true
     *
     * isBoolean(null)
     * // => false
     */
    function isBoolean(obj) {
        return typeof(obj) === "boolean";
    }

    function isDefined(obj) {
        return typeof obj !== 'undefined';
    }

    function isDocument(obj) {
        return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
    }

    function isEmptyObject(obj) {
        var name;
        for (name in obj) {
            if (obj[name] !== null) {
                return false;
            }
        }
        return true;
    }


    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * isFunction(parseInt)
     * // => true
     *
     * isFunction(/abc/)
     * // => false
     */
    function isFunction(value) {
        return type(value) == "function";
    }

    function isHtmlNode(obj) {
        return obj && obj.nodeType; // obj instanceof Node; //Consider the elements in IFRAME
    }

    function isInstanceOf( /*Object*/ value, /*Type*/ type) {
        //Tests whether the value is an instance of a type.
        if (value === undefined) {
            return false;
        } else if (value === null || type == Object) {
            return true;
        } else if (typeof value === "number") {
            return type === Number;
        } else if (typeof value === "string") {
            return type === String;
        } else if (typeof value === "boolean") {
            return type === Boolean;
        } else if (typeof value === "string") {
            return type === String;
        } else {
            return (value instanceof type) || (value && value.isInstanceOf ? value.isInstanceOf(type) : false);
        }
    }

    function isNull(value) {
      return type(value) === "null";
    }

    function isNumber(obj) {
        return typeof obj == 'number';
    }

    function isObject(obj) {
        return type(obj) == "object";
    }

    function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
    }

    function isString(obj) {
        return typeof obj === 'string';
    }

    function isWindow(obj) {
        return obj && obj == obj.window;
    }

    function isSameOrigin(href) {
        if (href) {
            var origin = location.protocol + '//' + location.hostname;
            if (location.port) {
                origin += ':' + location.port;
            }
            return href.startsWith(origin);
        }
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && objectToString.call(value) == symbolTag);
    }

    function isUndefined(value) {
      return value === undefined
    }

    return {

        isArray: isArray,

        isArrayLike: isArrayLike,

        isBoolean: isBoolean,

        isDefined: isDefined,

        isDocument: isDocument,

        isEmpty : isEmptyObject,

        isEmptyObject: isEmptyObject,

        isFunction: isFunction,

        isHtmlNode: isHtmlNode,

        isNull: isNull,

        isNumber: isNumber,

        isNumeric: isNumber,

        isObject: isObject,

        isPlainObject: isPlainObject,

        isString: isString,

        isSameOrigin: isSameOrigin,

        isSymbol : isSymbol,

        isUndefined: isUndefined,

        isWindow: isWindow,

        type: type
    };

});
define('skylark-langx/arrays',[
	"./types"
],function(types,objects){
	var filter = Array.prototype.filter,
		isArrayLike = types.isArrayLike;

    /**
     * The base implementation of `_.findIndex` and `_.findLastIndex` without
     * support for iteratee shorthands.
     *
     * @param {Array} array The array to inspect.
     * @param {Function} predicate The function invoked per iteration.
     * @param {number} fromIndex The index to search from.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length,
          index = fromIndex + (fromRight ? 1 : -1);

      while ((fromRight ? index-- : ++index < length)) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
     *
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} fromIndex The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseIndexOf(array, value, fromIndex) {
      if (value !== value) {
        return baseFindIndex(array, baseIsNaN, fromIndex);
      }
      var index = fromIndex - 1,
          length = array.length;

      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `isNaN` without support for number objects.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     */
    function baseIsNaN(value) {
      return value !== value;
    }


    function compact(array) {
        return filter.call(array, function(item) {
            return item != null;
        });
    }

    function filter2(array,func) {
      return filter.call(array,func);
    }

    function flatten(array) {
        if (isArrayLike(array)) {
            var result = [];
            for (var i = 0; i < array.length; i++) {
                var item = array[i];
                if (isArrayLike(item)) {
                    for (var j = 0; j < item.length; j++) {
                        result.push(item[j]);
                    }
                } else {
                    result.push(item);
                }
            }
            return result;
        } else {
            return array;
        }
        //return array.length > 0 ? concat.apply([], array) : array;
    }

    function grep(array, callback) {
        var out = [];

        each(array, function(i, item) {
            if (callback(item, i)) {
                out.push(item);
            }
        });

        return out;
    }

    function inArray(item, array) {
        if (!array) {
            return -1;
        }
        var i;

        if (array.indexOf) {
            return array.indexOf(item);
        }

        i = array.length;
        while (i--) {
            if (array[i] === item) {
                return i;
            }
        }

        return -1;
    }

    function makeArray(obj, offset, startWith) {
       if (isArrayLike(obj) ) {
        return (startWith || []).concat(Array.prototype.slice.call(obj, offset || 0));
      }

      // array of single index
      return [ obj ];             
    }


    function forEach (arr, fn) {
      if (arr.forEach) return arr.forEach(fn)
      for (var i = 0; i < arr.length; i++) fn(arr[i], i);
    }

    function map(elements, callback) {
        var value, values = [],
            i, key
        if (isArrayLike(elements))
            for (i = 0; i < elements.length; i++) {
                value = callback.call(elements[i], elements[i], i);
                if (value != null) values.push(value)
            }
        else
            for (key in elements) {
                value = callback.call(elements[key], elements[key], key);
                if (value != null) values.push(value)
            }
        return flatten(values)
    }


    function merge( first, second ) {
      var l = second.length,
          i = first.length,
          j = 0;

      if ( typeof l === "number" ) {
        for ( ; j < l; j++ ) {
          first[ i++ ] = second[ j ];
        }
      } else {
        while ( second[j] !== undefined ) {
          first[ i++ ] = second[ j++ ];
        }
      }

      first.length = i;

      return first;
    }

    function reduce(array,callback,initialValue) {
        return Array.prototype.reduce.call(array,callback,initialValue);
    }

    function uniq(array) {
        return filter.call(array, function(item, idx) {
            return array.indexOf(item) == idx;
        })
    }

    return {
        baseFindIndex: baseFindIndex,

        baseIndexOf : baseIndexOf,
        
        compact: compact,

        first : function(items,n) {
            if (n) {
                return items.slice(0,n);
            } else {
                return items[0];
            }
        },

        filter : filter2,
        
        flatten: flatten,

        inArray: inArray,

        makeArray: makeArray,

        merge : merge,

        forEach : forEach,

        map : map,
        
        reduce : reduce,

        uniq : uniq

    }
});
define('skylark-langx/numbers',[
	"./types"
],function(types){
	var isObject = types.isObject,
		isSymbol = types.isSymbol;

	var INFINITY = 1 / 0,
	    MAX_SAFE_INTEGER = 9007199254740991,
	    MAX_INTEGER = 1.7976931348623157e+308,
	    NAN = 0 / 0;

	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g;

	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;

	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;

	/**
	 * Converts `value` to a finite number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.12.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted number.
	 * @example
	 *
	 * _.toFinite(3.2);
	 * // => 3.2
	 *
	 * _.toFinite(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toFinite(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toFinite('3.2');
	 * // => 3.2
	 */
	function toFinite(value) {
	  if (!value) {
	    return value === 0 ? value : 0;
	  }
	  value = toNumber(value);
	  if (value === INFINITY || value === -INFINITY) {
	    var sign = (value < 0 ? -1 : 1);
	    return sign * MAX_INTEGER;
	  }
	  return value === value ? value : 0;
	}

	/**
	 * Converts `value` to an integer.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
	 *
	 * @static
	 * @memberOf _
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted integer.
	 * @example
	 *
	 * _.toInteger(3.2);
	 * // => 3
	 *
	 * _.toInteger(Number.MIN_VALUE);
	 * // => 0
	 *
	 * _.toInteger(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toInteger('3.2');
	 * // => 3
	 */
	function toInteger(value) {
	  var result = toFinite(value),
	      remainder = result % 1;

	  return result === result ? (remainder ? result - remainder : result) : 0;
	}	

	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return NAN;
	  }
	  if (isObject(value)) {
	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	    value = isObject(other) ? (other + '') : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = value.replace(reTrim, '');
	  var isBinary = reIsBinary.test(value);
	  return (isBinary || reIsOctal.test(value))
	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	    : (reIsBadHex.test(value) ? NAN : +value);
	}

	return  {
		toFinite : toFinite,
		toNumber : toNumber,
		toInteger : toInteger
	}
});
define('skylark-langx/objects',[
    "./_attach",
	"./types",
    "./numbers"
],function(_attach,types,numbers){
	var hasOwnProperty = Object.prototype.hasOwnProperty,
        slice = Array.prototype.slice,
        isBoolean = types.isBoolean,
        isFunction = types.isFunction,
		isObject = types.isObject,
		isPlainObject = types.isPlainObject,
		isArray = types.isArray,
        isArrayLike = types.isArrayLike,
        isString = types.isString,
        toInteger = numbers.toInteger;

     // An internal function for creating assigner functions.
    function createAssigner(keysFunc, defaults) {
        return function(obj) {
          var length = arguments.length;
          if (defaults) obj = Object(obj);  
          if (length < 2 || obj == null) return obj;
          for (var index = 1; index < length; index++) {
            var source = arguments[index],
                keys = keysFunc(source),
                l = keys.length;
            for (var i = 0; i < l; i++) {
              var key = keys[i];
              if (!defaults || obj[key] === void 0) obj[key] = source[key];
            }
          }
          return obj;
       };
    }

    // Internal recursive comparison function for `isEqual`.
    var eq, deepEq;
    var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

    eq = function(a, b, aStack, bStack) {
        // Identical objects are equal. `0 === -0`, but they aren't identical.
        // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
        if (a === b) return a !== 0 || 1 / a === 1 / b;
        // `null` or `undefined` only equal to itself (strict comparison).
        if (a == null || b == null) return false;
        // `NaN`s are equivalent, but non-reflexive.
        if (a !== a) return b !== b;
        // Exhaust primitive checks
        var type = typeof a;
        if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
        return deepEq(a, b, aStack, bStack);
    };

    // Internal recursive comparison function for `isEqual`.
    deepEq = function(a, b, aStack, bStack) {
        // Unwrap any wrapped objects.
        //if (a instanceof _) a = a._wrapped;
        //if (b instanceof _) b = b._wrapped;
        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className !== toString.call(b)) return false;
        switch (className) {
            // Strings, numbers, regular expressions, dates, and booleans are compared by value.
            case '[object RegExp]':
            // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
            case '[object String]':
                // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                // equivalent to `new String("5")`.
                return '' + a === '' + b;
            case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive.
                // Object(NaN) is equivalent to NaN.
                if (+a !== +a) return +b !== +b;
                // An `egal` comparison is performed for other numeric values.
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                // millisecond representations. Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a === +b;
            case '[object Symbol]':
                return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
        }

        var areArrays = className === '[object Array]';
        if (!areArrays) {
            if (typeof a != 'object' || typeof b != 'object') return false;
            // Objects with different constructors are not equivalent, but `Object`s or `Array`s
            // from different frames are.
            var aCtor = a.constructor, bCtor = b.constructor;
            if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor &&
                               isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
                return false;
            }
        }
        // Assume equality for cyclic structures. The algorithm for detecting cyclic
        // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

        // Initializing stack of traversed objects.
        // It's done here since we only need them for objects and arrays comparison.
        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
        while (length--) {
            // Linear search. Performance is inversely proportional to the number of
            // unique nested structures.
            if (aStack[length] === a) return bStack[length] === b;
        }

        // Add the first object to the stack of traversed objects.
        aStack.push(a);
        bStack.push(b);

        // Recursively compare objects and arrays.
        if (areArrays) {
            // Compare array lengths to determine if a deep comparison is necessary.
            length = a.length;
            if (length !== b.length) return false;
            // Deep compare the contents, ignoring non-numeric properties.
            while (length--) {
                if (!eq(a[length], b[length], aStack, bStack)) return false;
            }
        } else {
            // Deep compare objects.
            var keys = Object.keys(a), key;
            length = keys.length;
            // Ensure that both objects contain the same number of properties before comparing deep equality.
            if (Object.keys(b).length !== length) return false;
            while (length--) {
                // Deep compare each member
                key = keys[length];
                if (!(b[key]!==undefined && eq(a[key], b[key], aStack, bStack))) return false;
            }
        }
        // Remove the first object from the stack of traversed objects.
        aStack.pop();
        bStack.pop();
        return true;
    };

    // Retrieve all the property names of an object.
    function allKeys(obj) {
        if (!isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        return keys;
    }

    function each(obj, callback) {
        var length, key, i, undef, value;

        if (obj) {
            length = obj.length;

            if (length === undef) {
                // Loop object items
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        value = obj[key];
                        if (callback.call(value, key, value) === false) {
                            break;
                        }
                    }
                }
            } else {
                // Loop array items
                for (i = 0; i < length; i++) {
                    value = obj[i];
                    if (callback.call(value, i, value) === false) {
                        break;
                    }
                }
            }
        }

        return this;
    }

    function extend(target) {
        var deep, args = slice.call(arguments, 1);
        if (typeof target == 'boolean') {
            deep = target
            target = args.shift()
        }
        if (args.length == 0) {
            args = [target];
            target = this;
        }
        args.forEach(function(arg) {
            mixin(target, arg, deep);
        });
        return target;
    }

    // Retrieve the names of an object's own properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`.
    function keys(obj) {
        if (isObject(obj)) return [];
        var keys = [];
        for (var key in obj) if (has(obj, key)) keys.push(key);
        return keys;
    }

    function has(obj, path) {
        if (!isArray(path)) {
            return obj != null && hasOwnProperty.call(obj, path);
        }
        var length = path.length;
        for (var i = 0; i < length; i++) {
            var key = path[i];
            if (obj == null || !hasOwnProperty.call(obj, key)) {
                return false;
            }
            obj = obj[key];
        }
        return !!length;
    }

    /**
     * Checks if `value` is in `collection`. If `collection` is a string, it's
     * checked for a substring of `value`, otherwise
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * is used for equality comparisons. If `fromIndex` is negative, it's used as
     * the offset from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {boolean} Returns `true` if `value` is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'a': 1, 'b': 2 }, 1);
     * // => true
     *
     * _.includes('abcd', 'bc');
     * // => true
     */
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection)
        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
    }


   // Perform a deep comparison to check if two objects are equal.
    function isEqual(a, b) {
        return eq(a, b);
    }

    // Returns whether an object has a given set of `key:value` pairs.
    function isMatch(object, attrs) {
        var keys = keys(attrs), length = keys.length;
        if (object == null) return !length;
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
          var key = keys[i];
          if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }
        return true;
    }    

    function _mixin(target, source, deep, safe) {
        for (var key in source) {
            //if (!source.hasOwnProperty(key)) {
            //    continue;
            //}
            if (safe && target[key] !== undefined) {
                continue;
            }
            if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
                    target[key] = {};
                }
                if (isArray(source[key]) && !isArray(target[key])) {
                    target[key] = [];
                }
                _mixin(target[key], source[key], deep, safe);
            } else if (source[key] !== undefined) {
                target[key] = source[key]
            }
        }
        return target;
    }

    function _parseMixinArgs(args) {
        var params = slice.call(arguments, 0),
            target = params.shift(),
            deep = false;
        if (isBoolean(params[params.length - 1])) {
            deep = params.pop();
        }

        return {
            target: target,
            sources: params,
            deep: deep
        };
    }

    function mixin() {
        var args = _parseMixinArgs.apply(this, arguments);

        args.sources.forEach(function(source) {
            _mixin(args.target, source, args.deep, false);
        });
        return args.target;
    }

   // Return a copy of the object without the blacklisted properties.
    function omit(obj, prop1,prop2) {
        if (!obj) {
            return null;
        }
        var result = mixin({},obj);
        for(var i=1;i<arguments.length;i++) {
            var pn = arguments[i];
            if (pn in obj) {
                delete result[pn];
            }
        }
        return result;

    }

   // Return a copy of the object only containing the whitelisted properties.
    function pick(obj,prop1,prop2) {
        if (!obj) {
            return null;
        }
        var result = {};
        for(var i=1;i<arguments.length;i++) {
            var pn = arguments[i];
            if (pn in obj) {
                result[pn] = obj[pn];
            }
        }
        return result;
    }

    function removeItem(items, item) {
        if (isArray(items)) {
            var idx = items.indexOf(item);
            if (idx != -1) {
                items.splice(idx, 1);
            }
        } else if (isPlainObject(items)) {
            for (var key in items) {
                if (items[key] == item) {
                    delete items[key];
                    break;
                }
            }
        }

        return this;
    }

    function result(obj, path, fallback) {
        if (!isArray(path)) {
            path = path.split(".");//[path]
        };
        var length = path.length;
        if (!length) {
          return isFunction(fallback) ? fallback.call(obj) : fallback;
        }
        for (var i = 0; i < length; i++) {
          var prop = obj == null ? void 0 : obj[path[i]];
          if (prop === void 0) {
            prop = fallback;
            i = length; // Ensure we don't continue iterating.
          }
          obj = isFunction(prop) ? prop.call(obj) : prop;
        }

        return obj;
    }

    function safeMixin() {
        var args = _parseMixinArgs.apply(this, arguments);

        args.sources.forEach(function(source) {
            _mixin(args.target, source, args.deep, true);
        });
        return args.target;
    }

    // Retrieve the values of an object's properties.
    function values(obj) {
        var keys = allKeys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    }

    function clone( /*anything*/ src,checkCloneMethod) {
        var copy;
        if (src === undefined || src === null) {
            copy = src;
        } else if (checkCloneMethod && src.clone) {
            copy = src.clone();
        } else if (isArray(src)) {
            copy = [];
            for (var i = 0; i < src.length; i++) {
                copy.push(clone(src[i]));
            }
        } else if (isPlainObject(src)) {
            copy = {};
            for (var key in src) {
                copy[key] = clone(src[key]);
            }
        } else {
            copy = src;
        }

        return copy;

    }

    return {
        allKeys: allKeys,

        attach : _attach,

        clone: clone,

        defaults : createAssigner(allKeys, true),

        each : each,

        extend : extend,

        has: has,

        isEqual: isEqual,   

        includes: includes,

        isMatch: isMatch,

        keys: keys,

        mixin: mixin,

        omit: omit,

        pick: pick,

        removeItem: removeItem,

        result : result,
        
        safeMixin: safeMixin,

        values: values
    };



});
define('skylark-langx/klass',[
    "./arrays",
    "./objects",
    "./types"
],function(arrays,objects,types){
    var uniq = arrays.uniq,
        has = objects.has,
        mixin = objects.mixin,
        isArray = types.isArray,
        isDefined = types.isDefined;

/* for reference 
 function klass(props,parent) {
    var ctor = function(){
        this._construct();
    };
    ctor.prototype = props;
    if (parent) {
        ctor._proto_ = parent;
        props.__proto__ = parent.prototype;
    }
    return ctor;
}

// Type some JavaScript code here.
let animal = klass({
  _construct(){
      this.name = this.name + ",hi";
  },
    
  name: "Animal",
  eat() {         // [[HomeObject]] == animal
    alert(`${this.name} eats.`);
  }
    
    
});


let rabbit = klass({
  name: "Rabbit",
  _construct(){
      super._construct();
  },
  eat() {         // [[HomeObject]] == rabbit
    super.eat();
  }
},animal);

let longEar = klass({
  name: "Long Ear",
  eat() {         // [[HomeObject]] == longEar
    super.eat();
  }
},rabbit);
*/
    
    function inherit(ctor, base) {
        var f = function() {};
        f.prototype = base.prototype;

        ctor.prototype = new f();
    }

    var f1 = function() {
        function extendClass(ctor, props, options) {
            // Copy the properties to the prototype of the class.
            var proto = ctor.prototype,
                _super = ctor.superclass.prototype,
                noOverrided = options && options.noOverrided,
                overrides = options && options.overrides || {};

            for (var name in props) {
                if (name === "constructor") {
                    continue;
                }

                // Check if we're overwriting an existing function
                var prop = props[name];
                if (typeof props[name] == "function") {
                    proto[name] =  !prop._constructor && !noOverrided && typeof _super[name] == "function" ?
                          (function(name, fn, superFn) {
                            return function() {
                                var tmp = this.overrided;

                                // Add a new ._super() method that is the same method
                                // but on the super-class
                                this.overrided = superFn;

                                // The method only need to be bound temporarily, so we
                                // remove it when we're done executing
                                var ret = fn.apply(this, arguments);

                                this.overrided = tmp;

                                return ret;
                            };
                        })(name, prop, _super[name]) :
                        prop;
                } else if (types.isPlainObject(prop) && prop!==null && (prop.get)) {
                    Object.defineProperty(proto,name,prop);
                } else {
                    proto[name] = prop;
                }
            }
            return ctor;
        }

        function serialMixins(ctor,mixins) {
            var result = [];

            mixins.forEach(function(mixin){
                if (has(mixin,"__mixins__")) {
                     throw new Error("nested mixins");
                }
                var clss = [];
                while (mixin) {
                    clss.unshift(mixin);
                    mixin = mixin.superclass;
                }
                result = result.concat(clss);
            });

            result = uniq(result);

            result = result.filter(function(mixin){
                var cls = ctor;
                while (cls) {
                    if (mixin === cls) {
                        return false;
                    }
                    if (has(cls,"__mixins__")) {
                        var clsMixines = cls["__mixins__"];
                        for (var i=0; i<clsMixines.length;i++) {
                            if (clsMixines[i]===mixin) {
                                return false;
                            }
                        }
                    }
                    cls = cls.superclass;
                }
                return true;
            });

            if (result.length>0) {
                return result;
            } else {
                return false;
            }
        }

        function mergeMixins(ctor,mixins) {
            var newCtor =ctor;
            for (var i=0;i<mixins.length;i++) {
                var xtor = new Function();
                xtor.prototype = Object.create(newCtor.prototype);
                xtor.__proto__ = newCtor;
                xtor.superclass = null;
                mixin(xtor.prototype,mixins[i].prototype);
                xtor.prototype.__mixin__ = mixins[i];
                newCtor = xtor;
            }

            return newCtor;
        }

        function _constructor ()  {
            if (this._construct) {
                return this._construct.apply(this, arguments);
            } else  if (this.init) {
                return this.init.apply(this, arguments);
            }
        }

        return function createClass(props, parent, mixins,options) {
            if (isArray(parent)) {
                options = mixins;
                mixins = parent;
                parent = null;
            }
            parent = parent || Object;

            if (isDefined(mixins) && !isArray(mixins)) {
                options = mixins;
                mixins = false;
            }

            var innerParent = parent;

            if (mixins) {
                mixins = serialMixins(innerParent,mixins);
            }

            if (mixins) {
                innerParent = mergeMixins(innerParent,mixins);
            }

            var klassName = props.klassName || "",
                ctor = new Function(
                    "return function " + klassName + "() {" +
                    "var inst = this," +
                    " ctor = arguments.callee;" +
                    "if (!(inst instanceof ctor)) {" +
                    "inst = Object.create(ctor.prototype);" +
                    "}" +
                    "return ctor._constructor.apply(inst, arguments) || inst;" + 
                    "}"
                )();


            // Populate our constructed prototype object
            ctor.prototype = Object.create(innerParent.prototype);

            // Enforce the constructor to be what we expect
            ctor.prototype.constructor = ctor;
            ctor.superclass = parent;

            // And make this class extendable
            ctor.__proto__ = innerParent;


            if (!ctor._constructor) {
                ctor._constructor = _constructor;
            } 

            if (mixins) {
                ctor.__mixins__ = mixins;
            }

            if (!ctor.partial) {
                ctor.partial = function(props, options) {
                    return extendClass(this, props, options);
                };
            }
            if (!ctor.inherit) {
                ctor.inherit = function(props, mixins,options) {
                    return createClass(props, this, mixins,options);
                };
            }

            ctor.partial(props, options);

            return ctor;
        };
    }

    var createClass = f1();

    return createClass;
});
define('skylark-langx/Evented',[
    "./klass",
    "./arrays",
    "./objects",
    "./types"
],function(klass,arrays,objects,types){
    var slice = Array.prototype.slice,
        compact = arrays.compact,
        isDefined = types.isDefined,
        isPlainObject = types.isPlainObject,
        isFunction = types.isFunction,
        isString = types.isString,
        isEmptyObject = types.isEmptyObject,
        mixin = objects.mixin;

    function parse(event) {
        var segs = ("" + event).split(".");
        return {
            name: segs[0],
            ns: segs.slice(1).join(" ")
        };
    }

    var Evented = klass({
        on: function(events, selector, data, callback, ctx, /*used internally*/ one) {
            var self = this,
                _hub = this._hub || (this._hub = {});

            if (isPlainObject(events)) {
                ctx = callback;
                each(events, function(type, fn) {
                    self.on(type, selector, data, fn, ctx, one);
                });
                return this;
            }

            if (!isString(selector) && !isFunction(callback)) {
                ctx = callback;
                callback = data;
                data = selector;
                selector = undefined;
            }

            if (isFunction(data)) {
                ctx = callback;
                callback = data;
                data = null;
            }

            if (isString(events)) {
                events = events.split(/\s/)
            }

            events.forEach(function(event) {
                var parsed = parse(event),
                    name = parsed.name,
                    ns = parsed.ns;

                (_hub[name] || (_hub[name] = [])).push({
                    fn: callback,
                    selector: selector,
                    data: data,
                    ctx: ctx,
                    ns : ns,
                    one: one
                });
            });

            return this;
        },

        one: function(events, selector, data, callback, ctx) {
            return this.on(events, selector, data, callback, ctx, 1);
        },

        trigger: function(e /*,argument list*/ ) {
            if (!this._hub) {
                return this;
            }

            var self = this;

            if (isString(e)) {
                e = new CustomEvent(e);
            }

            Object.defineProperty(e,"target",{
                value : this
            });

            var args = slice.call(arguments, 1);
            if (isDefined(args)) {
                args = [e].concat(args);
            } else {
                args = [e];
            }
            [e.type || e.name, "all"].forEach(function(eventName) {
                var parsed = parse(eventName),
                    name = parsed.name,
                    ns = parsed.ns;

                var listeners = self._hub[name];
                if (!listeners) {
                    return;
                }

                var len = listeners.length,
                    reCompact = false;

                for (var i = 0; i < len; i++) {
                    var listener = listeners[i];
                    if (ns && (!listener.ns ||  !listener.ns.startsWith(ns))) {
                        continue;
                    }
                    if (e.data) {
                        if (listener.data) {
                            e.data = mixin({}, listener.data, e.data);
                        }
                    } else {
                        e.data = listener.data || null;
                    }
                    listener.fn.apply(listener.ctx, args);
                    if (listener.one) {
                        listeners[i] = null;
                        reCompact = true;
                    }
                }

                if (reCompact) {
                    self._hub[eventName] = compact(listeners);
                }

            });
            return this;
        },

        listened: function(event) {
            var evtArr = ((this._hub || (this._events = {}))[event] || []);
            return evtArr.length > 0;
        },

        listenTo: function(obj, event, callback, /*used internally*/ one) {
            if (!obj) {
                return this;
            }

            // Bind callbacks on obj,
            if (isString(callback)) {
                callback = this[callback];
            }

            if (one) {
                obj.one(event, callback, this);
            } else {
                obj.on(event, callback, this);
            }

            //keep track of them on listening.
            var listeningTo = this._listeningTo || (this._listeningTo = []),
                listening;

            for (var i = 0; i < listeningTo.length; i++) {
                if (listeningTo[i].obj == obj) {
                    listening = listeningTo[i];
                    break;
                }
            }
            if (!listening) {
                listeningTo.push(
                    listening = {
                        obj: obj,
                        events: {}
                    }
                );
            }
            var listeningEvents = listening.events,
                listeningEvent = listeningEvents[event] = listeningEvents[event] || [];
            if (listeningEvent.indexOf(callback) == -1) {
                listeningEvent.push(callback);
            }

            return this;
        },

        listenToOnce: function(obj, event, callback) {
            return this.listenTo(obj, event, callback, 1);
        },

        off: function(events, callback) {
            var _hub = this._hub || (this._hub = {});
            if (isString(events)) {
                events = events.split(/\s/)
            }

            events.forEach(function(event) {
                var parsed = parse(event),
                    name = parsed.name,
                    ns = parsed.ns;

                var evts = _hub[name];

                if (evts) {
                    var liveEvents = [];

                    if (callback || ns) {
                        for (var i = 0, len = evts.length; i < len; i++) {
                            
                            if (callback && evts[i].fn !== callback && evts[i].fn._ !== callback) {
                                liveEvents.push(evts[i]);
                                continue;
                            } 

                            if (ns && (!evts[i].ns || evts[i].ns.indexOf(ns)!=0)) {
                                liveEvents.push(evts[i]);
                                continue;
                            }
                        }
                    }

                    if (liveEvents.length) {
                        _hub[name] = liveEvents;
                    } else {
                        delete _hub[name];
                    }

                }
            });

            return this;
        },
        unlistenTo: function(obj, event, callback) {
            var listeningTo = this._listeningTo;
            if (!listeningTo) {
                return this;
            }
            for (var i = 0; i < listeningTo.length; i++) {
                var listening = listeningTo[i];

                if (obj && obj != listening.obj) {
                    continue;
                }

                var listeningEvents = listening.events;
                for (var eventName in listeningEvents) {
                    if (event && event != eventName) {
                        continue;
                    }

                    var listeningEvent = listeningEvents[eventName];

                    for (var j = 0; j < listeningEvent.length; j++) {
                        if (!callback || callback == listeningEvent[i]) {
                            listening.obj.off(eventName, listeningEvent[i], this);
                            listeningEvent[i] = null;
                        }
                    }

                    listeningEvent = listeningEvents[eventName] = compact(listeningEvent);

                    if (isEmptyObject(listeningEvent)) {
                        listeningEvents[eventName] = null;
                    }

                }

                if (isEmptyObject(listeningEvents)) {
                    listeningTo[i] = null;
                }
            }

            listeningTo = this._listeningTo = compact(listeningTo);
            if (isEmptyObject(listeningTo)) {
                this._listeningTo = null;
            }

            return this;
        }
    });

    return Evented;

});
define('skylark-data-collection/Collection',[
    "skylark-langx/Evented",
    "./collections"
], function(Evented, collections) {

    var Collection = collections.Collection = Evented.inherit({

        "klassName": "Collection",

        _clear: function() {
            throw new Error('Unimplemented API');
        },

        "clear": function() {
            //desc: "Removes all items from the Collection",
            //result: {
            //    type: Collection,
            //    desc: "this instance for chain call"
            //},
            //params: [],
            this._clear();
            this.trigger("changed:clear");
            return this;
        },

        /*
         *@method count
         *@return {Number}
         */
        count : /*Number*/function () {
            var c = 0,
                it = this.iterator();
            while(!it.hasNext()){
                c++;
            }
            return c;
        },

        "forEach": function( /*Function*/ func, /*Object?*/ thisArg) {
            //desc: "Executes a provided callback function once per collection item.",
            //result: {
            //    type: Number,
            //    desc: "the number of items"
            //},
            //params: [{
            //    name: "func",
            //    type: Function,
            //    desc: "Function to execute for each element."
            //}, {
            //    name: "thisArg",
            //    type: Object,
            //    desc: "Value to use as this when executing callback."
            //}],
            var it = this.iterator();
            while(it.hasNext()){
                var item = it.next();
                func.call(thisArg || item,item);
            }
            return this;

        },

        "iterator" : function() {
            throw new Error('Unimplemented API');
        },

        "toArray": function() {
            //desc: "Returns an array containing all of the items in this collection in proper sequence (from first to last item).",
            //result: {
            //    type: Array,
            //    desc: "an array containing all of the elements in this collection in proper sequence"
            //},
            //params: [],
            var items = [],
                it = this.iterator();
            while(!it.hasNext()){
                items.push(it.next());
            }
            return items;
        }
    });

    return Collection;
});


define('skylark-data-collection/Map',[
    "./collections",
    "./Collection"
], function( collections, Collection) {

    var Map = collections.Map = Collection.inherit({

        "klassName": "Map",

        _getInnerItems : function() {
            return this._items;
        },

        _clear : function() {
            this._items = [];
        },

        _findKeyByRegExp: function(regExp, callback) {
            var items = this._getInnerItems();
            return items.filter(function(key) {
                if (key.match(regExp)) {
                    if (callback) callback(key);
                    return true;
                } else {
                    return false;
                }
            });
        },

        "get":  function(strKey, silent) {
            //desc: "Returns the item at the specified key in the Hashtable.",
            //result: {
            //    type: Object,
            //    desc: "The item at the specified key."
            //},
            //params: [{
            //    name: "strKey",
            //    type: String,
            //    desc: "The key of the item to return."
            //}, {
            //    name: "silent",
            //    type: Boolean,
            //    desc: "the silent flag.",
            //    optional: true
            //}],
            if (typeof(strKey) != "string") {
                throw "hash key is not string!";
            }
            /*
            if (!silent && !this.contains(strKey)) {
                throw "hash key is not  existed";
            }
            */
            var items = this._getInnerItems();
            return items[strKey];
        },

        "iterator" : function() {
            var i =0;
            return {
                hasNext : function() {
                    return i < this._items.length;
                },
                next : function() {
                    var key =  this._items[i++];
                    return [this._items[key],key];
                }
            }
        },

        "set": function( /*String*/ strKey, /*Object*/ value) {
            //desc: "Replaces the item at the specified key in the Hashtable with the specified item.",
            //result: {
            //    type: Map,
            //    desc: "this instance for chain call."
            //},
            //params: [{
            //    name: "strKey",
            //    type: String,
            //    desc: "key of the item to replace."
            //}, {
            //    name: "value",
            //    type: Object,
            //    desc: "item to be stored at the specified position."
            //}],
            if (typeof(strKey) != "string") {
                throw "hash key is not string!";
            }

            /*
            if (!this.contains(strKey)) {
                throw "hash key is not existed";
            }
            */

            var items = this._getInnerItems();
            if (items.indexOf(strKey) == -1) {
                items.push(strKey);
            }
            var oldValue = items[strKey];
            if (oldValue !== value) {
                items[strKey] = value;
                var updated = {};
                updated[strKey] = {
                    name : strKey,
                    value : value,
                    oldValue : oldValue
                };
                this.trigger("changed" ,{ //TODO: "changed:"+ strKey
                    data : updated
                });
            }
            return this;
        },


        "remove": function( /*String*/ strKey) {
            //desc: "Removes the first occurrence of a specific item from the Hashtable",
            //result: {
            //    type: Map,
            //    desc: "this instance for chain call."
            //},
            //params: [{
            //    name: "strKey",
            //    type: String,
            //    desc: "The key for The item to remove from the Hashtable."
            //}],
            if (typeof(strKey) != "string") {
                throw "hash key is not string!";
            }
            var items = this._getInnerItems();
            var idx = items.indexOf(strKey);
            if (idx >= 0) {
                delete items[strKey];
                delete items[idx];
            }
        },

        findByRegExp: function( /*String*/ regExp, callback) {
            //desc: "find regExp items",
            //result: {
            //    type: Map,
            //    desc: "this instance for chain call."
            //},
            //params: [{
            //    name: "regExp",
            //    type: String,
            //    desc: "The key for The item to remove from the Hashtable."
            //}, {
            //    name: "callback",
            //    type: Function,
            //    desc: "the callback method"
            //}],
            var items = [],
                self = this;
            this._findKeyByRegExp(regExp, function(key) {
                var item = self.get(key);
                if (callback) callback(item);
                items.push(item);
            });
            return items;
        },

        removeByRegExp: function( /*String*/ regExp) {
            //desc: "Removes regExp items",
            //result: {
            //    type: Map,
            //    desc: "this instance for chain call."
            //},
            //params: [{
            //    name: "regExp",
            //    type: String,
            //    desc: "The key for The item to remove from the Hashtable."
            //}],
            var self = this;
            this._findKeyByRegExp(regExp, function(key) {
                self.remove(key);
            });
        },

        "toPlain": function() {
            //desc: "Returns a plain object containing all of the items in this Hashable.",
            //result: {
            //    type: Object,
            //    desc: "a plain object containing all of the items in this Hashtable."
            //},
            //params: [],
            var items = this._getInnerItems(); 

            for (var i = 0; i < items.length; i++) {
                var key = items[i];
                plain[key] = items[key];
            }
            return plain;
        },

        "toString": function( /*String?*/ delim) {
            //desc: "implementation of toString, follows [].toString().",
            //result: {
            //    type: String,
            //   desc: "The string."
            //},
            //params: [{
            //    name: "delim",
            //    type: String,
            //    desc: "The delim ",
            //    optional: true
            //}],
            var items = this._getInnerItems();

            return items.join((delim || ","));
        },

        "init": function( /*Object*/ data) {
            var items = this._items = [];
            for (var name in data) {
                items.push(name);
                items[name]= data[name];
            }
        }
       
    });
    return Map;
});


define('skylark-data-collection/HashMap',[
    "./collections",
	"./Map"
],function(collections,_Map) {

	var HashMap = collections.HashMap = _Map.inherit({
	});

	return HashMap;
});
define('skylark-data-collection/List',[
    "skylark-langx/arrays",
    "./collections",
    "./Collection"
], function(arrays,collections, Collection) {

    var List = collections.List = Collection.inherit({
        
        "klassName": "List",


        _getInnerItems : function() {
            return this._items;
        },

        _clear : function() {
            this._items = [];
        },

        "contains": function( /*Object*/ item) {
            //desc: "Determines whether an item is in the Collection.",
            //result: {
            //    type: Boolean,
            //    desc: "true if item is found in the Collection; otherwise, false."
            //},
            //params: [{
            //    name: "item",
            //    type: Object,
            //    desc: "The item to check."
            //}],
            var items = this._getInnerItems();
            return items.indexOf(item) >= 0;
        },

        "count": function() {
            //desc: "Gets the number of items actually contained in the Collection.",
            //result: {
            //    type: Number,
            //    desc: "the number of items"
            //},
            //params: [],
            var items = this._getInnerItems();
            return items.length;
        },

        "getAll": function() {
            //desc: "Returns all items.",
            //result: {
            //    type: Object,
            //    desc: "all items"
            //},
            //params: [],
            return this._getInnerItems();
        },

        "get": function(index) {
            //desc: "Returns the item at the specified position in the List.",
            //result: {
            //    type: Object,
            //    desc: "The item at the specified position."
            //},
            //params: [{
            //    name: "index",
            //    type: Number,
            //    desc: "index of the element to return."
            //}],
            var items = this._getInnerItems();
            if (index < 0 || index >= items.length) {
                throw new Error("Not exist:" + index);
            }
            return items[index];
        },

        "getRange": function( /*Number*/ index, /*Number*/ count) {
            //desc: "Returns an Array which represents a subset of the items in the source list.",
            //result: {
            //    type: Array,
            //    desc: "An Array which represents a subset of the items in the source list."
            //},
            //params: [{
            //    name: "index",
            //    type: Number,
            //    desc: "The zero-based list index at which the range starts."
            //}, {
            //    name: "count",
            //    type: Number,
            //    desc: "The number of items in the range."
            //}],
            var items = this._getInnerItems(),
                a1 = [];
            for (var i = Math.max(index, 0); i < count; i++) {
                if (i >= items.length) {
                    break;
                }
                a1.push(items[i]);
            }
            return a1;
        },

        "indexOf": function( /*Object*/ item) {
            //desc: "Searches for the specified Object and returns the zero-based index of the first occurrence within the entire list.",
            //result: {
            //    type: Number,
            //    desc: "The zero-based index of the first occurrence of value within the entire list,if found; otherwise, -1."
            //},
            //params: [{
            //    name: "item",
            //    type: Object,
            //    desc: "The Object to locate in the list. The value can be null."
            //}],
            var items = this._getInnerItems();
            return items.indexOf(item);
        },

        "iterator" : function() {
            var i =0,
                self = this;
            return {
                hasNext : function() {
                    return i < self._items.length;
                },
                next : function() {
                    return self._items[i++];
                }
            }
        },

        /*
         *@params {Object}args
         *  a plain object for the initialize arguments.
         */
        init :  function(/*Array*/data){
            if (data) {
                this._items = arrays.makeArray(data);
            } else {
                this._items =  [];
            }
        }
    });

    return List;
});

define('skylark-data-collection/ArrayList',[
    "./collections",
    "./List"
], function(collections, List) {

    var ArrayList = collections.ArrayList = List.inherit({
        
        "klassName": "ArrayList",

        "add": function(item) {
            //desc: "Adds an item to the end of the List.",
            //result: {
            //    type: List,
            //    desc: "this instance for chain call"
            //},
            //params: [{
            //    name: "item",
            //    type: Object,
            //    desc: "The item to be added to the end of the List. \nThe item can be null."
            //}],

            var items = this._getInnerItems();
            items.push(item);
            this.trigger("changed:add",{
                "data" :  [
                    { "item" : item, "index": items.length - 1, isSingle: true}
                ]
            });
            return this;
        },

        "addRange": function( /*Collection*/ c) {
            //desc: "Adds the items of a collection into the List at the specified index.",
            //result: {
            //    type: List,
            //    desc: "this instance for chain call"
            //},
            //params: [{
            //    name: "c",
            //    type: [Collection, Array],
            //    desc: "The Collection whose items should be added into the List.\nThe collection itself cannot be null, but it can contain items that are null."
            //}],
            var items = this._getInnerItems();
            var a1 = c.toArray ? c.toArray() : c,
                toAdd = [];
            for (var i = 0; i < a1.length; i++) {
                items.push(a1[i]);
                toAdd.push({
                    "item" : a1[i],
                    "index" : items.length-1
                });
            }
            this.trigger("changed:add",{
                "data" :  toAdd
            });
            return this;
        },


        "clone": function() {
            //desc: "Returns a shallow copy of this ArrayList instance. (The items themselves are not copied.)",
            //result: {
            //    type: ArrayList,
            //   desc: "a clone of this ArrayList instance."
            //},
            //params: [],

           return new ArrayList({
                "items": this._.items
            });
        },

        "insert": function( /*Number*/ index, /*Object*/ item) {
            //desc: "Inserts an item into the list at the specified index.",
            //result: {
            //    type: List,
            //    desc: "this instance for chain call."
            //},
            //params: [{
            //    name: "index",
            //    type: Number,
            //    desc: "The zero-based index at which the new item should be inserted."
            //}, {
            //    name: "item",
            //    type: Object,
            //    desc: "The item to insert. The value can be null."
            //}],
            var items = this._getInnerItems();
            if (index < 0 || index > items.length) {
                throw new Error("invalid parameter!");
            }
            items.splice(index, 0, item);
            this.trigger("changed",{
                "data" :  [
                    { "item" : item, "index" : index}
                ]
            });
            return this;
        },

        "insertRange": function( /*Number*/ index, /*Collection*/ c) {
            //desc: "Inserts the items of a collection into the list at the specified index.",
            //result: {
            //    type: List,
            //    desc: "this instance for chain call."
            //},
            //params: [{
            //    name: "index",
            //    type: Number,
            //    desc: "The zero-based index at which the new item should be inserted."
            //}, {
            //    name: "c",
            //    type: Collection,
            //    desc: "The Collection whose items should be inserted into the ArrayList. \nThe collection itself cannot be null, but it can contain items that are null. "
            //}],
            var items = this._getInnerItems(),
                toAdd = [];
            if (index < 0 || index >= items.length) {
                throw new Error("invalid parameter!");
            }
            var a1 = c.toArray();
            for (var i = 0; i<a1.length - 1; i++) {
                items.splice(index+i, 0, a1[i]);
                toAdd.push({
                    "item" : a1[i],
                    "index" : index+i
                });
            }
            this.trigger("changed:insert",{
                "data" :  toAdd
            });
            return this;
        },

        "removeFirstMatch": function( /*Object*/ item) {
            //desc: "Removes the first occurrence of a specific item from the list.",
            //result: {
            //    type: List,
            //    desc: "this instance for chain call."
            //},
            //params: [{
            //    name: "item",
            //    type: Object,
            //    desc: "The item to remove from the list. The value can be null."
            //}],
            var items = this._getInnerItems();
            for (var i = 0, len = items.length; i < len; i++) {
                if (items[i] === item) {
                    this.removeAt(i);
                    break;
                }
            }
            return this;
        },

        "remove": function( /*Object*/ item) {
            //desc: "Removes the all occurrence of a specific item from the list.",
            //result: {
            //    type: List,
            //    desc: "this instance for chain call."
            //},
            //params: [{
            //    name: "item",
            //    type: Object,
            //    desc: "The item to remove from the list. The value can be null."
            //}],
            var items = this._getInnerItems(),
                toRemove = [];
            for (var i = 0, len = items.length; i < len; i++) {
                if (items[i] === item) {
                    Array.removeAt(items, i);
                    toRemove.push({
                        "item" : item,
                        "index" : i
                    });
                }
            }
            this.trigger("changed:remove",{
                "data" :  toRemove
            });
            return this;
        },

        "removeAt": function(index) {
            //desc: "Removes the item at the specified index of the list.",
            //result: {
            //    type: List,
            //    desc: "this instance for chain call."
            //},
            //params: [{
            //    name: "index",
            //    type: Number,
            //    desc: "The zero-based index of the item to remove."
            //}],
            var items = this._getInnerItems(),
                item = items.splice(index, 1)[0];
            this.trigger("changed:remove",{
                "data" :  [
                    { "item" : item, "index" : index}
                ]
            });
            return this;
        },

        "removeRange": function( /*Number*/ index, /*Number*/ count) {
            //desc: "Removes a range of items from the list.",
            //result: {
            //    type: List,
            //    desc: "this instance for chain call."
            //},
            //params: [{
            //    name: "index",
            //    type: Number,
            //    desc: "The zero-based index of the item to remove."
            //}, {
            //    name: "count",
            //    type: Number,
            //    desc: "The number of items to remove."
            //}],
            var items = this._getInnerItems(),
                toRemove = [];

            for (var i = index; i<index+count;i++) {
                toRemove.push({
                    "item" : items[i],
                    "index" : i
                });
            }
            items.splice(index, count);

            this.trigger("changed:remove",{
                "data" : {
                    "removed" : toRemove
                }
            });
            return this;
        },

        "setByIndex": function( /*Number*/ index, /*Item*/ item) {
            //desc: "Replaces the item at the specified position in the list with the specified item.",
            //result: {
            //    type: List,
            //    desc: "this instance for chain call."
            //},
            //params: [{
            //    name: "index",
            //    type: Number,
            //    desc: "index of the item to replace."
            //}, {
            //    name: "item",
            //    type: Object,
            //    desc: "item to be stored at the specified position."
            //}],
            var items = this._getInnerItems();
            if (index < 0 || index >= items.length) throw new Error("" + i);
            var old = items[index];
            items[i] = item;

            this.trigger("changed:update",{
                "data" : [
                    { "item" : item, "index" : index,"oldItem":old}
                ]
            });
            return this;
        },

        "reset": function(newItems) {
            //desc: "Reset the internal array.",
            //result: {
            //    type: List,
            //    desc: "this instance for chain call."
            //},
            //params: [],
            var items = this._getInnerItems();
            items.length = 0;
            for (var i=0;i<newItems.length;i++){
                items.push(newItems[i]);
            }
            this.trigger("changed:reset");

            return this;
        },
        
        "reverse": function() {
            //desc: "Reverse the internal array.",
            //result: {
            //    type: List,
            //    desc: "this instance for chain call."
            //},
            //params: [],
            var items = this._getInnerItems();
            items.reverse();

            this.trigger("changed:reverse");
            return this;
        },

        "sort": function( /*Function?*/ fn) {
            //desc: "sort the internal array.",
            //result: {
            //    type: List,
            //    desc: "this instance for chain call."
            //},
            //params: [{
            //    name: "fn",
            //    type: Function,
            //    desc: "The function for sort"
            //}],
            var items = this._getInnerItems();
            if (fn) {
                items.sort(fn);
            } else {
                items.sort();
            }
            this.trigger("changed:sort");
            return this;
        }

    });

    return ArrayList;
});

define('skylark-langx/funcs',[
    "./objects",
	"./types"
],function(objects,types){
	var mixin = objects.mixin,
        slice = Array.prototype.slice,
        isFunction = types.isFunction,
        isString = types.isString;

    function defer(fn) {
        if (requestAnimationFrame) {
            requestAnimationFrame(fn);
        } else {
            setTimeoutout(fn);
        }
        return this;
    }

    function noop() {
    }

    function proxy(fn, context) {
        var args = (2 in arguments) && slice.call(arguments, 2)
        if (isFunction(fn)) {
            var proxyFn = function() {
                return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments);
            }
            return proxyFn;
        } else if (isString(context)) {
            if (args) {
                args.unshift(fn[context], fn)
                return proxy.apply(null, args)
            } else {
                return proxy(fn[context], fn);
            }
        } else {
            throw new TypeError("expected function");
        }
    }

    function debounce(fn, wait) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                fn.apply(context, args);
            };
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
   
    var delegate = (function() {
        // boodman/crockford delegation w/ cornford optimization
        function TMP() {}
        return function(obj, props) {
            TMP.prototype = obj;
            var tmp = new TMP();
            TMP.prototype = null;
            if (props) {
                mixin(tmp, props);
            }
            return tmp; // Object
        };
    })();

  var templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };


  function template(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = objects.defaults({}, settings,templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

    return {
        debounce: debounce,

        delegate: delegate,

        defer: defer,

        noop : noop,

        proxy: proxy,

        returnTrue: function() {
            return true;
        },

        returnFalse: function() {
            return false;
        },

        templateSettings : templateSettings,
        template : template
    };
});
define('skylark-langx/Deferred',[
    "./arrays",
	"./funcs",
    "./objects"
],function(arrays,funcs,objects){
    "use strict";
    
    var  PGLISTENERS = Symbol ? Symbol() : '__pglisteners',
         PGNOTIFIES = Symbol ? Symbol() : '__pgnotifies';

    var slice = Array.prototype.slice,
        proxy = funcs.proxy,
        makeArray = arrays.makeArray,
        result = objects.result,
        mixin = objects.mixin;

    mixin(Promise.prototype,{
        always: function(handler) {
            //this.done(handler);
            //this.fail(handler);
            this.then(handler,handler);
            return this;
        },
        done : function() {
            for (var i = 0;i<arguments.length;i++) {
                this.then(arguments[i]);
            }
            return this;
        },
        fail : function(handler) { 
            //return mixin(Promise.prototype.catch.call(this,handler),added);
            //return this.then(null,handler);
            this.catch(handler);
            return this;
         }
    });


    var Deferred = function() {
        var self = this,
            p = this.promise = new Promise(function(resolve, reject) {
                self._resolve = resolve;
                self._reject = reject;
            });

        wrapPromise(p,self);

        this[PGLISTENERS] = [];
        this[PGNOTIFIES] = [];

        //this.resolve = Deferred.prototype.resolve.bind(this);
        //this.reject = Deferred.prototype.reject.bind(this);
        //this.progress = Deferred.prototype.progress.bind(this);

    };

    function wrapPromise(p,d) {
        var   added = {
                state : function() {
                    if (d.isResolved()) {
                        return 'resolved';
                    }
                    if (d.isRejected()) {
                        return 'rejected';
                    }
                    return 'pending';
                },
                then : function(onResolved,onRejected,onProgress) {
                    if (onProgress) {
                        this.progress(onProgress);
                    }
                    return wrapPromise(Promise.prototype.then.call(this,
                            onResolved && function(args) {
                                if (args && args.__ctx__ !== undefined) {
                                    return onResolved.apply(args.__ctx__,args);
                                } else {
                                    return onResolved(args);
                                }
                            },
                            onRejected && function(args){
                                if (args && args.__ctx__ !== undefined) {
                                    return onRejected.apply(args.__ctx__,args);
                                } else {
                                    return onRejected(args);
                                }
                            }));
                },
                progress : function(handler) {
                    d[PGNOTIFIES].forEach(function (value) {
                        handler(value);
                    });
                    d[PGLISTENERS].push(handler);
                    return this;
                }

            };

        added.pipe = added.then;
        return mixin(p,added);

    }

    Deferred.prototype.resolve = function(value) {
        var args = slice.call(arguments);
        return this.resolveWith(null,args);
    };

    Deferred.prototype.resolveWith = function(context,args) {
        args = args ? makeArray(args) : []; 
        args.__ctx__ = context;
        this._resolve(args);
        this._resolved = true;
        return this;
    };

    Deferred.prototype.notify = function(value) {
        try {
            this[PGNOTIFIES].push(value);

            return this[PGLISTENERS].forEach(function (listener) {
                return listener(value);
            });
        } catch (error) {
          this.reject(error);
        }
        return this;
    };

    Deferred.prototype.reject = function(reason) {
        var args = slice.call(arguments);
        return this.rejectWith(null,args);
    };

    Deferred.prototype.rejectWith = function(context,args) {
        args = args ? makeArray(args) : []; 
        args.__ctx__ = context;
        this._reject(args);
        this._rejected = true;
        return this;
    };

    Deferred.prototype.isResolved = function() {
        return !!this._resolved;
    };

    Deferred.prototype.isRejected = function() {
        return !!this._rejected;
    };

    Deferred.prototype.then = function(callback, errback, progback) {
        var p = result(this,"promise");
        return p.then(callback, errback, progback);
    };

    Deferred.prototype.progress = function(progback){
        var p = result(this,"promise");
        return p.progress(progback);
    };
   
    Deferred.prototype.catch = function(errback) {
        var p = result(this,"promise");
        return p.catch(errback);
    };


    Deferred.prototype.done  = function() {
        var p = result(this,"promise");
        return p.done.apply(p,arguments);
    };

    Deferred.prototype.fail = function(errback) {
        var p = result(this,"promise");
        return p.fail(errback);
    };


    Deferred.all = function(array) {
        //return wrapPromise(Promise.all(array));
        var d = new Deferred();
        Promise.all(array).then(d.resolve.bind(d),d.reject.bind(d));
        return result(d,"promise");
    };

    Deferred.first = function(array) {
        return wrapPromise(Promise.race(array));
    };


    Deferred.when = function(valueOrPromise, callback, errback, progback) {
        var receivedPromise = valueOrPromise && typeof valueOrPromise.then === "function";
        var nativePromise = receivedPromise && valueOrPromise instanceof Promise;

        if (!receivedPromise) {
            if (arguments.length > 1) {
                return callback ? callback(valueOrPromise) : valueOrPromise;
            } else {
                return new Deferred().resolve(valueOrPromise);
            }
        } else if (!nativePromise) {
            var deferred = new Deferred(valueOrPromise.cancel);
            valueOrPromise.then(proxy(deferred.resolve,deferred), proxy(deferred.reject,deferred), deferred.notify);
            valueOrPromise = deferred.promise;
        }

        if (callback || errback || progback) {
            return valueOrPromise.then(callback, errback, progback);
        }
        return valueOrPromise;
    };

    Deferred.reject = function(err) {
        var d = new Deferred();
        d.reject(err);
        return d.promise;
    };

    Deferred.resolve = function(data) {
        var d = new Deferred();
        d.resolve.apply(d,arguments);
        return d.promise;
    };

    Deferred.immediate = Deferred.resolve;

    return Deferred;
});

define('skylark-data-collection/PagedList',[
    "skylark-langx/types",
    "skylark-langx/Deferred",
    "./collections",
    "./Collection"
], function(types, Deferred, collections, Collection) {
    
    var PagedList = collections.PagedList = Collection.inherit({

        "klassName": "PagedList",   　

        //{
        //  provider : function(){},
        //  totalCount : Infinity,  // the total count
        //}
        _options : null,

        _cachePageData: function(pageNo, pageItems) {
            var pages = this._pages,
                oldLen = this._count,
                len = (pageNo - 1) * this.pageSize + pageItems.length;

            pages[pageNo] = pageItems;

            this.trigger("changed:cache",{
                data : {
                    pageNo : pageNo,
                    pageItems : pageItems
                }
            })

            if (len > OldLen) {
                this._count = len;
                this.trigger("changed:count",{
                    data : {
                        count : len,
                        oldCount : oldLen
                    }
                })
            }
        },

        _getPageData: function(pageNo) {
            var items = this._getInnerItems(),
                pageItems = [],
                pageSize = this.pageSize,
                idx = (pageNo - 1) * pageSize,
                len = items.length;

            for (var i = 0; i < pageSize && idx < len; i++, idx++) {
                if (items[idx]) pageItems.push(items[idx]);
            }
            return pageItems;
        },

        "_laodPageData": function( /*Number*/ pageNo) {
            //desc: "Get a page at the specified index.",
            //result: {
            //    type: List,
            //    desc: "this page for chain call."
            //},
            //params: [{
            //    name: "pageNo",
            //    type: Number,
            //}],
            var loadData = this._options.loadData;
            pageSize = this.pageSize,
                from = (pageNo - 1) * pageSize;
            deferred = new Deferred(),
                self = this;
            loadData(from, pageSize).then(function(items) {
                self._cachePageData(pageNo, items);
                deferred.resolve(items);
            }, function(err) {
                deferred.reject(err);
            })

            return deferred.promise;

        },

        "pageSize": {
            "get": function() {
                return this._pageSize;
            }
        },

        "totalCount": {
            //"desc": "the total count",
            //"type": Number,
            //"defaultValue": Infinity
            get : function() {
                return this._options && (this._endless._options || Infinity);
            }
        },


        "totalPageCount": {
            "get": function() {
                return Math.ceil(this.totalCount / this.pageSize);
            }
        },

        "count": {
            //"desc": "the total count",
            //"type": Number,
            //"defaultValue": Infinity
            get : function() {
                return this._count;
            }
        },

        "pageCount": {
            "get": function() {
                return Math.ceil(this.count / this.pageSize);
            }
        },


        "hasMore": function() {
            //desc: "determine if the list has more items",
            //result: {
            //    type: Boolean,
            //    desc: "false if reached the end"
            //},
            //params: [],
            return this.count < this.totalCount;
        },

        "loadMore": function() {
            //desc: "load more data.",
            //result: {
            //    type: Promise,
            //    desc: "deferred object"
            //},
            //params: [{
            //}],

           return this._laodPageData(this.pageCount);
           
        },


        "getPage": function( /*Number*/ pageNo,autoLoad) {
            //desc: "Get a page at the specified index.",
            //result: {
            //    type: List,
            //    desc: "this page for chain call."
            //},
            //params: [{
            //    name: "pageNo",
            //    type: Number,
            //}],
            return  this._getPageData(pageNo);
        },

        fetchPage: function(pageNo) {
            var pageItems = this._getPageData(pageNo);
            if (!pageItems) {
                return this._laodPageData(pageNo);
            } else {
                return Deferred.when(items);
            }
        },

        "init"    :   function(pageSize,options){
            this._pages = {};
            this._count = 0;
            
            this._options =options;
        }

    });

    return PagedList;
});


define('skylark-data-collection/Queue',[
    "./collections",
	"./List"
],function(collections,List) {

	var Queue = collections.Queue = List.inherit({
		
		"klassName"	:	"Queue",

		"clone" :  function(item) {
			//desc : "Returns a shallow copy of this Queue instance. (The items themselves are not copied.)",
			//result	:	{
			//	type : Queue, desc : "a clone of this Queue instance."
			//},
			//params : [
			//],
			var items = this._getInnerItems();
			return new Queue({
				"items"	:	items
			});
		},

		"dequeue" : function() {
			//desc : "Shift the first element off the queue and return it",
			//result	:	{
			//	type : Object, desc : "The first element of the Queue."
			//},
			//params : [
			//],

			var items = this._getInnerItems(),
				item = items.shift();

            this.trigger("changed:dequeue",{
                "data" :  item
            });
			
			return item;
		},

		"enqueue" : function(item) {
			//desc : "Puts the passed object at the end of the queue",
			//result	:	{
			//	type : Object, desc : "Returns this Queue for chain call."
			//},
			//params : [
			//	{name: "item", type: Object, desc: "The Item Object to push onto the Stack.\nThe item can be null."}
			//],

			var items = this._getInnerItems();

			items.push(item);

            this.trigger("changed:enqueue",{
                "data" :  item
            });

			return this;
		}
	});


	return Queue;

});

define('skylark-data-collection/Set',[
    "skylark-langx/arrays",
    "./collections",
    "./Collection"
], function(arrays,collections, Collection) {

    var Set = collections.Set = Collection.inherit({

        "klassName": "Set",

        /*
         *Returns a  copy of this Set instance. (The items themselves are not copied.)
         *@method clone
         *@return {Set}
         *  a clone of this Set instance.
         */
        "clone" :   function(){
            return new Set({
                "items" :   this._.items
            });
        },

        /*
         *Returns everything in this set that is not in setB.
         *@method intersection
         */
        difference : function(/*Set*/ setB){
            var result = [];
            var items=this._getInnerItems();
            for (var i = 0; i<items.length; i++) {
                var item=items[i];
                if(!setB.contains(item)){
                    result.push(item);
                }
            }
            return new Set(result);
        },

        exclude : function(/*Item*/item) {
            var items = this._.items,
                i = items.indexOf(item);
            if (i>=0) {
                items.splice(i,1);
                this.trigger("changed:exclude",{
                    "data" :  [
                        item
                    ]
                });
            }
        },

        include : function(/*Item*/item){
            var items = this._.items;
            if (items.indexOf(item)<0) {
                items.push(item);
                this.trigger("changed:include",{
                    "data" :  [
                        item
                    ]
                });
            }
        },

        "iterator" : function() {
            var i =0;
            return {
                hasNext : function() {
                    return i < this._items.length;
                },
                next : function() {
                    return this._items[i++];
                }
            }
        },

        /*
         *Return the intersection of the set and passed set.
         *@method intersection
         */
        intersection : function(/*Set*/ setB){
            var result = [];
            var items=this._getInnerItems();
            for (var i = 0; i<items.length; i++) {
                var item=items[i];
                if(setB.contains(item)){
                    result.push(item);
                }
            }
            return new Set(result);
        },


        /*
         *Returns if set B is a subset of the set.
         *@method isSubSet
         */
        isSubSet : function(/*Set*/ setB) {
            var items=this._getInnerItems();
            for (var i = 0; i<items.length; i++) {
                var item=items[i];
                if(!setB.contains(item)){
                    return false;
                }
            }
            return true;  
        },

        /*
         *Returns if set B is a superset of the set.
         *@method isSuperSet
         */
        isSuperSet : function(/*Set*/ setB){
            return setB.isSubSet(this);
        },

        /*
         *Return the union of the set and passed set.
         *
         */
        union : function(/*Set*/ setA, /*Set*/ setB){
            var result = setB.clone();
            var items=this._getInnerItems();
            for (var i = 0; i<items.length; i++) {
                result.include(items[i]);
            }
            return result;  //
        },

        "init"  : function(/*Object*/data){
            if (data) {
                this._items = arrays.makeArray(data);
            } else {
                this._items =  [];
            }
        }
        

    });

    return Set;
});


define('skylark-data-collection/Stack',[
    "./collections",
	"./List"
],function(collections,List) {

	var Stack = collections.Stack = List.inhert({
		"klassName"	:	"Stack",

		"clone" : function() {
			//desc : "Returns a shallow copy of this Stack instance. (The items themselves are not copied.)",
			//result	:	{
			//	type : Stack, desc : "a clone of this Stack instance."
			//},
			//params : [
			//],
			var items = this._getInnerItems();
			return new Stack(items)
		},

        "peek" : function() {
            //desc : "Returns the item object at the top of the Queue without removing it.",
            //result    :   {
            //  type : Object, desc : "The Item Object at the top of the Queue."
            //},
            //params : [
            //],

            var items = this._getInnerItems(),
                lastIndex = items.length-1;
            if(lastIndex > -1 ) {
                return items[lastIndex];
            }
            return null;
        },

		"pop" : function() {
			//desc : "Returns the item object at the top of the Stack and  removes it.",
			//result	:	{
			//	type : Object, desc : "The Item Object at the top of the Stack."
			//},
			//params : [
			//],
			var items = this._getInnerItems(),
				item = null;
			if( items.length > 0 ) {
				item = items.pop();
	            this.trigger("changed:pop",{
	                "data" :  item
	            });				
			}
			return item;
		},

		"push" : function(/*Object*/item) {
			//desc : "Inserts an item object at the top of the Stack.",
			//result	:	{
			//	type : Object, desc : "Returns this Stack for chain call."
			//},
			//params : [
			//	{name: "item", type: Object, desc: "The Item Object to push onto the Stack.\nThe item can be null."}
			//],

			var items = this._getInnerItems();
			items.push(item);
            this.trigger("changed:push",{
                "data" :  item
            });				
			return this;
		}
	});


	return Stack;

});


define('skylark-data-collection/TreeItem',[
    "skylark-langx/arrays",
    "skylark-langx/Evented",
    "./collections"
], function(arrays, Evented, collections) {

    var TreeItem = collections.TreeItem = Evented.inherit({

        "klassName": "TreeItem",
        
        "_internalChildren": function(copy) {
            var children = this._.children;
            if (copy) {
                return arrays.makeArray(children);
            } else {
                return children;
            }
        },

        "_checkPublicOperation" : function(name) {
            return true;
        },

        "_internalSetParent": function(parent) {
            this._.parent = parent;
        },

        "_internalAddChild": function(item, at) {
            var child = this._internalCreateItem(item),
                children = this._internalChildren();
            if (children) {
                if (at === undefined) {
                    children.push(child);
                } else {
                    children.insert(at, child);
                }
            }
            child._internalSetParent(this);

            return child;
        },

        "_internalRemoveChildAt": function(at) {
            var children = this._internalChildren();
            var child = children.splice(at,1);
            child._internalSetParent(null);
        },

        "_internalClearChildren": function() {
            var children = this._internalChildren();
            if (children) {
                for (var i = 0; i < children.length; i++) {
                    children[i]._internalSetParent(null);
                }
                children.length = 0;
            }
        },

        "_internalCreateItem": function(data) {
            var root = this.root,
                item = root ? root.createItem(data) : data;

            return item;
        },
        
        "name": {
            //"type": String
            get : function() {
                return this._.name;
            }
        },

        "data": {
            //"type": Object
            get : function() {
                return this._.data;
            }
        },

        "children": {
            type: Array,
            getter: function() {
                return this._internalChildren(true);
            }
        },

        "firstChild": {
            //desc: "Gets the first child tree item in the tree item collection.",
            //type: TreeItem,
            get: function() {
                var children = this._internalChildren();
                return children && children[0];
            }
        },

        "fullPath": {
            //desc: "Gets the path from the root tree item to the current tree item.",
            //type: String,
            get: function() {
                var path = this.name,
                    parent = this.parent;
                while (parent) {
                    path = parent.name + "/" + path;
                    parent = parent.parent;
                }
                return path;
            }
        },

        "lastChild": {
            //desc: "Gets the last child tree item in the tree item collection",
            //type: TreeItem,
            get: function() {
                var children = this._internalChildren();
                return children && children[children.length - 1];
            }
        },

        "lastDescendants": {
            //desc: "Gets the last descendants tree item in the tree item collection",
            //type: TreeItem,
            get: function() {
                var last = this.lastChild,
                    lastChild = last.lastChild;
                while (lastChild) {
                    last = lastChild;
                    lastChild = last.lastChild;
                }
                return last;
            }
        },

        "level": {
            //desc: "Gets the zero-based depth of the tree item in the Tree.\nFor the Level property, the root node is considered the first level of nesting and returns 0.",
            //type: Number,
            get: function() {
                var result = 0,
                    item = this.parent;
                while (item) {
                    result++;
                    item = item.parent;
                }
                return result;
            }
        },

        "next": {
            //desc: "Gets the next tree item.",
            //type: TreeItem,
            get: function() {
                var nextItem = this.firstChild;
                if (!nextItem) {
                    var item = this,
                        parent = item.parent;
                    while (parent) {
                        nextItem = parent.getNextChild(item);
                        if (nextItem) {
                            break;
                        }
                        item = parent;
                        parent = item.parent;
                    }
                }
                return nextItem;
            }
        },

        "nextSibling": {
            //desc: "Gets the next sibling tree item.",
            //type: TreeItem,
            get: function() {
                var parent = this.parent;
                return parent && parent.getNextChild(this);
            }
        },

        "parent": {
            //desc: "Gets the parent tree item of the current tree item.",
            //type: TreeItem
            get : function(){
                return this._.parent;
            }
        },

        "prev": {
            //desc: "Gets the previous tree item.",
            //type: TreeItem,
            get: function() {
                var prevSibling = this.prevSibling,
                    prevItem;
                if (prevSibling) {
                    prevItem = prevSibling.lastDescendants;
                    if (!prevItem) {
                        prevItem = prevSibling;
                    }
                } else {
                    prevItem = this.parent;
                }

                return prevItem;
            }
        },

        "prevSibling": {
            //desc: "Gets the previous sibling tree item.",
            //type: TreeItem,
            get: function() {
                var parent = this.parent;
                return parent && parent.getPrevChild(this);
            }
        },

        "root": {
            //desc: "Gets the tree that the tree item is assigned to.",
            //type: TreeItem,
            get: function() {
                var r = this;
                while (r.parent) {
                    r = r.parent;
                }
                return r;
            }
        },
        /*
         *
         *@method prepend a child item.
         *@return TreeItem
         */
        "prependChild": function( /*Object*/ item) {
            return this.addChild(item, 0);
        },

        /*
         *
         *@method add a Child item
         *@return TreeItem
         */
        "addChild": function( /*Object*/ item, at) {
            this._checkPublicOperation("addChild");
            var child = this._internalAddChild(item, at);

            this.trigger("changed:addChild",{
                "data" :  [
                    { "item" : child, "index": at, isSingle: true}
                ]
            });

            return this;
        },

        /*
         *
         *@method addChildLast
         *@return TreeItem
         */
        "appendChild": function( /*Object*/ item) {
            return this.addChild(this);
        },

        "canHaveChildren": function() {
            var children = this._internalChildren();
            return children !== undefined;
        },

        /*
         *
         *@method indexOfChild
         *@return Number
         */
        "childrenCount": function() {
            var children = this._internalChildren();
            return children ? children.length : 0;
        },

        /*
         *
         *@method clearChildren
         *@return
         */
        "clearChildren": function() {
            this._checkPublicOperation("clearChildren");
            this._internalClearChildren();

            this.trigger("changed:clearChildren");                    
            return this;
        },

        /*
         *
         *@method getChildAt
         *@return TreeItem
         */
        "getChildAt": function( /*Number*/ index) {
            var children = this._internalChildren();
            return children[index];
        },

        /*
         *
         *@method getChildren
         *@return Array
         */
        "getChildren": function() {
            return this.children;
        },

        /*
         *
         *@method getPrevChild
         *@return TreeItem
         */
        "getPrevChild": function( /*TreeItem*/ child) {
            var children = this._internalChildren(),
                idx = children.indexOf(child);
            if (idx > 0) {
                return children[idx - 1];
            } else {
                return null;
            }
        },

        /*
         *
         *@method getNextChild
         *@return TreeItem
         */
        "getNextChild": function( /*TreeItem*/ child) {
            var children = this._internalChildren(),
                idx = children.indexOf(child);
            if (idx >= 0 && idx < children.length - 1) {
                return children[idx + 1];
            } else {
                return null;
            }
        },

        /**
         *@method hasChildren
         *@return {Boolean}
         *  true  if this node has children.
         */
        "hasChildren": function() {
            var children = this._internalChildren();
            return children && children.length > 0;
        },

        /*
         *
         *@method indexOfChild
         *@return TreeItem
         */
        "indexOfChild": function( /*TreeItem*/ child) {
            var children = this._internalChildren();
            return children.indexOf(child);
        },


        /*
         *
         *@method indexOfChild
         *@return TreeItem
         */
        "insertChild": function( /*Object*/ data, /*Number*/ index) {
            return this.addChild(item, index);
        },

        parents : function() {
            var r = [],
                p = this.parent;
            while (p) {
                r.push(p);
                p = p.parent;
            }
            return r;
        },

        /*
         *Removes the current tree item from the tree.
         *@method remove
         */
        "remove": function() {
            var parent = this.parent;
            if (parent) {
                parent.removeChild(this);
            }
        },

        /*
         *
         *@method removeChild
         *@return TreeItem
         */
        "removeChild": function( /*TreeItem*/ child) {
            var at = this.indexOfChild(child);
            if (at>-1) {
                return this.removeChildAt(at);
            }
        },

        /*
         *
         *@method indexOfChild
         *@return TreeItem
         */
        "removeChildAt": function( /*Number*/ at) {
            this._checkPublicOperation("removeChild");

            this._internalRemoveChildAt(at);

            this.trigger("changed:removeChild",{
                "data" : [
                    { "item" : item, "index" : at}
                ]
            });
        },

        "init"  :   function(data){
            var _ = this._ = {};
            _.data = data;
            _.name = data.name;
            _.children = [];
        }
        
    });

    return TreeItem;
});


define('skylark-data-collection/Tree',[
    "./collections",
	"./Collection",
	"./ArrayList",
	"./TreeItem"
],function(collections,Collection,ArrayList,TreeItem){


	var Tree = collections.Tree = Collection.inherit({

		/*
		 *@method createNode
		 *@return {TreeNode}
		 */
		"createItem"	:	function(/*Object*/data){
			return new Tree.TreeItem(data);

		},

		"items" : {
			//type : Array,
			get : function() {
				return this.toArray();
			}
		},


        "iterator" : function() {
            var nextItem = this.firstItem();
            return {
                hasNext : function() {
                    return nextItem;
                },
                next : function() {
                	if (nextItem) {
	                	var ret = nextItem;
	                	nextItem = ret.next;
	                    return ret ;
                	}
                }
            }
        },

		/*
		 *@method count
		 *@return {Number}
		 */
		count : /*Number*/function () {
			var c = 0;
			this.forEach(function(item){
				c+=1;
			});
        	return c;
        },

        firstItem : function() {
        	var children = this._.children;
        	if (children && children.length) {
        		return children[0];
        	} else {
        		return null;
        	}
        },

        lastItem : function() {
        	var last = function(item,noself) {
        		var children = item.children;
        		if (children && children.length) {
        			return last(children[children.length-1],false);
        		} else {
        			return noself ? null : item;
        		}
        	}
        	return last(item,true)
        },

		"init"	:	function() {
			this._.children = [];
		}
	});

	Tree.TreeItem = TreeItem;

	return Tree;

});

define('skylark-data-collection/main',[
	"./collections",
	"./Collection",
	"./HashMap",
	"./List",
	"./Map",
	"./ArrayList",
	"./PagedList",
	"./Queue",
	"./Set",	
	"./Stack",	
	"./Tree",
	"./TreeItem"
],function(collections){
	return collections;
});
define('skylark-data-collection', ['skylark-data-collection/main'], function (main) { return main; });


},this);