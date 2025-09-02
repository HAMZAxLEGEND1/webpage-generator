import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState(""); // "one" or "multi"
  const [filename, setFilename] = useState("");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [program, setProgram] = useState("");
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false); // ✅ new state

  const textareaStyle = {
    width: "100%",
    height: "150px",
    margin: "10px 0",
    borderRadius: "8px",
    padding: "10px",
    border: "none",
    fontFamily: "monospace",
    background: "#0f172a",
    color: "#22d3ee",
  };

  const inputStyle = {
    width: "100%",
    margin: "10px 0",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    fontFamily: "monospace",
    background: "#0f172a",
    color: "#22d3ee",
  };

  const buttonStyle = {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    marginRight: "10px",
  };

  const handleOwner = () => {
    const ownerContent = `<!DOCTYPE html>
<html>
<head>
  <title>Owner Info</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: #0f172a;
      color: #22d3ee;
      text-align: center;
      padding: 20px;
    }
    h1 {
      font-size: 36px;
      margin-bottom: 30px;
    }
    p {
      font-size: 24px;
      margin: 10px 0;
    }
    .highlight {
      color: #f59e0b;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>Owner Info</h1>
  <p><span class="highlight">HAMZA</span> => 923456751206</p>
  <p><span class="highlight">MR.LEGEND</span> => 923136420207</p>
</body>
</html>`;
    const blob = new Blob([ownerContent], { type: "text/html" });
    const newUrl = URL.createObjectURL(blob);
    window.open(newUrl, "_blank");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let body = { filename, mode };
    if (mode === "multi") {
      body.html = html;
      body.css = css;
      body.js = js;
    } else {
      body.program = program;
    }
    const res = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setUrl(data.url);
  };

  const handleView = () => {
    let content = "";
    if (mode === "one") {
      content = program;
    } else {
      content = `<!DOCTYPE html>
<html>
<head>
<style>${css}</style>
</head>
<body>
${html}
<script>${js}<\/script>
</body>
</html>`;
    }
    const blob = new Blob([content], { type: "text/html" });
    const newUrl = URL.createObjectURL(blob);
    window.open(newUrl, "_blank");
  };

  const handleCopyLink = () => {
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true); // ✅ show message
        setTimeout(() => setCopied(false), 2000); // ✅ hide after 2s
      });
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "10px",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "700px",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "15px" }}>
          Create Your Webpage 🚀
        </h1>

        {!mode && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button style={buttonStyle} onClick={() => setMode("one")}>
              One Program
            </button>
            <button
              style={{ ...buttonStyle, background: "#16a34a" }}
              onClick={() => setMode("multi")}
            >
              Multi Program
            </button>
            <button
              style={{ ...buttonStyle, background: "#ef4444" }}
              onClick={handleOwner}
            >
              Owner Info
            </button>
          </div>
        )}

        {mode && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter page name (example: mypage)"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              required
              style={inputStyle}
            />

            {mode === "one" && (
              <textarea
                placeholder="Enter full program..."
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                style={textareaStyle}
              />
            )}

            {mode === "multi" && (
              <>
                <textarea
                  placeholder="Enter HTML code..."
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  style={textareaStyle}
                />
                <textarea
                  placeholder="Enter CSS code..."
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                  style={textareaStyle}
                />
                <textarea
                  placeholder="Enter JavaScript code..."
                  value={js}
                  onChange={(e) => setJs(e.target.value)}
                  style={textareaStyle}
                />
              </>
            )}

            <div style={{ display: "flex", marginTop: "10px" }}>
              <button type="submit" style={{ ...buttonStyle, flex: 1 }}>
                Generate Page
              </button>
              <button
                type="button"
                onClick={handleView}
                style={{ ...buttonStyle, flex: 1, background: "#f59e0b" }}
              >
                View
              </button>
            </div>
          </form>
        )}

        {url && (
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              background: "#0f172a",
              borderRadius: "8px",
              wordBreak: "break-all",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#22d3ee", flex: 1 }}
            >
              {url}
            </a>
            <button
              onClick={handleCopyLink}
              style={{
                background: "#10b981",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {copied ? "✅ Copied!" : "Copy Link"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
