# Un-AI Text: Free AI Text Humanizer & Fast AI Radar Chrome Extension

<p align="center">
  <a href="https://un-ai-text.com"><img src="icons/icon128.png" alt="Un-AI Text Logo" width="80" height="80"></a>
</p>

<p align="center">
  <strong>Fast 300ms heuristic AI detector, one-click cliché cleaner, and mathematical formula guard for Google Docs, Overleaf, ChatGPT, and the web.</strong>
</p>

<p align="center">
  <a href="https://un-ai-text.com"><img src="https://img.shields.io/badge/Web%20App-un--ai--text.com-0075de?style=flat-square&logo=googlechrome&logoColor=white" alt="Live Web Platform"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License"></a>
  <a href="https://chromewebstore.google.com/detail/unai-text"><img src="https://img.shields.io/badge/Chrome%20Web%20Store-v1.0.2-blue?style=flat-square&logo=googlechrome&logoColor=white" alt="Chrome Web Store"></a>
  <a href="https://github.com/neotan/un-ai-text-chrome-extension/stargazers"><img src="https://img.shields.io/github/stars/neotan/un-ai-text-chrome-extension?style=flat-square&color=yellow" alt="GitHub Stars"></a>
  <a href="https://github.com/neotan/un-ai-text-chrome-extension/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome"></a>
</p>

---

## 💡 Overview

The **[Un-AI Text](https://un-ai-text.com)** Chrome Extension brings the core instant-inspection engine of **[un-ai-text.com](https://un-ai-text.com)** directly into your browser workflow. 

Whether you are editing an essay in Google Docs, polishing research notes in Overleaf, or reviewing AI-generated drafts in ChatGPT, this extension detects robotic syntax patterns in **under 300ms**, replaces telltale AI buzzwords with natural human phrasing, and protects complex LaTeX equations and Markdown tables from accidental corruption.

> 🌐 **Full-Power AI Humanization Platform**:  
> For deep sentence rhythm remodeling, multi-engine detector verification (Sapling, GPTZero, Turnitin-style heuristic analysis), and academic citation preservation, access the full web platform at **[https://un-ai-text.com](https://un-ai-text.com)**.

---

## ✨ Key Features

### 1. ⚡ Local AI Cliché Cleaner (Zero Latency & 100% Privacy)
- Scans and highlights **40+ typical AI buzzwords and robotic transition patterns** (*"delve into"*, *"a testament to"*, *"in conclusion"*, *"moreover"*, *"furthermore"*, *"multifaceted"*, *"beacon of"*, *"tapestry of"*).
- Instant one-click replacement with natural, conversational human expressions and natural contractions.
- **100% Client-Side**: Operates entirely within your local browser sandbox memory without sending your draft text to any third-party server.

### 2. 🔍 300ms Heuristic AI Risk Radar
- Calculates immediate heuristic AI probability score based on sentence length uniformity, formulaic conjunction density, and passive syntax ratios.
- Provides immediate actionable prepass insights without waiting for slow cloud AI API responses.

### 3. 🛡️ Academic LaTeX Formula & Table AST Guard
- Specifically crafted for researchers, academics, and graduate students working in **Overleaf**, **Notion**, and academic CMS portals.
- Automatically isolates inline math (`$...$`), block equations (`\[...\]`), and Markdown pipe tables into inert AST tokens before any text processing, ensuring formulas remain 100% intact.

### 4. 🎨 Shadow DOM In-Page Assistant
- Completely isolated via modern Web Components **Shadow DOM** to prevent CSS leakage or page styling interference on sensitive websites (e.g. LinkedIn, Gmail, Google Docs).
- Styled with the authentic **Un-AI Text Academic-Editorial Design System** (Iowan Old Style serif typography, signature linear gradients, and clean SVG iconography).

### 5. 🚀 One-Click Bridge to Web Workbench
- Seamlessly transfers selected text and active mode preferences directly to **[un-ai-text.com/app](https://un-ai-text.com/app)** for deep paragraph remodeling whenever higher-tier rewriting is required.

---

## 📊 Extension vs. Web Platform Comparison

| Feature | Chrome Extension (Open Source) | [Un-AI Text Web Workbench](https://un-ai-text.com) |
| :--- | :--- | :--- |
| **Primary Focus** | In-page radar, cliché cleaning, formula guard | Deep sentence remodeling & full rewriting |
| **Response Latency** | **< 300ms** (Instant local evaluation) | 3 - 6 seconds (Deep semantic remodeling) |
| **Server Cost** | Free & Open Source (Zero API cost) | Generous Free Tier + Pro Plan |
| **Data Privacy** | 100% runs locally inside browser memory | Encrypted HTTPS transit, zero permanent retention |
| **LaTeX & Table Masking** | Yes (AST Token Detection & Probe) | Yes (Full AST Token Preservation Engine) |
| **Multi-Engine Detector Check** | Heuristic Prepass Score | Sapling, GPTZero & Academic Heuristic Suite |
| **Writing Modes** | Standard & Academic Probe | Standard, Academic, Creative, Casual |
| **Direct Access** | Local toolbar & context menu | **[un-ai-text.com](https://un-ai-text.com)** |

---

## 📥 Installation

### Method A: Install via Chrome Web Store (Recommended)
1. Visit the **[Un-AI Text Chrome Web Store Listing](https://chromewebstore.google.com/detail/unai-text)**.
2. Click **Add to Chrome**.
3. Pin **Un-AI Text** to your browser extensions bar.

### Method B: Install from Source (Developer Mode)
1. Clone this repository:
   ```bash
   git clone https://github.com/neotan/un-ai-text-chrome-extension.git
   ```
2. Open Google Chrome and visit:
   ```text
   chrome://extensions/
   ```
3. Toggle on **Developer mode** in the upper-right corner.
4. Click **Load unpacked** (加载已解压的扩展程序).
5. Select the cloned repository folder (`un-ai-text-chrome-extension`).
6. The extension is now active on all websites!

---

## 🚀 How to Use

1. **Highlight Any Text**: Select any paragraph on any webpage (ChatGPT, Google Docs, Overleaf, or online editors).
2. **Click the Floating Bubble**: An authentic `unAI` gradient badge appears near your cursor.
3. **Inspect Radar & Clichés**:
   - Tab 1 (**Radar**): Check the heuristic AI risk score and sentence variance insight.
   - Tab 2 (**Clichés**): View detected buzzwords and copy the cleaned text in one click.
   - Tab 3 (**Shield**): Verify how many LaTeX equations and tables are detected and protected.
4. **Launch Web Workbench**: Click **Launch Full Workbench on un-ai-text.com** for full semantic remodeling.

---

## 🧩 Architecture

The repository is organized following Google Chrome **Manifest V3** best practices:

```text
├── manifest.json         # Chrome MV3 manifest with scoped permissions
├── background.js         # Service worker handling context menus and web redirection
├── content.js            # Shadow DOM-encapsulated in-page floating widget
├── cliches.js            # Curated 40+ AI cliché rules and natural replacements
├── prepass.js            # 300ms heuristic AI risk scoring and scanner engine
├── academic-guard.js     # Mathematical equation and table AST detection probe
├── popup.html            # Toolbar popup modal interface
├── popup.js              # Toolbar popup logic and daily quota tracker
├── popup.css             # Light-mode editorial styling for popup
└── icons/                # High-resolution vector and raster branding assets
```

---

## 🛡️ Responsible Writing & Ethics

**[Un-AI Text](https://un-ai-text.com)** adheres strictly to academic integrity and ethical AI writing principles:
- This tool is engineered to help authors, ESL researchers, and writers eliminate formulaic robotic syntax and express ideas with human naturalness.
- We do not encourage deceptive practices or academic dishonesty.
- For complete terms and disclaimers, please visit our **[Terms of Service](https://un-ai-text.com/terms)** and **[Disclaimer Policy](https://un-ai-text.com/disclaimer)**.

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/NewFeature`).
3. Commit your Changes (`git commit -m 'feat: Add new cliché patterns'`).
4. Push to the Branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more details.

---

<p align="center">
  Maintained with ❤️ by the <a href="https://un-ai-text.com">Un-AI Text Team</a>.
</p>
