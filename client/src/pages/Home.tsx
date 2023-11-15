//eslint-disable-next-line
import React, { useEffect, useState } from "react";
import { FaRobot } from "react-icons/fa";

type Props = {};

function Home(props: Props) {
  return (
    <div className="home-page-container">
      <div className="home-page-text fadeInText">
        <h4 style={{ fontSize: "clamp(1.1rem, 2.1vw, 1.7rem)" }}>
          Welcome to my succulent app, designed for plant lovers to share and
          discover. Here, you can showcase your plants, exchange growing tips,
          and favorite others' green gems.
          <br /> Plus, meet Robi <FaRobot />, our AI assistant, guiding you on
          nurturing each species.
          <br /> Enjoy your green journey!
        </h4>
      </div>
      <div className="home-page-gif"></div>
    </div>
  );
}

export default Home;
