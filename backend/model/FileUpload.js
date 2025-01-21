const fs = require('fs');
const https = require('https');
const { Dropbox } = require('dropbox');
require('dotenv').config()
const TOKEN = process.env.DROPBOX_TOKEN;

if (!TOKEN) {
    console.error("❌ Dropbox Access Token is missing!");
    process.exit(1);
}

const dbx = new Dropbox({ accessToken: TOKEN, fetch: require('node-fetch') });

exports.Upload = (filePath, req, res) => {
    console.log("Uploading File:", filePath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error("❌ File Read Error:", err);
            return res.status(500).json({ error: "Error reading file" });
        }

        const fileName = filePath.split('/').pop(); // Extract file name from path
        const dropboxPath = `/Upload/${fileName}`;

        const options = {
            hostname: 'content.dropboxapi.com',
            path: '/2/files/upload',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Dropbox-API-Arg': JSON.stringify({
                    path: dropboxPath,
                    mode: 'overwrite',
                    autorename: true,
                    mute: false,
                    strict_conflict: false
                }),
                'Content-Type': 'application/octet-stream'
            }
        };

        const dropboxReq = https.request(options, (dropboxRes) => {
            let responseBody = '';

            dropboxRes.on('data', (chunk) => {
                responseBody += chunk;
            });

            dropboxRes.on('end', () => {
                console.log("📂 File uploaded to Dropbox successfully:", responseBody);

                // Check if a shared link already exists
                dbx.sharingListSharedLinks({ path: dropboxPath })
                    .then(async listResponse => {
                        const existingLink = listResponse.result.links.find(link => link.path_lower === dropboxPath.toLowerCase());

                        if (existingLink) {
                            console.log("🔗 Shared link already exists:", existingLink.url);
                            return res.json({ url: existingLink.url });
                        }

                        // Create a new shared link

                        try{
                        const result=await dbx.sharingCreateSharedLinkWithSettings({ path: dropboxPath })
                            
                            
                                console.log("✅ New shared link created:", result.result.url);
                                res.json({ url: result.result.url });
                            }
                            
                            catch(error) {
                                console.error("❌ Error creating shared link:", error);
                                res.status(500).json({ error: "Failed to create shared link" });
                            }


                    })
                    .catch(error => {
                        console.error("❌ Error checking shared links:", error);
                        res.status(500).json({ error: "Failed to check existing links" });
                    });
            });
        });

        dropboxReq.on('error', (error) => {
            console.error("❌ Dropbox Upload Request Error:", error);
            res.status(500).json({ error: "File upload failed" });
        });

        dropboxReq.write(data);
        dropboxReq.end();
    });
};
