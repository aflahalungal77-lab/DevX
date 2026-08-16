import { useState, useEffect } from "react";
import "../index.css";
import { jwtDecode } from "jwt-decode";
import CreatePost from "./createPost";

function Feed() {

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState("");

  const token = localStorage.getItem("token");
const user = token ? jwtDecode(token) : null;
  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      try {
        const response = await fetch("https://devx-api-4fki.onrender.com/api/posts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          console.log(data);
          return;
        }
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
console.log(user);
    fetchPosts();
  }, []);
  
  //like a post
  const handleLike = async (postId) => {
    
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    const post = posts.find((post) => post._id === postId);

const isLiked = post?.likes?.some(
  (id) => id.toString() === user.user.id
);
const url = isLiked
  ? `https://devx-api-4fki.onrender.com/api/posts/${postId}/unlike`
  : `https://devx-api-4fki.onrender.com/api/posts/${postId}/like`;

const method = isLiked ? "DELETE" : "POST";
    try {
      const response = await fetch(
       url,
        {
          method: method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("LIKE RESPONSE:", data);
console.log("LIKES:", data.likes);
      if (!response.ok) {
        console.log(data);
        return;
      }
      
      // Update the post's like count in the state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: data.likes } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }
const handleComment = async (postId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }
  try {
    const response = await fetch(
      `https://devx-api-4fki.onrender.com/api/posts/${postId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
  comment: comments[postId]
}),
      }
    );

    const data = await response.json();
    console.log("COMMENT RESPONSE:", data);

    if (!response.ok) {
      console.log(data);
      return;
    }

    // Update the post's comments in the state
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, comments: data.comments } : post
      )
    );
    setComments({ ...comments, [postId]: "" }); // Clear the comment input after successful submission
  } catch (error) {
    console.error("Error commenting on post:", error);
  }
};
  return (
    <div className="feed-page">
       <CreatePost
      onPostCreated={(newPost) => {
        setPosts((prevPosts) => [
          newPost,
          ...prevPosts
        ]);
      }}
    />
      {posts.map((post) => (
        <div className="post-card" key={post._id}>
          <div className="post-header">
            <div className="post-avatar">
             {post.user?.name?.charAt(0).toUpperCase()}
            </div>
            <h3>{post.user?.name}</h3>
          </div>

          <p>{post.content}</p>
          <div className="post-actions">
  <button
    className="like-btn"
    onClick={() => handleLike(post._id)}
  >
    {post.likes?.some(
      (id) => id.toString() === user.user.id
    )
      ? "♥"
      : "♡"}
  </button>
<div className="like-count">
  <span>{post.likes?.length || 0}</span>
</div>
  <input
    className="comment-input"
    type="text"
    placeholder="Add a comment..."
    value={comments[post._id] || ""}
    onChange={(e) =>
      setComments({
        ...comments,
        [post._id]: e.target.value
      })
    }
  />

  <button
    className="comment-btn"
    onClick={() => handleComment(post._id)}
  >
    <img src="/chat-bubble.png" alt="Comment" />
  </button>
</div>

<div className="comments-section">
  {post.comments?.map((comment) => (
    <div className="comment" key={comment._id}>
  <div className="comment-avatar">
    {comment.user?.name?.charAt(0).toUpperCase()}
  </div>

  <div>
    <strong>{comment.user?.name}</strong>
    <p>{comment.comment}</p>
  </div>

</div>
  ))}
</div>
        </div>
      ))}
    </div>
  );
}

export default Feed;
