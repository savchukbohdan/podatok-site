# Simple File Converter

Простий онлайн-конвертер файлів (PDF, JPG, MP4 → MP3 та інші).  
Працює прямо у браузері, без завантаження на сервер.  
Хостинг: **GitHub Pages**.

## Функції
- MP4 → MP3 (через ffmpeg.wasm)
- PNG ↔ JPG (через canvas API)
- PDF базові операції (через pdf-lib)
- OCR українською (через Tesseract.js — експериментально)

## Використання
1. Відкрити [demo на GitHub Pages](https://yourusername.github.io/file-converter/)
2. Завантажити файл
3. Отримати результат

## Локальний запуск
```bash
git clone https://github.com/yourusername/file-converter
cd file-converter
# Відкрити index.html у браузері
