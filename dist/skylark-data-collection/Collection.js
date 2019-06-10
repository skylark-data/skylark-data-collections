/**
 * skylark-data-collection - The skylark collection utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/Evented","./collections"],function(r,t){return t.Collection=r.inherit({klassName:"Collection",_clear:function(){throw new Error("Unimplemented API")},clear:function(){return this._clear(),this.trigger("changed:clear"),this},count:function(){for(var r=0,t=this.iterator();!t.hasNext();)r++;return r},forEach:function(r,t){for(var e=this.iterator();e.hasNext();){var n=e.next();r.call(t||n,n)}return this},iterator:function(){throw new Error("Unimplemented API")},toArray:function(){for(var r=[],t=this.iterator();!t.hasNext();)r.push(t.next());return r}})});
//# sourceMappingURL=sourcemaps/Collection.js.map
