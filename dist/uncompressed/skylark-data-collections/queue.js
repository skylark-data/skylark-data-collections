
define([
    "./collections",
	"./list"
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
