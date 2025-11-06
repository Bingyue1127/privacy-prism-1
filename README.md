# 🔍 Privacy Prism

**AI驱动的隐私风险分析平台** - 跨六个关键隐私维度评估内容

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.x-brightgreen.svg)](https://nodejs.org)

---

## ✨ 核心特性

```
✅ 轻量级架构      20MB (使用PDFKit) - 比Puppeteer方案减少 94%
⚡ 快速分析        8-15秒完成 - 比传统方案快 80%
💰 免费部署        Vercel Hobby 计划完全够用
🎯 六维度分析      全面评估隐私风险
📊 实时输出        SSE 流式显示结果
📄 PDF导出         支持中文的专业PDF报告
🌐 URL爬取         支持85-90%的网站内容提取
```

---

## 🚀 快速开始

### 本地开发

```bash
# 1. 克隆并安装
git clone https://github.com/suyu250/privacy-prism.git
cd privacy-prism
npm install

# 2. 配置环境变量（创建 .env 文件）
OPENAI_API_KEY=sk-proj-your-key-here
MODEL=gpt-4o-mini
ANALYSIS_MODE=A

# 3. 启动服务器
npm start

# 4. 访问应用
# http://localhost:3000
```

### Vercel 一键部署

1. **推送到 GitHub**
```bash
git push origin main
```

2. **访问** [vercel.com/new](https://vercel.com/new) **导入仓库**

3. **配置环境变量**（⚠️ 关键步骤）
```
OPENAI_API_KEY = sk-proj-your-key-here
MODEL = gpt-4o-mini
ANALYSIS_MODE = A
```

4. **点击 Deploy** - 完成！🎉

---

## 📖 使用方法

### 文本输入模式
1. 选择 **TEXT INPUT**
2. 粘贴要分析的内容
3. 点击 **INITIATE ANALYSIS**
4. 实时查看六维度分析结果
5. 点击 **EXPORT PDF** 导出报告

### URL 输入模式
1. 选择 **URL INPUT**
2. 输入网页 URL（例如：新闻文章链接）
3. 点击 **INITIATE ANALYSIS**
4. 系统自动爬取内容并分析

**✅ 支持的网站**: 新闻、博客、文档、Wikipedia、GitHub（85-90%的网站）  
**❌ 不支持**: 需要 JavaScript 渲染的单页应用（SPA）

---

## 🎯 六维度隐私分析

| 维度 | 图标 | 说明 |
|------|------|------|
| **Exposure** | 🔍 | 可识别的个人身份信息（姓名、地址、联系方式） |
| **Inference** | 🧠 | 可推导的敏感信息（健康、信仰、位置、财务） |
| **Audience & Consequences** | 👥 | 内容传播范围和潜在影响 |
| **Platforms & Rules** | 📱 | 平台政策风险和数据收集 |
| **Amplification** | 📈 | 病毒式传播潜力 |
| **Manipulability** | 🎭 | 被扭曲、伪造、滥用的风险 |

---

## 🏗️ 技术栈

```
前端:      HTML/CSS/JavaScript (原生，无框架)
后端:      Node.js + Express (本地开发)
部署:      Vercel Serverless Functions
AI引擎:    OpenAI GPT-4o/4o-mini
网页爬取:  axios + cheerio (轻量级 5MB)
实时通信:  Server-Sent Events (SSE)
PDF生成:   PDFKit (轻量级 2MB，支持中文)
中文字体:  Noto Sans SC (16MB)
```

---

## 📁 项目结构

```
privacy-prism/
├── api/                      # ⭐ Vercel Serverless Functions
│   ├── analyze.js            # POST /api/analyze - 分析端点
│   ├── health.js             # GET /api/health - 健康检查
│   └── generate-pdf.js       # POST /api/generate-pdf - PDF生成
├── backend/
│   ├── config/               # 配置管理
│   │   └── config.js         # 环境变量读取
│   ├── fonts/                # 中文字体
│   │   └── NotoSansSC.otf    # 思源黑体
│   ├── prompts/              # AI 提示词
│   │   └── dimensions.js     # 六维度分析提示
│   ├── services/             # 核心业务逻辑
│   │   ├── analyzer.js       # OpenAI API 集成
│   │   ├── scraper.js        # 网页内容爬取
│   │   └── pdfGenerator.js   # PDF 报告生成
│   └── server.js             # Express 服务器（本地开发）
├── frontend/
│   ├── index.html            # 主页面
│   ├── css/style.css         # 样式（深色主题）
│   └── js/app.js             # 前端逻辑（SSE 客户端）
├── .env                      # 环境变量（不提交）
├── .gitignore                # Git 忽略规则
├── package.json              # 项目依赖
├── vercel.json               # Vercel 部署配置
├── README.md                 # 本文件
└── COMPLETE_GUIDE.md         # 完整文档
```

---

## 💰 成本估算

### Vercel 托管
```
✅ 免费 (Hobby 计划)
• 100 GB 带宽/月
• 100 GB-小时 执行时间/月
• 无限请求次数
• 自动 HTTPS + 全球 CDN
• 对个人使用完全够用
```

### OpenAI API
```
gpt-4o-mini (推荐):
• ~$0.001/次分析 (约 0.7 分钱)
• 100次分析 ≈ ¥0.70 ($0.10)
• 1000次分析 ≈ ¥7.00 ($1.00)

gpt-4o (更强大):
• ~$0.02/次分析 (约 14 分钱)
• 50次分析 ≈ ¥7.00 ($1.00)
• 100次分析 ≈ ¥14.00 ($2.00)
```

**总结**: 个人使用每月成本 < ¥10 (基本免费) 💰

---

## 🔧 主要依赖

| 依赖 | 版本 | 用途 | 大小 |
|------|------|------|------|
| `express` | ^5.1.0 | Web 框架 | 小 |
| `openai` | ^6.5.0 | OpenAI API 客户端 | 中 |
| `axios` | ^1.12.2 | HTTP 请求 | 小 |
| `cheerio` | ^1.1.2 | HTML 解析 | 小 |
| `pdfkit` | ^0.15.1 | PDF 生成 | 小 |
| `cors` | ^2.8.5 | CORS 中间件 | 极小 |
| `dotenv` | ^17.2.3 | 环境变量 | 极小 |
| `undici` | ^7.16.0 | Fetch + 代理 | 中 |

**总包大小**: ~20MB（比之前的 Puppeteer 方案减少 94%）

---

## ⚡ 性能优化

### 架构演进
```
v1.0 (Puppeteer 方案):
❌ 包大小: 350MB
❌ PDF生成: 需要Chrome浏览器
❌ Vercel兼容: 不支持
❌ 启动时间: 5-10秒

v2.0 (PDFKit 方案):
✅ 包大小: 20MB (减少 94%)
✅ PDF生成: 纯JavaScript，开箱即用
✅ Vercel兼容: 完美支持
✅ 启动时间: < 1秒
✅ 中文支持: 内置思源黑体
```

### 分析速度
```
文本分析 (gpt-4o-mini): 5-8秒
文本分析 (gpt-4o):      8-12秒
URL分析 (gpt-4o-mini):  8-12秒
URL分析 (gpt-4o):       10-15秒
PDF生成:                1-2秒
```

---

## 🌟 功能特点

### ✅ 已实现
- [x] 六维度隐私风险分析
- [x] 文本输入模式
- [x] URL 爬取模式（支持85-90%网站）
- [x] 实时流式输出（SSE）
- [x] PDF 报告导出
- [x] 完整中文支持
- [x] 专业UI设计（深色主题）
- [x] Vercel 一键部署
- [x] 本地开发支持
- [x] 代理支持（本地开发）
- [x] 错误处理和用户提示

### 🚧 未来计划
- [ ] 批量分析功能
- [ ] 历史记录保存
- [ ] 多语言支持（英文、日文等）
- [ ] 自定义分析维度
- [ ] API 密钥管理界面
- [ ] 分析结果对比功能

---

## 📚 完整文档

📖 **[查看完整指南 →](./COMPLETE_GUIDE.md)**

包含详细的：
- ✅ Vercel/Railway 部署步骤
- ✅ 环境变量配置说明
- ✅ 六维度分析详解
- ✅ 故障排查指南
- ✅ 性能优化建议
- ✅ 成本估算详情
- ✅ 常见问题 FAQ
- ✅ API 使用说明
- ✅ 自定义开发指南

---

## 🛠️ 开发指南

### 环境要求
- Node.js >= 18.x
- npm 或 yarn
- OpenAI API Key

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 或
npm start
```

### 测试
```bash
# 测试健康检查
curl http://localhost:3000/api/health

# 测试分析功能
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"input":"测试内容","type":"text"}'
```

---

## 🐛 故障排查

### 常见问题

**Q: PDF 显示中文乱码？**  
A: 确保 `backend/fonts/NotoSansSC.otf` 文件存在。已在最新版本修复。

**Q: URL 爬取失败？**  
A: 轻量级爬虫不支持需要 JavaScript 渲染的网站（如纯 React SPA）。建议使用文本输入模式。

**Q: 本地开发需要代理？**  
A: 如果在国内，需要在 `.env` 中配置代理：
```env
HTTP_PROXY=http://127.0.0.1:7890
HTTPS_PROXY=http://127.0.0.1:7890
```

**Q: Vercel 部署失败？**  
A: 确保已配置 `OPENAI_API_KEY` 环境变量。Vercel 不需要代理配置。

---

## 📄 许可证

ISC License - 详见 [LICENSE](LICENSE) 文件

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📞 联系方式

- **项目地址**: https://github.com/suyu250/privacy-prism
- **问题反馈**: [GitHub Issues](https://github.com/suyu250/privacy-prism/issues)

---

## 🙏 致谢

- [OpenAI](https://openai.com/) - 提供强大的 GPT 模型
- [Vercel](https://vercel.com/) - 免费的 Serverless 部署平台
- [PDFKit](https://pdfkit.org/) - 轻量级 PDF 生成库
- [Noto Sans](https://fonts.google.com/noto) - 优秀的开源中文字体

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给它一个 Star！**

Made with ❤️ by Privacy Prism Team

</div>
#   p r i v a c y - p r i s m - 1  
 