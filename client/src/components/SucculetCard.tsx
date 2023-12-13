import { AuthContext } from "../contexts/AuthContext";
// import SucculentCardModal from "../components/SucculentCardModal";
import React, {
  ChangeEvent,
  FormEvent,
  useState,
  useContext,
  useEffect,
  // useReducer,
} from "react";
import { MdDeleteForever } from "react-icons/md";
import { FaRobot } from "react-icons/fa";
import { MdComment } from "react-icons/md";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { ModalContext } from "../contexts/ModalContext";
// import NewModalElement from "../components/NewModalElement";
import { RiArrowGoBackFill } from "react-icons/ri";

///testing dialog
import { useRef } from "react";
import { serverURL } from "../utils/serverURL";

interface ExtendedHTMLDialogElement extends HTMLDialogElement {
  open: boolean;
  close: () => void;
  showModal: () => void;
}

/// testing dialog

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
  // speices: string;
}

const SucculentCard = ({
  succulent,
  deleteSucculent,
  setSucculents,
}: SucculentCardProps) => {
  const { user } = useContext(AuthContext);
  const {
    // isModalOpen,
    // closeModal,
    openModal,
    // modalContent,
    setModalContent,
    setModalContent2,
  } = useContext(ModalContext);
  const token = localStorage.getItem("token");
  const userId = user?._id.toString();
  const [likes, setLikes] = useState(succulent.likes);
  // const [speices, setSpeices] = useState(succulent.species);
  // const speices = succulent.species;
  const [isFlipped, setIsFlipped] = useState(false);
  // const [comments, setComments] = useState(succulent.Comments);
  const [comments, setComments] = useState<Comment[]>([]);
  const [textInput, setTextInput] = useState("");
  // const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [editFormData, setEditFormData] = useState<FormData>({
    species: "",
    description: "",
    city: "",
    img: "",
  });
  const fileInput = React.useRef<HTMLInputElement>(null);
  const { loading, setLoading } = useContext(AuthContext);

  const [modalComments, setModalComments] = useState<Comment[]>([]);
  const [publishing, setPublishing] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);

  ////dialog test
  const dialogRef = useRef<ExtendedHTMLDialogElement>(null);
  useEffect(() => {
    const dialogElement = dialogRef.current;
    const isModalDialogOpen = sessionStorage.getItem("isModalDialogOpen");

    if (dialogElement) {
      if (isModalDialogOpen === "true" && !dialogElement.open) {
        dialogElement.showModal();
      }
    }

    return () => {
      if (dialogElement && dialogElement.open) {
        dialogElement.close();
      }
    };
  }, []);

  const openModalDialog = () => {
    const dialogElement = dialogRef.current;
    if (dialogElement && !dialogElement.open) {
      getModalComments(succulent._id);
      dialogElement.showModal();
      sessionStorage.setItem("isModalDialogOpen", "true");
    }
  };

  const closeModalDialog = () => {
    const dialogElement = dialogRef.current;
    if (dialogElement && dialogElement.open) {
      dialogElement.close();
      sessionStorage.removeItem("isModalDialogOpen");
    }
  };

  ////dialog test

  const fetchSucculents = async () => {
    const requestOptions = {
      method: "GET",
    };

    try {
      const response = await fetch(
        `${serverURL}/api/succulents/all`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const result = await response.json();
      // console.log(result);
      setSucculents(result);
    } catch (error) {
      console.error("Failed to fetch succulents:-", error);
    }
  };

  useEffect(() => {
    fetchSucculents();
    //eslint-disable-next-line
  }, []);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const getPlantCareAi = async (species: string) => {
    if (!user) {
      setModalContent("Log-In to use this feature");
      openModal();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${serverURL}/api/succulents/plantCare/${species}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      // parse the response to get the text part
      // const text = data["response from OpenAI"].choices.text;

      // setPlantCare(text);
      console.log(
        "this is the result from open ai",
        data["response from OpenAI"].choices[0].text
      );
      // console.log("test for speices -  ", species);
      const robiRobot = (
        <>
          <h3>
            Robi <FaRobot /> Robot AI
          </h3>
          <p>{data["response from OpenAI"].choices[0].text}</p>
        </>
      );
      setModalContent2(robiRobot);
      setLoading(false);
      openModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    setEditing(true);
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
        `${serverURL}/api/succulents/update/${succulent._id}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const result = await response.json();
      // console.log("Updated succulent: ", result.updatedSucculent);
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
      fetchSucculents();
      setEditing(false);
    } catch (error) {
      console.error("Failed to update succulent:", error);
      setEditing(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.value);
    setTextInput(e.target.value);
  };
  // console.log(textInput);

  const handleCommentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPublishing(true);
    // console.log(textInput);
    // check if user exists
    if (!user) {
      setModalContent("Log-In to use this feature");
      openModal();
      return;
    }

    try {
      // console.log("test for submit data :", textInput);
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
        `${serverURL}/api/succulents/comments/${succulent._id}`,
        requestOptions
      );

      // convert the response to JSON
      const data = await response.json();

      if (!response.ok) {
        setModalContent(data.error); // set the error message as modal content
        openModal();
        setPublishing(false);
      }

      const newComment =
        data.succulent.Comments[data.succulent.Comments.length - 1];
      setPublishing(false);

      setComments([...comments, newComment]);
      setTextInput("");
      toggleModal([...comments, newComment]);
      fetchSucculents();
    } catch (error) {
      console.error("Failed to create a comment:", error);
      setModalContent("Failed to create a comment"); // a general error message when an unexpected error (like network error) occurs
      openModal();
      setPublishing(false);
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
        `${serverURL}/api/succulents/delete/${succulentId}/comments/${commentId}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const result = await response.json();
      // console.log("results fetched again :>> ", result);
      const updatedComments = result.succulent.Comments; // this is the new succulent back from the server without the comment we deleted

      setComments(updatedComments);
      toggleModal(updatedComments);
      fetchSucculents();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const toggleModal = async (updatedComments: any) => {
    if (!user) {
      setModalContent("Log-In to use this feature");
      openModal();
    }
    // else {
    //   setModalContent2(
    //     <NewModalElement
    //       user={user}
    //       succulent={succulent}
    //       comments={updatedComments}
    //       setComments={setComments}
    //       handleCommentSubmit={handleCommentSubmit}
    //       handleCommentChange={handleCommentChange}
    //       deleteCommentModal={deleteCommentModal}
    //       textInput={textInput}
    //     />
    //   );
    //   openModal();
    // }
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const addOrRemoveLike = async () => {
    // check if user exists
    if (!user) {
      setModalContent("Log-In to use this feature");
      openModal();
      return;
    }
    try {
      // Send a PUT request to the server with the succulent's ID
      const response = await fetch(
        `${serverURL}/api/succulents/likes/${succulent._id}`,
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
      fetchSucculents();
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
  /////////////////////////////////////////////////////////////////////////////////////
  // const getAllComments = async (succulentId: string) => {
  //   // console.log('%csucculent ID',"color:blue",  succulentId)
  //   const requestOptions = {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };

  //   try {
  //     const response = await fetch(
  //       `http://localhost:5001/api/succulents/allcomments/${succulentId}`,
  //       requestOptions
  //     );
  //     console.log("%call comments :>> ", "color:green", response);
  //     if (!response.ok) {
  //       throw new Error("HTTP error " + response.status);
  //     }
  //     const result = await response.json();
  //     console.log("%call comments :>> ", "color:green", result);
  //     const updatedComments = result.succulent.Comments; // this is the new succulent back from the server without the comment we deleted
  //     console.log("%call comments :>> ", "color:green", updatedComments);

  //     setComments(updatedComments);
  //     toggleModal(updatedComments);
  //     // toggleModal()
  //     // openModal();
  //   } catch (error) {
  //     console.error("Failed to delete comment:", error);
  //   }
  // };
  //////////////////////////////////////////////////////////////////////////////////////

  //test dialog
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
        `${serverURL}/api/succulents/allcomments/${succulentId}`,
        requestOptions
      );
      //  console.log("%call comments :>> ", "color:green",response);
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const result = await response.json();
      // console.log("%call comments :>> ", "color:green",result);
      const updatedComments = result.succulent.Comments; // this is the new succulent back from the server without the comment we deleted
      // console.log("%call comments :>> ", "color:green", updatedComments);

      setModalComments(updatedComments);

      // openModal();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  useEffect(() => {
    // console.log("%cuseEffectmodal", "color:lightblue", succulent._id);
    getModalComments(succulent._id);
    //eslint-disable-next-line
  }, [comments.length, modalComments.length]);
  /////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      {loading && (
        <>
          <div className="spinner">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </>
      )}
      <div
        data-testid="fullCard"
        className={`succulent-card-div ${isFlipped ? "flipped" : ""}`}
      >
        <div
          data-testid="frontCard"
          className="front"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingBottom: "0.3rem",
          }}
        >
          <img
            src={succulent.img}
            alt={succulent.species}
            className="succulent-card-img"
          />

          <div style={{ textAlign: "left", paddingInline: "1rem" }}>
            {" "}
            <p>
              <b>
                <i>Species:</i>
              </b>{" "}
              {succulent.species}
            </p>
            <p className="testclass">
              <i>
                <b>Description:</b>
              </i>{" "}
              {succulent.description}
            </p>
            <p>
              <i>
                <b>City: </b>
              </i>
              {succulent.city}
            </p>
            <p>
              <i>
                <b>Posted by: </b>
              </i>
              {succulent.owner.username}, on:{" "}
              {new Date(succulent.createdAt).toLocaleDateString()}{" "}
              {new Date(succulent.createdAt).toLocaleTimeString()}
            </p>
            <p>
              {succulent.likes.length === 0 ? (
                <>
                  <AiFillLike className="pt-0" /> 0
                </>
              ) : (
                <>
                  <AiFillLike className="pt-0" /> {succulent.likes.length}
                </>
              )}{" "}
              {succulent.Comments.length === 0 ? (
                <>
                  <MdComment /> 0
                </>
              ) : (
                <>
                  <MdComment /> {succulent.Comments.length}
                </>
              )}
            </p>
          </div>

          <div className="succulent-card-buttons">
            {/* <MdComment className="succulent-card-btn" onClick={toggleModal} /> */}
            {/* testing modal dialog  */}

            <MdComment
              className="succulent-card-btn"
              onClick={openModalDialog}
            />
            <dialog ref={dialogRef}>
              <button
                className="close-modal-btn"
                onClick={() => {
                  closeModalDialog();
                }}
              >
                &#10005;
              </button>
              <>
                {user ? (
                  <>
                    <h3>Comments</h3>
                    {/* {console.log('JSX modal "comments">>> :', modalComments)} */}
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
                            Posted on:{" "}
                            {new Date(comment.createdAt).toLocaleDateString()}{" "}
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
                      <h4>Be the first one to comment!</h4>
                      // <p>No comments found for this post</p>
                    )}
                    <form onSubmit={handleCommentSubmit}>
                      <input
                        style={{ width: "100%" }}
                        type="text"
                        name="comment"
                        placeholder="write something"
                        onChange={handleCommentChange}
                        value={textInput}
                        required
                      />
                      <br />
                      <button
                        disabled={publishing}
                        className="custom-button"
                        type="submit"
                      >
                        Submit
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="center-p-test">
                    <div>Log-In to use this feature</div>
                  </div>
                )}
              </>
            </dialog>

            <FaRobot
              className="succulent-card-btn"
              onClick={() => getPlantCareAi(succulent.species)}
            />
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
              <FaEdit
                data-testid="flipFrontToBack"
                className="succulent-card-btn"
                onClick={handleFlip}
              />
            )}
          </div>
        </div>
        <div className="back" data-testid="backCard">
          <RiArrowGoBackFill className="flip-back-icon" onClick={handleFlip} />

          <form onSubmit={handleEditSubmit}>
            <input
              type="text"
              name="species"
              value={editFormData.species}
              onChange={handleEditChange}
              placeholder="Species"
              style={{ width: "80%" }}
            />
            <br />
            <textarea
              style={{ width: "80%" }}
              name="description"
              value={editFormData.description}
              onChange={handleEditChange}
              placeholder="Description 
            (Max 120 characters)"
              maxLength={120}
              rows={6}
            />
            <br />
            <input
              style={{ width: "80%" }}
              type="text"
              name="city"
              value={editFormData.city}
              onChange={handleEditChange}
              placeholder="City"
            />
            <br />
            <input
              style={{ width: "80%" }}
              ref={fileInput}
              type="file"
              name="img"
              onChange={handleFileChange}
              className="text-input-position-edit-from"
            />
            <br />
            {editing ? (
              <div className="loader2"></div>
            ) : (
              <button className="custom-button" type="submit">
                Update
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default SucculentCard;
