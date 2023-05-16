import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

type Props = {}

const ErrorPage = (props: Props) => {

 const navigate = useNavigate();
  console.log("navigate:", navigate);
  const [redirect, setRedirect] = useState(false);
  const [countdown, setCountdown] = useState(5);

    useEffect(() => {
    async function test() {
      timeoutFunction(1000, 4);
      timeoutFunction(2000, 3);
      timeoutFunction(3000, 2);
      timeoutFunction(4000, 1);

      setTimeout(() => {
        setRedirect(true);
        // navigate(-1);
      }, 5000);
    }
    test();
  }, []);

  function timeoutFunction(count: number, timeout: number) {
    setTimeout(() => {
      setCountdown(timeout);
    }, count);
  }

    
    
  return (
        <div>
      {redirect ? <Navigate to={"/"} replace={true} /> : null}
      <h1>Error404 Page not found :/</h1>
      <p>Redirecting in {countdown} seconds</p>
      <button onClick={() => navigate(-1)}>Go back...</button>
      <button onClick={() => navigate("/")}>Go home...</button>
    </div>

  )
}

export default ErrorPage