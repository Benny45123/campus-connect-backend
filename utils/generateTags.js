// const natural = require('natural');
// const rake = require('node-rake');
// const nlp=require('compromise');
// const generateAutoTags = (content,limit=5)=>{
//     if (!Array.isArray(content)) return [];
//     const text = content.filter(b=>['heading','paragraph'].includes(b.type)).map(b=>b.data.text).join(' ');
//     if(!text.trim()) return [];
//     const results = new Set();
//     const tfidf = new natural.TfIdf();
//     tfidf.addDocument(text);
//     // Get top terms from TF-IDF KeyWords
//     tfidf.listTerms(0).slice(0,limit*2).forEach(item =>{if(item.term.length>3) results.add(item.term)});
//     //Get top phrases from RAKE
//     const rakeResult = rake.generate(text);

//   if (Array.isArray(rakeResult)) {
//     rakeResult.slice(0, limit).forEach(keyword => {
//       if (
//         typeof keyword === "string" &&
//         keyword.trim().length > 3 &&
//         keyword.split(" ").length <= 3
//       ) {
//         results.add(keyword.toLowerCase());
//       }
//     });
//   }
      
//     //Get nouns from compromise NLP
//     nlp(text).nouns().out('array').slice(0,limit).forEach(noun => results.add(noun.toLowerCase()));
//     content.filter(b => b.type==='heading').forEach(b=>{b.data.text.toLowerCase().split(' ').filter(word=>word.length>3).forEach(word=>results.add(word))});
//     return [...results].map(tag=>tag.toLowerCase().replace(/\s+/g,'-')).slice(0,limit);
// }
// module.exports={generateTags:generateAutoTags};
const natural = require("natural");
const rake = require("node-rake");
const nlp = require("compromise");

const sanitizeText = (text) =>
  text
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[—–]/g, "-");

const generateAutoTags = (content, limit = 5) => {
  if (!Array.isArray(content)) return [];

  const text = sanitizeText(
    content
      .filter(b => ["heading", "paragraph"].includes(b.type))
      .map(b => b.data?.text || "")
      .join(" ")
      .trim()
  );

  // 🔥 HARD STOP — prevents RAKE crashes
  if (text.length < 120) return [];

  const results = new Set();

  /* ---------- TF-IDF (SAFE) ---------- */
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(text);
  tfidf.listTerms(0)
    .slice(0, limit * 2)
    .forEach(item => {
      if (item.term.length > 3) results.add(item.term.toLowerCase());
    });

  /* ---------- RAKE (UNSTABLE → SANDBOX) ---------- */
  try {
    const rakeResult = rake.generate(text);
    if (Array.isArray(rakeResult)) {
      rakeResult.slice(0, limit).forEach(k => {
        if (typeof k === "string" && k.split(" ").length <= 3) {
          results.add(k.toLowerCase());
        }
      });
    }
  } catch (err) {
    console.warn("RAKE skipped:", err.message);
  }

  /* ---------- NLP nouns (SAFE) ---------- */
  nlp(text).nouns().out("array")
    .slice(0, limit)
    .forEach(noun => results.add(noun.toLowerCase()));

  return [...results]
    .map(t => t.replace(/\s+/g, "-"))
    .slice(0, limit);
};

module.exports = { generateTags: generateAutoTags };
