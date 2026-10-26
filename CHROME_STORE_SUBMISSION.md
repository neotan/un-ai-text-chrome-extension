# Chrome Web Store Submission Guide & Metadata Kit

> **Product**: unAI Text - AI Detector & Humanizer  
> **Official Website**: [https://un-ai-text.com](https://un-ai-text.com)  
> **Developer Dashboard**: [https://chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole)  
> **Target Package**: `unai-text-chrome-extension-v1.0.0.zip`

---

## 1. Store Listing Details (商店基础信息)

| Field | Content | Note |
| :--- | :--- | :--- |
| **Item Name** | `unAI Text - AI Detector & Humanizer` | Under 45 chars limit |
| **Summary / Short Description** | `300ms AI detector, one-click AI cliché cleaner (delve, furthermore), and text humanizer with LaTeX formula & table protection.` | Exactly 126 chars (Max 132 chars) |
| **Category** | `Productivity` / `Workflow & Planning` | 生产力工具 |
| **Language** | `English (United States)` | 主语言 |
| **Official Website URL** | `https://un-ai-text.com` | DR 传递与官方实体认证 |
| **Support URL / Repository** | `https://github.com/neotan/un-ai-text-chrome-extension` | 开源支持链接 |

---

## 2. Detailed Description (详细描述 - 直接复制完整 Markdown)

```markdown
Tired of robotic AI-sounding prose packed with "delve into", "a testament to", and repetitive sentence rhythms? Afraid that rewriting tools will corrupt your mathematical formulas or Markdown tables in Google Docs or Overleaf?

Un-AI Text is your lightweight, zero-latency browser companion for natural, human-grade writing.

🌟 CORE FEATURES:
✔ 300ms Heuristic AI Radar: Instant probability analysis and rhythm variance check without waiting for slow cloud APIs.
✔ 1-Click AI Cliché Cleaner: Detects and replaces 40+ typical ChatGPT clichés ("delve into", "a testament to", "furthermore", "multifaceted") with natural expressions.
✔ Academic LaTeX & Table Shield: Automatically protects inline math ($...$), display equations (\[...\]), and Markdown pipe tables from corruption.
✔ Shadow DOM Encapsulated: 100% style-isolated from host pages — zero visual interference on LinkedIn, Gmail, Overleaf, or Google Docs.
✔ Direct Web Bridge: Highlight any text and launch the full deep-remodeling workbench on un-ai-text.com in one click.

🔒 PRIVACY & SECURITY FIRST:
• Local Prepass: Cliché scanning and heuristic checks execute 100% locally in your browser memory.
• Zero Text Logging: We do not store, sell, or collect your input drafts.
• Privacy Policy: https://un-ai-text.com/privacy
• Open Source: Fully auditable source code available on GitHub (https://github.com/neotan/un-ai-text-chrome-extension).
```

---

## 3. Privacy Practices (隐私问卷与权限合规声明)

### 3.1 Single Purpose Description (单一用途声明)
> *To help users analyze AI-generated writing patterns, clean robotic clichés, and protect academic formulas across web text editors.*

### 3.2 Permission Justifications (权限合理性说明)

| Permission | Official Review Justification (审核理由) |
| :--- | :--- |
| **`activeTab`** | *Used solely to read user-selected text and render the in-page floating analysis bubble when explicitly selected.* |
| **`contextMenus`** | *Allows users to right-click highlighted text to trigger "Analyze with unAI Text" or "Clean AI Clichés".* |
| **`storage`** | *Saves user UI preferences (such as enabling/disabling the floating bubble) and tracks daily local scan count.* |
| **`host_permissions` (`https://un-ai-text.com/*`)** | *Required to seamlessly bridge user-selected text to the web application workbench upon clicking the launch button.* |

### 3.3 Data Usage Declarations (数据使用问卷)
- **Does this extension collect user data?** $\rightarrow$ Select **No** (All analysis executes client-side).
- **Personal Data**: No personal identifiable information (PII), health, financial, or authentication credentials are collected.
- **Third-Party Transfer**: Check *"I certify that I do not sell or transfer user data to third parties"*.
- **Privacy Policy Link**: `https://un-ai-text.com/privacy`

---

## 4. Graphic Assets Checklist (视觉图片物料)

All promotional graphics and screenshots have been designed to Chrome Web Store official specifications and are available in [`store-assets/`](file:///D:/workspace/un-ai-text-chrome-extension/store-assets/):

| Asset | Dimensions | File Location | Purpose & Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Store Icon** | 128x128 PNG | [`store-assets/store-icon-128x128.png`](file:///D:/workspace/un-ai-text-chrome-extension/store-assets/store-icon-128x128.png) | High-contrast store catalog icon | ✅ Ready |
| **Screenshot 1** | 1280x800 PNG | [`store-assets/screenshot-1-radar-1280x800.png`](file:///D:/workspace/un-ai-text-chrome-extension/store-assets/screenshot-1-radar-1280x800.png) | 300ms Heuristic AI Risk Radar card overlay | ✅ Ready |
| **Screenshot 2** | 1280x800 PNG | [`store-assets/screenshot-2-cliches-1280x800.png`](file:///D:/workspace/un-ai-text-chrome-extension/store-assets/screenshot-2-cliches-1280x800.png) | One-Click Local AI Cliché Cleaner | ✅ Ready |
| **Screenshot 3** | 1280x800 PNG | [`store-assets/screenshot-3-shield-1280x800.png`](file:///D:/workspace/un-ai-text-chrome-extension/store-assets/screenshot-3-shield-1280x800.png) | Academic LaTeX & Markdown Table Protection | ✅ Ready |
| **Small Promo Tile** | 440x280 PNG | [`store-assets/promo-small-tile-440x280.png`](file:///D:/workspace/un-ai-text-chrome-extension/store-assets/promo-small-tile-440x280.png) | Search results & category listing card | ✅ Ready |
| **Marquee Banner** | 1400x560 PNG | [`store-assets/promo-marquee-banner-1400x560.png`](file:///D:/workspace/un-ai-text-chrome-extension/store-assets/promo-marquee-banner-1400x560.png) | Featured store spotlight banner | ✅ Ready |

---

## 5. How to Rebuild ZIP Archive (重新打包命令)

If you modify code in the future, run this one-line command to generate the production-ready `.zip`:

```bash
python -c "
import os, zipfile
source_dir = r'.'
output_zip = r'unai-text-chrome-extension-v1.0.0.zip'
files = ['manifest.json', 'background.js', 'content.js', 'popup.html', 'popup.js', 'popup.css', 'cliches.js', 'prepass.js', 'academic-guard.js', 'icons/icon16.png', 'icons/icon48.png', 'icons/icon128.png', 'icons/icon.svg']
with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as z:
    for f in files: z.write(os.path.join(source_dir, f.replace('/', os.sep)), f)
print('Package built:', output_zip)
"
```
