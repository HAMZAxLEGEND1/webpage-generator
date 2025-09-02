import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { mode, filename, html, css, js, program } = req.body;

      if (!filename) {
        return res.status(400).json({ error: "Filename is required" });
      }

      // ✅ Save location = public/sites
      const dirPath = path.join(process.cwd(), "public", "sites");
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Base filename
      let baseName = filename.replace(/\s+/g, "_");
      let filePath = path.join(dirPath, `${baseName}.html`);
      let counter = 1;

      // ✅ Agar file exist kare to new name generate karo
      while (fs.existsSync(filePath)) {
        filePath = path.join(dirPath, `${baseName}_${counter}.html`);
        counter++;
      }

      let finalHTML = "";

      if (mode === "multi") {
        // MULTI PROGRAM (HTML, CSS, JS alag alag)
        finalHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${baseName}</title>
  <style>${css || ""}</style>
</head>
<body>
  ${html || ""}
  <script>${js || ""}<\/script>
</body>
</html>`;
      } else {
        // ONE PROGRAM (direct full code)
        finalHTML = program || "";
      }

      // ✅ Save file
      fs.writeFileSync(filePath, finalHTML, "utf-8");

      const finalName = path.basename(filePath); // e.g. test_1.html

      // ✅ Poora URL banao
      const protocol = req.headers["x-forwarded-proto"] || "http";
      const host = req.headers.host;
      const fullUrl = `${protocol}://${host}/sites/${finalName}`;

      return res.status(200).json({ url: fullUrl });

    } catch (err) {
      console.error("❌ Error saving file:", err);
      return res.status(500).json({ error: "Failed to save file" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
