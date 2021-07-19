define([
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
