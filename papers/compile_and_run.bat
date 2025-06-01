@echo off
echo Compiling Java application...
javac PDFExtractor.java
if %errorlevel% neq 0 (
    echo Compilation failed!
    pause
    exit /b %errorlevel%
)

echo Running application...
java PDFExtractor
pause