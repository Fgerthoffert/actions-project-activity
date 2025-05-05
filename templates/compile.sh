#!/bin/bash

# Script to convert HTML files to base64 encoded TypeScript files
# Cross-platform compatible (Linux, macOS, Windows with bash)

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Ensure target directory exists relative to the script location
TARGET_DIR="$SCRIPT_DIR/../src/views/compiled-templates"
mkdir -p "$TARGET_DIR"

# Function to encode file content to base64 in a cross-platform way
encode_to_base64() {
  local file="$1"
  # Try different base64 commands based on platform availability
  if command -v base64 &>/dev/null; then
    # Linux/macOS/WSL
    base64 -w 0 -i "$file" # -w 0 prevents line wrapping
  elif command -v openssl &>/dev/null; then
    # Alternative using openssl (commonly available)
    openssl base64 -A -in "$file"
  else
    echo "Error: No base64 encoding tool found (tried: base64, openssl)" >&2
    exit 1
  fi
}

# Find all HTML files in the script's directory
echo "Searching for HTML files in: $SCRIPT_DIR"
find "$SCRIPT_DIR" -maxdepth 1 -type f -name "*.html" | while read -r file; do
  # Get just the filename without path
  filename=$(basename "$file")
  
  # Create target file path
  target_file="$TARGET_DIR/$filename.base64.ts"
  
  echo "Processing $filename -> $target_file"
  
  # Get base64 encoded content
  encoded_content=$(encode_to_base64 "$file")
  
  # Create TypeScript file with encoded content
  echo "export const tpl = '$encoded_content'" > "$target_file"
  echo "" >> "$target_file"
  echo "export default tpl" >> "$target_file"
  
  echo "✓ Created $target_file"
done

echo "Conversion complete!"