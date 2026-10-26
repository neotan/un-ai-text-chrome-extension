// academic-guard.js - Formula & Table Shield Inspector
(function (root) {
  function detectFormulas(text) {
    if (!text) return { hasFormulas: false, formulaCount: 0 };
    const inlineMath = text.match(/\$(?:\\\$|[^\$\n])+\$/g) || [];
    const displayMath = text.match(/\$\$(?:\\\$|[^\$])+\$\$/g) || [];
    const bracketMath = text.match(/\\\[[\s\S]*?\\\]/g) || [];
    const envMath = text.match(/\\begin\{(?:equation|align|gather|matrix|pmatrix)\*?\}[\s\S]*?\\end\{(?:equation|align|gather|matrix|pmatrix)\*?\}/g) || [];

    const total = inlineMath.length + displayMath.length + bracketMath.length + envMath.length;
    return {
      hasFormulas: total > 0,
      formulaCount: total,
      details: {
        inline: inlineMath.length,
        display: displayMath.length,
        environments: envMath.length
      }
    };
  }

  function detectTables(text) {
    if (!text) return { hasTables: false, tableCount: 0 };
    // Detect pipe tables (at least 2 rows with |)
    const lines = text.split("\n");
    let tableLines = 0;
    let inTable = false;
    let tablesFound = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        tableLines++;
        if (!inTable && tableLines >= 2) {
          inTable = true;
          tablesFound++;
        }
      } else {
        tableLines = 0;
        inTable = false;
      }
    }

    return {
      hasTables: tablesFound > 0,
      tableCount: tablesFound
    };
  }

  function getAcademicStatus(text) {
    const formulas = detectFormulas(text);
    const tables = detectTables(text);
    return {
      isAcademic: formulas.hasFormulas || tables.hasTables,
      formulas,
      tables
    };
  }

  const api = {
    detectFormulas,
    detectTables,
    getAcademicStatus
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.UN_AI_ACADEMIC = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
