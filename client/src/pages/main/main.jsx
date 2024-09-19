import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/navbar";
import {Link, Outlet} from "react-router-dom"


const Main = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const user = Cookies.get("user");

    if (!user) {
      navigate("/sign-up");
    }
  }, [navigate]);

  return(
    <div className="main">
      <Navbar />
      <Outlet/>
    </div>
  )
}

export default Main;