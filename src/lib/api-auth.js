export function getAccessTokenFromRequest(req) {
    let token = null;
    const cookie = req.headers.get('cookie');
    if (cookie) {
      const match = cookie.match(/accessToken=([^;]+)/);
      if (match) token = match[1];
    }
    if (!token) {
      const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    return token;
  }