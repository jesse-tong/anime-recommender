#!/bin/sh
cd ./src/web/react && cd ../../ && . .venv/bin/activate && ./.venv/bin/flask run --no-debugger &
cd ./src/web/react && npm run dev &