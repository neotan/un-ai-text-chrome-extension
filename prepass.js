// prepass.js - Local Cleaning & Analysis Engine
(function (root) {
  function matchCase(source, replacement) {
    const first = source.charAt(0);
    if (first !== "" && first === first.toUpperCase() && first !== first.toLowerCase()) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }
    return replacement;
  }

  function getEngineData() {
    return (
      (typeof root.UN_AI_DATA !== "undefined" && root.UN_AI_DATA) ||
      (typeof require !== "undefined" && require("./cliches.js")) || {
        CLICHES: [],
        CONTRACTIONS: []
      }
    );
  }

  /**
   * Scan text for AI clichés, returning match list with positions.
   */
  function scanCliches(text) {
    if (!text || typeof text !== "string") return [];
    const { CLICHES } = getEngineData();
    const results = [];

    CLICHES.forEach((cliche, index) => {
      // Create new RegExp to avoid stateful lastIndex bugs
      const regex = new RegExp(cliche.pattern.source, "gi");
      let match;
      while ((match = regex.exec(text)) !== null) {
        results.push({
          phrase: match[0],
          clicheIndex: index,
          options: cliche.options,
          suggested: cliche.options[0],
          start: match.index,
          end: match.index + match[0].length
        });
      }
    });

    // Sort by position in text
    return results.sort((a, b) => a.start - b.start);
  }

  /**
   * One-click local cleaner: replaces cliches with first natural synonym
   * and optionally applies contractions for human warmth.
   */
  function cleanText(text, options = { contractions: true }) {
    if (!text || typeof text !== "string") return "";
    const { CLICHES, CONTRACTIONS } = getEngineData();
    let out = text;

    CLICHES.forEach((cliche) => {
      const regex = new RegExp(cliche.pattern.source, "gi");
      out = out.replace(regex, (match) => {
        const option = cliche.options[0] || match;
        return matchCase(match, option);
      });
    });

    if (options.contractions) {
      CONTRACTIONS.forEach((contraction) => {
        const regex = new RegExp(contraction.pattern.source, "gi");
        out = out.replace(regex, (match) => matchCase(match, contraction.replacement));
      });
    }

    return out;
  }

  /**
   * Fast 300ms heuristic AI indicator (0 - 100%)
   * Calculates density of buzzwords + sentence burstiness heuristic.
   */
  function analyzeText(text) {
    if (!text || text.trim().length === 0) {
      return { score: 0, wordCount: 0, matches: [], level: "Low" };
    }

    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const matches = scanCliches(text);

    if (wordCount < 10) {
      return {
        score: matches.length > 0 ? 60 : 15,
        wordCount,
        matches,
        level: matches.length > 0 ? "Moderate" : "Low"
      };
    }

    // Density: cliches per 100 words
    const density = (matches.length / wordCount) * 100;

    // AI texts usually feature high cliche density (e.g. 2+ per 100 words)
    // Low variance in sentence length (burstiness)
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const lengths = sentences.map((s) => s.trim().split(/\s+/).length);
    const avgLen = lengths.reduce((a, b) => a + b, 0) / (lengths.length || 1);
    const variance =
      lengths.reduce((acc, len) => acc + Math.pow(len - avgLen, 2), 0) / (lengths.length || 1);

    let rawScore = Math.min(density * 22, 65);

    // Uniform sentence length adds suspected AI weight
    if (variance < 15 && sentences.length >= 3) {
      rawScore += 20;
    }

    // Baseline presence
    if (matches.length > 0) rawScore += 15;

    const finalScore = Math.min(Math.max(Math.round(rawScore), 5), 98);

    let level = "Low";
    if (finalScore >= 70) level = "High AI Risk";
    else if (finalScore >= 35) level = "Moderate";
    else level = "Human-Like";

    return {
      score: finalScore,
      wordCount,
      matches,
      level,
      sentenceCount: sentences.length
    };
  }

  const api = {
    scanCliches,
    cleanText,
    analyzeText
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.UN_AI_PREPASS = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
