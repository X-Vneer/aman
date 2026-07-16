const fs = require("fs")
const path = require("path")

const root = path.join(__dirname, "..")

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue
      walk(p, acc)
    } else if (name.endsWith(".tsx") || name.endsWith(".ts")) acc.push(p)
  }
  return acc
}

const pkgs = [
  "input-otp",
  "accordion",
  "button",
  "card",
  "checkbox",
  "chip",
  "divider",
  "dropdown",
  "image",
  "input",
  "modal",
  "navbar",
  "progress",
  "radio",
  "select",
  "slider",
  "spinner",
  "switch",
  "system",
  "tabs",
  "theme",
  "tooltip",
]

const files = walk(path.join(root, "src")).filter((f) => fs.readFileSync(f, "utf8").includes("@heroui/"))

for (const file of files) {
  let s = fs.readFileSync(file, "utf8")
  const orig = s
  for (const pkg of pkgs) {
    s = s.split(`@heroui/${pkg}`).join("@heroui/react")
  }
  if (s !== orig) {
    fs.writeFileSync(file, s)
    console.log(path.relative(root, file))
  }
}
