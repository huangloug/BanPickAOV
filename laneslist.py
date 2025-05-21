import re

# File input (hero.js chứa: const heroes = [...])
hero_file = "hero.js"

# File output (kết quả lanes.js)
output_file = "lanes.js"

# Các lane bạn muốn phân loại
lane_options = {
    "1": "Rồng",
    "2": "Trợ thủ",
    "3": "Mid",
    "4": "Đi rừng",
    "5": "Tà thần Caesar"
}

# Đọc danh sách tướng từ hero.js
with open(hero_file, "r", encoding="utf-8") as f:
    content = f.read()

heroes = re.findall(r'"(.*?)"', content)

# Tạo dict trống cho lanes
lanes = {lane_name: [] for lane_name in lane_options.values()}

# Hỏi từng tướng thuộc lane nào
for hero in heroes:
    while True:
        print(f"\nTướng: {hero}")
        for num, lane in lane_options.items():
            print(f"{num}. {lane}")
        choice = input("→ Nhập số tương ứng với lane: ").strip()
        if choice in lane_options:
            lanes[lane_options[choice]].append(hero)
            break
        else:
            print("⚠️ Lựa chọn không hợp lệ. Vui lòng nhập lại.")

# Ghi kết quả ra lanes.js
with open(output_file, "w", encoding="utf-8") as f:
    f.write("const lanes = {\n")
    for lane, hero_list in lanes.items():
        heroes_str = ", ".join(f'"{name}"' for name in hero_list)
        f.write(f'  "{lane}": [{heroes_str}],\n')
    f.write("};\n")

print(f"\n✅ Đã ghi kết quả vào '{output_file}'")
