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

define('skylark-data-collection/collections',[
	"skylark-langx/skylark"
],function(skylark){
	return skylark.attach("data.collections",{});
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
//# sourceMappingURL=sourcemaps/skylark-data-collection.js.map
