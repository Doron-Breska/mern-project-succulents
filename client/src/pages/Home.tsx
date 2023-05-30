import React, { useEffect, useState } from "react";

type Props = {};

function Home(props: Props) {
  return (
    <div className="home-page-container">
      <div className="home-page-text fadeInText">
        This is an app for succulent enthusiasts where you can share your own
        plants and experiences in growing them, and growing with them. You can
        also comment on and favorite plants. I could watter my 40+ plants with
        the tears I cried while building this app. So, I hope you'll enjoy it!
      </div>
      <div className="home-page-gif"></div>
    </div>
  );
}

export default Home;
