import React, { useState, useContext, useEffect } from "react";
import SucculentCard from "./SucculetCard";
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

const ProfileHistory = (props: Props) => {
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
      // console.log(result);
      setSucculents(result);
    } catch (error) {
      console.error("Failed to fetch succulents:", error);
    }
  };

  useEffect(() => {
    fetchSucculents();
  }, []);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const deleteComment = async (succulentId: string, commentId: string) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `http://localhost:5001/api/succulents/delete/${succulentId}/comments/${commentId}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      // manually remove the deleted comment from the local state.
      setSucculents(
        succulents.map((succulent) => {
          if (succulent._id === succulentId) {
            return {
              ...succulent,
              Comments: succulent.Comments.filter(
                (comment) => comment._id !== commentId
              ),
            };
          }
          return succulent;
        })
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const dislikeSucculent = async (succulentId: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
    };

    try {
      const response = await fetch(
        `http://localhost:5001/api/succulents/likes/${succulentId}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const result = await response.json(); // If your API returns updated succulent data, parse it as JSON
      console.log("response:", result);

      // Update the state
      setSucculents(
        succulents.map((succulent) => {
          if (succulent._id === succulentId) {
            // replace the entire succulent object with the one from the server
            return result.succulent;
          }
          return succulent;
        })
      );
    } catch (error) {
      console.log("error", error);
    }
  };

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
    <div className="inner-component">
      <h1 className="profile-page-header">
        Posts &#8674; Comments &#8674; Likes
      </h1>
      <div className="history-profile-container">
        <div className="profile-succulents-container">
          {succulents
            .filter((succulent) => succulent.owner._id === user?._id)
            .map((succulent) => (
              <SucculentCard
                key={succulent._id}
                succulent={succulent}
                deleteSucculent={deleteSucculent}
                setSucculents={setSucculents}
                // species={succulent.species}
              />
            ))}
        </div>
        <hr />
        <div className="profile-comments-container">
          {userComments.length === 0 ? (
            <p>
              You did not comment on any succulent, Go and hit the keyboard !
            </p>
          ) : (
            userComments.flatMap((succulent) =>
              succulent.Comments.filter(
                (comment) => comment.authorId.toString() === userId
              ).map((comment) => (
                <div
                  key={comment._id}
                  className="comment-card"
                  onClick={() => deleteComment(succulent._id, comment._id)}
                  style={{ width: "200px" }}
                >
                  <div className="succulent-card">
                    <img
                      src={succulent.img}
                      alt={succulent.species}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <div className="comment-details">
                    <p>
                      Comment:
                      <br />
                      {comment.text}
                    </p>
                    <p>{new Date(comment.createdAt).toLocaleString()}</p>
                    {/* <button
                      onClick={() => deleteComment(succulent._id, comment._id)}
                    >
                      Delete Comment
                    </button> */}
                  </div>
                </div>
              ))
            )
          )}
        </div>
        <hr />
        <div className="profile-likes-container">
          {succulents.filter(
            (succulent) => userId && succulent.likes.includes(userId)
          ).length === 0 ? (
            <p>You did not like anything yet, go an hit the like button !</p>
          ) : (
            succulents
              .filter((succulent) => userId && succulent.likes.includes(userId))
              .map((succulent) => (
                <div
                  key={succulent._id}
                  className="like-card"
                  style={{ width: "150px", height: "150px" }}
                  onClick={() => dislikeSucculent(succulent._id)}
                >
                  <img
                    src={succulent.img}
                    alt={succulent.species}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHistory;
