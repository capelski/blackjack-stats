JS_FILE=$1

node dist/use-cases/$JS_FILE.js

npx prettier --write output/$JS_FILE.md
