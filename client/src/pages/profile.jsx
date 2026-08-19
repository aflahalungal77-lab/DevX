import { useEffect, useState } from "react";
import "../index.css";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH PROFILE
  // =========================

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://devx-api-4fki.onrender.com/api/users/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const text = await response.text();

        let data;

        try {
          data = JSON.parse(text);
        } catch {
          data = {
            message: text || "Invalid server response",
          };
        }

        console.log("PROFILE STATUS:", response.status);
        console.log("PROFILE DATA:", data);

        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          setError(data.message || "Failed to load profile.");
          return;
        }

        setProfile(data);
        setName(data.name || "");
        setBio(data.bio || "");

      } catch (error) {
        console.error("PROFILE FETCH ERROR:", error);
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      console.log("SAVE CLICKED");

      const response = await fetch(
        "https://devx-api-4fki.onrender.com/api/users/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            bio: bio.trim(),
          }),
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = {
          message: text || "Unknown server response",
        };
      }

      console.log("UPDATE STATUS:", response.status);
      console.log("UPDATE RESPONSE:", data);

      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        setError(
          data.message ||
          `Profile update failed (${response.status})`
        );
        return;
      }

      // Update UI immediately
      setProfile(data);

      setName(data.name || "");
      setBio(data.bio || "");

      setIsEditing(false);

      console.log("PROFILE UPDATED SUCCESSFULLY");

    } catch (error) {
      console.error("UPDATE ERROR:", error);
      setError("Unable to connect to server.");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // CANCEL
  // =========================

  const handleCancel = () => {
    setName(profile?.name || "");
    setBio(profile?.bio || "");

    setError("");
    setIsEditing(false);
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="profile-page">

      <div className="profile-card">

        {/* Avatar */}

        <div className="profile-avatar">
          {profile?.name
            ? profile.name.charAt(0).toUpperCase()
            : "U"}
        </div>

        {/* Name */}

        <h1>
          {profile?.name || "User"}
        </h1>

        {/* Email */}

        <p className="profile-email">
          {profile?.email}
        </p>

        {/* Error */}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {/* Bio */}

        {!isEditing && (
          <p className="profile-bio">
            {profile?.bio || "No bio added yet."}
          </p>
        )}

        {/* EDIT FORM */}

        {isEditing && (
          <div className="edit-form">

            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={50}
            />

            <label>Bio</label>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell something about yourself..."
              maxLength={250}
            />

            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>

          </div>
        )}

        {/* EDIT BUTTON */}

        {!isEditing && (
          <button
            type="button"
            className="edit-profile-btn"
            onClick={() => {
              setError("");
              setName(profile?.name || "");
              setBio(profile?.bio || "");
              setIsEditing(true);
            }}
          >
            Edit Profile
          </button>
        )}

      </div>

    </div>
  );
}

export default Profile;