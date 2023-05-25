import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";

interface User {
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

interface Owner {
  _id: string;
  email: string;
  username: string;
  avatar: string;
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

interface NewModalElementProps {
  user: User | null;
  succulent: Succulent;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  handleCommentSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleCommentChange: (e: ChangeEvent<HTMLInputElement>) => void;
  deleteCommentModal: (succulentId: string, commentId: string) => Promise<void>;
  textInput: string;
  getAllComments?: any;
}

const NewModalElement = ({
  user,
  succulent,
  comments,
  setComments,
  handleCommentSubmit,
  handleCommentChange,
  deleteCommentModal,
  textInput,
  getAllComments,
}: NewModalElementProps) => {
  const [modalComments, setModalComments] = useState<Comment[]>([]);
  const token = localStorage.getItem("token");

  const getModalComments = async (succulentId: string) => {
    // console.log('%csucculent ID',"color:blue",  succulentId)
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `http://localhost:5001/api/succulents/allcomments/${succulentId}`,
        requestOptions
      );
      //  console.log("%call comments :>> ", "color:green",response);
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const result = await response.json();
      // console.log("%call comments :>> ", "color:green",result);
      const updatedComments = result.succulent.Comments; // this is the new succulent back from the server without the comment we deleted
      console.log("%call comments :>> ", "color:green", updatedComments);

      setModalComments(updatedComments);

      // openModal();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  useEffect(() => {
    console.log("%cuseEffectmodal", "color:lightblue", succulent._id);
    getModalComments(succulent._id);
  }, [comments.length, modalComments.length]);
  return (
    <>
      <h3>Comments</h3>
      {user ? (
        <>
          {console.log('JSX modal "comments">>> :', modalComments)}
          {modalComments.length > 0 ? (
            modalComments.map((comment) => (
              <div key={comment._id} className="single-comment-modal">
                <img
                  src={comment.authorImage}
                  alt="profile-img-author"
                  className="comment-user-pic"
                ></img>
                <span>
                  {comment.authorName}: {comment.text}
                </span>
                <p>
                  Posted on: {new Date(comment.createdAt).toLocaleDateString()}{" "}
                  {new Date(comment.createdAt).toLocaleTimeString()}
                </p>
                {user && comment.authorId === user._id && (
                  <MdDeleteForever
                    className="delete-icon-comment"
                    onClick={() => {
                      deleteCommentModal(succulent._id, comment._id);
                      // getModalComments(succulent._id)
                    }}
                  />
                )}
              </div>
            ))
          ) : (
            <p>No comments found for this post</p>
          )}
          <form onSubmit={handleCommentSubmit}>
            <input
              type="text"
              name="comment"
              placeholder="write something"
              onChange={handleCommentChange}
              value={textInput}
            />
            <br />
            <button type="submit">Submit</button>
          </form>
        </>
      ) : (
        <p>You have to log in to comment</p>
      )}
    </>
  );
};
export default NewModalElement;
