import express from "express";
import { generateCodePDF } from "./utils/pdfGenerator.js";
import cors from "cors";
import { detectLanguage } from "./utils/detectLangauge.js";
import multer from "multer";
import { streamPdf } from "./utils/streamPdf.js";
import {rateLimit} from "express-rate-limit"

const app = express();
const PORT = process.env.PORT || 4000;


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders:true,
  legacyHeaders:false
});
app.use(limiter);

app.use(express.json());
app.use(cors({
  origin:true,
  credentials:true
}));

const upload = multer({ storage: multer.memoryStorage() });

app.get("/",(_req,res)=>{
  res.send("Code to PDF API is running");
})

app.post("/generate/paste", async (req, res) => {
  const { code, language, theme, fileName } = req.body;
  console.log("Received PDF generation request for pasted code")

  try {
    const pdfBuffer = await generateCodePDF({
      code,
      language,
      theme,
      fileName,
    });
    streamPdf(res, pdfBuffer, fileName);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

app.post("/generate/upload", upload.single('file'), async (req, res) => {
  const file = req.file;
  const { theme } = req.body;

  if (!file) {
    return res.status(400).json({ error: "No file upload" });
  }

  const language = detectLanguage(file.originalname);
  if (!language) {
    return res.status(400).json({ error: "Unsupported file type" });
  }

  const code = file.buffer.toString("utf-8");
  const fileName = file.originalname;

  try {
    const pdfBuffer = await generateCodePDF({
      code,
      language,
      theme,
      fileName,
    });
    streamPdf(res, pdfBuffer, fileName);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
