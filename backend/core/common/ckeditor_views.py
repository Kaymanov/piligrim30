"""
Custom CKEditor 5 image upload view.

Wraps the default django_ckeditor_5 upload flow but converts every uploaded
image to WebP and downscales it to a maximum width before saving. This keeps
in-article images small and fast, matching the cover-image behaviour.
"""

from django.conf import settings
from django.http import JsonResponse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.http import require_POST

from django_ckeditor_5.exceptions import NoImageException
from django_ckeditor_5.forms import UploadFileForm
from django_ckeditor_5.permissions import check_upload_permission
from django_ckeditor_5.storage_utils import handle_uploaded_file, image_verify

from core.common.utils import optimize_image_to_webp


@require_POST
@check_upload_permission
def upload_file_webp(request):
    form = UploadFileForm(request.POST, request.FILES)
    allow_all_file_types = getattr(settings, "CKEDITOR_5_ALLOW_ALL_FILE_TYPES", False)

    if not allow_all_file_types:
        try:
            image_verify(request.FILES["upload"])
        except NoImageException as ex:
            return JsonResponse({"error": {"message": f"{ex}"}}, status=400)

    if form.is_valid():
        upload = request.FILES["upload"]
        # Verify reset the file pointer; ensure we read from the start
        try:
            upload.seek(0)
        except Exception:
            pass
        # Convert to WebP + resize to max width (skips non-images gracefully)
        optimized = optimize_image_to_webp(upload)
        url = handle_uploaded_file(optimized)
        return JsonResponse({"url": url})

    if form.errors.get("upload"):
        return JsonResponse(
            {"error": {"message": form.errors["upload"][0]}},
            status=400,
        )

    return JsonResponse({"error": {"message": _("Invalid form data")}}, status=400)
