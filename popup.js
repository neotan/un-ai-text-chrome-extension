// popup.js

document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("test-input");
  const charCount = document.getElementById("char-count");
  const btnAnalyze = document.getElementById("btn-analyze");
  const resultsCard = document.getElementById("results-card");
  const resScore = document.getElementById("res-score");
  const resLabel = document.getElementById("res-label");
  const resClichesCount = document.getElementById("res-cliches-count");
  const resAcademicBadge = document.getElementById("res-academic-badge");
  const clichePreview = document.getElementById("cliche-preview");
  const btnClean = document.getElementById("btn-clean");
  const btnDeepRewrite = document.getElementById("btn-deep-rewrite");
  const toggleBubble = document.getElementById("toggle-bubble");
  const quotaVal = document.getElementById("quota-val");
  const ratePrompt = document.getElementById("rate-prompt");
  const btnRateDismiss = document.getElementById("btn-rate-dismiss");
  const btnRateCws = document.getElementById("btn-rate-cws");

  // Load Quota & Review Prompt
  if (chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({ action: "get-quota" }, (res) => {
      if (res) {
        quotaVal.textContent = `${res.used} / ${res.limit} Used`;
        
        // Show 5-star review prompt after 3 scans if not dismissed
        if (chrome.storage && chrome.storage.local && res.used >= 3) {
          chrome.storage.local.get(["rate_dismissed"], (st) => {
            if (!st.rate_dismissed && ratePrompt) {
              ratePrompt.classList.remove("hidden");
            }
          });
        }
      }
    });
  }

  if (btnRateDismiss) {
    btnRateDismiss.addEventListener("click", () => {
      if (ratePrompt) ratePrompt.classList.add("hidden");
      if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ rate_dismissed: true });
      }
    });
  }

  if (btnRateCws) {
    btnRateCws.addEventListener("click", () => {
      if (ratePrompt) ratePrompt.classList.add("hidden");
      if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ rate_dismissed: true });
      }
    });
  }

  // Load Settings
  if (chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(["bubbleEnabled"], (res) => {
      if (res.bubbleEnabled !== undefined) {
        toggleBubble.checked = res.bubbleEnabled;
      }
    });

    toggleBubble.addEventListener("change", () => {
      chrome.storage.sync.set({ bubbleEnabled: toggleBubble.checked });
    });
  }

  textarea.addEventListener("input", () => {
    charCount.textContent = `${textarea.value.length} chars`;
  });

  btnAnalyze.addEventListener("click", () => {
    const text = textarea.value.trim();
    if (!text) return;

    // Run local prepass analyzer
    const analysis = window.UN_AI_PREPASS
      ? window.UN_AI_PREPASS.analyzeText(text)
      : { score: 50, level: "Moderate", matches: [] };

    const academic = window.UN_AI_ACADEMIC
      ? window.UN_AI_ACADEMIC.getAcademicStatus(text)
      : { isAcademic: false };

    // Update UI
    resultsCard.classList.remove("hidden");
    resScore.textContent = `${analysis.score}%`;
    resLabel.textContent = analysis.level;

    const scoreColor =
      analysis.score >= 70 ? "#ef4444" : analysis.score >= 40 ? "#f59e0b" : "#10b981";
    resScore.style.color = scoreColor;
    resLabel.style.color = scoreColor;

    resClichesCount.textContent = `${analysis.matches.length} Clichés`;

    if (academic.isAcademic) {
      resAcademicBadge.classList.remove("hidden");
    } else {
      resAcademicBadge.classList.add("hidden");
    }

    if (analysis.matches.length > 0) {
      clichePreview.classList.remove("hidden");
      clichePreview.innerHTML = analysis.matches
        .slice(0, 6)
        .map((m) => `<span class="cliche-tag">${m.phrase}</span>`)
        .join("");
    } else {
      clichePreview.classList.add("hidden");
    }

    // Record scan quota
    if (chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ action: "increment-quota" }, (res) => {
        if (res) quotaVal.textContent = `${res.used} / ${res.limit} Used`;
      });
    }
  });

  btnClean.addEventListener("click", () => {
    const text = textarea.value.trim();
    if (!text) return;
    const cleaned = window.UN_AI_PREPASS ? window.UN_AI_PREPASS.cleanText(text) : text;
    textarea.value = cleaned;
    charCount.textContent = `${cleaned.length} chars`;
    btnAnalyze.click();
  });

  btnDeepRewrite.addEventListener("click", () => {
    const text = textarea.value.trim();
    const academic = window.UN_AI_ACADEMIC
      ? window.UN_AI_ACADEMIC.getAcademicStatus(text)
      : { isAcademic: false };

    chrome.runtime.sendMessage({
      action: "open-web",
      text,
      mode: academic.isAcademic ? "academic" : "standard"
    });
  });
});
