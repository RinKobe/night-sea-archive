# 夜海档案馆 Demo

在项目根目录运行：

```powershell
python -m http.server 8000 -d dist
```

打开 `http://localhost:8000`。

`assets/` 包含三件 Aholo Lux3D GLB 和三段 8 秒本地渲染结局视频。网页优先加载真实 GLB。浏览器无法加载模型查看器时，其他交互仍可使用 CSS 降级视觉。
