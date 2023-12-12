//eslint-disable-next-line
import React, { useEffect, useState } from "react";
import { FaLink, FaRobot } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io5";
import { FaGithubSquare } from "react-icons/fa";
import { IoBrowsersOutline } from "react-icons/io5";
import { IoBrowsersSharp } from "react-icons/io5";
import { IoBrowsers } from "react-icons/io5";
import { FaExternalLinkAlt } from "react-icons/fa";
import { GoLinkExternal } from "react-icons/go";
import { IoIosLink } from "react-icons/io";

type Props = {};

function Home(props: Props) {
  return (
    <div>
      <h4 className="fadeInText registerOrHome-header">
        Welcome to my succulent app, designed for plant lovers to share and
        discover. Here, you can showcase your plants, exchange growing tips, and
        favorite others' green gems.
        <br /> Plus, meet Robi <FaRobot />, our AI assistant, guiding you on
        nurturing each species.
        <br /> Enjoy your green journey!
      </h4>
      <h4 className="fadeInText Home-second-header">
        DORON BRESKA
        <br />
        WEB DEVELOPER
        <br />
      </h4>
      <div className="fadeInText" style={{ marginBottom: "2rem" }}>
        <a
          className="home-icon"
          href="https://www.linkedin.com/in/doron-breska"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IoLogoLinkedin />
        </a>
        <a
          className="home-icon"
          href="https://github.com/Doron-Breska"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithubSquare />
        </a>
        <a
          className="home-icon"
          href="https://doron-breska-portfolio.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IoIosLink />
        </a>
      </div>

      <div className="home-page-gif"></div>
    </div>
  );
}

export default Home;
