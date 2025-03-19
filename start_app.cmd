@echo off
start python server.py
timeout /t 2
start http://localhost:8000/index.html
