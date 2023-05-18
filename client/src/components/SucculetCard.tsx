import { AuthContext } from '../contexts/AuthContext';
import SucculentCardModal from '../components/SucculentCardModal'
import React, { ChangeEvent, FormEvent, useState, useContext } from 'react'
import { MdDeleteForever } from 'react-icons/md';



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
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

    
    
    
  return (
    <div className='succulent-card-div'>
      <img src={succulent.img} alt={succulent.species} className="succulent-card-img" />
      <p>Species: {succulent.species}</p>
      <p>Description: {succulent.description}</p>
      <p>City: {succulent.city}</p>
      <p>Posted by: {succulent.owner.username}, on: {new Date(succulent.createdAt).toLocaleDateString()} {new Date(succulent.createdAt).toLocaleTimeString()}</p>
      <button className='open-modal' onClick={toggleModal}>open modal</button>
     <SucculentCardModal isOpen={isModalOpen} closeModal={toggleModal}>
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
</SucculentCardModal>
    </div>
  );
};

export default SucculentCard;
