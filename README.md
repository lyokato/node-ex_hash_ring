## node-ExHashRing

node.js HashRing library which has compatibility with https://github.com/discordapp/ex_hash_ring

```javascript
const ring = new ExHashRing(["node1", "node2", "node3"])
const node = ring.findNode("topic:12345")
```

