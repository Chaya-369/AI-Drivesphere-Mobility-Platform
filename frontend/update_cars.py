import re

def update_database():
    path = r"c:\Users\Chaya Devi CS\OneDrive\Desktop\DriveSphere\frontend\src\data\carDatabase.js"
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    centers = ["Yelahanka", "Electronic City", "Indiranagar"]
    center_idx = 0

    def replace_line(match):
        nonlocal center_idx
        line = match.group(0)
        
        # increase price by 20%, ensure ends in 99
        price_m = re.search(r'price:\s*(\d+)', line)
        if price_m:
            old_price = int(price_m.group(1))
            new_price = int(old_price * 1.20 / 100) * 100 + 99
            line = re.sub(r'price:\s*\d+', f'price: {new_price}', line)
            
        center = centers[center_idx % len(centers)]
        center_idx += 1
        
        # Add location and center
        line = re.sub(r'\s*\},?', f', location: "Bengaluru", center: "{center}" }},', line)
        
        # Fix any double commas just in case
        line = line.replace('},,', '},')
        return line

    new_content = re.sub(r'\{.*?id:.*?\}', replace_line, content)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
if __name__ == "__main__":
    update_database()
    print("Car database updated!")
