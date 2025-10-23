import os
from PIL import Image, ImageOps

def get_dominant_color(image_path):
    img = Image.open(image_path)
    img = img.convert("RGB")
    img = img.resize((150, 150))  # Resize for faster processing
    colors = img.getcolors(img.size[0] * img.size[1])
    dominant_color = max(colors, key=lambda x: x[0])[1]
    return dominant_color

def pad_image_to_square(image_path, output_path, color):
    img = Image.open(image_path)
    width, height = img.size
    if width == height:
        print(f"Image {image_path} is already square.")
        return

    delta_w = abs(width - height)
    padding = (delta_w // 2, 0, delta_w - (delta_w // 2), 0) if width < height else (0, delta_w // 2, 0, delta_w - (delta_w // 2))
    
    if width < height:
        new_width = height
        new_height = height
        padded_img = Image.new("RGB", (new_width, new_height), color)
        padded_img.paste(img, (delta_w // 2, 0))
    else:
        new_width = width
        new_height = width
        padded_img = Image.new("RGB", (new_width, new_height), color)
        padded_img.paste(img, (0, delta_w // 2))
    
    padded_img.save(output_path)
    print(f"Padded image {image_path} and saved to {output_path}")

if __name__ == "__main__":
    input_folder = "static/membres"
    output_folder = "static/membres_padded"

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(input_folder):
        if filename.lower().endswith((".png", ".jpg", ".jpeg", ".jfif")):
            image_path = os.path.join(input_folder, filename)
            output_path = os.path.join(output_folder, filename)
            try:
                dominant_color = get_dominant_color(image_path)
                pad_image_to_square(image_path, output_path, dominant_color)
            except Exception as e:
                print(f"Could not process {image_path}: {e}") 