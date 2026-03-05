import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute — guards routes by JWT + role.
 *
 * Props:
 *   role      – required role string ('student' | 'company' | 'admin')
 *   children  – the component to render if authorized
 *
 * Checks:
 *   1. JWT token exists in localStorage
 *   2. Token not expired (basic decode check)
 *   3. User role matches the required role
 */
export default function ProtectedRoute({ role, children }) {
    const token = localStorage.getItem('pms_token');
    const user = JSON.parse(localStorage.getItem('pms_user') || 'null');

    // No token or no user → login
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Check token expiry (decode JWT payload)
    try {
        // JWT uses base64url encoding — convert to standard base64 before atob
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
        const payload = JSON.parse(atob(padded));
        if (payload.exp * 1000 < Date.now()) {
            // Token expired → clear and redirect
            localStorage.removeItem('pms_token');
            localStorage.removeItem('pms_user');
            return <Navigate to="/login" replace />;
        }
    } catch {
        // If decode fails, don't block — just rely on user object check
        // The backend will reject invalid tokens on API calls
    }

    // Role mismatch → login
    if (role && user.role !== role) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
