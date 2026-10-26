// content.js - In-page floating assistant with 100% Authentic Website Theme & Assets

(function () {
  let shadowHost = null;
  let shadowRoot = null;
  let activeSelection = "";
  let currentTab = "radar";

  // Check if floating bubble is enabled in settings (default true)
  let bubbleEnabled = true;
  if (chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(["bubbleEnabled"], (res) => {
      if (res.bubbleEnabled !== undefined) bubbleEnabled = res.bubbleEnabled;
    });
  }

  // Official logo asset URL from extension package (uses vector SVG)
  const LOGO_URL = chrome.runtime.getURL("icons/icon.svg");

  // Official website SVG icons ported directly from src/components/icon-sprite.tsx
  const SVG = {
    bolt: `<svg class="unai-svg-icon unai-tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>`,
    sparkle: `<svg class="unai-svg-icon unai-tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /><path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" /></svg>`,
    shield: `<svg class="unai-svg-icon unai-tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>`,
    arrowRight: `<svg class="unai-svg-icon unai-cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>`,
    lightbulb: `<svg class="unai-svg-icon unai-insight-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" /></svg>`,
    copy: `<svg class="unai-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>`,
    check: `<svg class="unai-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>`,
    close: `<svg class="unai-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>`
  };

  // Exact un-ai-text.com Academic-Editorial Design System embedded directly in shadowRoot
  const EMBEDDED_STYLES = `
    :host {
      all: initial !important;
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
      font-size: 13px !important;
      line-height: 1.5 !important;
      color: rgba(0, 0, 0, 0.95) !important;
      -webkit-font-smoothing: antialiased !important;
    }
    .unai-bubble, .unai-bubble *,
    .unai-card, .unai-card * {
      box-sizing: border-box !important;
      margin: 0 !important;
      padding: 0 !important;
      font-family: inherit !important;
    }
    .unai-bubble {
      position: fixed !important;
      pointer-events: auto !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 7px !important;
      padding: 5px 13px 5px 6px !important;
      background: linear-gradient(135deg, #163474 0%, #1c4494 30%, #1e68ca 70%, #0284c7 100%) !important;
      color: #ffffff !important;
      font-family: "Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif !important;
      font-size: 13px !important;
      font-weight: 700 !important;
      letter-spacing: -0.01em !important;
      border: 1px solid rgba(255, 255, 255, 0.3) !important;
      border-radius: 9999px !important;
      cursor: pointer !important;
      box-shadow: 0 10px 25px -4px rgba(0, 117, 222, 0.4), 0 4px 10px -2px rgba(22, 52, 116, 0.3) !important;
      transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1) !important;
      user-select: none !important;
      z-index: 2147483647 !important;
      backdrop-filter: blur(8px) !important;
    }
    .unai-bubble:hover {
      background: linear-gradient(135deg, #12254e 0%, #16336a 30%, #1a4286 70%, #0284c7 100%) !important;
      transform: translateY(-2px) scale(1.04) !important;
      box-shadow: 0 14px 30px -4px rgba(0, 117, 222, 0.55), 0 6px 14px -2px rgba(22, 52, 116, 0.4) !important;
      border-color: rgba(255, 255, 255, 0.5) !important;
    }
    .unai-bubble-logo {
      width: 20px !important;
      height: 20px !important;
      border-radius: 5px !important;
      flex-shrink: 0 !important;
      display: block !important;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) !important;
    }
    .unai-card {
      position: fixed !important;
      pointer-events: auto !important;
      width: 380px !important;
      background: #ffffff !important;
      border: 1px solid rgba(0, 0, 0, 0.1) !important;
      border-radius: 16px !important;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 18px 40px -4px rgba(0, 0, 0, 0.2), 0 6px 16px -2px rgba(0, 0, 0, 0.08) !important;
      overflow: hidden !important;
      z-index: 2147483647 !important;
      animation: unai-card-appear 0.18s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    @keyframes unai-card-appear {
      from { opacity: 0; transform: translateY(6px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .unai-header {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      padding: 12px 16px !important;
      background: rgba(255, 255, 255, 0.96) !important;
      border-bottom: 1px solid rgba(0, 0, 0, 0.07) !important;
      backdrop-filter: blur(12px) !important;
    }
    .unai-brand {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
    }
    .unai-header-logo {
      width: 28px !important;
      height: 28px !important;
      border-radius: 7px !important;
      flex-shrink: 0 !important;
      display: block !important;
      box-shadow: 0 2px 6px rgba(14, 165, 233, 0.25) !important;
    }
    .unai-brand-titles {
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
    }
    .unai-brand-title {
      font-family: "Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif !important;
      font-weight: 800 !important;
      font-size: 16px !important;
      color: rgba(0, 0, 0, 0.95) !important;
      letter-spacing: -0.03em !important;
    }
    .unai-pill-tag {
      display: inline-flex !important;
      align-items: center !important;
      gap: 4px !important;
      font-family: Inter, -apple-system, sans-serif !important;
      font-size: 10px !important;
      font-weight: 600 !important;
      background: #f2f9ff !important;
      color: #0a5fb0 !important;
      padding: 2px 7px !important;
      border-radius: 9999px !important;
      border: 1px solid rgba(0, 117, 222, 0.2) !important;
    }
    .unai-dot-live {
      width: 6px !important;
      height: 6px !important;
      border-radius: 50% !important;
      background: #1aae39 !important;
      display: inline-block !important;
    }
    .unai-close-btn {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 26px !important;
      height: 26px !important;
      background: transparent !important;
      border: none !important;
      color: #6b6661 !important;
      cursor: pointer !important;
      border-radius: 6px !important;
      transition: all 0.15s ease !important;
    }
    .unai-close-btn:hover {
      background: #f6f5f4 !important;
      color: rgba(0, 0, 0, 0.95) !important;
    }
    .unai-close-btn svg {
      width: 14px !important;
      height: 14px !important;
      stroke-width: 2 !important;
    }
    .unai-tabs-wrap {
      padding: 8px 12px !important;
      background: #fbfaf9 !important;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
    }
    .unai-tabs {
      display: flex !important;
      background: rgba(0, 0, 0, 0.055) !important;
      border: 1px solid rgba(0, 0, 0, 0.08) !important;
      padding: 3px !important;
      gap: 3px !important;
      border-radius: 9999px !important;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04) !important;
    }
    .unai-tab {
      flex: 1 !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 6px !important;
      border: 1px solid transparent !important;
      background: transparent !important;
      padding: 6px 10px !important;
      font-size: 12px !important;
      font-weight: 500 !important;
      color: #595551 !important;
      cursor: pointer !important;
      border-radius: 9999px !important;
      transition: all 0.15s ease !important;
      white-space: nowrap !important;
    }
    .unai-tab:hover {
      color: rgba(0, 0, 0, 0.95) !important;
      background: rgba(0, 0, 0, 0.035) !important;
    }
    .unai-tab.active {
      background: #ffffff !important;
      color: rgba(0, 0, 0, 0.95) !important;
      font-weight: 600 !important;
      border-color: rgba(0, 0, 0, 0.08) !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.09), 0 1px 2px rgba(0, 0, 0, 0.05) !important;
    }
    .unai-svg-icon {
      width: 14px !important;
      height: 14px !important;
      stroke-width: 2 !important;
      flex-shrink: 0 !important;
      display: inline-block !important;
      vertical-align: middle !important;
    }
    .unai-tab-icon {
      width: 13px !important;
      height: 13px !important;
      stroke-width: 2 !important;
      color: #6b6661 !important;
      transition: color 0.15s ease, transform 0.15s ease !important;
    }
    .unai-tab:hover .unai-tab-icon {
      color: #0075de !important;
    }
    .unai-tab.active .unai-tab-icon {
      color: #0075de !important;
      transform: scale(1.1) !important;
    }
    .unai-tab.active[data-tab="cleaner"] .unai-tab-icon {
      color: #dd5b00 !important;
    }
    .unai-tab.active[data-tab="academic"] .unai-tab-icon {
      color: #116b2e !important;
    }
    .unai-body {
      padding: 14px 16px !important;
      max-height: 280px !important;
      overflow-y: auto !important;
      background: #ffffff !important;
    }
    .unai-radar-panel {
      display: flex !important;
      flex-direction: column !important;
      gap: 12px !important;
    }
    .unai-score-card {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      padding: 12px 14px !important;
      border-radius: 12px !important;
      border: 1px solid rgba(0, 0, 0, 0.08) !important;
      background: #fbfaf9 !important;
    }
    .unai-score-left {
      display: flex !important;
      align-items: baseline !important;
      gap: 3px !important;
    }
    .unai-score-num {
      font-size: 34px !important;
      font-weight: 800 !important;
      line-height: 1 !important;
      letter-spacing: -0.03em !important;
      font-family: "Iowan Old Style", Georgia, serif !important;
    }
    .unai-score-percent {
      font-size: 16px !important;
      font-weight: 600 !important;
    }
    .unai-score-badge {
      display: inline-flex !important;
      align-items: center !important;
      gap: 4px !important;
      padding: 4px 10px !important;
      border-radius: 9999px !important;
      font-size: 11px !important;
      font-weight: 700 !important;
    }
    .badge-human {
      background: #e9f9ee !important;
      color: #116b2e !important;
      border: 1px solid rgba(26, 174, 57, 0.3) !important;
    }
    .badge-moderate {
      background: #fff4e9 !important;
      color: #a34400 !important;
      border: 1px solid rgba(221, 91, 0, 0.3) !important;
    }
    .badge-ai {
      background: #fdecec !important;
      color: #dc2626 !important;
      border: 1px solid rgba(220, 38, 38, 0.3) !important;
    }
    .unai-stats-grid {
      display: grid !important;
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 8px !important;
    }
    .unai-stat-box {
      background: #f6f5f4 !important;
      border: 1px solid rgba(0, 0, 0, 0.05) !important;
      border-radius: 8px !important;
      padding: 8px 10px !important;
      text-align: center !important;
    }
    .unai-stat-value {
      font-size: 13px !important;
      font-weight: 700 !important;
      color: rgba(0, 0, 0, 0.95) !important;
    }
    .unai-stat-label {
      font-size: 10px !important;
      color: #6b6661 !important;
      margin-top: 2px !important;
    }
    .unai-insight-box {
      display: flex !important;
      align-items: flex-start !important;
      gap: 8px !important;
      background: #fbfaf9 !important;
      border: 1px solid rgba(0, 0, 0, 0.07) !important;
      border-radius: 10px !important;
      padding: 10px 12px !important;
      font-size: 11px !important;
      line-height: 1.45 !important;
      color: #31302e !important;
    }
    .unai-insight-icon {
      font-size: 14px !important;
      flex-shrink: 0 !important;
      margin-top: 1px !important;
    }
    .unai-cleaner-panel {
      display: flex !important;
      flex-direction: column !important;
      gap: 12px !important;
    }
    .unai-cliche-list {
      display: flex !important;
      flex-direction: column !important;
      gap: 6px !important;
      max-height: 150px !important;
      overflow-y: auto !important;
    }
    .unai-cliche-item {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      background: #fbfaf9 !important;
      border: 1px solid rgba(0, 0, 0, 0.07) !important;
      border-radius: 8px !important;
      padding: 6px 10px !important;
      font-size: 11px !important;
    }
    .unai-cliche-target {
      color: #dc2626 !important;
      font-weight: 600 !important;
      text-decoration: line-through !important;
      background: #fdecec !important;
      padding: 1px 5px !important;
      border-radius: 4px !important;
    }
    .unai-cliche-arrow {
      color: #6b6661 !important;
      display: inline-flex !important;
      align-items: center !important;
    }
    .unai-cliche-arrow svg {
      width: 12px !important;
      height: 12px !important;
      stroke-width: 2.2 !important;
    }
    .unai-cliche-replacement {
      color: #116b2e !important;
      font-weight: 600 !important;
      background: #e9f9ee !important;
      padding: 1px 5px !important;
      border-radius: 4px !important;
    }
    .unai-empty-state {
      text-align: center !important;
      padding: 24px 12px !important;
      background: #fbfaf9 !important;
      border-radius: 10px !important;
      border: 1px dashed rgba(0, 0, 0, 0.12) !important;
    }
    .unai-empty-title {
      font-size: 13px !important;
      font-weight: 700 !important;
      color: #116b2e !important;
      margin-bottom: 4px !important;
    }
    .unai-empty-desc {
      font-size: 11px !important;
      color: #595551 !important;
    }
    .unai-cleaner-actions {
      display: flex !important;
      justify-content: flex-end !important;
    }
    .unai-action-btn {
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      background: #ffffff !important;
      color: rgba(0, 0, 0, 0.95) !important;
      border: 1px solid rgba(0, 0, 0, 0.16) !important;
      border-radius: 8px !important;
      padding: 7px 14px !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04) !important;
      transition: all 0.15s ease !important;
    }
    .unai-action-btn:hover {
      background: #f6f5f4 !important;
      border-color: rgba(0, 0, 0, 0.25) !important;
    }
    .unai-action-btn svg {
      width: 13px !important;
      height: 13px !important;
      stroke-width: 2 !important;
    }
    .unai-academic-panel {
      display: flex !important;
      flex-direction: column !important;
      gap: 12px !important;
    }
    .unai-academic-card {
      display: flex !important;
      gap: 12px !important;
      background: #fbfaf9 !important;
      border: 1px solid rgba(0, 0, 0, 0.08) !important;
      border-radius: 12px !important;
      padding: 12px !important;
    }
    .unai-shield-badge {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 32px !important;
      height: 32px !important;
      background: #e9f9ee !important;
      border: 1px solid rgba(26, 174, 57, 0.3) !important;
      border-radius: 8px !important;
      color: #116b2e !important;
      flex-shrink: 0 !important;
    }
    .unai-shield-badge svg {
      width: 18px !important;
      height: 18px !important;
      stroke-width: 2 !important;
    }
    .unai-academic-text strong {
      font-size: 12px !important;
      color: rgba(0, 0, 0, 0.95) !important;
      display: block !important;
    }
    .unai-academic-text p {
      font-size: 11px !important;
      color: #595551 !important;
      margin-top: 3px !important;
      line-height: 1.4 !important;
    }
    .unai-shield-pills {
      display: flex !important;
      gap: 8px !important;
    }
    .unai-shield-pill {
      flex: 1 !important;
      background: #ffffff !important;
      border: 1px solid rgba(0, 0, 0, 0.1) !important;
      border-radius: 8px !important;
      padding: 8px !important;
      text-align: center !important;
    }
    .unai-shield-pill.active {
      border-color: rgba(26, 174, 57, 0.4) !important;
      background: #e9f9ee !important;
    }
    .unai-pill-num {
      font-size: 15px !important;
      font-weight: 700 !important;
      color: rgba(0, 0, 0, 0.95) !important;
    }
    .unai-shield-pill.active .unai-pill-num {
      color: #116b2e !important;
    }
    .unai-pill-label {
      font-size: 10px !important;
      color: #6b6661 !important;
      margin-top: 2px !important;
    }
    .unai-footer {
      padding: 12px 16px !important;
      background: #fbfaf9 !important;
      border-top: 1px solid rgba(0, 0, 0, 0.07) !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 6px !important;
    }
    .unai-primary-cta {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 10px !important;
      width: 100% !important;
      background: linear-gradient(100deg, #0075de 0%, #1558b8 48%, #213183 100%) !important;
      color: #ffffff !important;
      border: 1px solid rgba(255, 255, 255, 0.22) !important;
      border-radius: 12px !important;
      padding: 12px 18px !important;
      font-size: 13px !important;
      font-weight: 700 !important;
      cursor: pointer !important;
      box-shadow: 0 4px 14px rgba(0, 117, 222, 0.32), 0 2px 6px rgba(33, 49, 131, 0.22) !important;
      transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1) !important;
      letter-spacing: -0.01em !important;
      text-decoration: none !important;
    }
    .unai-primary-cta:hover {
      background: linear-gradient(100deg, #005bab 0%, #0f4699 48%, #18255f 100%) !important;
      transform: translateY(-1.5px) !important;
      box-shadow: 0 8px 22px rgba(0, 117, 222, 0.45), 0 4px 10px rgba(33, 49, 131, 0.3) !important;
    }
    .unai-primary-cta:active {
      transform: translateY(0) scale(0.98) !important;
    }
    .unai-cta-arrow {
      width: 15px !important;
      height: 15px !important;
      stroke-width: 2.2 !important;
      transition: transform 0.18s ease !important;
      flex-shrink: 0 !important;
    }
    .unai-primary-cta:hover .unai-cta-arrow {
      transform: translateX(4px) !important;
    }
    .unai-cta-subtext {
      text-align: center !important;
      font-size: 10px !important;
      color: #6b6661 !important;
    }
  `;

  function ensureShadowContainer() {
    if (shadowHost && document.documentElement.contains(shadowHost)) {
      return shadowRoot;
    }

    shadowHost = document.createElement("div");
    shadowHost.id = "unai-extension-root";
    shadowHost.style.setProperty("all", "initial", "important");
    shadowHost.style.setProperty("position", "fixed", "important");
    shadowHost.style.setProperty("top", "0", "important");
    shadowHost.style.setProperty("left", "0", "important");
    shadowHost.style.setProperty("width", "0", "important");
    shadowHost.style.setProperty("height", "0", "important");
    shadowHost.style.setProperty("overflow", "visible", "important");
    shadowHost.style.setProperty("z-index", "2147483647", "important");
    shadowHost.style.setProperty("pointer-events", "none", "important");

    document.documentElement.appendChild(shadowHost);
    shadowRoot = shadowHost.attachShadow({ mode: "open" });

    const styleEl = document.createElement("style");
    styleEl.textContent = EMBEDDED_STYLES;
    shadowRoot.appendChild(styleEl);

    return shadowRoot;
  }

  function removeWidget() {
    if (shadowRoot) {
      const card = shadowRoot.querySelector(".unai-card");
      if (card) card.remove();
      const bubble = shadowRoot.querySelector(".unai-bubble");
      if (bubble) bubble.remove();
    }
  }

  // Floating trigger bubble with 3D gradient & official logo
  function showBubble(viewportX, viewportY, text) {
    const root = ensureShadowContainer();
    removeWidget();

    const bubble = document.createElement("button");
    bubble.className = "unai-bubble";

    const safeX = Math.min(Math.max(12, viewportX), window.innerWidth - 95);
    const safeY = Math.min(Math.max(12, viewportY), window.innerHeight - 45);

    bubble.style.top = `${safeY}px`;
    bubble.style.left = `${safeX}px`;
    bubble.innerHTML = `
      <img src="${LOGO_URL}" class="unai-bubble-logo" alt="unAI" />
      <span>unAI</span>
    `;

    bubble.onclick = (e) => {
      e.stopPropagation();
      showCard(safeX + 35, safeY, text, "radar");
    };

    root.appendChild(bubble);
  }

  // Interactive Card with Segmented Pill Tabs & .btn-run Gradient CTA
  function showCard(viewportX, viewportY, text, initialTab = "radar") {
    const root = ensureShadowContainer();
    removeWidget();

    currentTab = initialTab;
    activeSelection = text;

    const analysis = window.UN_AI_PREPASS
      ? window.UN_AI_PREPASS.analyzeText(text)
      : { score: 5, wordCount: 0, matches: [], level: "Human-Like", sentenceCount: 0 };

    const academic = window.UN_AI_ACADEMIC
      ? window.UN_AI_ACADEMIC.getAcademicStatus(text)
      : { isAcademic: false, formulas: { formulaCount: 0 }, tables: { tableCount: 0 } };

    const card = document.createElement("div");
    card.className = "unai-card";

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const cardWidth = 380;
    const estimatedCardHeight = 340;

    const adjustedX = Math.min(Math.max(16, viewportX - cardWidth / 2), viewportWidth - cardWidth - 16);

    let adjustedY = viewportY + 8;
    if (adjustedY + estimatedCardHeight > viewportHeight - 16) {
      adjustedY = Math.max(16, viewportY - estimatedCardHeight - 24);
    }

    card.style.top = `${adjustedY}px`;
    card.style.left = `${adjustedX}px`;

    function renderCardContent() {
      const cleaned = window.UN_AI_PREPASS
        ? window.UN_AI_PREPASS.cleanText(activeSelection)
        : activeSelection;

      card.innerHTML = `
        <div class="unai-header">
          <div class="unai-brand">
            <img src="${LOGO_URL}" class="unai-header-logo" alt="Un-AI Text" />
            <div class="unai-brand-titles">
              <span class="unai-brand-title">Un-AI Text</span>
              <span class="unai-pill-tag">
                <span class="unai-dot-live"></span>
                Fast Radar
              </span>
            </div>
          </div>
          <button class="unai-close-btn" id="unai-close" title="Close" aria-label="Close">${SVG.close}</button>
        </div>

        <div class="unai-tabs-wrap">
          <div class="unai-tabs">
            <button class="unai-tab ${currentTab === "radar" ? "active" : ""}" data-tab="radar">
              ${SVG.bolt}
              <span>Radar (${analysis.score}%)</span>
            </button>
            <button class="unai-tab ${currentTab === "cleaner" ? "active" : ""}" data-tab="cleaner">
              ${SVG.sparkle}
              <span>Clichés (${analysis.matches.length})</span>
            </button>
            <button class="unai-tab ${currentTab === "academic" ? "active" : ""}" data-tab="academic">
              ${SVG.shield}
              <span>Shield ${academic.isAcademic ? "•" : ""}</span>
            </button>
          </div>
        </div>

        <div class="unai-body">
          ${renderTabBody(cleaned, analysis, academic)}
        </div>

        <div class="unai-footer">
          <button class="unai-primary-cta" id="unai-launch-web">
            <span>Launch Full Workbench on un-ai-text.com</span>
            ${SVG.arrowRight}
          </button>
          <span class="unai-cta-subtext">Deep sentence rhythm remodeling & formula preservation</span>
        </div>
      `;

      card.querySelector("#unai-close").onclick = (e) => {
        e.stopPropagation();
        removeWidget();
      };

      card.querySelectorAll(".unai-tab").forEach((tabBtn) => {
        tabBtn.onclick = (e) => {
          e.stopPropagation();
          currentTab = tabBtn.getAttribute("data-tab");
          renderCardContent();
        };
      });

      card.querySelector("#unai-launch-web").onclick = (e) => {
        e.stopPropagation();
        chrome.runtime.sendMessage({
          action: "open-web",
          text: activeSelection,
          mode: academic.isAcademic ? "academic" : "standard"
        });
        removeWidget();
      };

      const copyCleanBtn = card.querySelector("#unai-copy-clean");
      if (copyCleanBtn) {
        copyCleanBtn.onclick = async (e) => {
          e.stopPropagation();
          try {
            await navigator.clipboard.writeText(cleaned);
            copyCleanBtn.innerHTML = `${SVG.check} <span>Copied Clean Text!</span>`;
            setTimeout(() => {
              if (copyCleanBtn) copyCleanBtn.innerHTML = `${SVG.copy} <span>Copy Cleaned Text</span>`;
            }, 2000);
          } catch (err) {
            console.error(err);
          }
        };
      }
    }

    function renderTabBody(cleaned, analysis, academic) {
      if (currentTab === "radar") {
        const isHuman = analysis.score < 35;
        const isModerate = analysis.score >= 35 && analysis.score < 70;
        const scoreColor = isHuman ? "#116b2e" : isModerate ? "#a34400" : "#dc2626";
        const badgeClass = isHuman ? "badge-human" : isModerate ? "badge-moderate" : "badge-ai";

        return `
          <div class="unai-radar-panel">
            <div class="unai-score-card">
              <div class="unai-score-left" style="color: ${scoreColor}">
                <span class="unai-score-num">${analysis.score}</span>
                <span class="unai-score-percent">%</span>
              </div>
              <div class="unai-score-badge ${badgeClass}">
                ${analysis.level}
              </div>
            </div>

            <div class="unai-stats-grid">
              <div class="unai-stat-box">
                <div class="unai-stat-value">${analysis.wordCount}</div>
                <div class="unai-stat-label">Words</div>
              </div>
              <div class="unai-stat-box">
                <div class="unai-stat-value" style="color: ${analysis.matches.length > 0 ? "#dc2626" : "#116b2e"}">
                  ${analysis.matches.length}
                </div>
                <div class="unai-stat-label">AI Clichés</div>
              </div>
              <div class="unai-stat-box">
                <div class="unai-stat-value">${analysis.sentenceCount || 1}</div>
                <div class="unai-stat-label">Sentences</div>
              </div>
            </div>

            <div class="unai-insight-box">
              ${SVG.lightbulb}
              <div>
                <strong>Prepass Insight:</strong>
                ${
                  isHuman
                    ? "Natural sentence length variance and zero typical AI transition formulas detected."
                    : "Machine-generated text often over-relies on predictable transitions like <em>'delve into'</em> and uniform sentence cadences."
                }
              </div>
            </div>
          </div>
        `;
      }

      if (currentTab === "cleaner") {
        if (analysis.matches.length === 0) {
          return `
            <div class="unai-cleaner-panel">
              <div class="unai-empty-state">
                <div class="unai-empty-title">
                  <span style="display:inline-flex;align-items:center;gap:5px;">
                    ${SVG.check}
                    <span>No AI Clichés Detected!</span>
                  </span>
                </div>
                <div class="unai-empty-desc">This text already avoids generic buzzwords like <em>"delve into"</em> and <em>"testament to"</em>.</div>
              </div>
            </div>
          `;
        }

        const items = analysis.matches
          .slice(0, 5)
          .map(
            (m) => `
            <div class="unai-cliche-item">
              <span class="unai-cliche-target">${m.phrase}</span>
              <span class="unai-cliche-arrow">${SVG.arrowRight}</span>
              <span class="unai-cliche-replacement">${m.suggested}</span>
            </div>
          `
          )
          .join("");

        return `
          <div class="unai-cleaner-panel">
            <div class="unai-cliche-list">${items}</div>
            <div class="unai-cleaner-actions">
              <button class="unai-action-btn" id="unai-copy-clean">
                ${SVG.copy}
                <span>Copy Cleaned Text</span>
              </button>
            </div>
          </div>
        `;
      }

      if (currentTab === "academic") {
        return `
          <div class="unai-academic-panel">
            <div class="unai-academic-card">
              <div class="unai-shield-badge">${SVG.shield}</div>
              <div class="unai-academic-text">
                <strong>LaTeX & Markdown Table Protection</strong>
                <p>Mathematical expressions and table rows are masked into inert AST tokens during rewrite, then restored verbatim.</p>
              </div>
            </div>

            <div class="unai-shield-pills">
              <div class="unai-shield-pill ${academic.formulas?.hasFormulas ? "active" : ""}">
                <div class="unai-pill-num">${academic.formulas?.formulaCount || 0}</div>
                <div class="unai-pill-label">Formulas Found</div>
              </div>
              <div class="unai-shield-pill ${academic.tables?.hasTables ? "active" : ""}">
                <div class="unai-pill-num">${academic.tables?.tableCount || 0}</div>
                <div class="unai-pill-label">Tables Found</div>
              </div>
            </div>
          </div>
        `;
      }
    }

    renderCardContent();
    root.appendChild(card);
  }

  // Selection listener - uses getBoundingClientRect viewport coordinates
  document.addEventListener("mouseup", (e) => {
    if (shadowHost && e.composedPath().includes(shadowHost)) return;

    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : "";

    if (!text || text.length < 15 || !bubbleEnabled) {
      setTimeout(() => {
        const root = shadowRoot;
        if (root && !root.querySelector(".unai-card")) {
          removeWidget();
        }
      }, 150);
      return;
    }

    try {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const clientX = rect.left + rect.width / 2 - 25;
      const clientY = rect.bottom + 8;
      showBubble(clientX, clientY, text);
    } catch (err) {
      showBubble(e.clientX, e.clientY + 10, text);
    }
  });

  // Background context menu trigger
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "trigger-action") {
      const text = msg.text || "";
      let tab = "radar";
      if (msg.type === "unai-clean-cliches") tab = "cleaner";
      if (msg.type === "unai-humanize-web") tab = "academic";

      const clientX = window.innerWidth / 2;
      const clientY = 80;
      showCard(clientX, clientY, text, tab);
      sendResponse({ status: "shown" });
    }
  });
})();
