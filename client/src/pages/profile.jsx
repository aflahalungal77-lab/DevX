import { useEffect, useState } from "react";
import '../index.css';
function Profile() {
  const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
const [bio, setBio] = useState("");
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

if (!response.ok) {
  console.log(data);
  return;
}

console.log(data);

setProfile(data);
setName(data.name || "");
setBio(data.bio || "");
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    fetchProfile();
  }, []);
  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (name.trim() === "") {
  alert("Name is required");
  return;
}
    try {
      const response = await fetch(
        "http://localhost:5000/api/users/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, bio }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        return;
      }

      console.log(data);
setProfile(data);
alert("Profile updated successfully");
setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
    }
    }
  return (
  <div className="profile-page">
    <div className="profile-card">
      <div className="profile-avatar">
        {profile?.name?.charAt(0).toUpperCase()}
      </div>

      <h1>{profile?.name}</h1>

      <p className="profile-email">
        {profile?.email}
      </p>

      <p className="profile-bio">
        {profile?.bio || "No bio added yet."}
      </p>
    {isEditing && (
  <div className="edit-form">
    <input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Your name"
/>

<textarea

  value={bio}
  onChange={(e) => setBio(e.target.value)}
  placeholder="Your bio"
/>

    <button onClick={handleSaveChanges}>
      Save Changes
    </button>

    <button
      type="button"
      onClick={() => setIsEditing(false)}
    >
      Cancel
    </button>
  </div>
)}
      <button
  className="edit-profile-btn"
  onClick={() => setIsEditing(true)}
>
  Edit Profile
</button>
    </div>
  </div>
);
}

export default Profile;