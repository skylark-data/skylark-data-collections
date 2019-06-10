define([
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
