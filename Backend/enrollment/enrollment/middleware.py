import os
from django.http import HttpResponse
from django.conf import settings

class ReactMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if response.status_code == 404 and not request.path.startswith('/api'):
            try:
                with open(os.path.join(settings.BASE_DIR, '../Frontend/build/index.html')) as f:
                    return HttpResponse(f.read(), content_type='text/html')
            except FileNotFoundError:
                pass

        return response
