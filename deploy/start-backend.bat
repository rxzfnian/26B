@echo off
echo Starting KPL Guessr Backend Server...
echo Current directory: %CD%
echo Node version: 
node --version
echo NPM version:
npm --version
echo Installing dependencies...
npm install
echo Starting server...
npm start
pause
