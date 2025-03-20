const http = require('http');
const fs = require('fs');
const path = require('path');

// relative paths
const publicFolderPath = '../public'

const imagePublicSubfolderPath = '/image';
const imageFolderPath = publicFolderPath + imagePublicSubfolderPath;

//absolute path
const publicFolder = path.join(__dirname, publicFolderPath);


const restApiFilePath = path.join(publicFolder, "rest_metode.txt");



/*
server serves all html files in public folder, req path shouldn't include .html at the end
all images are stored in public/image folder which get serverd with full path provided
*/
const server = http.createServer((req, res) => {
    let filePath = path.join(publicFolder, req.url === '/' ? 'index.html' : req.url);

    const htmlRequested = !req.url.startsWith(imagePublicSubfolderPath)
    
    if (req.url === "/REST") {
        fs.readFile(restApiFilePath, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("File rest_metode.txt not found\n");
            } else {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end(data);
            }
        });
        return;
    }
    
    if (htmlRequested && !filePath.endsWith('.html')) {
        filePath += '.html';
    }

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            console.log("File not found in path: ", filePath)
            res.end('File not found\n');
        } else {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error\n');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                }
            });
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});
