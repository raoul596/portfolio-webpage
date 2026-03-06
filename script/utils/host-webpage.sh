#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$REPO_ROOT"

port=8000
max_port=8010

port_in_use() {
    if command -v lsof >/dev/null 2>&1; then
        lsof -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1
    else
        netstat -an 2>/dev/null | grep -E "[\.:]$1[[:space:]].*LISTEN" >/dev/null 2>&1
    fi
}

while port_in_use "$port"; do
    port=$((port + 1))
    if [ "$port" -gt "$max_port" ]; then
        echo "No free port found in range 8000-8010. Stop old python http.server processes and retry." >&2
        exit 1
    fi
done

echo "Serving $REPO_ROOT on http://127.0.0.1:$port"
python3 -m http.server "$port" --bind 127.0.0.1  # Python 3 local server
