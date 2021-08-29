/**
 * skylark-data-collection - The skylark collection utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./collections","./Collection","./array-list","./tree-item"],function(t,n,e,r){var i=t.Tree=n.inherit({createItem:function(t){return new i.TreeItem(t)},items:{get:function(){return this.toArray()}},iterator:function(){var t=this.firstItem();return{hasNext:function(){return t},next:function(){if(t){var n=t;return t=n.next,n}}}},count:function(){var t=0;return this.forEach(function(n){t+=1}),t},firstItem:function(){var t=this._.children;return t&&t.length?t[0]:null},lastItem:function(){var t=function(n,e){var r=n.children;return r&&r.length?t(r[r.length-1],!1):e?null:n};return t(item,!0)},init:function(){this._.children=[]}});return i.TreeItem=r,i});
//# sourceMappingURL=sourcemaps/tree.js.map
