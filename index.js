const { create, all } = require('mathjs')
const config = { }
const math = create(all, config)
let fs = require('fs')

const datagen = require('./datagen.js')
let genTextLog = datagen.text
let genTexTable = datagen.tex

function nextBillinear(r, s, l1, l0) {
  return (r * l1) + (s * l0)
}

function billinear(r, s, u0, u1, n) {
    let out = [u0, u1]

    for(let i = 3; i <= n; i++) {
        //let k = (r * out[i - 2]) + (s * out[i - 3]);
        let k = nextBillinear(r, s, out[i - 2], out[i - 3])
        out.push(k)
    }

    return out
}

// gets first n terms of billinear sequence mod m
function billinearMod(r, s, u0, u1, n, m) {
    let out = [math.mod(u0, m), math.mod(u1, m)]

    for(let i = 3; i <= n; i++) {
        let k = math.mod( nextBillinear(r, s, out[i - 2], out[i - 3]), m);
        out.push(k)
    }

    return out
}

// removes duplicates from an array
// useful for determining if a list is
//  a complete set of residue classes
function removeDuplicates(list) {
  let set = []

  list.forEach(el => {
    if(!set.includes(el)) set.push(el)
  })

  return set
}

// takes a set of residues
function isResidueClass(set, m) {
  return (removeDuplicates(set)).length == m
}

// consider billinear sequences mod 8
let m = 8

// Iterate through all desired p, q, a, b
function findCompleteSequences(m) {
  let seq = (p, q, a, b) => billinearMod(p, q, a, b, m, m)

  let completeSets = []
  let out = {sequences: []}

  for(let p = 0; p < m; p++) {
    for(let q = 0; q < m; q++) {
      let data = { p: p, q: q }
      let attempts = []

      // We only wish to consider sequences
      // Which don't satisfy (p, q) = (2, 3) [mod 4]
      if(math.mod(p, 4) == 2 && math.mod(q, 4) == 3) {
        data.skipped = true;
        out.sequences.push(data)
        continue;
      }

      for(let a = 0; a < m; a++) {
        for(b = 0; b < m; b++) {
          // Only interested in a, b which satisfy a + b == 0 [mod 2]
          if(math.mod(a + b, 2) == 0) continue;

          let s = seq(p, q, a, b)
          let resCl = isResidueClass(s, m)
          if(resCl) completeSets.push([p, q, a, b])

          attempts.push( { p: p, q: q, a: a, b: b, seq: s, complete: resCl } )
        }
      }

      data.attempts = attempts

      out.sequences.push(data)
    }
  }

  out.completeSets = completeSets
  return out
}

let start = Date.now()
console.log("Iterating through sequences...")

let results = findCompleteSequences(8)

console.log("Done. Found " + results.completeSets.length + " complete sets of residue classes in " + (Date.now() - start)/1000 + "s" )

let readableStr = genTextLog(results)
let tex = genTexTable(results)
let resultStr = JSON.stringify(results)

console.log("\nWriting results to disk...")

fs.writeFileSync('out.json', resultStr);
fs.writeFileSync('out.txt', readableStr);
fs.writeFileSync('out.tex', tex);

console.log("Successfully wrote results to disk.")