import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/Sidebar';
import { Eye, EyeOff } from 'lucide-react'; // For password viewer icon

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
    job: ''
  });

  const [showPassword, setShowPassword] = useState(false); // 👈 Password toggle state
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      if (data) {
        console.log("Fetched data:", data);
        setUserData(data);
      } else {
        console.error("Fetch error:", error);
      }
    };
    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updates = {
      description: userData.description,
    };
  
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select();
  
    if (error) {
      console.error("Update failed:", error);
      alert('Failed to save description');
    } else {
      console.log("Description updated:", data);
      alert('Description updated successfully!');
    }
  };
    

  return (
    <div className="d-flex">
      {userData.id ? (
        <Sidebar userData={userData} />
      ) : (
        <div>Loading sidebar...</div>
      )}

      <div className="p-4 w-100 bg-light">
        <h3 className="mb-4">User Details</h3>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col">
              <label>Firstname</label>
              <input type="text" className="form-control" name="first_name" value={userData.first_name} onChange={handleChange} disabled />
            </div>
            <div className="col">
              <label>Lastname</label>
              <input type="text" className="form-control" name="last_name" value={userData.last_name} onChange={handleChange} disabled />
            </div>
            <div className="col">
              <label>Role</label>
              <input type="text" className="form-control" name="role" value={userData.role} disabled />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label>Email</label>
              <input type="email" className="form-control" name="email" value={userData.email} onChange={handleChange} disabled />
            </div>
            <div className="col position-relative">
            <label>Password</label>
            <div className="position-relative">
                <input
                type={showPassword ? 'text' : 'password'}
                className="form-control pe-5" // Add pe-5 for right-side padding
                name="password"
                value={userData.password}
                onChange={handleChange}
                disabled
                />
                <span
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '12px',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#6c757d',
                }}
                onClick={() => setShowPassword(!showPassword)}
                >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
            </div>
            </div>
            <div className="col">
              <label>Country</label>
              <input type="text" className="form-control" name="country" value={userData.country} onChange={handleChange} disabled />
            </div>
          </div>

          <div className="mb-3">
            <label>Description</label>
            <textarea
              className="form-control"
              name="description"
              rows="4"
              value={userData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
