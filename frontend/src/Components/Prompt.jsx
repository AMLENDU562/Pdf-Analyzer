import React, { useState } from "react";
import Logo from "../Images/logo.png";
import "../styles/prompt.css";

export default function Prompt() {
    function ChatAnswer(props) {
        return (
            <div className="chat-gpt-section">
                <div className="chat-userSection">
                    <div className="chat-userLogo">
                        <p>S</p>
                    </div>
                    <div className="textChat">
                        {props.user}
                    </div>
                </div>
                <div className="chat-AiSection">
                    <div className="chat-AiLogo">
                        <img src={Logo} alt="" />
                    </div>
                    <div className="textAi">
                        {props.aiText}
                    </div>
                </div>
            </div>
        );
    }

    const [pdfFile, setPDF] = useState(null);
    const [url, setUrl] = useState(null);
    const [pdfData, setPdfData] = useState("");
    const [curData, setCurData] = useState({ user: "", ai: "" });
    const [list, setList] = useState([]);

    const updateDatabaseData = async () => {
        if (!url || !pdfFile) {
            console.error("PDF file or URL missing");
            return;
        }
        console.log("list : ",list);
        const data = { name: pdfFile.name, prompt: list };
        console.log("prompt.jsx",data);
        try {
            const response = await fetch("http://localhost:5000/api/putDatabaseData", {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();

            console.log("Added:", result);
        } catch (error) {
            console.error("Error updating database:", error);
        }
    };

    const changeSearchData = (e) => {
        setCurData((prevData) => ({
            ai:"",
            user: e.target.value,
        }));

        console.log(curData.user);
    };

    const search = async (e) => {
        e.preventDefault();

        if (!url) {
            console.log("PDF not uploaded yet.");
            return;
        }

        try {
            const sendData = pdfData + curData.user;
            console.log("Sending data:", sendData);

            const data = { message: sendData };
            const response = await fetch("http://localhost:5000/api/getAnswers", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            console.log("AI Response:", result.data);

            const updatedCurData = { user:curData.user, ai: result.data };

            setList((prevList) => [...prevList, updatedCurData]);
            console.log("upaded pot ",list);
            setCurData({ user: "", ai: "" });
            updateDatabaseData();

        } catch (error) {
            console.error("Error in search:", error);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPDF(file);
            console.log("Selected file:", file.name);
        }
    };

    const addPDF = async (e) => {
        e.preventDefault();

        if (!pdfFile) {
            console.error("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append("image", pdfFile);

        try {
            const uploadResponse = await fetch("http://localhost:5000/api/postPdf", {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                },
            });

            if (!uploadResponse.ok) {
                throw new Error(`File upload failed: ${uploadResponse.status}`);
            }

            const uploadedData = await uploadResponse.json();
            console.log("File uploaded successfully:", uploadedData.url);

            if (!uploadedData.url) {
                throw new Error("File URL missing in response");
            }

            setUrl(uploadedData.url);
            alert("PDF UPLOADED");

            // Fetch PDF data
            const path = `./Images/${pdfFile.name}`;
            const data = { filePath: path };
            const response = await fetch("http://localhost:5000/api/getPdfInformation", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            console.log("PDF data received:", result.data);

            setPdfData(`This is pdf Data ${result.data}`);

            const dataDatabase = {
                pdfName: pdfFile.name,
                pdfData: result.data, // Use result.data instead of outdated pdfData
            };

            const responseDatabase = await fetch("http://localhost:5000/api/postDatabase", {
                method: "POST",
                body: JSON.stringify(dataDatabase),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const resultDatabase = await responseDatabase.json();
            console.log("Database response:", resultDatabase.data);

            if (resultDatabase.data && resultDatabase.data.prompt) {
                setList(resultDatabase.data.prompt);
            }
        } catch (error) {
            console.error("Database error:", error.message);
        }
    };

    return (
        <div className="prompt-container">
            {/* Navbar Section */}
            <nav className="navbar">
                <img src={Logo} alt="AI Planet Logo" className="navbar-logo" />
                <div className="navbar-actions">
                    <input
                        onChange={handleFileChange}
                        type="file"
                        accept="application/pdf"
                        className="file-input"
                    />
                    <button onClick={addPDF} className="upload-button">
                        <p className="uploadButton">📤</p>
                        <p className="uploadText">Upload PDF</p>
                    </button>
                </div>
            </nav>

            {/* Message Section */}
            <div className="message-section" style={{ overflowY: "scroll", height: "550px" }}>
                {list.map((item, index) => (
                    <ChatAnswer key={index} user={item.user} aiText={item.ai} />
                ))}
            </div>

            {/* Search Section */}
            <div className="search-section">
                <textarea
                    className="search-textarea"
                    placeholder="Message AI Planet"
                    value={curData.user}
                    onChange={changeSearchData}
                ></textarea>
                <button onClick={search} className="search-button">
                    🔎
                </button>
            </div>
        </div>
    );
}
