import { AuthContext } from "../contexts/AuthContext";
import SucculentCardModal from "../components/SucculentCardModal";
import React, {
  ChangeEvent,
  FormEvent,
  useState,
  useContext,
  useReducer,
} from "react";
import { MdDeleteForever } from "react-icons/md";
import { FaRobot } from "react-icons/fa";
import { MdComment } from "react-icons/md";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { ModalContext } from "../contexts/ModalContext";
import NewModalElement from "../components/NewModalElement";

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
type Img = string | File;

interface FormData {
  species: string;
  description: string;
  city: string;
  img: Img;
}

interface SucculentCardProps {
  succulent: Succulent;
  deleteSucculent: (succulentId: string) => void;
  setSucculents: React.Dispatch<React.SetStateAction<Succulent[]>>;
}

const SucculentCard = ({
  succulent,
  deleteSucculent,
  setSucculents,
}: SucculentCardProps) => {
  const { user } = useContext(AuthContext);
  const {
    isModalOpen,
    closeModal,
    openModal,
    modalContent,
    setModalContent,
    setModalContent2,
  } = useContext(ModalContext);
  const token = localStorage.getItem("token");
  const userId = user?._id.toString();
  const [likes, setLikes] = useState(succulent.likes);
  const [isFlipped, setIsFlipped] = useState(false);
  const [comments, setComments] = useState(succulent.Comments);
  const [textInput, setTextInput] = useState("");
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [editFormData, setEditFormData] = useState<FormData>({
    species: "",
    description: "",
    city: "",
    img: "",
  });
  const fileInput = React.useRef<HTMLInputElement>(null);

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData,
      img: e.target.files ? e.target.files[0] : "",
    });
  };

  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitData = new FormData();
    if (editFormData.species !== "") {
      submitData.append("species", editFormData.species);
    }
    if (editFormData.description !== "") {
      submitData.append("description", editFormData.description);
    }
    if (editFormData.city !== "") {
      submitData.append("city", editFormData.city);
    }
    if (editFormData.img !== "") {
      submitData.append("img", editFormData.img);
    }

    const requestOptions = {
      method: "PUT",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
      body: submitData,
    };
    try {
      const response = await fetch(
        `http://localhost:5001/api/succulents/update/${succulent._id}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const result = await response.json();
      console.log("Updated succulent: ", result.updatedSucculent);

      setSucculents((prevState) =>
        prevState.map((succ) =>
          succ._id === succulent._id ? result.updatedSucculent : succ
        )
      );
      setIsFlipped(false); // flip the card back to front view
      setEditFormData({
        species: "",
        description: "",
        city: "",
        img: "",
      });
      if (fileInput.current) {
        fileInput.current.value = ""; // reset the file input
      }
    } catch (error) {
      console.error("Failed to update succulent:", error);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setTextInput(e.target.value);
  };
  console.log(textInput);

  const handleCommentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(textInput);
    // check if user exists
    if (!user) {
      setModalContent("Members only feature!");
      openModal();
      return;
    }

    try {
      console.log("test for submit data :", textInput);
      const submitData = new URLSearchParams();
      submitData.set("text", textInput);

      // request options
      const requestOptions = {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        }),
        body: submitData,
      };

      // send a POST request to create a new comment
      const response = await fetch(
        `http://localhost:5001/api/succulents/comments/${succulent._id}`,
        requestOptions
      );

      // convert the response to JSON
      const data = await response.json();

      if (!response.ok) {
        setModalContent(data.error); // set the error message as modal content
        openModal();
      }

      const newComment =
        data.succulent.Comments[data.succulent.Comments.length - 1];

      setComments([...comments, newComment]);
      setTextInput("");
    } catch (error) {
      console.error("Failed to create a comment:", error);
      setModalContent("Failed to create a comment"); // a general error message when an unexpected error (like network error) occurs
      openModal();
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////////

  const deleteCommentModal = async (succulentId: string, commentId: string) => {
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
      const result = await response.json();
      console.log("results fetched again :>> ", result);
      const updatedComments = result.succulent.Comments; // this is the new succulent back from the server without the comment we deleted

      setComments(updatedComments);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //     const ModalEl =
  //     <>
  //     <h3>Comments</h3>
  //     {
  //         user ? (
  //         <>
  //             { comments.length > 0 ? (
  //                 comments.map(comment => (
  //                     <div key={comment._id} className="single-comment-modal">
  //                         <img src={comment.authorImage} alt="profile-img-author" className="comment-user-pic"></img><span>{comment.authorName}: {comment.text}</span>
  //                         <p>Posted on: {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString()}</p>
  //                         { user && comment.authorId === user._id && <MdDeleteForever className='delete-icon-comment' onClick={() => deleteCommentModal(succulent._id, comment._id)} /> }
  //                     </div>
  //                 ))
  //             ) : (
  //                 <p>No comments found for this post</p>
  //             )}

  //            <form onSubmit={handleCommentSubmit}>
  //             <input type='text' name='comment' placeholder='write something' onChange={handleCommentChange} /><br />
  //             <button type="submit" >Submit</button>
  //             </form>
  //         </>
  //         ) : (
  //             <p>You have to log in to comment</p>
  //         )
  //     }
  // </>

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const toggleModal = () => {
    if (!user) {
      setModalContent("Members only feature");
      openModal();
    } else {
      setModalContent2(
        <NewModalElement
          user={user}
          succulent={succulent}
          comments={comments}
          setComments={setComments}
          handleCommentSubmit={handleCommentSubmit}
          handleCommentChange={handleCommentChange}
          deleteCommentModal={deleteCommentModal}
          textInput={textInput}
        />
      );
      openModal();
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const addOrRemoveLike = async () => {
    // check if user exists
    if (!user) {
      setModalContent("Members only feature");
      openModal();
      return;
    }
    try {
      // Send a PUT request to the server with the succulent's ID
      const response = await fetch(
        `http://localhost:5001/api/succulents/likes/${succulent._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Convert the response to JSON
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }
      setLikes(data.succulent.likes);

      // Handle the response data here
    } catch (error) {
      console.error("Failed to update likes:", error);
    }
  };

  const handleDeleteSucculent = async () => {
    try {
      await deleteSucculent(succulent._id);
    } catch (error) {
      console.error("Failed to delete succulent:", error);
    }
  };

  return (
    <div className={`succulent-card-div ${isFlipped ? "flipped" : ""}`}>
      <div className="front">
        <img
          src={succulent.img}
          alt={succulent.species}
          className="succulent-card-img"
        />
        <p>Species: {succulent.species}</p>
        <p>Description: {succulent.description}</p>
        <p>City: {succulent.city}</p>
        <p>
          Posted by: {succulent.owner.username}, on:{" "}
          {new Date(succulent.createdAt).toLocaleDateString()}{" "}
          {new Date(succulent.createdAt).toLocaleTimeString()}
        </p>
        <MdComment className="succulent-card-btn" onClick={toggleModal} />
        <FaRobot className="succulent-card-btn" />
        {user && likes.includes(user._id) ? (
          <AiFillLike
            className="succulent-card-btn"
            onClick={addOrRemoveLike}
          />
        ) : (
          <AiOutlineLike
            className="succulent-card-btn"
            onClick={addOrRemoveLike}
          />
        )}
        {succulent.owner._id === userId && (
          <MdDeleteForever
            className="succulent-card-btn"
            onClick={handleDeleteSucculent}
          />
        )}
        {succulent.owner._id === userId && (
          <FaEdit className="succulent-card-btn" onClick={handleFlip} />
        )}
      </div>
      <div className="back">
        <p>this is the back of the Card</p>
        <button onClick={handleFlip}>flip back</button>
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            name="species"
            value={editFormData.species}
            onChange={handleEditChange}
            placeholder="Species"
          />
          <br />
          <input
            type="text"
            name="description"
            value={editFormData.description}
            onChange={handleEditChange}
            placeholder="Description"
          />
          <br />
          <input
            type="text"
            name="city"
            value={editFormData.city}
            onChange={handleEditChange}
            placeholder="City"
          />
          <br />
          <input
            ref={fileInput}
            type="file"
            name="img"
            onChange={handleFileChange}
          />
          <br />
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default SucculentCard;
