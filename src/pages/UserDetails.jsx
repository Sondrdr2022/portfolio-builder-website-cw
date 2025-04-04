import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/Sidebar';
import { Eye, EyeOff } from 'lucide-react';

export default function UserDetails() {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: '',
    country: '',
    description: '',
    image: '',
    job: '',
    rate: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      if (data) {
        setUserData(data);
      } else {
        console.error("Fetch error:", error);
      }
    };
    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updates = {
      description: userData.description,
      rate: parseFloat(userData.rate) || 0
    };

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      alert('Failed to save changes');
      console.error("Update error:", error);
    } else {
      alert('Changes updated successfully!');
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row" style={{ minHeight: '100vh' }}>
      <Sidebar userData={userData} />

      <main className="flex-grow-1 p-4 bg-light" style={{
         marginLeft: window.innerWidth >= 768 ? '250px' : '0px',
         width: '100%',
         transition: 'margin-left 0.3s ease',
      }} >
        <h3 className="mb-4">User Details</h3>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Firstname</label>
              <input
                type="text"
                className="form-control"
                name="first_name"
                value={userData.first_name}
                disabled
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Lastname</label>
              <input
                type="text"
                className="form-control"
                name="last_name"
                value={userData.last_name}
                disabled
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Role</label>
              <input
                type="text"
                className="form-control"
                name="role"
                value={userData.role}
                disabled
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={userData.email}
                disabled
              />
            </div>
            <div className="col-md-4 position-relative">
              <label className="form-label">Password</label>
              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control pe-5"
                  name="password"
                  value={userData.password}
                  disabled
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-control"
                name="country"
                value={userData.country}
                disabled
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Rate (USD/hour)</label>
              <input
                type="number"
                className="form-control"
                name="rate"
                value={userData.rate || ''}
                onChange={handleChange}
                placeholder="e.g. 50"
              />
            </div>

            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                rows="4"
                value={userData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="mt-4">
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </main>
    </div>
  );
}
