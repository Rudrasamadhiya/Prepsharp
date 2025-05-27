@echo off
echo Starting local server for PrepSharp admin dashboard...
echo.
echo Please wait while the server starts...
echo.
start "" http://localhost:3000/admin-dashboard.html
node server.js