import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin, handleRegister } from "../AuthService"



function SimpleRegistrationForm({ isLogin = false }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage,setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setErrorMessage(" ");
  }, [username,password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
   if(isLogin){
    try{
      await handleLogin(username,password)
      navigate("/");
    }catch(error){
      console.error('error logging in:',error);
      setErrorMessage("Invalid username or password");
    }
   }else{
    try{
      await handleRegister(username,password);
      navigate('/login');
    }catch(error){
      console.error('error registering:',error);
      setErrorMessage("Registeration failed");
    }
   }
    
  };
  
  return (
  <div className="flex justify-center items-center h-screen">
    <Card shadow={true}>
      <Typography variant="h4" color="blue-gray" className="text-center mt-4">
        {isLogin ? "Log IN" : "Sign Up"}
      </Typography>
      <Typography color="gray" className="mt-1 font-normal text-center">
        Nice to meet you! Enter your details to{" "}
        {isLogin ? "Log In" : "Register"}.
      </Typography>
      <form
        className="mt-8 mb-2 w-96 p-8 max-w-screen-lg sm:w-96 h-full"
        onSubmit={handleSubmit}
      >
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3 text-center">
            Username
          </Typography>
          <Input
            size="lg"
            placeholder="name@mail.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />

          <Typography variant="h6" color="blue-gray" className="-mb-3 text-center">
            Password
          </Typography>
          <Input
            type="password"
            size="lg"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          {errorMessage && (
              <Typography
                color="red"
                variant="small"
                className="text-center mt-2"
              >
                {errorMessage}
              </Typography>
            )}
        </div>

        {!isLogin && (
          <Checkbox color="blue"
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center font-normal"
              >
                I agree the
                <a
                  href="#"
                  className="font-medium transition-colors hover:text-gray-900"
                >
                  &nbsp;Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
        )}

        <Button color="blue" type="submit" className="mt-6" fullWidth>
          {isLogin ? "Sign In" : "Sign Up"}
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <a href="/register" className="font-medium text-blue-700">
                Sign Up
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a href="/login" className="font-medium text-blue-700">
                Sign In
              </a>
            </>
          )}
        </Typography>
      </form>
    </Card>
  </div>
  );
}

export default SimpleRegistrationForm;
