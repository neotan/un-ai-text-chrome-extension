// background.js - Service Worker for unAI Text Extension

const WEBSITE_URL = "https://un-ai-text.com";
const WELCOME_URL = `${WEBSITE_URL}/extension?installed=true`;
const UNINSTALL_URL = `${WEBSITE_URL}/contact?topic=uninstall-feedback`;

// Setup context menus & welcome redirect on install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // 哥飞推荐：打开主站落地页，激活新标签页，获取新用户与沉淀 PV
    chrome.tabs.create({ url: WELCOME_URL });
  }

  // Set uninstall feedback survey URL
  if (chrome.runtime.setUninstallURL) {
    chrome.runtime.setUninstallURL(UNINSTALL_URL);
  }

  // Create context menus for text selections
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "unai-root",
      title: "unAI Text Actions",
      contexts: ["selection"]
    });

    chrome.contextMenus.create({
      id: "unai-quick-check",
      parentId: "unai-root",
      title: "🔍 Quick AI Risk Radar (300ms)",
      contexts: ["selection"]
    });

    chrome.contextMenus.create({
      id: "unai-clean-cliches",
      parentId: "unai-root",
      title: "✨ Clean AI Clichés (delve, furthermore...)",
      contexts: ["selection"]
    });

    chrome.contextMenus.create({
      id: "unai-humanize-web",
      parentId: "unai-root",
      title: "🚀 Humanize on Web (Keep LaTeX & Tables)",
      contexts: ["selection"]
    });
  });
});

// Handle Context Menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab || !tab.id) return;
  const selectedText = info.selectionText || "";

  if (info.menuItemId === "unai-humanize-web") {
    // Open web app with preloaded text in academic or standard mode
    const encoded = encodeURIComponent(selectedText.slice(0, 3000));
    chrome.tabs.create({
      url: `${WEBSITE_URL}/?from=extension&input=${encoded}`
    });
    return;
  }

  // Send message to content script to display the interactive card
  chrome.tabs.sendMessage(tab.id, {
    action: "trigger-action",
    type: info.menuItemId,
    text: selectedText
  }).catch((err) => {
    console.warn("Could not send message to tab:", err);
  });
});

// Daily quota tracking via chrome.storage.local
async function getDailyQuota() {
  const today = new Date().toISOString().slice(0, 10);
  const data = await chrome.storage.local.get(["dailyDate", "dailyChecksUsed"]);
  if (data.dailyDate !== today) {
    await chrome.storage.local.set({ dailyDate: today, dailyChecksUsed: 0 });
    return { date: today, used: 0, limit: 5 };
  }
  return { date: today, used: data.dailyChecksUsed || 0, limit: 5 };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "get-quota") {
    getDailyQuota().then(sendResponse);
    return true;
  }

  if (request.action === "increment-quota") {
    getDailyQuota().then(async (quota) => {
      const nextUsed = quota.used + 1;
      await chrome.storage.local.set({ dailyChecksUsed: nextUsed });
      sendResponse({ success: true, used: nextUsed, limit: quota.limit });
    });
    return true;
  }

  if (request.action === "open-web") {
    const encoded = encodeURIComponent((request.text || "").slice(0, 3000));
    const mode = request.mode || "standard";
    chrome.tabs.create({
      url: `${WEBSITE_URL}/?from=extension&utm_source=chrome_extension&utm_medium=floating_card&mode=${mode}&input=${encoded}`
    });
    sendResponse({ success: true });
    return true;
  }
});
