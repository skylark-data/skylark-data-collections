
define([
    "./collections",
	"./Collection",
	"./array-list",
	"./tree-item"
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
