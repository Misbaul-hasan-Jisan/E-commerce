export const checkAdminStatus = async () => {
  const token = localStorage.getItem('auth-token');
  if (!token) return false;

  try {
    const response = await fetch('http://localhost:3000/admin/verify', {
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
