"""Generate the synthetic test drawings. Run: python -m backend.test_data.make_fixtures

Fixtures and expected answers are for tests only and are never sent as part of a prompt.
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

SIZE, CENTER, RADIUS = 800, 400, 300
HERE = Path(__file__).resolve().parent


def point(angle_deg, radius):
    angle = math.radians(angle_deg)
    return CENTER + radius * math.sin(angle), CENTER - radius * math.cos(angle)


def draw_clock(path, *, closed=True, numbers=range(1, 13), layout="correct", hour_deg, minute_deg,
               hour_len=150, minute_len=240):
    image = Image.new("RGB", (SIZE, SIZE), "white")
    draw = ImageDraw.Draw(image)
    box = (CENTER - RADIUS, CENTER - RADIUS, CENTER + RADIUS, CENTER + RADIUS)
    if closed:
        draw.ellipse(box, outline="black", width=6)
    else:
        draw.arc(box, start=20, end=330, fill="black", width=6)
    font = ImageFont.load_default(size=44)
    for n in numbers:
        if layout == "correct":
            x, y = point(n * 30, RADIUS - 50)
        elif layout == "bunched":
            x, y = point(n * 7, RADIUS - 50)
        else:  # counter-clockwise and bunched near the bottom
            x, y = point(180 + n * 12, RADIUS - 50)
        draw.text((x, y), str(n), fill="black", font=font, anchor="mm")
    draw.line([CENTER, CENTER, *point(hour_deg, hour_len)], fill="black", width=10)
    draw.line([CENTER, CENTER, *point(minute_deg, minute_len)], fill="black", width=6)
    image.save(path)


def main():
    # clock-06: 9:30 hands; everything else correct.
    draw_clock(HERE / "clock-06.png", hour_deg=285, minute_deg=180)
    # clock-07: open outline, only four numbers placed counter-clockwise, correct 11:10 hands.
    draw_clock(HERE / "clock-07.png", closed=False, numbers=[1, 2, 3, 4], layout="reversed",
               hour_deg=335, minute_deg=60)
    # clock-08: closed, all numbers present but bunched in one quadrant, wrong hands.
    draw_clock(HERE / "clock-08.png", layout="bunched", hour_deg=120, minute_deg=240)


if __name__ == "__main__":
    main()
