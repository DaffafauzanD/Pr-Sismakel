export function hasPermission(req, requiredPermission) {
    const permissions = JSON.parse(req.headers.get('x-user-permissions') || '[]');
    return permissions.includes(requiredPermission);
}