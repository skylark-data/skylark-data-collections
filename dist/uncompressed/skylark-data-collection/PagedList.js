
define([
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
