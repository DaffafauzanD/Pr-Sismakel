export async function checkRole(req, requiredRole) {
  const role = req.headers.get('x-user-role');
  if (role !== requiredRole) {
    return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
  }
}