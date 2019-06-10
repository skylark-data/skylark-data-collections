/**
 * skylark-data-collection - The skylark collection utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./collections","./Collection"],function(t,n){return t.Map=n.inherit({klassName:"Map",_getInnerItems:function(){return this._items},_clear:function(){this._items=[]},_findKeyByRegExp:function(t,n){return this._getInnerItems().filter(function(e){return!!e.match(t)&&(n&&n(e),!0)})},get:function(t,n){if("string"!=typeof t)throw"hash key is not string!";return this._getInnerItems()[t]},iterator:function(){var t=0;return{hasNext:function(){return t<this._items.length},next:function(){var n=this._items[t++];return[this._items[n],n]}}},set:function(t,n){if("string"!=typeof t)throw"hash key is not string!";var e=this._getInnerItems();-1==e.indexOf(t)&&e.push(t);var i=e[t];if(i!==n){e[t]=n;var r={};r[t]={name:t,value:n,oldValue:i},this.trigger("changed",{data:r})}return this},remove:function(t){if("string"!=typeof t)throw"hash key is not string!";var n=this._getInnerItems(),e=n.indexOf(t);e>=0&&(delete n[t],delete n[e])},findByRegExp:function(t,n){var e=[],i=this;return this._findKeyByRegExp(t,function(t){var r=i.get(t);n&&n(r),e.push(r)}),e},removeByRegExp:function(t){var n=this;this._findKeyByRegExp(t,function(t){n.remove(t)})},toPlain:function(){for(var t=this._getInnerItems(),n=0;n<t.length;n++){var e=t[n];plain[e]=t[e]}return plain},toString:function(t){return this._getInnerItems().join(t||",")},init:function(t){var n=this._items=[];for(var e in t)n.push(e),n[e]=t[e]}})});
//# sourceMappingURL=sourcemaps/Map.js.map
