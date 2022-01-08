define([
    "./collections",
    "./lru-node"
], function(collections,LruNode) {
   // Adapted from https://chrisrng.svbtle.com/lru-cache-in-javascript
    class LruCache {
        constructor(limit) {
            this.limit = limit;
            this.size = 0;
            this.map = {};
            this.head = null;
            this.tail = null;
        }
        /**
         * Change or add a new value in the cache
         * We overwrite the entry if it already exists
         */
        set(key, value) {
            const node = new LruNode(key, value);
            if (this.map[key]) {
                this.map[key].value = node.value;
                this.remove(node.key);
            }
            else {
                if (this.size >= this.limit) {
                    delete this.map[this.tail.key];
                    this.size--;
                    this.tail = this.tail.prev;
                    this.tail.next = null;
                }
            }
            this.setHead(node);
        }
        /* Retrieve a single entry from the cache */
        get(key) {
            if (this.map[key]) {
                const value = this.map[key].value;
                const node = new LruNode(key, value);
                this.remove(key);
                this.setHead(node);
                return value;
            }
            else {
                return null;
            }
        }
        /* Remove a single entry from the cache */
        remove(key) {
            const node = this.map[key];
            if (!node) {
                return;
            }
            if (node.prev !== null) {
                node.prev.next = node.next;
            }
            else {
                this.head = node.next;
            }
            if (node.next !== null) {
                node.next.prev = node.prev;
            }
            else {
                this.tail = node.prev;
            }
            delete this.map[key];
            this.size--;
        }
        /* Resets the entire cache - Argument limit is optional to be reset */
        removeAll() {
            this.size = 0;
            this.map = {};
            this.head = null;
            this.tail = null;
        }
        setHead(node) {
            node.next = this.head;
            node.prev = null;
            if (this.head !== null) {
                this.head.prev = node;
            }
            this.head = node;
            if (this.tail === null) {
                this.tail = node;
            }
            this.size++;
            this.map[node.key] = node;
        }
    }

    return collections.LruCache = LruCache;
});