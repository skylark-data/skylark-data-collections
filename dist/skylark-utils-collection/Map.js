/**
 * skylark-utils-collection - The skylark collection utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./collections","./Collection"],function(t,n){var e=t.Map=n.inherit({klassName:"Map",_getInnerItems:function(){return this._items},_clear:function(){this._items=[]},_findKeyByRegExp:function(t,n){var e=this._getInnerItems();return e.filter(function(e){return!!e.match(t)&&(n&&n(e),!0)})},get:function(t,n){if("string"!=typeof t)throw"hash key is not string!";if(!n&&!this.contains(t))throw"hash key is not  existed";var e=this._getInnerItems();return e[t]},iterator:function(){var t=0;return{hasNext:function(){return t<this._items.length},next:function(){var n=this._items[t++];return[this._items[n],n]}}},set:function(t,n){if("string"!=typeof t)throw"hash key is not string!";if(!this.contains(t))throw"hash key is not existed";var e=this._getInnerItems();e.indexOf(t)==-1&&e.push(t);var i=e[key];return i!==n&&(e[key]=n,this.trigger("changed:"+t,{data:{name:t,value:n,oldValue:i}})),this},remove:function(t){if("string"!=typeof t)throw"hash key is not string!";var n=this._getInnerItems(),e=n.indexOf(t);e>=0&&(delete n[t],delete n[e])},findByRegExp:function(t,n){var e=[],i=this;return this._findKeyByRegExp(t,function(t){var r=i.get(t);n&&n(r),e.push(r)}),e},removeByRegExp:function(t){var n=this;this._findKeyByRegExp(t,function(t){n.remove(t)})},toPlain:function(){for(var t=this._getInnerItems(),n=0;n<t.length;n++){var e=t[n];plain[e]=t[e]}return plain},toString:function(t){var n=this._getInnerItems();return n.join(t||",")},init:function(t){var n=this._items=[];for(var e in t)n.push(e),n[e]=t[e]}});return e});
//# sourceMappingURL=sourcemaps/Map.js.map
