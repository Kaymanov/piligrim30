"""
Custom middleware for handling API requests.
"""
from django.http import HttpResponsePermanentRedirect


class ApiSlashMiddleware:
    """
    Append trailing slash to API URLs for any HTTP method (including POST).
    Django's default APPEND_SLASH only redirects GET/HEAD requests.
    For API consumers that don't add trailing slashes, we rewrite the path internally.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # If path starts with /api/ and doesn't end with slash, append it internally
        if request.path.startswith('/api/') and not request.path.endswith('/'):
            # Modify path_info so Django's URL resolver finds the route
            request.path_info = request.path_info + '/'
            request.path = request.path + '/'
        return self.get_response(request)
