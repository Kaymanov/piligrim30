from rest_framework.throttling import SimpleRateThrottle


class ChatRateThrottle(SimpleRateThrottle):
    """
    Rate limiting для чата: 10 запросов в минуту на сессию/IP.
    """
    scope = 'chat'

    def get_cache_key(self, request, view):
        # Use session key if available, otherwise fall back to IP
        session_key = request.session.session_key
        if session_key:
            ident = session_key
        else:
            ident = self.get_ident(request)
        return self.cache_format % {'scope': self.scope, 'ident': ident}
