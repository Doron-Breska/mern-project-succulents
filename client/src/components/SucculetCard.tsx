import { AuthContext } from '../contexts/AuthContext';
import SucculentCardModal from '../components/SucculentCardModal'
import React, { ChangeEvent, FormEvent, useState, useContext } from 'react'
import { MdDeleteForever } from 'react-icons/md';
import { FaRobot } from 'react-icons/fa';
import { MdComment } from 'react-icons/md';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { FaEdit } from 'react-icons/fa';
import { ModalContext } from '../contexts/ModalContext'



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





interface SucculentCardProps {
  succulent: Succulent;
    deleteSucculent: (succulentId: string) => void; 
    setSucculents: React.Dispatch<React.SetStateAction<Succulent[]>>;

}

interface FormData {
    comment: string,
}

const SucculentCard = ({ succulent, deleteSucculent ,setSucculents}: SucculentCardProps) => {
  const { user } = useContext(AuthContext);
  const { isModalOpen, closeModal, openModal, modalContent, setModalContent, setModalContent2} = useContext(ModalContext);
  const token = localStorage.getItem("token");
  const userId = user?._id.toString();
  const [likes, setLikes] = useState(succulent.likes);
  const [isFlipped, setIsFlipped] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(succulent.Comments);
  const [formData, setFormData] = useState<FormData>({
    comment: "",
    });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleCommentSubmit = async (event: FormEvent) => {
  event.preventDefault();

  // check if user exists
  if (!user) {
    setModalContent("Members only feature");
    openModal();
    return;
  }

  try {
    // form data
    const submitData = new URLSearchParams();
    submitData.set('text', formData.comment);
  
    // request options
    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      body: submitData
    };
   console.log("test for submot data :",requestOptions)
    // send a POST request to create a new comment
    const response = await fetch(`http://localhost:5001/api/succulents/comments/${succulent._id}`, requestOptions);

    // convert the response to JSON
    const data = await response.json();

    if (!response.ok) {
        setModalContent(data.error); // set the error message as modal content
        openModal();
    }
       setComments([
    ...comments,
    {
      ...data.comment,  // assuming the response contains the comment data
      authorId: user._id,
      authorName: user.username,
      authorImage: user.avatar,
    },
  ]);

    // reset the form data
    setFormData({
      comment: "",
    });

  } catch (error) {
    console.error('Failed to create a comment:', error);
    setModalContent('Failed to create a comment'); // a general error message when an unexpected error (like network error) occurs
    openModal();
  }
};

    
  /////////////////////////////////////////////////////////////////////////////////////////////

  const deleteCommentModal = async (succulentId: string, commentId: string) => {
  try {
    const response = await fetch(`http://localhost:5001/api/succulents/delete/${succulentId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }

    // Update the local state of the Succulent's comments
    const updatedComments = comments.filter(comment => comment._id !== commentId);
    
    setComments(updatedComments);
    // setSucculents((prevState: Succulent[]) => prevState.map(suc => {
    //   if (suc._id === succulent._id) {
    //     return { ...suc, Comments: updatedComments }
    //   }
    //   return suc;
    // }));   this part is updating the container in the profile page 
  } catch (error) {
    console.error('Failed to delete comment:', error);
  }
};

   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    }

  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    const ModalEl =   
    <>
    <h3>Comments</h3>
    {
        user ? (
        <>
            { comments.length > 0 ? (
                comments.map(comment => (
                    <div key={comment._id} className="single-comment-modal">
                        <img src={comment.authorImage} alt="profile-img-author" className="comment-user-pic"></img><span>{comment.authorName}: {comment.text}</span>
                        <p>Posted on: {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString()}</p>
                        { user && comment.authorId === user._id && <MdDeleteForever className='delete-icon-comment' onClick={() => deleteCommentModal(succulent._id, comment._id)} /> }
                    </div>
                ))
            ) : (
                <p>No comments found for this post</p>
            )}

           <form onSubmit={handleCommentSubmit}>
            <input type='text' name='comment' placeholder='write something' onChange={handleChange} /><br />
            <button type="submit" >Submit</button>
            </form>
        </>
        ) : (
            <p>You have to log in to comment</p>
        )
    }
</>

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    const toggleModal = () => {
        if (!user) {
            setModalContent("Members only feature");
            openModal();
        }
    else {
         setModalContent2(ModalEl)
    openModal() 
    }
  };
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const addOrRemoveLike = async () => {
      // check if user exists
  if (!user) {
    setModalContent("Members only feature");
    openModal()
    return;
  }
    try {
      // Send a PUT request to the server with the succulent's ID
      const response = await fetch(`http://localhost:5001/api/succulents/likes/${succulent._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Convert the response to JSON
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }
      setLikes(data.succulent.likes);

      // Handle the response data here

    } catch (error) {
      console.error('Failed to update likes:', error);
    }
  };
  
      const handleDeleteSucculent = async () => {
    try {
      await deleteSucculent(succulent._id);
    } catch (error) {
      console.error('Failed to delete succulent:', error);
    }
  };


    
    
  return (
  <div className={`succulent-card-div ${isFlipped ? 'flipped' : ''}`}>
  <div className="front">
      <img src={succulent.img} alt={succulent.species} className="succulent-card-img" />
      <p>Species: {succulent.species}</p>
      <p>Description: {succulent.description}</p>
      <p>City: {succulent.city}</p>
      <p>Posted by: {succulent.owner.username}, on: {new Date(succulent.createdAt).toLocaleDateString()} {new Date(succulent.createdAt).toLocaleTimeString()}</p>
      <MdComment className='succulent-card-btn' onClick={toggleModal}/><FaRobot className='succulent-card-btn'/>{ user && likes.includes(user._id) 
      ? <AiFillLike className='succulent-card-btn' onClick={addOrRemoveLike}/> 
      : <AiOutlineLike className='succulent-card-btn' onClick={addOrRemoveLike} />}
          {succulent.owner._id === userId && <MdDeleteForever className='succulent-card-btn' onClick={handleDeleteSucculent} />}
          {succulent.owner._id === userId && <FaEdit className='succulent-card-btn' onClick={handleFlip} />}
  </div>
  <div className="back">
              <p>this is the back of the Card</p>
              <button onClick={handleFlip} >flip back</button>
  </div>
</div>
  );
};


        
export default SucculentCard;



