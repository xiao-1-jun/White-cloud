# 🎬 视频列表网站

一个基于 HTML、CSS、JavaScript 的视频列表展示网站，支持滚动浏览、视频播放、视口监听等功能。

## 📁 项目结构

```
your-repo-name/
├── index.html          # 主页面，包含视频列表和基础布局
├── style.css           # 全局样式，含全屏布局、导航、控件样式
├── script.js           # 核心逻辑：滚轮切换、播放控制、视口监听
├── videos/             # 本地视频目录（开发阶段使用）
│   └── (视频文件)
└── README.md           # 项目说明文档（当前文件）
```

## ✨ 功能特性

- 📺 **视频列表展示** - 网格布局展示视频卡片
- 🎮 **视频播放** - 点击卡片弹出模态框播放视频
- 🔔 **滚动监听** - 导航栏滚动隐藏/显示
- 📱 **响应式设计** - 适配桌面端和移动端
- ✨ **视口动画** - 卡片进入视口时淡入效果

## 🚀 快速开始

### 开发模式

```bash
# 克隆仓库
git clone https://github.com/xiao-1-jun/White-cloud.git

# 进入项目目录
cd White-cloud

# 启动本地服务器
python -m http.server 8000

# 然后访问 http://localhost:8000
```

### 生产部署

项目已部署到 GitHub Pages：
https://xiao-1-jun.github.io/White-cloud/

## 🛠️ 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式设计（Flexbox、Grid、动画）
- **JavaScript ES6+** - 交互逻辑（DOM操作、事件监听）

## 📝 使用说明

1. **浏览视频** - 滚动页面查看视频列表
2. **播放视频** - 点击视频卡片弹出播放窗口
3. **关闭播放** - 点击关闭按钮或按 ESC 键
4. **导航跳转** - 点击顶部导航链接快速跳转

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！