JS_FILE=$1
OUTPUT_FILE=$2

OUTPUT_PATH=output/$OUTPUT_FILE.md

node dist/use-cases/$JS_FILE.js > $OUTPUT_PATH

npx prettier --write $OUTPUT_PATH
