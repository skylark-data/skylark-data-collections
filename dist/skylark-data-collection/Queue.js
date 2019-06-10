/**
 * skylark-data-collection - The skylark collection utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./collections","./List"],function(e,t){var n=e.Queue=t.inherit({klassName:"Queue",clone:function(e){var t=this._getInnerItems();return new n({items:t})},dequeue:function(){var e=this._getInnerItems().shift();return this.trigger("changed:dequeue",{data:e}),e},enqueue:function(e){return this._getInnerItems().push(e),this.trigger("changed:enqueue",{data:e}),this}});return n});
//# sourceMappingURL=sourcemaps/Queue.js.map
