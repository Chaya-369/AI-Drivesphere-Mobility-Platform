import os

def upgrade_to_variables(content):
    # 1. Gradients
    content = content.replace('linear-gradient(135deg, #3b82f6, #8b5cf6)', 'var(--accent-gradient)')
    
    # 2. Main Colors -> Variables
    # Text
    content = content.replace('"#0f172a"', '"var(--text)"')
    content = content.replace("'#0f172a'", "'var(--text)'")
    
    # Borders
    content = content.replace('"#e2e8f0"', '"var(--border)"')
    content = content.replace("'#e2e8f0'", "'var(--border)'")
    
    # Accents
    content = content.replace('"#3b82f6"', '"var(--accent)"')
    content = content.replace("'#3b82f6'", "'var(--accent)'")
    
    # Backgrounds
    content = content.replace('"#ffffff"', '"var(--bg-card)"')
    content = content.replace("'#ffffff'", "'var(--bg-card)'")
    
    # We also need to catch cases where the hex is inside a string like `1px solid #e2e8f0`
    content = content.replace('#e2e8f0', 'var(--border)')
    content = content.replace('#0f172a', 'var(--text)')
    content = content.replace('#3b82f6', 'var(--accent)')
    content = content.replace('#ffffff', 'var(--bg-card)')
    
    # 3. Fix common hardcoded transparent rgba
    content = content.replace('rgba(255, 255, 255, 0.5)', 'var(--glass-bg)')
    content = content.replace('rgba(15, 23, 42, 0.5)', 'var(--glass-bg)')
    content = content.replace('rgba(59, 130, 246, 0.1)', 'var(--accent-bg)')

    return content

def main():
    directory = r"c:\Users\Chaya Devi CS\OneDrive\Desktop\DriveSphere\frontend\src"
    changed_files = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.css'):
                if file in ['index.css']:  # skip index.css because we just manually wrote it
                    continue
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = upgrade_to_variables(content)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    changed_files += 1
                    
    print(f"Successfully applied CSS variables to {changed_files} files!")

if __name__ == "__main__":
    main()
