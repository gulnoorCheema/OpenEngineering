"""Prepare actual studio renders for the homepage. Requires Pillow.

Run after exporting all six transparent collection images and both hero posters
with the local authoring UI: python3 scripts/prepare-home-media.py
No generated design mockups are used as product imagery.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CAPTURES = ROOT / 'artifacts/captures'
for slug in ['engine', 'jet-engine', 'mechanical-watch', 'sewing-machine', 'gears', 'differential']:
    source = Image.open(CAPTURES / f'openengineering-thumbnail-{slug}.png').convert('RGBA')
    if source.getpixel((0, 0))[3] != 0:
        raise ValueError(f'{slug}: export with Transparent collection image enabled')
    bounds = source.getchannel('A').point(lambda alpha: 255 if alpha > 128 else 0).getbbox()
    x0, y0, x1, y1 = bounds
    crop = source.crop((max(0, x0-22), max(0, y0-22), min(source.width, x1+22), min(source.height, y1+22)))
    scale = min(680 / crop.width, 500 / crop.height)
    crop = crop.resize((round(crop.width*scale), round(crop.height*scale)), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (720, 540))
    canvas.alpha_composite(crop, ((720-crop.width)//2, (540-crop.height)//2))
    canvas.save(ROOT / f'public/exhibits/{slug}.webp', quality=92)

for variant, filename in [('desktop', 'jet-poster'), ('phone', 'jet-poster-phone')]:
    source = Image.open(CAPTURES / f'openengineering-hero-{variant}.png')
    if source.width > 1440:
        source = source.resize((1440, round(source.height*1440/source.width)), Image.Resampling.LANCZOS)
    source.save(ROOT / f'public/home/{filename}.webp', quality=89)
