from django.http import HttpResponsePermanentRedirect, HttpResponseRedirect
from django.utils.deprecation import MiddlewareMixin
from apps.redirects.models import Redirect

class RedirectMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if response.status_code == 404:
            path = request.path
            try:
                redirect_obj = Redirect.objects.get(old_path=path, is_active=True)
                if redirect_obj.status_code == 301:
                    return HttpResponsePermanentRedirect(redirect_obj.new_path)
                else:
                    return HttpResponseRedirect(redirect_obj.new_path)
            except Redirect.DoesNotExist:
                pass
            except Redirect.MultipleObjectsReturned:
                # Fallback to the first active one if multiple somehow exist
                redirect_obj = Redirect.objects.filter(old_path=path, is_active=True).first()
                if redirect_obj:
                    if redirect_obj.status_code == 301:
                        return HttpResponsePermanentRedirect(redirect_obj.new_path)
                    else:
                        return HttpResponseRedirect(redirect_obj.new_path)
        return response
