import {Link, useNavigate} from "react-router-dom"
import {useForm} from "react-hook-form";
import { useState,  } from "react";
import Cookies from "js-cookie";



const SignIn = () => {

  const { register, handleSubmit} = useForm();

  const [login, setLogin] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try{
      const response = await fetch("http://localhost:5000/api/users/login",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        setLogin('Sign In successful');
        navigate("/");
        Cookies.set(
          "user",
          JSON.stringify({
            userId: String(result.userId),
            username: result.username,
          }),
          { expires: 7 }
        );
        console.log(result);
      } else {
        setLogin('Invalid email or password');
        console.log('Login failed:', result.message);
      }
    } catch (error) {
      setLogin('An error occurred during login');
      console.error('Error during login:', error.message);
    }
  }

  return(
    <div className="sign-in">
      <form onSubmit={handleSubmit(onSubmit)} className="sign-in-form">
        <h2>Email:</h2>
        <input placeholder="Email" type="email" {...register("email")} />
        <h2>Password:</h2>
        <input placeholder="Password" type="password" {...register("password")} />
        <p  className="sign-in-err">
        {login}
        </p>
        <button type="submit" className="submit-sign-in">Sign In</button>
        <p className="sign-up-p">
          Don't have an account?
          <Link to="/sign-up" className="sing-up-button">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;