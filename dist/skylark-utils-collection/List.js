/**
 * skylark-utils-collection - The skylark collection utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/arrays","./collections","./Collection"],function(t,n,e){var r=n.List=e.inherit({klassName:"List",_getInnerItems:function(){return this._items},_clear:function(){this._items=[]},contains:function(t){var n=this._getInnerItems();return n.indexOf(t)>=0},count:function(){var t=this._getInnerItems();return t.length},getAll:function(){return this._getInnerItems()},get:function(t){var n=this._getInnerItems();if(t<0||t>=n.length)throw new Error("Not exist:"+t);return n[t]},getRange:function(t,n){for(var e=this._getInnerItems(),r=[],i=Math.max(t,0);i<n&&!(i>=e.length);i++)r.push(e[i]);return r},indexOf:function(t){var n=this._getInnerItems();return n.indexOf(t)},iterator:function(){var t=0;return{hasNext:function(){return t<this._items.length},next:function(){return this._items[t++]}}},init:function(n){n?this._items=t.makeArray(n):this._items=[]}});return r});
//# sourceMappingURL=sourcemaps/List.js.map
