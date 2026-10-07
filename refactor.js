const fs = require("fs");
const path = require("path");

const dirs = ["frontend/src/pages", "frontend/src/components"];

const replacements = [
  // Backgrounds
  { regex: /background:\s*["']rgba\(15,\s*23,\s*42,.*?\)["']/g, replace: `background: "#ffffff"` },
  { regex: /background:\s*["']rgba\(30,\s*41,\s*59,.*?\)["']/g, replace: `background: "#ffffff"` },
  { regex: /background:\s*["']#111827["']/g, replace: `background: "#ffffff"` },
  { regex: /background:\s*["']#0f172a["']/g, replace: `background: "#f4f7fb"` },
  { regex: /background:\s*["']rgba\(255,\s*255,\s*255,\s*0\.0[1-9]\)["']/g, replace: `background: "#f9fafb"` },
  // Gradients
  { regex: /background:\s*["']linear-gradient\(.*?,.*?,.*?\)["']/g, replace: `background: "#000000"` },
  { regex: /background:\s*["']linear-gradient\(.*?\)["']/g, replace: `background: "#000000"` },
  // Text Colors
  { regex: /color:\s*["']#ffffff["']/gi, replace: `color: "#111827"` },
  { regex: /color:\s*["']#fff["']/gi, replace: `color: "#111827"` },
  { regex: /color:\s*["']#f8fafc["']/gi, replace: `color: "#111827"` },
  { regex: /color:\s*["']#e2e8f0["']/gi, replace: `color: "#111827"` },
  { regex: /color:\s*["']#cbd5e1["']/gi, replace: `color: "#4b5563"` },
  { regex: /color:\s*["']#94a3b8["']/gi, replace: `color: "#6b7280"` },
  { regex: /color:\s*["']#38bdf8["']/gi, replace: `color: "#2563eb"` },
  // Borders
  { regex: /border:\s*["']1px solid rgba\(255,\s*255,\s*255,\s*0\.1\)["']/g, replace: `border: "1px solid #e5e7eb"` },
  { regex: /border:\s*["']1px solid rgba\(56,\s*189,\s*248,.*?\)["']/g, replace: `border: "1px solid #e5e7eb"` },
  { regex: /borderColor:\s*["']rgba\(255,\s*255,\s*255,\s*0\.1\)["']/g, replace: `borderColor: "#e5e7eb"` },
  // Box Shadows
  { regex: /boxShadow:\s*["']0.*?rgba\(56,\s*189,\s*248,.*?\)["']/g, replace: `boxShadow: "0 4px 6px rgba(0,0,0,0.05)"` },
  { regex: /boxShadow:\s*["']0.*?rgba\(0,\s*0,\s*0,.*?\)["']/g, replace: `boxShadow: "0 4px 6px rgba(0,0,0,0.05)"` },
  // CSS specific lines in .css files
  { regex: /background:\s*rgba\(15,23,42,.*?\);/g, replace: `background: #ffffff;` },
  { regex: /background:\s*#111827;/g, replace: `background: #ffffff;` },
  { regex: /color:\s*#fff;/gi, replace: `color: #111827;` },
  { regex: /color:\s*#f8fafc;/gi, replace: `color: #111827;` },
];

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith(".jsx") || fullPath.endsWith(".css")) {
      let content = fs.readFileSync(fullPath, "utf-8");
      let original = content;
      
      for (const rule of replacements) {
        content = content.replace(rule.regex, rule.replace);
      }
      
      // Basic Emoji Strip (using literal codes or simple match)
      const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F100}-\u{1F1FF}\u{1F200}-\u{1F2FF}]/gu;
      content = content.replace(emojiRegex, "");
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log("Updated: " + fullPath);
      }
    }
  }
}

dirs.forEach(processDir);
console.log("Done.");
