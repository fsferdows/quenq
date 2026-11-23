import subprocess
import os
from PIL import Image

def generate_favicons():
    root = "/Users/user/Desktop/quenq"
    svg_path = os.path.join(root, "favicon.svg")
    master_png = os.path.join(root, "favicon-master-1024.png")

    # Render SVG to 1024x1024 PNG using Google Chrome headless
    chrome_bin = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    cmd = [
        chrome_bin,
        "--headless=new",
        "--disable-gpu",
        "--window-size=1024,1024",
        "--default-background-color=00000000",
        f"--screenshot={master_png}",
        f"file://{svg_path}"
    ]
    print("Rendering SVG to 1024x1024 master PNG...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print("Chrome error:", res.stderr)
        return False

    if not os.path.exists(master_png):
        print("Failed to generate master PNG")
        return False

    # Open with PIL
    master = Image.open(master_png).convert("RGBA")

    # Crop to exact square if window size differed
    w, h = master.size
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = (h - min_dim) // 2
    master_sq = master.crop((left, top, left + min_dim, top + min_dim))

    # Resize targets
    targets = {
        "favicon-16x16.png": (16, 16),
        "favicon-32x32.png": (32, 32),
        "favicon-48x48.png": (48, 48),
        "apple-touch-icon.png": (180, 180),
        "android-chrome-192x192.png": (192, 192),
        "android-chrome-512x512.png": (512, 512),
    }

    for filename, (tw, th) in targets.items():
        out_path = os.path.join(root, filename)
        resized = master_sq.resize((tw, th), Image.Resampling.LANCZOS)
        resized.save(out_path, "PNG", optimize=True)
        print(f"Generated {filename}: {tw}x{th} ({os.path.getsize(out_path)} bytes)")

    # Generate multi-size favicon.ico embedding (16, 32, 48, 64)
    ico_path = os.path.join(root, "favicon.ico")
    icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    master_sq.save(ico_path, format="ICO", sizes=icon_sizes)
    print(f"Generated favicon.ico: {icon_sizes} ({os.path.getsize(ico_path)} bytes)")

    # Clean up temp master PNG
    if os.path.exists(master_png):
        os.remove(master_png)

    print("All favicon assets successfully generated!")
    return True

if __name__ == "__main__":
    generate_favicons()
