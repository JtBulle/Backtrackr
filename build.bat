@echo off

REM Build the Svelte components
call npm run build

REM Copy the HTML file to the correct location
copy "dist\src\popup\popup.html" "dist\popup.html"

REM Fix the asset paths to be relative
powershell -Command "(Get-Content 'dist\popup.html') -replace 'src=\"/popup.js\"', 'src=\"popup.js\"' | Set-Content 'dist\popup.html'"
powershell -Command "(Get-Content 'dist\popup.html') -replace 'href=\"/popup.css\"', 'href=\"popup.css\"' | Set-Content 'dist\popup.html'"

REM Copy background and content scripts
copy "src\background.js" "dist\background.js"
copy "src\content-script.js" "dist\content-script.js"

REM Copy manifest and icons
copy "manifest.json" "dist\manifest.json"
xcopy "icons" "dist\icons" /E /I

REM Clean up the nested directory
rmdir /S /Q "dist\src"

echo Build complete!