define([
    "./collections"
], function(collections, List) {

    class LruNode {
        constructor(key, value) {
            this.key = key;
            this.value = value;
            this.prev = null;
            this.next = null;
        }
    }

    return collections.LruNode = LruNode;
});