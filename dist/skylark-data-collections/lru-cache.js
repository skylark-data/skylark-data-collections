/**
 * skylark-data-collections - The skylark collection utility library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./collections","./lru-node"],function(t,e){return t.LruCache=class{constructor(t){this.limit=t,this.size=0,this.map={},this.head=null,this.tail=null}set(t,i){const s=new e(t,i);this.map[t]?(this.map[t].value=s.value,this.remove(s.key)):this.size>=this.limit&&(delete this.map[this.tail.key],this.size--,this.tail=this.tail.prev,this.tail.next=null),this.setHead(s)}get(t){if(this.map[t]){const i=this.map[t].value,s=new e(t,i);return this.remove(t),this.setHead(s),i}return null}remove(t){const e=this.map[t];e&&(null!==e.prev?e.prev.next=e.next:this.head=e.next,null!==e.next?e.next.prev=e.prev:this.tail=e.prev,delete this.map[t],this.size--)}removeAll(){this.size=0,this.map={},this.head=null,this.tail=null}setHead(t){t.next=this.head,t.prev=null,null!==this.head&&(this.head.prev=t),this.head=t,null===this.tail&&(this.tail=t),this.size++,this.map[t.key]=t}}});
//# sourceMappingURL=sourcemaps/lru-cache.js.map
