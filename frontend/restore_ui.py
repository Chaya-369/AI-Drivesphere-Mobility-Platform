import os
import re

def restore_colors(content):
    # 1. Fix Borders
    # If a border is currently #FFF9F5 (the pastel background color), we make it a visible gray.
    content = re.sub(r'border:\s*"([^"]*)#FFF9F5([^"]*)"', r'border: "\1#e2e8f0\2"', content)
    content = re.sub(r'border(Top|Bottom|Left|Right):\s*"([^"]*)#FFF9F5([^"]*)"', r'border\1: "\2#e2e8f0\3"', content)
    
    # 2. Fix Gradients
    # If a linear-gradient uses #FFD1DC, #FFD1DC, make it a nice vibrant blue to purple.
    content = content.replace('#FFD1DC, #FFD1DC', '#3b82f6, #8b5cf6')
    content = content.replace('rgba(255, 209, 220, 1), rgba(255, 209, 220, 1)', 'rgba(59, 130, 246, 1), rgba(139, 92, 246, 1)')
    
    # 3. Fix standard hex codes
    # #FFF9F5 -> #ffffff (Crisp White Background)
    content = content.replace('#FFF9F5', '#ffffff')
    # #FFD1DC -> #3b82f6 (Vibrant Blue Accents)
    content = content.replace('#FFD1DC', '#3b82f6')
    # #4A3B39 -> #0f172a (Deep Slate Text)
    content = content.replace('#4A3B39', '#0f172a')
    
    # 4. Fix RGBA values
    # rgba(255, 249, 245, -> rgba(255, 255, 255,
    content = content.replace('rgba(255, 249, 245,', 'rgba(255, 255, 255,')
    # rgba(255, 209, 220, -> rgba(59, 130, 246,
    content = content.replace('rgba(255, 209, 220,', 'rgba(59, 130, 246,')
    # rgba(74, 59, 57, -> rgba(15, 23, 42,
    content = content.replace('rgba(74, 59, 57,', 'rgba(15, 23, 42,')

    return content

def main():
    directory = r"c:\Users\Chaya Devi CS\OneDrive\Desktop\DriveSphere\frontend\src"
    changed_files = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.css'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = restore_colors(content)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    changed_files += 1
                    
    print(f"Successfully restored high-contrast modern UI to {changed_files} files!")

if __name__ == "__main__":
    main()
