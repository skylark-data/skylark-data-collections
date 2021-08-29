define([
    "skylark-langx-arrays",
    "./collections",
    "./collection"
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
