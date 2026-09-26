"""Generate original, local animated CAMPUSMATE companion GIFs.

Requires Pillow to regenerate: python -m pip install Pillow
No remote image or animation service is used. The PNGs are reduced-motion posters.
"""
from __future__ import annotations

import math
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parents[1] / "public" / "pets"
OUT.mkdir(parents=True, exist_ok=True)
S = 3  # draw at 3x, then downsample for smooth edges
SIZE = 240
INK = "#39445d"
CREAM = "#fff8ec"
PINK = "#f3a9b5"
WHITE = "#ffffff"

COLORS = {
    "cat": ("#e8ad80", "#f8c9a5"),
    "dog": ("#b98b67", "#dfb590"),
    "bunny": ("#e9e2fa", "#f7efff"),
    "panda": ("#f7f4f0", "#ffffff"),
    "fox": ("#eaa073", "#fac195"),
    "bear": ("#b99a88", "#d9bca7"),
    "penguin": ("#485f79", "#647d99"),
    "dino": ("#85c9ba", "#a9e5d5"),
    "hamster": ("#e4bd8c", "#f5d6ab"),
}


def frame_for(species: str, step: int) -> Image.Image:
    base, light = COLORS[species]
    bob = round(math.sin(step * math.tau / 12) * 3)
    sway = round(math.sin(step * math.tau / 12) * 5)
    blink = step in (5, 6)
    im = Image.new("RGBA", (SIZE * S, SIZE * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    def xy(box, move=True):
        x1, y1, x2, y2 = box
        dy = bob if move else 0
        return tuple(round(v * S) for v in (x1, y1 + dy, x2, y2 + dy))

    def oval(box, fill, outline=INK, width=3, move=True):
        d.ellipse(xy(box, move), fill=fill, outline=outline, width=round(width * S) if outline else 0)

    def poly(points, fill, outline=INK, width=3, move=True):
        pts = [(round(x * S), round((y + (bob if move else 0)) * S)) for x, y in points]
        d.polygon(pts, fill=fill)
        if outline:
            d.line(pts + pts[:1], fill=outline, width=round(width * S), joint="curve")

    def line(points, fill=INK, width=3, move=True):
        pts = [(round(x * S), round((y + (bob if move else 0)) * S)) for x, y in points]
        d.line(pts, fill=fill, width=round(width * S), joint="curve")

    def arc(box, start, end, fill=INK, width=3):
        d.arc(xy(box), start, end, fill=fill, width=round(width * S))

    # Soft floor shadow stays still while the pet bobs.
    oval((65, 208, 178, 222), "#b4bad7", None, move=False)

    # Tails and species silhouettes are behind the body/head.
    if species == "cat":
        arc((146 + sway, 139, 210 + sway, 213), 255, 75, fill=INK, width=17)
        arc((146 + sway, 139, 210 + sway, 213), 255, 75, fill=base, width=11)
        poly([(68, 70), (65, 24), (100, 51)], base)
        poly([(172, 70), (176, 24), (141, 51)], base)
        poly([(75, 61), (73, 38), (92, 53)], PINK, None)
        poly([(165, 61), (168, 38), (148, 53)], PINK, None)
    elif species == "dog":
        oval((45, 63, 81, 135), "#987153")
        oval((159, 63, 195, 135), "#987153")
        oval((46, 68, 70, 122), "#b78664", None)
        oval((170, 68, 194, 122), "#b78664", None)
        oval((165 + sway, 153, 216 + sway, 190), base)
    elif species == "bunny":
        oval((68, 7, 100, 104), base)
        oval((140, 7, 172, 104), base)
        oval((78, 18, 92, 88), PINK, None)
        oval((148, 18, 162, 88), PINK, None)
    elif species == "panda":
        oval((57, 29, 92, 68), "#4c5268")
        oval((148, 29, 183, 68), "#4c5268")
    elif species == "fox":
        poly([(60, 90), (64, 23), (102, 59)], base)
        poly([(180, 90), (176, 23), (138, 59)], base)
        poly([(68, 66), (71, 39), (88, 58)], "#f2b3ae", None)
        poly([(172, 66), (169, 39), (152, 58)], "#f2b3ae", None)
        poly([(163, 177), (209 + sway, 148), (210 + sway, 193), (178, 207)], base)
        poly([(195 + sway, 158), (210 + sway, 148), (210 + sway, 193), (196 + sway, 199)], CREAM, None)
    elif species == "bear":
        oval((60, 31, 95, 68), base)
        oval((145, 31, 180, 68), base)
        oval((68, 39, 86, 59), "#e5bdad", None)
        oval((154, 39, 172, 59), "#e5bdad", None)
    elif species == "penguin":
        oval((52, 126, 84, 186), base)
        oval((156, 126, 188, 186), base)
    elif species == "dino":
        for x, y in ((64, 70), (59, 99), (62, 129), (169, 67), (181, 91), (185, 119)):
            poly([(x, y), (x + (10 if x < 100 else -10), y - 13), (x + (16 if x < 100 else -16), y + 7)], "#68b5ac")
        oval((162 + sway, 156, 207 + sway, 189), base)
    elif species == "hamster":
        oval((54, 38, 94, 78), base)
        oval((146, 38, 186, 78), base)
        oval((64, 47, 86, 70), PINK, None)
        oval((154, 47, 176, 70), PINK, None)

    # Rounded body, little feet and paws.
    oval((70, 119, 170, 209), base)
    oval((81, 151, 159, 200), CREAM, None)
    oval((72, 193, 103, 216), base)
    oval((137, 193, 168, 216), base)
    if species == "penguin":
        oval((69, 196, 106, 217), "#eeb46c")
        oval((134, 196, 171, 217), "#eeb46c")
        oval((83, 125, 157, 201), CREAM, None)
    oval((60, 137, 89, 178), light)
    oval((151, 137, 180, 178), light)

    # Head, highlights, and species face markings.
    head_y = 59 if species == "bunny" else 50
    oval((56, head_y, 184, 166), light)
    oval((69, head_y + 11, 102, head_y + 27), WHITE, None)
    if species == "panda":
        oval((74, 93, 109, 127), "#51566a", None)
        oval((131, 93, 166, 127), "#51566a", None)
    elif species == "fox":
        poly([(61, 110), (81, 146), (120, 157), (159, 146), (179, 110), (154, 128), (120, 126), (86, 128)], CREAM, None)
    elif species == "dog":
        oval((91, 117, 149, 151), CREAM, None)
    elif species == "bear":
        oval((91, 119, 149, 151), "#eacfc1", None)
    elif species == "penguin":
        oval((69, 68, 171, 158), CREAM, None)
    elif species == "hamster":
        oval((66, 112, 109, 148), CREAM, None)
        oval((131, 112, 174, 148), CREAM, None)

    # Expressive eyes with a purposeful blink in the animation loop.
    eye_y = 108 if species != "bunny" else 112
    for ex in (94, 145):
        if blink:
            line([(ex - 8, eye_y + 3), (ex + 8, eye_y + 3)], width=3)
        else:
            oval((ex - 6, eye_y - 10, ex + 6, eye_y + 9), INK, None)
            oval((ex - 3, eye_y - 7, ex + 1, eye_y - 2), WHITE, None)
    # Cheeks and noses.
    oval((72, 123, 91, 132), "#efadb6", None)
    oval((149, 123, 168, 132), "#efadb6", None)
    if species == "penguin":
        poly([(110, 121), (130, 121), (120, 135)], "#eeb46c", INK, 2)
    elif species == "dino":
        oval((112, 123, 128, 132), "#69aa9e", None)
        oval((137, 130, 142, 134), INK, None)
    else:
        poly([(114, 124), (126, 124), (120, 132)], "#bd7883" if species != "dog" else INK, None)
        line([(120, 132), (120, 136)], width=2)
        arc((109, 126, 121, 144), 5, 165, width=2)
        arc((119, 126, 131, 144), 15, 175, width=2)
    if species in ("cat", "fox", "hamster"):
        for side in (-1, 1):
            x = 85 if side == -1 else 155
            line([(x, 129), (x + side * 18, 124)], width=2)
            line([(x, 135), (x + side * 17, 137)], width=2)
    if species == "bunny":
        oval((114, 132, 120, 140), WHITE, INK, 1)
        oval((120, 132, 126, 140), WHITE, INK, 1)

    # Floating twinkles make the idle GIF feel alive without being distracting.
    pulse = 1 if step % 6 < 3 else 0
    for sx, sy in ((41, 102 + sway), (198, 91 - sway)):
        radius = 5 + pulse
        poly([(sx, sy - radius), (sx + 2, sy - 2), (sx + radius, sy), (sx + 2, sy + 2), (sx, sy + radius), (sx - 2, sy + 2), (sx - radius, sy), (sx - 2, sy - 2)], "#9cbcf7", None, move=False)
    return im.resize((180, 180), Image.Resampling.LANCZOS)


def gif_palette(im: Image.Image) -> Image.Image:
    alpha = im.getchannel("A")
    palette = im.convert("RGB").quantize(colors=255, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    transparent = alpha.point(lambda value: 255 if value < 72 else 0)
    palette.paste(255, mask=transparent)
    palette.info["transparency"] = 255
    return palette


for species in COLORS:
    frames = [frame_for(species, step) for step in range(12)]
    frames[0].save(OUT / f"{species}.png", optimize=True)
    palette_frames = [gif_palette(frame) for frame in frames]
    palette_frames[0].save(OUT / f"{species}.gif", save_all=True, append_images=palette_frames[1:], loop=0, duration=95, disposal=2, transparency=255, optimize=True)
    print(f"{species:8s} {((OUT / (species + '.gif')).stat().st_size / 1024):.1f} KB")
