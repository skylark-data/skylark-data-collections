
define([
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
