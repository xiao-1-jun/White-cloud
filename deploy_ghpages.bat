@echo off
echo === Deploy to GitHub Pages ===

echo.
echo 1. Checkout main branch...
git checkout main

echo.
echo 2. Build project...
call npm run build

echo.
echo 3. Delete old gh-pages branch...
git branch -D gh-pages 2>nul
git push origin --delete gh-pages 2>nul

echo.
echo 4. Create new gh-pages branch...
git checkout --orphan gh-pages
git reset --hard

echo.
echo 5. Copy dist files...
xcopy "dist\*" ".\" /E /H /Y /Q

echo.
echo 6. Remove dist folder...
rd /s /q "dist"

echo.
echo 7. Add files...
git add -A

echo.
echo 8. Commit...
git commit -m "deploy: build for github pages"

echo.
echo 9. Push...
git push -f origin gh-pages

echo.
echo 10. Switch back to main...
git checkout main

echo.
echo Done!
echo URL: https://xiao-1-jun.github.io/White-cloud/