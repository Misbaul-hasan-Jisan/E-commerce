const BASE_URL = 'https://e-commerce-8j0j.onrender.com';

export const checkAdminStatus = async () => {
  const token = localStorage.getItem('auth-token');
  if (!token) return false;

  try {
    const response = await fetch(`${BASE_URL}/admin/verify`, {
      headers: { 'auth-token': token },
    });

    const data = await response.json();
    return response.ok && data?.isAdmin;
  } catch {
    return false;
  }
};
