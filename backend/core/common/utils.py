import os
from io import BytesIO
from PIL import Image
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import InMemoryUploadedFile

def optimize_image_to_webp(image_field, quality=80):
    """
    Converts an uploaded image to WebP format.
    """
    if not image_field:
        return image_field

    # Check if already webp
    if image_field.name.lower().endswith('.webp'):
        return image_field

    try:
        img = Image.open(image_field)
        
        # Convert to RGB if RGBA/P to avoid issues with WebP conversion
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            # WebP supports alpha, so we can keep RGBA
            pass
        elif img.mode != 'RGB':
            img = img.convert('RGB')

        output = BytesIO()
        img.save(output, format='WEBP', quality=quality)
        output.seek(0)
        
        file_name = os.path.splitext(image_field.name)[0] + '.webp'
        
        # Create a new InMemoryUploadedFile
        return InMemoryUploadedFile(
            output,
            'ImageField',
            file_name,
            'image/webp',
            output.tell(),
            None
        )
    except Exception as e:
        # Fallback to original image if optimization fails
        import logging
        logging.error(f"Image optimization failed: {e}")
        return image_field
