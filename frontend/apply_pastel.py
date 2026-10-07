import os
import re

PASTEL_BG = "#FAF5F0"
PASTEL_ACCENT = "#C5D8B4"
PASTEL_TEXT = "#4A5340"

def hex_to_rgb(h):
    h = h.lstrip('#')
    if len(h) == 3:
        h = ''.join(c + c for c in h)
    try:
        return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
    except:
        return (255, 255, 255)

def get_luminance(r, g, b):
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255.0

def replace_hex(match):
    original = match.group(0)
    r, g, b = hex_to_rgb(original)
    lum = get_luminance(r, g, b)
    
    # Very dark colors (Blacks, Dark Grays, Dark Blues) -> Text Color
    if lum < 0.35:
        return PASTEL_TEXT
    # Very light colors (Whites, Light Grays) -> Background Color
    elif lum > 0.85:
        return PASTEL_BG
    # Mid-tones and Vibrant colors (Blues, Greens, Yellows) -> Accent Color
    else:
        return PASTEL_ACCENT

def replace_rgba(match):
    original = match.group(0)
    parts = re.findall(r"[\d.]+", original)
    if len(parts) >= 3:
        r, g, b = map(float, parts[:3])
        a = parts[3] if len(parts) > 3 else "1"
        lum = get_luminance(r, g, b)
        
        if lum < 0.35:
            # PASTEL_TEXT RGB: 74, 83, 64
            return f"rgba(74, 83, 64, {a})"
        elif lum > 0.85:
            # PASTEL_BG RGB: 250, 245, 240
            return f"rgba(250, 245, 240, {a})"
        else:
            # PASTEL_ACCENT RGB: 197, 216, 180
            return f"rgba(197, 216, 180, {a})"
    return original

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Match hex colors (#fff, #ffffff, #111827)
    # Exclude ids/hrefs by checking the context, but this regex is a bit naive.
    # We will use a regex that matches # followed by 3 or 6 hex chars, but only in style contexts.
    # Actually, safely replacing all #hex is mostly fine in React unless it's a URL hash.
    # We'll avoid replacing if it's inside quotes after an href=
    
    # A safer regex for CSS/inline style colors:
    # Match hex codes
    new_content = re.sub(r'#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b', replace_hex, content)
    
    # Match rgb/rgba
    new_content = re.sub(r'rgba?\([0-9\s.,]+\)', replace_rgba, new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    directory = r"c:\Users\Chaya Devi CS\OneDrive\Desktop\DriveSphere\frontend\src"
    changed_files = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.css'):
                filepath = os.path.join(root, file)
                if process_file(filepath):
                    changed_files += 1
                    
    print(f"Successfully applied pastel theme to {changed_files} files!")

if __name__ == "__main__":
    main()
