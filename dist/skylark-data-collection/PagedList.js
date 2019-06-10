/**
 * skylark-data-collection - The skylark collection utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/types","skylark-langx/Deferred","./collections","./Collection"],function(t,e,n,a){return n.PagedList=a.inherit({klassName:"PagedList",_options:null,_cachePageData:function(t,e){var n=this._pages,a=this._count,i=(t-1)*this.pageSize+e.length;n[t]=e,this.trigger("changed:cache",{data:{pageNo:t,pageItems:e}}),i>OldLen&&(this._count=i,this.trigger("changed:count",{data:{count:i,oldCount:a}}))},_getPageData:function(t){for(var e=this._getInnerItems(),n=[],a=this.pageSize,i=(t-1)*a,o=e.length,s=0;s<a&&i<o;s++,i++)e[i]&&n.push(e[i]);return n},_laodPageData:function(t){var n=this._options.loadData;return pageSize=this.pageSize,from=(t-1)*pageSize,deferred=new e,self=this,n(from,pageSize).then(function(e){self._cachePageData(t,e),deferred.resolve(e)},function(t){deferred.reject(t)}),deferred.promise},pageSize:{get:function(){return this._pageSize}},totalCount:{get:function(){return this._options&&(this._endless._options||1/0)}},totalPageCount:{get:function(){return Math.ceil(this.totalCount/this.pageSize)}},count:{get:function(){return this._count}},pageCount:{get:function(){return Math.ceil(this.count/this.pageSize)}},hasMore:function(){return this.count<this.totalCount},loadMore:function(){return this._laodPageData(this.pageCount)},getPage:function(t,e){return this._getPageData(t)},fetchPage:function(t){return this._getPageData(t)?e.when(items):this._laodPageData(t)},init:function(t,e){this._pages={},this._count=0,this._options=e}})});
//# sourceMappingURL=sourcemaps/PagedList.js.map
