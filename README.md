# JEE Advanced Image Uploader

This tool allows you to upload images and save them directly to specific folders on your computer.

## Setup Instructions

1. **Install Node.js**
   - Download and install Node.js from [nodejs.org](https://nodejs.org/)

2. **Install Dependencies**
   - Open a command prompt in the project folder
   - Run: `npm install`

3. **Start the Server**
   - Run: `npm start`
   - The server will start on http://localhost:3000

4. **Use the Upload Tool**
   - Open `screenshot-saver-simple.html` in your web browser
   - Select the exam year and paper number
   - Upload an image file
   - Click "Upload Image" to save it to the specified folder

## Features

- Upload images directly to specific folders
- Preview images before uploading
- Save images with sequential naming
- Track uploaded files

## Folder Structure

Images are saved to:
```
C:\Users\HP\myproject\jeeapp\src\webapp\Prepsharp\papers\[YEAR] paper [NUMBER]\
```

For example:
```
C:\Users\HP\myproject\jeeapp\src\webapp\Prepsharp\papers\2024 paper 1\
```

## Troubleshooting

- If images aren't saving, make sure the server is running
- Check the console for any error messages
- Ensure the papers directory exists and is writable