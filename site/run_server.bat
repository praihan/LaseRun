http-server -p 8000
if %errorlevel%==9009 (
    echo http-server not found... attempting to use python server
) else (
    exit
)
python run_server.py