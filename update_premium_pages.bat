@echo off
echo Updating premium pages to use auth-check-bypass.js

for %%f in (
  analytics.html
  mock-interviews.html
  peer-comparison.html
  practice-papers.html
  question-bank.html
  settings.html
  study-plan.html
) do (
  echo Processing %%f
  powershell -Command "(Get-Content 'dashboards\premium\%%f') -replace '<script src=\"../../js/auth-check.js\"></script>', '<script src=\"../../js/auth-check-bypass.js\"></script>' | Set-Content 'dashboards\premium\%%f'"
  if not exist "dashboards\premium\%%f" (
    powershell -Command "(Get-Content 'dashboards\premium\%%f') -replace '<script>(\r?\n\s+)document.addEventListener', '<script src=\"../../js/auth-check-bypass.js\"></script>\r\n    <script>$1document.addEventListener' | Set-Content 'dashboards\premium\%%f'"
  )
)

echo Update complete