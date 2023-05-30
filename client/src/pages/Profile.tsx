import React from "react";
import ProfileHistory from "../components/ProfileHistory";
import ProfileUpdate from "../components/ProfileUpdate";

type Props = {};

const Profile = (props: Props) => {
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
