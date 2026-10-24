import { useEffect, useState } from "react";

import {
  getStudentProfileByUserId,
  updateStudentProfile,
} from "../../services/studentService";

import "../../styles/student-profile.css";

function Profile() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(user));
  const [error, setError] = useState(
    user ? "" : "User information not found. Please login again.",
  );

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await getStudentProfileByUserId(user.id);

        setProfile(data);
      } catch (error) {
        console.error("Profile loading error:", error);

        setError(error.message || "Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const updatedProfile = await updateStudentProfile(profile.id, {
        course: profile.course,
        department: profile.department,
        year: profile.year,
        skills: profile.skills,
        bio: profile.bio,
      });

      setProfile(updatedProfile);
      setIsEditing(false);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);

      alert(error.message || "Failed to update profile.");
    }
  };

  const completionFields = [
    {
      label: "Course",
      value: profile?.course,
    },
    {
      label: "Department",
      value: profile?.department,
    },
    {
      label: "Year",
      value: profile?.year,
    },
    {
      label: "Skills",
      value: profile?.skills,
    },
    {
      label: "Bio",
      value: profile?.bio,
    },
  ];

  const isFieldComplete = (value) => {
    return value !== null && value !== undefined && String(value).trim() !== "";
  };

  const completedFields = completionFields.filter((field) =>
    isFieldComplete(field.value),
  );

  const completionPercentage =
    completionFields.length > 0
      ? Math.round((completedFields.length / completionFields.length) * 100)
      : 0;

  const getSkills = () => {
    if (!profile?.skills) {
      return [];
    }

    return profile.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  };

  const formatYear = (year) => {
    if (!year) {
      return "Not provided";
    }

    if (year === 1) return "1st Year";
    if (year === 2) return "2nd Year";
    if (year === 3) return "3rd Year";

    return `${year}th Year`;
  };

  if (isLoading) {
    return (
      <div className="student-profile">
        <div className="profile-loading">Loading your profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-profile">
        <div className="profile-error">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="student-profile">
        <div className="profile-error">Profile not found.</div>
      </div>
    );
  }

  return (
    <div className="student-profile">
      {/* HEADER */}
      <header className="student-profile-header">
        <div>
          <p className="student-profile-eyebrow">YOUR PROFILE</p>

          <h1>Your professional identity.</h1>

          <p>
            Keep your information updated so alumni can understand your
            background, interests, and goals.
          </p>
        </div>

        <button
          type="button"
          className="profile-edit-button"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel editing" : "Edit profile"}
        </button>
      </header>

      {/* CONTENT */}
      <div className="student-profile-content">
        {/* MAIN PROFILE */}
        <div className="profile-main-card">
          {/* PROFILE IDENTITY */}
          <div className="profile-main-heading">
            <div className="student-profile-avatar">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="profile-identity-copy">
              <p className="profile-status">STUDENT</p>

              <h2>{profile.name}</h2>

              <p className="profile-identity-course">
                {profile.course || "Course not provided"}

                {profile.department && (
                  <>
                    <span> · </span>
                    {profile.department}
                  </>
                )}
              </p>

              <span>{profile.email}</span>
            </div>
          </div>

          <form onSubmit={handleSave}>
            {/* PERSONAL */}
            <section className="profile-form-section">
              <div className="profile-form-heading">
                <p>01 · PERSONAL INFORMATION</p>

                <span>Your account information.</span>
              </div>

              <div className="profile-form-grid">
                <div className="profile-field">
                  <label>Name</label>

                  <div className="profile-value profile-readonly">
                    {profile.name || "Not provided"}
                  </div>

                  {isEditing && (
                    <small>Name is managed through your account.</small>
                  )}
                </div>

                <div className="profile-field">
                  <label>Email</label>

                  <div className="profile-value profile-readonly">
                    {profile.email || "Not provided"}
                  </div>
                </div>
              </div>
            </section>

            {/* ACADEMIC */}
            <section className="profile-form-section">
              <div className="profile-form-heading">
                <p>02 · ACADEMIC INFORMATION</p>

                <span>Your current academic background.</span>
              </div>

              <div className="profile-form-grid">
                <div className="profile-field">
                  <label>Course</label>

                  {isEditing ? (
                    <input
                      type="text"
                      name="course"
                      value={profile.course || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="profile-value">
                      {profile.course || "Not provided"}
                    </div>
                  )}
                </div>

                <div className="profile-field">
                  <label>Department</label>

                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={profile.department || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="profile-value">
                      {profile.department || "Not provided"}
                    </div>
                  )}
                </div>

                <div className="profile-field">
                  <label>Year</label>

                  {isEditing ? (
                    <input
                      type="number"
                      name="year"
                      min="1"
                      max="5"
                      value={profile.year || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="profile-value">
                      {formatYear(profile.year)}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* PROFESSIONAL */}
            <section className="profile-form-section">
              <div className="profile-form-heading">
                <p>03 · PROFESSIONAL INTERESTS</p>

                <span>Share what you know and what you want to learn.</span>
              </div>

              <div className="profile-form-grid">
                <div className="profile-field profile-field-full">
                  <label>Skills</label>

                  {isEditing ? (
                    <input
                      type="text"
                      name="skills"
                      value={profile.skills || ""}
                      onChange={handleChange}
                      placeholder="Java, React, SQL"
                    />
                  ) : (
                    <div className="profile-skills">
                      {getSkills().length > 0 ? (
                        getSkills().map((skill) => (
                          <span className="profile-skill-tag" key={skill}>
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="profile-empty-value">
                          No skills added yet.
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="profile-field profile-field-full">
                  <label>Bio</label>

                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={profile.bio || ""}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Tell alumni a little about yourself..."
                    />
                  ) : (
                    <div className="profile-value profile-bio">
                      {profile.bio || "No bio added yet."}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* SAVE */}
            {isEditing && (
              <div className="profile-save-area">
                <p>Your changes will be saved to your student profile.</p>

                <button type="submit" className="profile-save-button">
                  Save changes
                </button>
              </div>
            )}
          </form>
        </div>

        {/* RIGHT COLUMN */}
        <aside className="profile-side-column">
          {/* COMPLETION */}
          <div className="profile-completion">
            <p className="profile-side-label">PROFILE COMPLETION</p>

            <div className="completion-number">{completionPercentage}%</div>

            <div className="completion-bar">
              <span
                style={{
                  width: `${completionPercentage}%`,
                }}
              ></span>
            </div>

            <p>
              Complete your profile to make it easier for alumni to understand
              your background.
            </p>

            <div className="completion-checklist">
              {completionFields.map((field) => {
                const complete = isFieldComplete(field.value);

                return (
                  <div
                    className={`completion-item ${complete ? "completed" : ""}`}
                    key={field.label}
                  >
                    <span>{complete ? "✓" : "○"}</span>

                    <p>{field.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TIP */}
          <div className="profile-tip">
            <p className="profile-side-label">WHY IT MATTERS</p>

            <h2>Your profile is your introduction.</h2>

            <p>
              Alumni are more likely to respond when they can quickly understand
              who you are, what you study, and what you want to learn.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Profile;
