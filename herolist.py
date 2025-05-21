import os

# Thư mục chứa ảnh
img_dir = "assets/img"
output_file = "heroes.js"

# Định dạng ảnh hợp lệ
valid_exts = (".png", ".jpg", ".jpeg", ".webp")

# Lấy danh sách file hợp lệ và bỏ đuôi mở rộng
hero_names = [
    os.path.splitext(f)[0]
    for f in os.listdir(img_dir)
    if f.lower().endswith(valid_exts)
]

# Tạo nội dung file JavaScript
array_content = "const heroes = [\n" + ",\n".join(f'  "{name}"' for name in sorted(hero_names)) + "\n];\n"

# Ghi vào file JS
with open(output_file, "w", encoding="utf-8") as f:
    f.write(array_content)

print(f"✅ Đã tạo '{output_file}' với {len(hero_names)} heroes.")
