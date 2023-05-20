import { AuthContext } from '../contexts/AuthContext';
import SucculentCardModal from '../components/SucculentCardModal'
import React, { ChangeEvent, FormEvent, useState, useContext } from 'react'
import { MdDeleteForever } from 'react-icons/md';
import { FaRobot } from 'react-icons/fa';
import { MdComment } from 'react-icons/md';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';










// Define the type of a succulent here

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
  deleteComment: (succulentId: string, commentId: string) => void;
}

const SucculentCard = ({ succulent, deleteComment }: SucculentCardProps) => {
  const { user, errorMsg, setErrorMsg } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const userId = user?._id.toString();
  const [likes, setLikes] = useState(succulent.likes);
    
    


  


    
    
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
    
    const addOrRemoveLike = async () => {
      // check if user exists
  if (!user) {
    setErrorMsg("Members only feature");
    setIsModalOpen(true);
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
    
    
    
  return (
    <div className='succulent-card-div'>
      <img src={succulent.img} alt={succulent.species} className="succulent-card-img" />
      <p>Species: {succulent.species}</p>
      <p>Description: {succulent.description}</p>
      <p>City: {succulent.city}</p>
      <p>Posted by: {succulent.owner.username}, on: {new Date(succulent.createdAt).toLocaleDateString()} {new Date(succulent.createdAt).toLocaleTimeString()}</p>
      <MdComment className='succulent-card-btn' onClick={toggleModal}/><FaRobot className='succulent-card-btn'/>{ user && likes.includes(user._id) 
    ? <AiFillLike className='succulent-card-btn' onClick={addOrRemoveLike}/> 
    : <AiOutlineLike className='succulent-card-btn' onClick={addOrRemoveLike}/> }
    <SucculentCardModal isOpen={isModalOpen} closeModal={toggleModal}>
  {errorMsg ? <p>{errorMsg}</p> : (
    <>
      <h3>Comments</h3>
      {
        user ? (
          succulent.Comments.length > 0 ? (
            succulent.Comments.map(comment => (
                <div key={comment._id} className="single-comment-modal">
                    <img src={comment.authorImage} className="comment-user-pic"></img><span>{comment.authorName}: {comment.text}</span>
                    <p>Posted on: {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString()}</p>
                    { user && comment.authorId === user._id && <MdDeleteForever className='delete-icon-comment' onClick={() => deleteComment(succulent._id, comment._id)}/> }
              </div>
            ))
          ) : (
            <p>No comments found for this post</p>
          )
        ) : (
          <p>You have to log in to comment</p>
        )
      }
    </>
  )}
</SucculentCardModal>

    </div>
  );
};

export default SucculentCard;
