from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = root / "web/pgadmin/static/img/orca-logo.png"
image = Image.open(source).convert("RGBA")

for name, size in (("logo-128.png", 128), ("logo-256.png", 256), ("logo-right-128.png", 128), ("logo-right-256.png", 256)):
    image.resize((size, size), Image.Resampling.LANCZOS).save(
        root / "web/pgadmin/static/img" / name,
        format="PNG",
        optimize=True,
    )

image.resize((64, 64), Image.Resampling.LANCZOS).save(
    root / "web/pgadmin/static/favicon.ico",
    format="ICO",
    sizes=[(64, 64), (32, 32), (16, 16)],
)
