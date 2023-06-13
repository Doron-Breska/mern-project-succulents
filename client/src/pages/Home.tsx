import React, { useEffect, useState } from "react";
import { FaRobot } from "react-icons/fa";

type Props = {};

function Home(props: Props) {
  return (
    <div className="home-page-container">
      <div className="home-page-text fadeInText">
        <h4>
          This is an app for succulent enthusiasts where you can share your own
          plants and experiences in growing them, and growing with them. You can
          also comment/favorite plants and use our Robi <FaRobot /> Robot AI. I
          could watter my 40+ plants with the tears I cried while building this
          app. So, I hope you'll enjoy it!
        </h4>
      </div>
      <div className="home-page-gif"></div>
    </div>
  );
}

export default Home;
