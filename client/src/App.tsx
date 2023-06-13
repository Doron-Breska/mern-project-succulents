import React, { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { AuthContextProvider } from "./contexts/AuthContext";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import SideBar from "./components/SideBar";
import ErrorPage from "./pages/ErrorPage";
import Succulents from "./pages/Succulents";
import { ModalContext } from "./contexts/ModalContext";
import SucculentCardModal from "./components/SucculentCardModal";

function App() {
  const { isModalOpen, closeModal, modalContent, modalContent2 } =
    useContext(ModalContext);

  return (
    <div className="app-container" style={{ width: "100%" }}>
      <AuthContextProvider>
        <BrowserRouter>
          <SideBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<ErrorPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/succulents" element={<Succulents />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
          {isModalOpen && (
            <SucculentCardModal
              isOpen={isModalOpen}
              closeModal={closeModal}
              modalContent={modalContent}
              modalContent2={modalContent2}
              children={undefined}
            ></SucculentCardModal>
          )}
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
