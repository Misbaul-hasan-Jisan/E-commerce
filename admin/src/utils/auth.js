export const checkAdminStatus = async () => {
  const token = localStorage.getItem('auth-token');
  if (!token) return false;

  try {
    const response = await fetch('https://e-commerce-8j0j.onrender.com/admin/verify', {
      headers: {
        'auth-token': token,
      },
    });

    const data = await response.json();
    return response.ok && data?.isAdmin;
  } catch (error) {
    return false;
  }
};
