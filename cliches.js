// cliches.js - Faithful port from un-ai-text.com engine
(function (root) {
  const CLICHES = [
    { pattern: /\bdelve into\b/gi, phrase: "delve into", options: ["look at", "dig into", "examine"] },
    { pattern: /\bit is important to note that\b/gi, phrase: "it is important to note that", options: ["note that", "keep in mind that", "remember that"] },
    { pattern: /\bit is worth noting that\b/gi, phrase: "it is worth noting that", options: ["note that", "one thing stands out:", "worth saying:"] },
    { pattern: /\bin today's fast-paced world\b/gi, phrase: "in today's fast-paced world", options: ["today", "right now", "these days"] },
    { pattern: /\bin the ever-evolving landscape of\b/gi, phrase: "in the ever-evolving landscape of", options: ["in", "across", "within"] },
    { pattern: /\btapestry\b/gi, phrase: "tapestry", options: ["mix", "range", "blend"] },
    { pattern: /\ba testament to\b/gi, phrase: "a testament to", options: ["a sign of", "proof of", "evidence of"] },
    { pattern: /\bnavigate the complexities of\b/gi, phrase: "navigate the complexities of", options: ["work through", "handle", "make sense of"] },
    { pattern: /\bshed light on\b/gi, phrase: "shed light on", options: ["explain", "clarify", "bring out"] },
    { pattern: /\bplay a pivotal role in\b/gi, phrase: "play a pivotal role in", options: ["matter to", "shape", "drive"] },
    { pattern: /\bplay a crucial role in\b/gi, phrase: "play a crucial role in", options: ["matter to", "shape", "drive"] },
    { pattern: /\ba myriad of\b/gi, phrase: "a myriad of", options: ["many", "plenty of", "all sorts of"] },
    { pattern: /\ba plethora of\b/gi, phrase: "a plethora of", options: ["lots of", "many", "no shortage of"] },
    { pattern: /\bin conclusion\b/gi, phrase: "in conclusion", options: ["so", "to wrap up", "in short"] },
    { pattern: /\bfurthermore\b/gi, phrase: "furthermore", options: ["also", "what's more", "on top of that"] },
    { pattern: /\bmoreover\b/gi, phrase: "moreover", options: ["also", "what's more", "besides"] },
    { pattern: /\badditionally\b/gi, phrase: "additionally", options: ["also", "besides", "plus"] },
    { pattern: /\bembark on a journey\b/gi, phrase: "embark on a journey", options: ["start out", "set off", "begin"] },
    { pattern: /\bunlock the potential of\b/gi, phrase: "unlock the potential of", options: ["get more from", "make the most of", "open up"] },
    { pattern: /\bharness the power of\b/gi, phrase: "harness the power of", options: ["use", "tap into", "take advantage of"] },
    { pattern: /\brevolutionize\b/gi, phrase: "revolutionize", options: ["change", "reshape", "overhaul"] },
    { pattern: /\bgame-changer\b/gi, phrase: "game-changer", options: ["big shift", "turning point", "real change"] },
    { pattern: /\bcutting-edge\b/gi, phrase: "cutting-edge", options: ["new", "modern", "advanced"] },
    { pattern: /\bstate-of-the-art\b/gi, phrase: "state-of-the-art", options: ["modern", "current", "up-to-date"] },
    { pattern: /\bseamlessly\b/gi, phrase: "seamlessly", options: ["smoothly", "easily", "cleanly"] },
    { pattern: /\bseamless\b/gi, phrase: "seamless", options: ["smooth", "easy", "clean"] },
    { pattern: /\brobust\b/gi, phrase: "robust", options: ["strong", "solid", "dependable"] },
    { pattern: /\bleverage\b/gi, phrase: "leverage", options: ["use", "draw on", "build on"] },
    { pattern: /\butilize\b/gi, phrase: "utilize", options: ["use", "apply", "work with"] },
    { pattern: /\bfacilitate\b/gi, phrase: "facilitate", options: ["help", "ease", "support"] },
    { pattern: /\bin order to\b/gi, phrase: "in order to", options: ["to", "so as to", "to help"] },
    { pattern: /\bdue to the fact that\b/gi, phrase: "due to the fact that", options: ["because", "since", "as"] },
    { pattern: /\ba wide range of\b/gi, phrase: "a wide range of", options: ["many", "all kinds of", "plenty of"] },
    { pattern: /\bdelving deeper\b/gi, phrase: "delving deeper", options: ["looking closer", "digging further", "going further"] },
    { pattern: /\bat the end of the day\b/gi, phrase: "at the end of the day", options: ["in the end", "finally", "when it counts"] },
    { pattern: /\bthe fact of the matter is\b/gi, phrase: "the fact of the matter is", options: ["the truth is", "in fact", "really"] },
    { pattern: /\bneedless to say\b/gi, phrase: "needless to say", options: ["obviously", "clearly", "of course"] },
    { pattern: /\bfirst and foremost\b/gi, phrase: "first and foremost", options: ["first", "above all", "to start"] },
    { pattern: /\blast but not least\b/gi, phrase: "last but not least", options: ["finally", "lastly", "one more thing"] },
    { pattern: /\bparadigm shift\b/gi, phrase: "paradigm shift", options: ["big change", "new approach", "rethink"] },
    { pattern: /\bholistic approach\b/gi, phrase: "holistic approach", options: ["whole-picture approach", "broad approach", "joined-up approach"] },
    { pattern: /\bsynergy\b/gi, phrase: "synergy", options: ["teamwork", "fit", "overlap"] },
    { pattern: /\bmultifaceted\b/gi, phrase: "multifaceted", options: ["many-sided", "layered", "complicated"] },
    { pattern: /\bintricate\b/gi, phrase: "intricate", options: ["detailed", "fiddly", "fine-grained"] },
    { pattern: /\bprofound\b/gi, phrase: "profound", options: ["deep", "serious", "far-reaching"] },
    { pattern: /\bunderscores the importance of\b/gi, phrase: "underscores the importance of", options: ["shows the value of", "brings out", "points to the value of"] },
    { pattern: /\bserves as a\b/gi, phrase: "serves as a", options: ["is a", "works as a", "acts as a"] },
    { pattern: /\bwhen it comes to\b/gi, phrase: "when it comes to", options: ["with", "for", "on"] },
    { pattern: /\bin the realm of\b/gi, phrase: "in the realm of", options: ["in", "within", "across"] },
    { pattern: /\bfoster\b/gi, phrase: "foster", options: ["build", "encourage", "grow"] },
    { pattern: /\bcomprehensive understanding\b/gi, phrase: "comprehensive understanding", options: ["full picture", "clear grasp", "rounded view"] }
  ];

  const CONTRACTIONS = [
    { pattern: /\bit is\b/gi, replacement: "it's" },
    { pattern: /\bthat is\b/gi, replacement: "that's" },
    { pattern: /\bthere is\b/gi, replacement: "there's" },
    { pattern: /\bhere is\b/gi, replacement: "here's" },
    { pattern: /\bwhat is\b/gi, replacement: "what's" },
    { pattern: /\bwho is\b/gi, replacement: "who's" },
    { pattern: /\bhe is\b/gi, replacement: "he's" },
    { pattern: /\bshe is\b/gi, replacement: "she's" },
    { pattern: /\bthey are\b/gi, replacement: "they're" },
    { pattern: /\bwe are\b/gi, replacement: "we're" },
    { pattern: /\byou are\b/gi, replacement: "you're" },
    { pattern: /\bI am\b/gi, replacement: "I'm" },
    { pattern: /\bdo not\b/gi, replacement: "don't" },
    { pattern: /\bdoes not\b/gi, replacement: "doesn't" },
    { pattern: /\bdid not\b/gi, replacement: "didn't" },
    { pattern: /\bis not\b/gi, replacement: "isn't" },
    { pattern: /\bare not\b/gi, replacement: "aren't" },
    { pattern: /\bwas not\b/gi, replacement: "wasn't" },
    { pattern: /\bwere not\b/gi, replacement: "weren't" },
    { pattern: /\bcannot\b/gi, replacement: "can't" },
    { pattern: /\bwill not\b/gi, replacement: "won't" },
    { pattern: /\bwould not\b/gi, replacement: "wouldn't" }
  ];

  const api = { CLICHES, CONTRACTIONS };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.UN_AI_DATA = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
