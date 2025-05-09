// This script is intended to be run after cloning the repository from Replit to GitHub
// It prepares the project for GitHub Pages deployment

const fs = require('fs');
const path = require('path');

// Create an index.html file at the root for GitHub Pages
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ETHIC - Educational Technology Hub for Indonesian Community</title>
  <meta http-equiv="refresh" content="0;url=./client/dist/index.html">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      text-align: center;
    }
    .loader {
      border: 5px solid #f3f3f3;
      border-top: 5px solid #3498db;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 20px auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div>
    <h1>ETHIC</h1>
    <p>Educational Technology Hub for Indonesian Community</p>
    <div class="loader"></div>
    <p>Redirecting to application...</p>
    <p>If you are not redirected automatically, <a href="./client/dist/index.html">click here</a>.</p>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtml);

console.log('Created index.html for GitHub Pages redirection');