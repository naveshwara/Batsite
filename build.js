const fs = require("fs");
const path = require("path");
function readJSON(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (e) { return fallback; }
}
const worksData = readJSON("content.json", { works: [] });
const works = Array.isArray(worksData) ? worksData : (worksData.works || []);
const settings = readJSON("settings.json", {});

// Attach a local thumbnail path when a cached image exists in assets/thumbs/
// (downloaded once and committed, so the site serves cover images from its own
// origin — reliable, fast, and never blocked like cross-origin Drive hotlinks).
// Missing ones fall back to live hotlinking in the page, then to the placeholder.
const THUMB_DIR = "assets/thumbs";
works.forEach((w) => {
  let key = "";
  if (w.yt) key = "yt_" + w.yt;
  else if (w.drive) key = "dr_" + w.drive;
  const rel = key ? THUMB_DIR + "/" + key + ".jpg" : "";
  w.thumb = rel && fs.existsSync(path.join(THUMB_DIR, key + ".jpg")) ? rel : "";
});

const header =
  "/* AUTO-GENERATED from content.json + settings.json by build.js — do not edit by hand.\n" +
  "   Edit in the admin dashboard (yoursite.com/admin), or by hand in content.json / settings.json. */\n";
const out = header
  + "window.SITE_WORKS = " + JSON.stringify(works, null, 2) + ";\n"
  + "window.SITE_SETTINGS = " + JSON.stringify(settings, null, 2) + ";\n";
fs.writeFileSync("content.js", out);
const cached = works.filter((w) => w.thumb).length;
console.log("build.js: wrote content.js with " + works.length + " videos (" + cached + " local thumbnails).");
