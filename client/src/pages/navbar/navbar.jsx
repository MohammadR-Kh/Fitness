import {Link, useNavigate} from "react-router-dom"
import Cookies from 'js-cookie'

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("user");
    navigate("/sign-in");
  };

  return(
    <div className="navbar">
      <Link to="/">
      </Link>
      <div className="nav-container">
        <div className="nav-links">
          <Link to="/" className="nav-item">Dashboard</Link>
          <Link to="/workouts" className="nav-item">Workouts</Link>
          <Link to="/diet" className="nav-item">Diet</Link>
          <Link to="/goals" className="nav-item">Goals</Link>
          <Link to="/profile" className="nav-item">Profile</Link>
          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;