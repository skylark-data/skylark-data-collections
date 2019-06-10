/**
 * skylark-data-collection - The skylark collection utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./collections","./List"],function(t,n){var e=t.Stack=n.inhert({klassName:"Stack",clone:function(){var t=this._getInnerItems();return new e(t)},peek:function(){var t=this._getInnerItems(),n=t.length-1;return n>-1?t[n]:null},pop:function(){var t=this._getInnerItems(),n=null;return t.length>0&&(n=t.pop(),this.trigger("changed:pop",{data:n})),n},push:function(t){return this._getInnerItems().push(t),this.trigger("changed:push",{data:t}),this}});return e});
//# sourceMappingURL=sourcemaps/Stack.js.map
