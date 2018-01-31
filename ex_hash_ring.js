const crypto = require('crypto');
const UINT64 = require('cuint').UINT64;

/*
 *  const ring = new ExHashRing(["node1", "node2", "node3"])
 *  const node = ring.findNode("my_topic")
 */

module.exports = class ExHashRing {

  constructor(nodes, numReplica = 512) {
    this._nodes      = nodes
    this._numReplica = numReplica
    this._items      = []
    this._algorithm  = 'md5'
    this._rebuild()
  }

  add(node) {
    this._nodes.push(node)
    this._rebuild()
  }

  findNode(key) {

    const hash = this._hash(key)

    let min = 0
    let max = this._items.length

    while (true) {
      const result = this._tryToFind(hash, min, max)
      if (result[0] == 1) {
        // success
        return result[1][1]

      } else {
        min = result[1]
        max = result[2]
        // go next loop
      }

    }
  }

  _tryToFind(keyHash, min, max) {

    const next = this._calcNextMinMax(keyHash, min, max)

    const nextMin = next[0]
    const nextMax = next[1]

    if (nextMin > nextMax && nextMin == this._items.length) {

      return [1, this._items[0]]

    } else if(nextMin > nextMax) {

      return [1, this._items[nextMin]]

    } else {

      return [0, nextMin, nextMax]
      //this._tryToFind(keyHash, nextMin, nextMax)

    }
  }

  _calcNextMinMax(keyHash, min, max) {

    const mid = Math.floor((min + max) / 2)

    const item = this._items[mid]

    const number = item[0]

    if (number.greaterThan(keyHash)) {

      return [min, mid - 1]

    } else {

      return [mid + 1, max]

    }

  }

  _hash(key) {

    const hash = crypto.createHash(this._algorithm).update(key).digest();

    const l1 = hash[8]
    const l2 = hash[9]
    const l3 = hash[10]
    const l4 = hash[11]

    const h1 = hash[12]
    const h2 = hash[13]
    const h3 = hash[14]
    const h4 = hash[15]

    const low  = ((l4 << 24) | (l3 << 16) | (l2 << 8) | l1)
    const high = ((h4 << 24) | (h3 << 16) | (h2 << 8) | h1)

    const val = UINT64(low, high)

    return val
  }

  _rebuild() {

    const items = []

    for (let i = 0; i < this._nodes.length; i++) {
      const node = this._nodes[i]
      for (let j = 0; j < this._numReplica; j++) {
        const item = [this._hash(node + j.toString()), node]
        items.push(item)
      }
    }

    items.sort((a, b) => {
      if (a[0].greaterThan(b[0])) {
        return 1;
      } else if (a[0].equals(b[0])) {
        return 0;
      } else {
        return -1;
      }
    })

    this._items = items
  }

}
