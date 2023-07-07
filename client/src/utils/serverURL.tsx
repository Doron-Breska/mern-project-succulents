const serverURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : "https://mern-project-succulents-server.vercel.app";

export { serverURL };
