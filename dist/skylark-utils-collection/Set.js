/**
 * skylark-utils-collection - The skylark collection utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/arrays","./collections","./Collection"],function(t,n,e){var i=n.Set=e.inherit({klassName:"Set",clone:function(){return new i({items:this._.items})},difference:function(t){for(var n=[],e=this._getInnerItems(),r=0;r<e.length;r++){var s=e[r];t.contains(s)||n.push(s)}return new i(n)},exclude:function(t){var n=this._.items,e=n.indexOf(t);e>=0&&(n.splice(e,1),this.trigger("changed:exclude",{data:[t]}))},include:function(t){var n=this._.items;n.indexOf(t)<0&&(n.push(t),this.trigger("changed:include",{data:[t]}))},iterator:function(){var t=0;return{hasNext:function(){return t<this._items.length},next:function(){return this._items[t++]}}},intersection:function(t){for(var n=[],e=this._getInnerItems(),r=0;r<e.length;r++){var s=e[r];t.contains(s)&&n.push(s)}return new i(n)},isSubSet:function(t){for(var n=this._getInnerItems(),e=0;e<n.length;e++){var i=n[e];if(!t.contains(i))return!1}return!0},isSuperSet:function(t){return t.isSubSet(this)},union:function(t,n){for(var e=n.clone(),i=this._getInnerItems(),r=0;r<i.length;r++)e.include(i[r]);return e},init:function(n){n?this._items=t.makeArray(n):this._items=[]}});return i});
//# sourceMappingURL=sourcemaps/Set.js.map
