import React, { useState, useContext, useEffect } from "react";
import SucculentCard from "../components/SucculetCard";
import { AuthContext } from "../contexts/AuthContext";
import { ModalContext } from "../contexts/ModalContext";

type Props = {};

interface Owner {
  _id: string;
  email: string;
  username: string;
  avatar: string;
}

interface Comment {
  authorId: string;
  authorName: string;
  authorImage: string;
  text: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface Succulent {
  _id: string;
  species: string;
  owner: Owner;
  img: string;
  description: string;
  city: string;
  likes: string[];
  Comments: Comment[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Succulents = (props: Props) => {
  const { user } = useContext(AuthContext);
  const { isModalOpen, closeModal, modalContent, setModalContent } =
    useContext(ModalContext);
  const token = localStorage.getItem("token");
  const [succulents, setSucculents] = useState<Succulent[]>([]);
  const userId = user?._id.toString();
  const userComments = succulents.filter((succulent) =>
    succulent.Comments.some((comment) => comment.authorId.toString() === userId)
  );

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const fetchSucculents = async () => {
    const requestOptions = {
      method: "GET",
    };

    try {
      const response = await fetch(
        "http://localhost:5001/api/succulents/all",
        requestOptions
      );
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const result = await response.json();
      console.log(result);
      setSucculents(result);
    } catch (error) {
      console.error("Failed to fetch succulents:", error);
    }
  };

  useEffect(() => {
    fetchSucculents();
  }, []);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const deleteSucculent = async (id: string) => {
    // check if user exists
    if (!user) {
      setModalContent("Members only feature");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5001/api/succulents/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      // Handle the response data here
      console.log(data.msg); // Succulent successfully deleted!
      setSucculents(succulents.filter((succulent) => succulent._id !== id));
      setModalContent(null); // Clear the modal content
    } catch (error) {
      console.error("Failed to delete succulent:", error);
    }
  };

  return (
    <div className="succulents-page-container">
      {succulents.map((succulent) => (
        <SucculentCard
          key={succulent._id}
          succulent={succulent}
          deleteSucculent={deleteSucculent}
          setSucculents={setSucculents}
        />
      ))}
    </div>
  );
};

export default Succulents;
