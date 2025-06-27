@echo off
echo Updating all premium pages to use auth-check-bypass.js

set PAGES=dashboard.html mock-interviews.html peer-comparison.html practice-papers.html question-bank.html settings.html study-plan.html ai-coach.html analytics.html

for %%f in (%PAGES%) do (
  echo Processing %%f
  powershell -Command "$content = Get-Content 'dashboards\premium\%%f' -Raw; if ($content -match '<script src=\"../../js/auth-check.js\"></script>') { $content = $content -replace '<script src=\"../../js/auth-check.js\"></script>', '<script src=\"../../js/auth-check-bypass.js\"></script>'; } else { $content = $content -replace '(<script>(\r?\n|\r)\s*document\.addEventListener)', '<script src=\"../../js/auth-check-bypass.js\"></script>$1'; } Set-Content 'dashboards\premium\%%f' -Value $content"
)

echo Update complete