const fs = require("fs");
function readJSON(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (e) { return fallback; }
}
const worksData = readJSON("content.json", { works: [] });
const works = Array.isArray(worksData) ? worksData : (worksData.works || []);
const settings = readJSON("settings.json", {});
const header =
  "/* AUTO-GENERATED from content.json + settings.json by build.js — do not edit by hand.\n" +
  "   Edit in the admin dashboard (yoursite.com/admin), or by hand in content.json / settings.json. */\n";
const out = header
  + "window.SITE_WORKS = " + JSON.stringify(works, null, 2) + ";\n"
  + "window.SITE_SETTINGS = " + JSON.stringify(settings, null, 2) + ";\n";
fs.writeFileSync("content.js", out);
console.log("build.js: wrote content.js with " + works.length + " videos.");
