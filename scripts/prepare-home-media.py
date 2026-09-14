"""Prepare actual studio renders for the homepage. Requires Pillow.

Run after exporting all six transparent collection images and both hero posters
with the local authoring UI: python3 scripts/prepare-home-media.py
No generated design mockups are used as product imagery.
"""
from pathlib import Path
import argparse
import re
import shutil
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CAPTURES = ROOT / 'artifacts/captures'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--exhibit', help='Prepare only this exhibit, including its PNG preview and social card')
args = parser.parse_args()
if args.exhibit and not re.fullmatch(r'[a-z][a-z0-9]*(?:-[a-z0-9]+)*', args.exhibit):
    parser.error('Use a lowercase exhibit slug')
slugs = [args.exhibit] if args.exhibit else ['engine', 'jet-engine', 'mechanical-watch', 'sewing-machine', 'gears', 'differential']
for slug in slugs:
    source = Image.open(CAPTURES / f'openengineering-thumbnail-{slug}.png').convert('RGBA')
    if source.getpixel((0, 0))[3] != 0:
        raise ValueError(f'{slug}: export with Transparent collection image enabled')
    bounds = source.getchannel('A').point(lambda alpha: 255 if alpha > 128 else 0).getbbox()
    if bounds is None:
        raise ValueError(f'{slug}: the capture has no visible model')
    x0, y0, x1, y1 = bounds
    crop = source.crop((max(0, x0-22), max(0, y0-22), min(source.width, x1+22), min(source.height, y1+22)))
    scale = min(680 / crop.width, 500 / crop.height)
    crop = crop.resize((round(crop.width*scale), round(crop.height*scale)), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (720, 540))
    canvas.alpha_composite(crop, ((720-crop.width)//2, (540-crop.height)//2))
    canvas.save(ROOT / f'public/exhibits/{slug}.webp', quality=92)
    if args.exhibit:
        canvas.save(ROOT / f'public/exhibits/{slug}.png')
        shutil.copyfile(CAPTURES / f'openengineering-social-{slug}.png', ROOT / f'public/social/{slug}.png')

for variant, filename in ([] if args.exhibit else [('desktop', 'jet-poster'), ('phone', 'jet-poster-phone')]):
    source = Image.open(CAPTURES / f'openengineering-hero-{variant}.png')
    if source.width > 1440:
        source = source.resize((1440, round(source.height*1440/source.width)), Image.Resampling.LANCZOS)
    source.save(ROOT / f'public/home/{filename}.webp', quality=89)
