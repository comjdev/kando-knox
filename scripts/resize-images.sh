#!/bin/bash

# Quick script to resize images larger than 1920px width
# Maintains aspect ratio and quality

MAX_WIDTH=1920
QUALITY=85

echo "Resizing images larger than ${MAX_WIDTH}px wide..."
echo ""

find src/assets/img -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.JPG" \) | while read -r file; do
    width=$(identify -format "%w" "$file" 2>/dev/null)
    
    if [ -n "$width" ] && [ "$width" -gt "$MAX_WIDTH" ]; then
        echo "Resizing: $file (${width}px → ${MAX_WIDTH}px)"
        
        # Create backup
        cp "$file" "${file}.bak"
        
        # Resize maintaining aspect ratio
        magick "$file" -resize "${MAX_WIDTH}x>" -quality "$QUALITY" "$file"
        
        # Get new size
        new_width=$(identify -format "%w" "$file" 2>/dev/null)
        new_height=$(identify -format "%h" "$file" 2>/dev/null)
        echo "  ✓ New size: ${new_width}x${new_height}"
        echo ""
    fi
done

echo "Done! Backup files (.bak) created. Remove them if you're happy with the results."

