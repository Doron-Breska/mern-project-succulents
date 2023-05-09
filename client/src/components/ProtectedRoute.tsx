import React, { ReactNode, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";


type Props = {
  children: ReactNode;
}

const ProtectedRoute = (props: Props) => {
    const { user } = useContext(AuthContext);
  return (
    <>{user !== null  ? props.children : <h1>This page is restricted.</h1>}</>
  )
}

export default ProtectedRoute