import React, { useContext } from "react";
import ProfileHistory from "../components/ProfileHistory";
import ProfileUpdate from "../components/ProfileUpdate";
import { AuthContext } from "../contexts/AuthContext";

type Props = {};

const Profile = (props: Props) => {
  //eslint-disable-next-line
  const { loading, setLoading } = useContext(AuthContext);
  return (
    <div className="parent-div">
      <div className="page-container">
        <ProfileUpdate />
        <hr />
        <ProfileHistory />
      </div>
    </div>
  );
};

export default Profile;
