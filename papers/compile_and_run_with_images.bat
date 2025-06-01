@echo off
echo Checking for PDFBox library...
if not exist pdfbox-app-2.0.27.jar (
    echo PDFBox library not found. Downloading...
    call download_pdfbox.bat
)

echo Compiling Java application...
javac -cp ".;pdfbox-app-2.0.27.jar" PDFExtractorWithImages.java
if %errorlevel% neq 0 (
    echo Compilation failed!
    pause
    exit /b %errorlevel%
)

echo Running application...
java -cp ".;pdfbox-app-2.0.27.jar" PDFExtractorWithImages
pause