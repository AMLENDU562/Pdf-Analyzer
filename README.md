# PDF Analyzer And Prompt

# About  
Developed a full-stack application that allows users to upload PDF documents and ask questions regarding the content of these documents. 
The backend will process these documents and utilize natural language processing to provide answers to the questions posed by the users.

## Setup Instructions
1. Clone the repository:  
   ```sh
   git clone https://github.com/AMLENDU562/Pdf-Analyzer.git
   ```
2. Navigate to the project directory:  
   ```sh
   cd pdf-analyzer
   ```
3. Follow the frontend and backend setup procedures described above.
4. Ensure the `.env` file is properly configured with the necessary API keys.
5. Start both the frontend and backend servers.
6. Access the frontend at `http://localhost:3000` and the backend at `http://localhost:5000`.
   
## Frontend

### Dependencies
- **react-router-dom**: To route the components.

### Procedure to Run
1. Run `npm install` in the terminal to install all dependencies.
2. Run `npm start` to start the frontend on port **3000**.

---

## Backend

### Dependencies
- **express**: Backend framework for Node.js.
- **mongodb**: Database to store PDF-related data.
- **multer**: Middleware for handling file uploads.
- **dropbox**: To save PDF files in Dropbox.
- **gemini AI API**: To act as an AI prompt for extracting and answering PDF queries.

### Procedure to Run
1. Create a `.env` file.
2. Add API keys for Dropbox, MongoDB, and Gemini AI, along with:
   ```env
   PORT=5000
   ```
3. Run `npm install` in the terminal to install all dependencies.
4. Run `npm start` to start the backend on port **5000**.

---

## API Endpoints

### 1. Extract PDF Information
**Endpoint:** `/api/getPdfInformation`  
**Method:** `POST`  
**Description:** Extracts information from an uploaded PDF.

### 2. Get Answers from PDF
**Endpoint:** `/api/getAnswers`  
**Method:** `POST`  
**Description:** Extracts data from the PDF and processes queries to generate answers.

### 3. Upload PDF to Dropbox
**Endpoint:** `/api/postPdf`  
**Method:** `POST`  
**Description:** Sends and stores PDF data in Dropbox.

### 4. Store PDF Data in MongoDB
**Endpoint:** `/api/postDatabase`  
**Method:** `POST`  
**Description:** Stores extracted PDF data in MongoDB.
**Request Body:**
```json
{
  "pdfName": "string",
  "pdfExtractedData": "string",
  "query": { "user": "string", "ai": "string" }
}
```

### 5. Update PDF Query Data in Database
**Endpoint:** `/api/putDatabase/Data`  
**Method:** `PUT`  
**Description:** After each stores query results and updates PDF data. 


---
## Author
AMLENDU KUMAR

## License
This project is licensed under the MIT License.

