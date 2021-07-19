
define([
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
