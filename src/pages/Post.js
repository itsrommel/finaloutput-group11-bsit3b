import React, { useState, useEffect } from 'react';
import Avatar from "@material-ui/core/Avatar";
import  { db } from '../utils/firebase';
import "../css/Post.css";
import firebase from "firebase";



function Post({ postId, user, username,caption, imageUrl }) {
  const [comments, setComments] = useState ([]);
  const [comment, setComment] = useState ('');
  useEffect(( ) => {
    let unsubscribe;
    if(postId){
      unsubscribe = db 
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .orderBy('timestamp', 'asc')
      .onSnapshot((snapshot) =>{
          setComments(snapshot.docs.map((doc) => doc.data()));
      });

    }
    return () => {
        unsubscribe();
    };
  },[postId]); 

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment('');
  }

  return (
   <div className="post">

      <div className="post_header">
          <Avatar
            className="post_avatar" 
            alt={username} 
            src="static/images/avatar/1.jpg"
          />
          <form>
      <h3>{username}</h3> 
        </form>
      </div>
      
      <img className="post_image" src={imageUrl} alt="" />
      <h4 className="post_text"><strong>{username} </strong> {caption} </h4>
      <h4 className="comments">Comments</h4>
      
        <div className="post_comments">
          {comments.map((comment) =>(
            <p>
              <strong>{comment.username}</strong> {comment.text}
            </p>
          ))}
        </div> 
        
{user && (
  <form className="post_commentBox">
      <input
        className="post_input"
        type="text"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)} 
      />
    <button className="post_button" disabled={!comment} type="submit" onClick={postComment}> 
      Post        
       </button>
    </form>
)}
    </div>
  )
}

export default Post
