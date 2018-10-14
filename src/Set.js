define([
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
