@echo off
echo Downloading Apache PDFBox library...
powershell -Command "Invoke-WebRequest -Uri 'https://archive.apache.org/dist/pdfbox/2.0.27/pdfbox-app-2.0.27.jar' -OutFile 'pdfbox-app-2.0.27.jar'"
echo Download complete!
pause