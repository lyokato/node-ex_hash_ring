const ExHashRing = require('./ex_hash_ring')

const servers = [
  "server1",
  "server2",
  "server3",
  "server4",
  "server5",
  "server6",
  "server7",
  "server8",
  "server9",
  "server10"
]

const prepareIndices = (servers) => {
  const idx = []
  for (let i = 0; i < servers.length; i++) {
    idx.push(i.toString())
  }
  return idx
}

const show = (key) => {
  const node = ring.findNode(key)
  const server = servers[parseInt(node, 10)]
  console.log(server)
}

const ring = new ExHashRing(prepareIndices(servers))
show("hoge")
show("foo")
show("bar")
show("session:100:hogehoge")
show("session:101:fugafuga")
  /*
for (let i = 0; i < 10; i++) {
  console.log(ring._items[i][0].toString() + ":" + ring._items[i][1].toString())
}
*/
