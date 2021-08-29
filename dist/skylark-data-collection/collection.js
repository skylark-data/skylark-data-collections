/**
 * skylark-data-collection - The skylark collection utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-events/emitter","./collections"],function(t,r){return r.Collection=t.inherit({klassName:"Collection",_clear:function(){throw new Error("Unimplemented API")},clear:function(){return this._clear(),this.trigger("changed:clear"),this},count:function(){for(var t=0,r=this.iterator();!r.hasNext();)t++;return t},forEach:function(t,r){for(var e=this.iterator();e.hasNext();){var n=e.next();t.call(r||n,n)}return this},iterator:function(){throw new Error("Unimplemented API")},toArray:function(){for(var t=[],r=this.iterator();!r.hasNext();)t.push(r.next());return t}})});
//# sourceMappingURL=sourcemaps/collection.js.map
