@echo off
echo === AUTO DEPLOY SCRIPT ===

:: Cek apakah git terinstall
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git tidak ditemukan di komputer ini!
    echo Silakan install Git terlebih dahulu: https://git-scm.com/download/win
    pause
    exit /b
)

echo [1/5] Inisialisasi Git...
git init

echo [2/5] Menambahkan file...
git add .

echo [3/5] Membuat commit pertama...
git commit -m "Initial commit: Aplikasi Catatan Pro"

echo.
echo === PENTING ===
echo Silakan buat repository baru di https://github.com/new
echo Lalu salin URL repository tersebut (contoh: https://github.com/username/repo.git)
echo.
set /p REPO_URL="Masukkan URL Repository: "

echo [4/5] Menghubungkan ke GitHub...
git remote add origin %REPO_URL%
git branch -M main

echo [5/5] Mengupload ke GitHub...
git push -u origin main

echo.
echo === SELESAI ===
echo Sekarang buka repository Anda di GitHub, masuk ke Settings > Pages,
echo dan aktifkan GitHub Pages dari branch 'main'.
pause
