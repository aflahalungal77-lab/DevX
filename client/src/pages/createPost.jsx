import { useState } from "react";

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!content.trim()) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("https://devx-api-4fki.onrender.com/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content,
        }),
      });

      const data = await response.json();

      console.log("CREATE POST RESPONSE:", data);

      if (!response.ok) {
        console.log("CREATE POST ERROR:", data);
        return;
      }

      console.log("NEW POST:", data);
onPostCreated(data);
      setContent("");

    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-card">

      <div className="create-post-top">
        <div className="create-post-avatar">
          +
        </div>

        <div>
          <h3>Create a post</h3>
          <p>Share something with the developer community</p>
        </div>
      </div>

      <textarea
        className="create-post-input"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="create-post-bottom">

        <span>
          {content.length}/500
        </span>

        <button
          className="create-post-btn"
          onClick={handleCreatePost}
          disabled={loading || !content.trim()}
        >
          {loading ? "Posting..." : "Create Post"}
        </button>

      </div>

    </div>
  );
}

export default CreatePost;