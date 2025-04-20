
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminPanelPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new admin dashboard
    navigate('/admin/dashboard');
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center">
      <p className="text-gray-600">Redirecting to Admin Dashboard...</p>
    </div>
  );
}
