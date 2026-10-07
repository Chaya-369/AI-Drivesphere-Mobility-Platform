import os

def fix_text_visibility(content):
    # Ensure all text strictly uses var(--text) for perfect visibility in light/dark mode
    content = content.replace('color: "var(--bg-card)"', 'color: "var(--text)"')
    content = content.replace("color: 'var(--bg-card)'", 'color: "var(--text)"')
    content = content.replace('color: "var(--accent)"', 'color: "var(--text)"')
    content = content.replace("color: 'var(--accent)'", 'color: "var(--text)"')
    content = content.replace('color: "var(--bg)"', 'color: "var(--text)"')
    
    # Let's also fix background/color overlap just in case
    content = content.replace('background: "var(--text)", color: "var(--text)"', 'background: "var(--bg-card)", color: "var(--text)"')
    
    return content

def main():
    directory = r"c:\Users\Chaya Devi CS\OneDrive\Desktop\DriveSphere\frontend\src"
    changed_files = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = fix_text_visibility(content)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    changed_files += 1
                    
    print(f"Fixed text visibility in {changed_files} files!")

if __name__ == "__main__":
    main()
