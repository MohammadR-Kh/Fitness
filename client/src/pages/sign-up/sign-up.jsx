import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup"
import { useState } from "react";
import {useNavigate, Link} from "react-router-dom";
import Cookies from "js-cookie";


const SignUp = () => {

  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const schema = yup.object().shape({
    fullname: yup.string().required("Name is Required!"),
    email: yup.string().email("Email is Incorrect!").required("Email is Required!"),
    password: yup.string().min(6, "Password Must be at Least 6 Charecters!").max(30, "Password Must be less than 30 charecters!").matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$.-]).*$/,
      "Password Must Contain at Least One Uppercase Letter, One Number, and One Special Character (@, $, -, or .)!"
    ).required("Password is Required!"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null],"Passwords Don't Match!"),
    username: yup.string().required("Username is Required!")
  })

  const {register, handleSubmit, formState:{errors}} = useForm({resolver: yupResolver(schema)});

  const onSubmit = async (data) => {
    try{
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
  
      if (response.ok) {
        setServerError("");
        Cookies.set(
          "user",
          JSON.stringify({
            userId: String(result.userId),
            username: result.username,
          }),
          { expires: 7 }
        );
        navigate("/");

      } else {
        console.error('Error:', result.msg);
        setServerError(result.msg);
        
      }
    }catch (error){
      console.log('Error:', error);
      setServerError("Something went wrong. Please try again later.");
    }
  }

  return(
    <div className="sign-up">
      <form onSubmit={handleSubmit(onSubmit)} className="sign-up-form">
        <h2>Full Name:</h2>
        <input placeholder="Full Name" type="text" {...register("fullname")} />
        <p className="sign-up-err">{errors.fullname?.message}</p>
        <h2>Username:</h2>
        <input placeholder="Username" type="text" {...register("username")} />
        <p className="sign-up-err">{errors.username?.message}</p>
        <h2>Email:</h2>
        <input placeholder="Email" type="email" {...register("email")} />
        <p className="sign-up-err">{errors.email?.message}</p>
        <h2>Password:</h2>
        <input placeholder="Password" type="password" {...register("password")} />
        <p className="sign-up-err">{errors.password?.message}</p>
        <h2>Confirm Password:</h2>
        <input placeholder="Confirm Password" type="password" {...register("confirmPassword")} />
        <p className="sign-up-err">{errors.confirmPassword?.message}</p>
        <button type="submit">Sign Up</button>
        {serverError && <p className="sign-up-err">{serverError}</p>}
        <p className="sign-in-p">
          Already have an account?
          <Link to="/sign-in" className="sing-in-button">Sign In</Link>
        </p>
      </form>
    </div>
  )
};

export default SignUp;