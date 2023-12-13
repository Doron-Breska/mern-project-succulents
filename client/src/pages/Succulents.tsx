import React, {
  useState,
  useContext,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import SucculentCard from "../components/SucculetCard";
import { AuthContext } from "../contexts/AuthContext";
import { ModalContext } from "../contexts/ModalContext";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { FiPlusSquare } from "react-icons/fi";
import { FiMinusSquare } from "react-icons/fi";
import { serverURL } from "../utils/serverURL";

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

type Img = string | File;

interface FormData {
  species: string;
  description: string;
  city: string;
  img: Img;
}

const Succulents = (props: Props) => {
  const { user } = useContext(AuthContext);
  const {
    // isModalOpen,
    // closeModal,
    // modalContent,
    setModalContent,
    openModal,
  } = useContext(ModalContext);
  const token = localStorage.getItem("token");
  const [succulents, setSucculents] = useState<Succulent[]>([]);
  const userId = user?._id.toString();
  //eslint-disable-next-line
  const userComments = succulents.filter((succulent) =>
    succulent.Comments.some((comment) => comment.authorId.toString() === userId)
  );
  const [editFormData, setEditFormData] = useState<FormData>({
    species: "",
    description: "",
    city: "",
    img: "",
  });
  const fileInput = React.useRef<HTMLInputElement>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const { loading, setLoading } = useContext(AuthContext);
  const [loader, setLoader] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState("default");

  function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

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

    const submitData = new FormData();
    submitData.append("species", editFormData.species);
    submitData.append("description", editFormData.description);
    submitData.append("city", editFormData.city);
    submitData.append("img", editFormData.img);

    const requestOptions = {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
      body: submitData,
    };
    setLoader(true);
    try {
      const response = await fetch(
        `${serverURL}/api/succulents/new`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const result = await response.json();
      console.log(result);

      // setSucculents((prevState) =>
      //   prevState.map((succ) =>
      //     succ._id === succulent._id ? result.updatedSucculent : succ
      //   )

      setEditFormData({
        species: "",
        description: "",
        city: "",
        img: "",
      });
      if (fileInput.current) {
        fileInput.current.value = ""; // reset the file input
      }
      fetchSucculents().then(() => {
        scrollToBottom();
      });
      setShowForm(false);
      setLoader(false);
    } catch (error) {
      console.error("Failed to update succulent:", error);
      setLoader(false);
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const fetchSucculents = async () => {
    const requestOptions = {
      method: "GET",
    };

    try {
      const response = await fetch(
        `${serverURL}/api/succulents/all`,
        requestOptions
      );
      console.log(serverURL);
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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const deleteSucculent = async (id: string) => {
    // check if user exists
    if (!user) {
      setModalContent("Log-In to use this feature");
      return;
    }

    try {
      const response = await fetch(`${serverURL}/api/succulents/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  const sortSucculentsByLikes = () => {
    const sortedSucculents = [...succulents].sort(
      (a, b) => b.likes.length - a.likes.length
    );
    // console.log("test for sorting by likes", sortedSucculents);
    setSucculents(sortedSucculents);
  };

  const sortSucculentsByComments = () => {
    const sortedSucculents = [...succulents].sort(
      (a, b) => b.Comments.length - a.Comments.length
    );
    setSucculents(sortedSucculents);
  };
  const sortAlphabeticallyBySpecies = () => {
    setSucculents(
      succulents.slice().sort((a, b) => a.species.localeCompare(b.species))
    );
  };

  const toggleFormVisibility = () => {
    if (!user) {
      setModalContent("Log-In to use this feature");
      openModal();
      return;
    }
    setShowForm((prevShowForm) => !prevShowForm);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [paginatedSucculents, setPaginatedSucculents] = useState<Succulent[]>(
    []
  );
  useEffect(() => {
    // Logic to fetch succulents from the server or context
    // Assuming succulents are already fetched and set in the state
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setPaginatedSucculents(succulents.slice(indexOfFirstItem, indexOfLastItem));
  }, [succulents, currentPage]);

  const totalPages = Math.ceil(succulents.length / itemsPerPage);

  const navigate = (newPage: number) => {
    setCurrentPage(newPage);
  };

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
      <div className="filter-buttons-container">
        <button
          className={`custom-button2 ${
            activeButton === "likes" ? "filterSucculents" : ""
          }`}
          onClick={() => {
            sortSucculentsByLikes();
            setActiveButton("likes");
          }}
        >
          Sort by likes
        </button>
        <button
          className={`custom-button2 ${
            activeButton === "comments" ? "filterSucculents" : ""
          }`}
          onClick={() => {
            sortSucculentsByComments();
            setActiveButton("comments");
          }}
        >
          Sort by comments
        </button>
        <button
          className={`custom-button2 ${
            activeButton === "alphabetical" ? "filterSucculents" : ""
          }`}
          onClick={() => {
            sortAlphabeticallyBySpecies();
            setActiveButton("alphabetical");
          }}
        >
          Sort alphabetically
        </button>
        <button
          className={`custom-button2 ${
            activeButton === "default" ? "filterSucculents" : ""
          }`}
          onClick={() => {
            fetchSucculents();
            setActiveButton("default");
          }}
        >
          Default order
        </button>
      </div>
      <div>
        <h1 className="wobble-hor-bottom succulent-page-header">
          Click To Post
        </h1>
        <span>
          {showForm ? (
            <FiMinusSquare
              className="wobble-hor-bottom create-post-icon"
              onClick={toggleFormVisibility}
            />
          ) : (
            <FiPlusSquare
              className="wobble-hor-bottom create-post-icon"
              onClick={toggleFormVisibility}
            />
          )}
        </span>
        {showForm && (
          <form className="create-succulent-form" onSubmit={handleEditSubmit}>
            <input
              type="text"
              name="species"
              value={editFormData.species}
              onChange={handleEditChange}
              placeholder="Species"
              required
            />
            <br />
            <textarea
              name="description"
              value={editFormData.description}
              onChange={handleEditChange}
              placeholder="Description 
            (Max 120 characters)"
              maxLength={120}
              rows={4}
              required
            />
            <br />
            <input
              type="text"
              name="city"
              value={editFormData.city}
              onChange={handleEditChange}
              placeholder="City"
              required
            />
            <br />
            <input
              ref={fileInput}
              type="file"
              name="img"
              onChange={handleFileChange}
              accept="image/png, image/jpg, image/jpeg"
              required
              className="text-input-position-create-succulent"
            />
            <br />
            {loader ? (
              <div className="loader2"></div>
            ) : (
              <button className="custom-button" type="submit">
                Post
              </button>
            )}
          </form>
        )}
      </div>
      <div className="succulents-page-container">
        {paginatedSucculents.map((succulent) => (
          <SucculentCard
            key={succulent._id}
            succulent={succulent}
            deleteSucculent={deleteSucculent}
            setSucculents={setSucculents}
          />
        ))}
      </div>
      <div className="pagination-controls">
        {currentPage > 1 && (
          <span onClick={() => navigate(currentPage - 1)}>&#8672; </span>
        )}

        <span>
          Page {currentPage} of {totalPages}
        </span>

        {currentPage < totalPages && (
          <span onClick={() => navigate(currentPage + 1)}> &#8674;</span>
        )}
      </div>
    </>
  );
};

export default Succulents;
