const fs = require("fs")
const path = require("path")
const root = path.join(__dirname, "..")

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    if (fs.statSync(p).isDirectory()) {
      if (name === "node_modules" || name === ".next") continue
      walk(p, acc)
    } else if (name.endsWith(".tsx")) acc.push(p)
  }
  return acc
}

for (const file of walk(path.join(root, "src"))) {
  let s = fs.readFileSync(file, "utf8")
  const o = s
  s = s.replace(/\s+shadow=\{?"none"?\}/g, "")
  s = s.replace(/\s+shadow="none"/g, "")
  s = s.replace(/\s+radius="md"/g, "")
  s = s.replace(/\s+radius="lg"/g, "")
  s = s.replace(/\s+radius=\{?"md"?\}/g, "")
  s = s.replace(/\s+radius=\{?"lg"?\}/g, "")
  if (s !== o) fs.writeFileSync(file, s)
}
