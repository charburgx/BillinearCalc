const fs = require('fs')

let files = ["./out.txt", "./out.tex", "./out.json"]

files.forEach(s => {
	if (fs.existsSync(s)) { fs.unlinkSync(s) }
})