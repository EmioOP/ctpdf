export const detectLanguage = (fileName) => {
  const ext = fileName.split(".").pop().toLowerCase();
  const map = {
    c: "c",
    h: "c", 
    cpp: "cpp",
    cc: "cpp",
    py: "python",
    js: "javascript",
    ts: "typescript",
    java: "java",
    go: "go",
    rs: "rust",
    rb: "ruby",
    php: "php",
    cs: "csharp",
    swift: "swift",
    kt: "kotlin",
    sh: "bash",
  };
  return map[ext] || null;
};
