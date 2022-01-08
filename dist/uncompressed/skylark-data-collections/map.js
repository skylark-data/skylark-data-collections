
define([
    "./collections",
    "./collection"
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
