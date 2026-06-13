import os
from io import BytesIO
from PIL import Image, ImageOps
from django.core.files.uploadedfile import InMemoryUploadedFile

# Default maximum width for uploaded images (px). Wider images are downscaled
# proportionally. Keeps file sizes small without visible quality loss on web.
DEFAULT_MAX_WIDTH = 1600


def optimize_image_to_webp(image_field, quality=80, max_width=DEFAULT_MAX_WIDTH):
    """
    Converts an uploaded image to WebP and downscales it to `max_width`.

    - Skips files that are already .webp (but still applies resize if needed).
    - Preserves alpha channel for transparent images.
    - Honours EXIF orientation.
    - On any failure, returns the original file unchanged.
    """
    if not image_field:
        return image_field

    already_webp = image_field.name.lower().endswith(".webp")

    try:
        img = Image.open(image_field)

        # Respect EXIF orientation (phones/cameras)
        img = ImageOps.exif_transpose(img)

        # Resize if wider than max_width (proportional)
        resized = False
        if max_width and img.width > max_width:
            ratio = max_width / float(img.width)
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.LANCZOS)
            resized = True

        # If it's already webp and didn't need resizing, leave it as-is
        if already_webp and not resized:
            image_field.seek(0)
            return image_field

        has_alpha = img.mode in ("RGBA", "LA") or (
            img.mode == "P" and "transparency" in img.info
        )
        if has_alpha:
            img = img.convert("RGBA")
        elif img.mode != "RGB":
            img = img.convert("RGB")

        output = BytesIO()
        img.save(output, format="WEBP", quality=quality, method=6)
        output.seek(0)

        file_name = os.path.splitext(os.path.basename(image_field.name))[0] + ".webp"

        return InMemoryUploadedFile(
            output,
            "ImageField",
            file_name,
            "image/webp",
            output.tell(),
            None,
        )
    except Exception as e:
        import logging

        logging.error(f"Image optimization failed: {e}")
        try:
            image_field.seek(0)
        except Exception:
            pass
        return image_field
