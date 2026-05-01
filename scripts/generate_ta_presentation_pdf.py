from pathlib import Path
from typing import Iterable, Sequence

from PIL import Image, ImageDraw, ImageFont


ASSETS_DIR = Path(
    "C:/Users/ali/.cursor/projects/c-Users-ali-Desktop-ns-jewels/assets"
)
OUTPUT_PDF = Path("C:/Users/ali/Desktop/ns-jewels/TA_Business_Presentation.pdf")

IMAGE_NAMES = [
    "c__Users_ali_AppData_Roaming_Cursor_User_workspaceStorage_290b39af6322aa04ef92baf786d962cd_images_WhatsApp_Image_2026-04-30_at_11.13.22_AM-09b2faa4-1f45-4909-ac18-30b6091555e3.png",
    "c__Users_ali_AppData_Roaming_Cursor_User_workspaceStorage_290b39af6322aa04ef92baf786d962cd_images_WhatsApp_Image_2026-04-30_at_11.13.23_AM__1_-20455d67-dc95-4ff9-990b-9ee5082f3c1a.png",
    "c__Users_ali_AppData_Roaming_Cursor_User_workspaceStorage_290b39af6322aa04ef92baf786d962cd_images_WhatsApp_Image_2026-04-30_at_11.13.21_AM__1_-e23fb813-8cb5-4dfd-9260-dc85cb1ea052.png",
    "c__Users_ali_AppData_Roaming_Cursor_User_workspaceStorage_290b39af6322aa04ef92baf786d962cd_images_WhatsApp_Image_2026-04-30_at_11.13.23_AM-ba7ef5a1-91f3-4e28-ba05-23233c1248e9.png",
    "c__Users_ali_AppData_Roaming_Cursor_User_workspaceStorage_290b39af6322aa04ef92baf786d962cd_images_WhatsApp_Image_2026-04-30_at_11.13.21_AM__2_-aa6ae588-5459-480b-9a78-5d2c998da0fd.png",
    "c__Users_ali_AppData_Roaming_Cursor_User_workspaceStorage_290b39af6322aa04ef92baf786d962cd_images_WhatsApp_Image_2026-04-30_at_11.13.24_AM-05ecae02-f16c-4544-9da6-2e4a5f29da15.png",
    "c__Users_ali_AppData_Roaming_Cursor_User_workspaceStorage_290b39af6322aa04ef92baf786d962cd_images_WhatsApp_Image_2026-04-30_at_11.13.21_AM-a33dbb9a-0eb1-4b02-850c-a5b9d266ea30.png",
]

WIDTH = 1920
HEIGHT = 1080
PRIMARY = (241, 255, 3)
BLACK = (12, 12, 12)
WHITE = (244, 244, 244)
GRAY = (170, 170, 170)


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/arial.ttf",
    ]
    for font_path in candidates:
        path = Path(font_path)
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def wrap_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    font: ImageFont.FreeTypeFont | ImageFont.ImageFont,
    max_width: int,
) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = []
    for word in words:
        test = " ".join([*current, word]).strip()
        box = draw.textbbox((0, 0), test, font=font)
        line_width = box[2] - box[0]
        if line_width <= max_width:
            current.append(word)
            continue
        if current:
            lines.append(" ".join(current))
        current = [word]
    if current:
        lines.append(" ".join(current))
    return lines


def add_title(slide: Image.Image, title: str, subtitle: str) -> None:
    draw = ImageDraw.Draw(slide)
    title_font = load_font(90)
    subtitle_font = load_font(40)
    draw.text((110, 100), title, fill=PRIMARY, font=title_font)
    draw.text((110, 220), subtitle, fill=WHITE, font=subtitle_font)
    draw.rectangle((110, 285, 720, 295), fill=PRIMARY)


def add_bullets(slide: Image.Image, bullets: Sequence[str]) -> None:
    draw = ImageDraw.Draw(slide)
    bullet_font = load_font(38)
    y = 350
    for bullet in bullets:
        lines = wrap_text(draw, bullet, bullet_font, 1520)
        for index, line in enumerate(lines):
            prefix = "• " if index == 0 else "  "
            draw.text((130, y), f"{prefix}{line}", fill=WHITE, font=bullet_font)
            y += 56
        y += 8


def place_image(
    slide: Image.Image,
    image_path: Path,
    x: int,
    y: int,
    width: int,
    height: int,
) -> None:
    photo = Image.open(image_path).convert("RGB")
    photo.thumbnail((width, height))
    canvas = Image.new("RGB", (width, height), (24, 24, 24))
    x_offset = (width - photo.width) // 2
    y_offset = (height - photo.height) // 2
    canvas.paste(photo, (x_offset, y_offset))
    slide.paste(canvas, (x, y))
    draw = ImageDraw.Draw(slide)
    draw.rectangle((x, y, x + width, y + height), outline=PRIMARY, width=4)


def make_slide(title: str, subtitle: str, bullets: Iterable[str]) -> Image.Image:
    slide = Image.new("RGB", (WIDTH, HEIGHT), BLACK)
    add_title(slide, title, subtitle)
    add_bullets(slide, list(bullets))
    return slide


def create_presentation() -> None:
    image_paths = [ASSETS_DIR / name for name in IMAGE_NAMES]
    missing = [path.name for path in image_paths if not path.exists()]
    if missing:
        raise FileNotFoundError(f"Missing assets: {missing}")

    slides: list[Image.Image] = []

    cover = Image.new("RGB", (WIDTH, HEIGHT), BLACK)
    add_title(cover, "TA BUSINESS PRESENTATION", "FUTURE BELONGS HERE")
    draw = ImageDraw.Draw(cover)
    sub_font = load_font(42)
    info_font = load_font(32)
    draw.text((110, 345), "Company Name: TA Innovations", fill=WHITE, font=sub_font)
    draw.text((110, 400), "Instagram: @ta.innovations (update if needed)", fill=WHITE, font=info_font)
    place_image(cover, image_paths[0], 1020, 140, 760, 760)
    slides.append(cover)

    intro = make_slide(
        "INTRODUCTION",
        "Who We Are",
        [
            "TA Innovations is a modern technology and creative brand focused on smart, AI-driven business growth.",
            "We build digital-first products, campaigns, and brand systems for startups and ambitious businesses.",
            "Our visual identity combines bold simplicity with high-performance execution.",
        ],
    )
    place_image(intro, image_paths[1], 1120, 500, 700, 430)
    slides.append(intro)

    idea = make_slide(
        "BUSINESS IDEA",
        "What We Offer",
        [
            "Deliver end-to-end branding, digital marketing, and AI-powered business automation.",
            "Transform business visibility through strong design systems and high-impact campaign assets.",
            "Provide scalable services for social media, product presentation, and online sales growth.",
        ],
    )
    place_image(idea, image_paths[2], 1020, 480, 760, 460)
    slides.append(idea)

    pricing = Image.new("RGB", (WIDTH, HEIGHT), BLACK)
    add_title(pricing, "PRICING", "Flexible Packages")
    draw = ImageDraw.Draw(pricing)
    header_font = load_font(34)
    body_font = load_font(30)
    start_x = 120
    start_y = 360
    table_width = 1150
    row_height = 110
    columns = [420, 340, 390]
    rows = [
        ("Starter Package", "$299", "Brand kit + 5 social posts"),
        ("Growth Package", "$699", "Campaign set + 15 creative assets"),
        ("Premium Package", "$1,499", "Full monthly strategy + automation"),
    ]

    draw.rectangle((start_x, start_y, start_x + table_width, start_y + row_height), outline=PRIMARY, width=4)
    col_x = start_x
    for col in columns[:-1]:
        col_x += col
        draw.line((col_x, start_y, col_x, start_y + row_height * (len(rows) + 1)), fill=PRIMARY, width=3)

    draw.text((start_x + 20, start_y + 34), "Package", fill=PRIMARY, font=header_font)
    draw.text((start_x + 450, start_y + 34), "Price", fill=PRIMARY, font=header_font)
    draw.text((start_x + 790, start_y + 34), "Includes", fill=PRIMARY, font=header_font)

    for idx, row in enumerate(rows, start=1):
        y = start_y + row_height * idx
        draw.rectangle((start_x, y, start_x + table_width, y + row_height), outline=PRIMARY, width=2)
        draw.text((start_x + 20, y + 35), row[0], fill=WHITE, font=body_font)
        draw.text((start_x + 450, y + 35), row[1], fill=WHITE, font=body_font)
        draw.text((start_x + 790, y + 35), row[2], fill=WHITE, font=body_font)

    draw.text((120, 855), "Custom enterprise plan available on request.", fill=GRAY, font=body_font)
    place_image(pricing, image_paths[3], 1320, 360, 500, 500)
    slides.append(pricing)

    team = make_slide(
        "TEAM MEMBERS",
        "Leadership",
        [
            "Bisma Noor (Leader): strategic planning, client communication, project direction.",
            "Romaisa Rafiq: creative execution, campaign design, and content operations.",
            "A focused two-member core team delivering speed, consistency, and quality.",
        ],
    )
    place_image(team, image_paths[4], 1020, 480, 760, 460)
    slides.append(team)

    orders = Image.new("RGB", (WIDTH, HEIGHT), BLACK)
    add_title(orders, "ORDER PORTFOLIO", "Visual Work Samples")
    place_image(orders, image_paths[0], 90, 330, 540, 320)
    place_image(orders, image_paths[1], 690, 330, 540, 320)
    place_image(orders, image_paths[2], 1290, 330, 540, 320)
    place_image(orders, image_paths[3], 90, 700, 540, 320)
    place_image(orders, image_paths[4], 690, 700, 540, 320)
    place_image(orders, image_paths[5], 1290, 700, 540, 320)
    slides.append(orders)

    closing = make_slide(
        "THANK YOU",
        "Let's Build The Future Together",
        [
            "Ready to collaborate on branding, marketing, or business growth projects.",
            "Contact us to place your order and begin your custom project plan.",
            "TA Innovations - fast delivery, premium quality, clear communication.",
        ],
    )
    place_image(closing, image_paths[6], 980, 430, 820, 520)
    slides.append(closing)

    rgb_slides = [slide.convert("RGB") for slide in slides]
    rgb_slides[0].save(
        OUTPUT_PDF,
        save_all=True,
        append_images=rgb_slides[1:],
        resolution=100.0,
    )


if __name__ == "__main__":
    create_presentation()
