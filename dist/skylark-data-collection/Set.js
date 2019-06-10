/**
 * skylark-data-collection - The skylark collection utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/arrays","./collections","./Collection"],function(n,t,e){var i=t.Set=e.inherit({klassName:"Set",clone:function(){return new i({items:this._.items})},difference:function(n){for(var t=[],e=this._getInnerItems(),r=0;r<e.length;r++){var s=e[r];n.contains(s)||t.push(s)}return new i(t)},exclude:function(n){var t=this._.items,e=t.indexOf(n);e>=0&&(t.splice(e,1),this.trigger("changed:exclude",{data:[n]}))},include:function(n){var t=this._.items;t.indexOf(n)<0&&(t.push(n),this.trigger("changed:include",{data:[n]}))},iterator:function(){var n=0;return{hasNext:function(){return n<this._items.length},next:function(){return this._items[n++]}}},intersection:function(n){for(var t=[],e=this._getInnerItems(),r=0;r<e.length;r++){var s=e[r];n.contains(s)&&t.push(s)}return new i(t)},isSubSet:function(n){for(var t=this._getInnerItems(),e=0;e<t.length;e++){var i=t[e];if(!n.contains(i))return!1}return!0},isSuperSet:function(n){return n.isSubSet(this)},union:function(n,t){for(var e=t.clone(),i=this._getInnerItems(),r=0;r<i.length;r++)e.include(i[r]);return e},init:function(t){this._items=t?n.makeArray(t):[]}});return i});
//# sourceMappingURL=sourcemaps/Set.js.map
