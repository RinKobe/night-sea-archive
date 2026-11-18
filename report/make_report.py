# -*- coding: utf-8 -*-
import pathlib
import markdown

base = pathlib.Path(r"D:/competition/repo")
md = (base / "README.md").read_text(encoding="utf-8")
# report.html lives in repo/report/, so images need ../screenshots/
md = md.replace("](screenshots/", "](../screenshots/")
body = markdown.markdown(md, extensions=["tables", "fenced_code", "sane_lists"])

css = """
@page { size: A4; margin: 16mm 14mm; }
* { box-sizing: border-box; }
body { font-family: "Microsoft YaHei", "Noto Sans SC", "Segoe UI", sans-serif;
  font-size: 10.5pt; line-height: 1.75; color: #1a2433; margin: 0; }
h1 { font-size: 23pt; color: #0b2a4a; border-bottom: 3px solid #f4ca7d;
  padding-bottom: 8px; margin: 0 0 16px; }
h2 { font-size: 15pt; color: #0b2a4a; margin: 24px 0 10px;
  border-left: 4px solid #7ce6e1; padding-left: 10px; page-break-after: avoid; }
h3 { font-size: 12pt; color: #24476b; margin: 16px 0 8px; page-break-after: avoid; }
p { margin: 7px 0; }
img { max-width: 100%; border-radius: 6px; margin: 6px 0; page-break-inside: avoid; }
table { border-collapse: collapse; width: 100%; margin: 10px 0; page-break-inside: avoid; }
th, td { border: 1px solid #cfd8e3; padding: 6px 8px; font-size: 9.5pt; vertical-align: top; }
th { background: #eef4fa; }
pre { background: #f5f7fa; border: 1px solid #e1e6ed; padding: 9px;
  border-radius: 6px; white-space: pre-wrap; font-size: 8.5pt; page-break-inside: avoid; }
code { font-family: Consolas, "Courier New", monospace; }
blockquote { border-left: 3px solid #f4ca7d; margin: 10px 0; padding: 4px 12px;
  color: #445; background: #fbf8f0; }
hr { border: none; border-top: 1px solid #dde3ea; margin: 18px 0; }
"""

html = f"""<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><style>{css}</style></head>
<body>{body}</body></html>"""

(base / "report" / "report.html").write_text(html, encoding="utf-8")
print("report.html written:", (base / "report" / "report.html"))
