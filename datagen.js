// Generates list of tested sequences from JSON output
function getSequences(data) {
  let entries = []

  if(data.sequences == null) return entries

  data.sequences.forEach(s => {
    if(s.skipped) return

    s.attempts.forEach(a => {
      entries.push( { p: s.p, q: s.q, ...a } )
    })
  })

  return entries
}

// Converts JSON output into readable string
function genTextLog(data) {
  let out = ""
  if(data.sequences == null) return out

  data.sequences.forEach(s => {
    out += "(p, q) = (" + s.p + ", " + s.q + ")\n"
      
    if(s.skipped) {
      out += "\tSKIPPED\n"
      return
    }

    s.attempts.forEach(a => {
      out += "\t(a, b) = (" + a.a + ", " + a.b + "): " + "[" + a.seq + "]" + "; Complete: " + a.complete + "\n"
    })
  })

  out += "\n\nFound " + data.completeSets.length + " complete sets of residue classes."
  return out
}

// Converts JSON output into LaTeX table
function genTexTable(data) {
  let out = ""

  out += "\\begin{center} \\begin{tabular}{|c | c | c |} \\hline $(p, q, a, b)$ & Sequence mod 8 & Is Complete Set \\\\"

  let entries = getSequences(data)

  entries.forEach(e => {
    out += "\\hline (" + e.p + ", " + e.q + ", " + e.a + ", " + e.b + ") & (" + e.seq +  ") & " + ( (e.complete) ? "Yes" : "No" ) + " \\\\ "
  })

  out += "\\hline  \\end{tabular} \\end{center}"

  return out
}

module.exports = { text: genTextLog, tex: genTexTable }
//module.exports.genTexTable = genTexTable