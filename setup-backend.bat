@echo off
echo Setting up AI Coach Backend...
echo.

REM Create backend folder
mkdir ..\..\..\ai-coach-backend
cd ..\..\..\ai-coach-backend

REM Create package.json
echo {> package.json
echo   "name": "ai-coach-backend",>> package.json
echo   "version": "1.0.0",>> package.json
echo   "type": "module",>> package.json
echo   "scripts": {>> package.json
echo     "start": "node server.js">> package.json
echo   },>> package.json
echo   "dependencies": {>> package.json
echo     "express": "^4.18.2",>> package.json
echo     "openai": "^4.20.1",>> package.json
echo     "cors": "^2.8.5",>> package.json
echo     "dotenv": "^16.0.3">> package.json
echo   }>> package.json
echo }>> package.json

REM Create server.js
echo import express from 'express';> server.js
echo import OpenAI from 'openai';>> server.js
echo import cors from 'cors';>> server.js
echo import dotenv from 'dotenv';>> server.js
echo.>> server.js
echo dotenv.config();>> server.js
echo.>> server.js
echo const app = express();>> server.js
echo.>> server.js
echo app.use(cors());>> server.js
echo app.use(express.json());>> server.js
echo.>> server.js
echo const openai = new OpenAI({>> server.js
echo   apiKey: process.env.OPENAI_API_KEY>> server.js
echo });>> server.js
echo.>> server.js
echo app.post('/api/chat', async (req, res) =^> {>> server.js
echo   try {>> server.js
echo     const completion = await openai.chat.completions.create({>> server.js
echo       model: "gpt-4o-mini",>> server.js
echo       messages: [>> server.js
echo         { role: "system", content: "You are a helpful AI study coach for students learning Physics, Chemistry, and Mathematics." },>> server.js
echo         { role: "user", content: req.body.message }>> server.js
echo       ]>> server.js
echo     });>> server.js
echo     res.json({ reply: completion.choices[0].message.content });>> server.js
echo   } catch (error) {>> server.js
echo     res.status(500).json({ error: 'Something went wrong' });>> server.js
echo   }>> server.js
echo });>> server.js
echo.>> server.js
echo app.listen(3000, () =^> {>> server.js
echo   console.log('Server running on http://localhost:3000');>> server.js
echo });>> server.js

REM Create .env file
echo OPENAI_API_KEY=PUT_YOUR_API_KEY_HERE> .env

echo.
echo ✅ Backend setup complete!
echo.
echo Next steps:
echo 1. Edit .env file and replace PUT_YOUR_API_KEY_HERE with your actual OpenAI API key
echo 2. Run: npm install
echo 3. Run: npm start
echo.
pause