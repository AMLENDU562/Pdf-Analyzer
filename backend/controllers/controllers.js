const https = require("https");
const pdf = require("pdf-parse");
const fs = require("fs");
const pdfModel=require('../model/pdfModel')
const { GoogleGenerativeAI }=require("@google/generative-ai");
const {Upload}=require('../model/FileUpload')

require('dotenv').config();
const path = require("path");

const API_KEY=process.env.GEMINI_API_KEY
/* -------- Download PDF -------- */
const downloadPDF = (dropboxUrl, filename) => {
    const directLink = dropboxUrl.replace("?dl=0", "?raw=1"); // Convert to direct download link

    const savePath = `C:\\Users\\Amlendu Kumar\\Desktop\\PDF Analyzer\\frontend\\src\\Images\\${filename}`;
    const fileStream = fs.createWriteStream(savePath);

    https.get(directLink, (response) => {
        response.pipe(fileStream);
        fileStream.on('finish', () => {
            fileStream.close();
            console.log("✅ PDF Downloaded and saved to:", savePath);
        });
    }).on('error', (err) => {
        console.error("❌ Error downloading PDF:", err.message);
    });
};

/* -------- AI Chat Function -------- */


 
const gemini_api_key = API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};
 
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  geminiConfig,
});
 
const generate = async (message,res) => {
  try {
    const prompt = message;
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    console.log(response.text());
    res.json({ data: response.text() });

  } catch (error) {
    console.log("response error", error);
  }
};
 

/* -------- Get PDF Text Information -------- */
exports.downloadPdf = (req, res) => {
    const data = req.body.url;
    downloadPDF(data, "myDownloadedFile.pdf");
    res.send("File downloaded");
};

exports.getPdfInformation = async (req, res) => {
    try {
        console.log("getPdfInformation");
        const filePath = req.body.filePath;

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "File not found" });
        }

        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        console.log(data.text);
        res.json({ data: data.text });
    } catch (error) {
        console.error("Error reading PDF:", error);
        res.status(500).json({ error: "Failed to process PDF" });
    }
};

/* -------- Get AI Answers -------- */
exports.getAnswers = async (req, res) => {
    try {
        const {message} = req.body;
        console.log(message);
        if (!message) return res.status(400).json({ error: "Message is required" });

        await generate(message,res);
    } catch (error) {
        console.error("Error getting AI response:", error);
        res.status(500).json({ error: "Failed to get AI response" });
    }
};

/* -------- Save PDF Information in Database -------- */
exports.postDatabase = async (req, res) => {
    try {
        console.log("Reached /postDatabase");
        
        const data = req.body;
        console.log("Received data:", data); // Log the incoming data
    
        if (!data || !data.pdfName) {
            return res.status(400).json({ error: "Invalid data: pdfName is required" });
        }
    
        const exist = await pdfModel.findOne({ pdfName: data.pdfName });
    
        if (exist) {
            return res.json({ success: true, data: exist });
        }
    
        const savedPdf = await pdfModel.create(data);
        res.json({ success: true, data: savedPdf });
    
    } catch (error) {
        console.error("Error saving to database:", error);
        res.status(500).json({ error: "Error saving PDF data" });
    }
    
};

/* -------- Upload PDF File -------- */
exports.postPdf = async (req, res) => {
    try {
        console.log("Reached /postPdf");
        if (!req.files || !req.files.image) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const uploadedFile = req.files.image;
        const uploadPath = `Images/${uploadedFile.name}`;

        uploadedFile.mv(uploadPath, async (err) => {
            if (err) {
                console.error("File upload error:", err);
                return res.status(500).json({ error: "File upload failed" });
            }

            await Upload(uploadPath, req, res);
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Error uploading file" });
    }
};

/* -------- Delete PDF -------- */
exports.deletePdf = async (req, res) => {
    try {
        const { filePath } = req.body;
        if (!filePath) return res.status(400).json({ error: "File path required" });

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "File not found" });
        }

        fs.unlinkSync(filePath);
        res.json({ success: true, message: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ error: "Error deleting file" });
    }
};

/* -------Update PDF Data -------*/

exports.updatePromptData = async (req, res) => {
    try {
        const { name, prompt } = req.body;
        console.log("reach update prompt ",prompt);
        if (!name || !prompt) {
            return res.status(400).json({ error: "Missing name or prompt in request body" });
        }

        const updatedData = await pdfModel.findOneAndUpdate(
            { pdfName: name },  // Find by pdfName
            { $set: { prompt: prompt } },  // Update prompt field
            { new: true, runValidators: true } // Return updated document, enforce validation
        );

        if (!updatedData) {
            return res.status(404).json({ error: "PDF not found" });
        }

        res.json({ success: true, data: updatedData });

    } catch (error) {
        console.error("Error updating prompt:", error);
        res.status(500).json({ error: "Error updating prompt" });
    }
};
