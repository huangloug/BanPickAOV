import os

img_dir = "assets/img"
output_file = "heroes.js"

valid_exts = (".png", ".jpg", ".jpeg", ".webp")

hero_names = [
    os.path.splitext(f)[0]
    for f in os.listdir(img_dir)
    if f.lower().endswith(valid_exts)
]

array_content = "const heroes = [\n" + ",\n".join(f'  "{name}"' for name in sorted(hero_names)) + "\n];\n"

with open(output_file, "w", encoding="utf-8") as f:
    f.write(array_content)

print(f"✅ Đã tạo '{output_file}' với {len(hero_names)} heroes.")
