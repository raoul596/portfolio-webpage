#!/usr/bin/env bash
set -euo pipefail

SOURCE_ROOT="images"
THUMB_ROOT="images/thumbs"
MAX_WIDTH=720
JPEG_QUALITY=72

usage() {
    cat <<EOF
Usage: $(basename "$0") [options]

Options:
  --source-root <path>   Source image root (default: images)
  --thumb-root <path>    Thumbnail output root (default: images/thumbs)
  --max-width <pixels>   Max thumbnail width (default: 720)
  --jpeg-quality <0-100> JPEG quality (default: 72)
  -h, --help             Show this help

Requires ImageMagick (magick or convert).
EOF
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --source-root)
            SOURCE_ROOT="${2:-}"
            shift 2
            ;;
        --thumb-root)
            THUMB_ROOT="${2:-}"
            shift 2
            ;;
        --max-width)
            MAX_WIDTH="${2:-}"
            shift 2
            ;;
        --jpeg-quality)
            JPEG_QUALITY="${2:-}"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "Unknown argument: $1" >&2
            usage
            exit 1
            ;;
    esac
done

if [[ -z "$SOURCE_ROOT" || ! -d "$SOURCE_ROOT" ]]; then
    echo "Source folder '$SOURCE_ROOT' does not exist." >&2
    exit 1
fi

if ! [[ "$MAX_WIDTH" =~ ^[0-9]+$ ]] || ! [[ "$JPEG_QUALITY" =~ ^[0-9]+$ ]]; then
    echo "--max-width and --jpeg-quality must be integers." >&2
    exit 1
fi

mkdir -p "$THUMB_ROOT"

if command -v magick >/dev/null 2>&1; then
    IM_CMD=(magick)
elif command -v convert >/dev/null 2>&1; then
    IM_CMD=(convert)
else
    echo "ImageMagick not found. Install 'magick' (or legacy 'convert')." >&2
    exit 1
fi

SOURCE_ROOT_ABS="$(cd "$SOURCE_ROOT" && pwd)"
THUMB_ROOT_ABS="$(mkdir -p "$THUMB_ROOT" && cd "$THUMB_ROOT" && pwd)"

find "$SOURCE_ROOT_ABS" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -print0 |
while IFS= read -r -d '' src; do
    case "$src" in
        "$THUMB_ROOT_ABS"/*) continue ;;
    esac

    rel="${src#"$SOURCE_ROOT_ABS"/}"
    dest="$THUMB_ROOT_ABS/$rel"
    dest_dir="$(dirname "$dest")"
    ext="${src##*.}"
    ext_lc="$(printf '%s' "$ext" | tr '[:upper:]' '[:lower:]')"

    mkdir -p "$dest_dir"

    if [[ "$ext_lc" == "jpg" || "$ext_lc" == "jpeg" ]]; then
        "${IM_CMD[@]}" "$src" \
            -auto-orient \
            -resize "${MAX_WIDTH}x>" \
            -strip \
            -interlace Plane \
            -sampling-factor 4:2:0 \
            -quality "$JPEG_QUALITY" \
            "$dest"
    else
        "${IM_CMD[@]}" "$src" \
            -auto-orient \
            -resize "${MAX_WIDTH}x>" \
            -strip \
            "$dest"
    fi

    echo "Thumbnail created: $dest"
done

