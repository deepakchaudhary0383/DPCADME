import { useEffect, useState } from "react";

import {
  getAlumniProfileByUserId,
  updateAlumniProfile,
} from "../../services/alumniService";

import "../../styles/alumni-profile-page.css";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    graduationYear: "",
    course: "",
    department: "",
    company: "",
    jobRole: "",
    location: "",
    skills: "",
    linkedinUrl: "",
    bio: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError("");

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          throw new Error("No logged-in user found.");
        }

        const user = JSON.parse(storedUser);

        const alumniProfile = await getAlumniProfileByUserId(user.id);

        setProfile(alumniProfile);

        setFormData({
          graduationYear: alumniProfile.graduationYear || "",
          course: alumniProfile.course || "",
          department: alumniProfile.department || "",
          company: alumniProfile.company || "",
          jobRole: alumniProfile.jobRole || "",
          location: alumniProfile.location || "",
          skills: alumniProfile.skills || "",
          linkedinUrl: alumniProfile.linkedinUrl || "",
          bio: alumniProfile.bio || "",
        });
      } catch (err) {
        console.error("Alumni profile loading error:", err);
        setError(err.message || "Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const getInitial = () => {
    const name = profile?.name || "Alumni";

    return name.charAt(0).toUpperCase();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      graduationYear: profile?.graduationYear || "",
      course: profile?.course || "",
      department: profile?.department || "",
      company: profile?.company || "",
      jobRole: profile?.jobRole || "",
      location: profile?.location || "",
      skills: profile?.skills || "",
      linkedinUrl: profile?.linkedinUrl || "",
      bio: profile?.bio || "",
    });

    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!profile?.id) {
      setError("Alumni profile ID not found.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      const updatedProfile = await updateAlumniProfile(profile.id, {
        graduationYear: formData.graduationYear
          ? Number(formData.graduationYear)
          : null,

        course: formData.course,

        department: formData.department,

        company: formData.company,

        jobRole: formData.jobRole,

        location: formData.location,

        skills: formData.skills,

        linkedinUrl: formData.linkedinUrl,

        bio: formData.bio,
      });

      setProfile(updatedProfile);

      setFormData({
        graduationYear: updatedProfile.graduationYear || "",
        course: updatedProfile.course || "",
        department: updatedProfile.department || "",
        company: updatedProfile.company || "",
        jobRole: updatedProfile.jobRole || "",
        location: updatedProfile.location || "",
        skills: updatedProfile.skills || "",
        linkedinUrl: updatedProfile.linkedinUrl || "",
        bio: updatedProfile.bio || "",
      });

      setIsEditing(false);

      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error("Alumni profile update error:", err);

      setError(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="alumni-profile-page">
        <div className="alumni-profile-loading">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="alumni-profile-page">
      {/* =========================
          HEADER
         ========================= */}

      <section className="alumni-profile-header">
        <div>
          <p className="alumni-eyebrow">MY PROFILE</p>

          <h1>Professional profile</h1>

          <p>
            Keep your alumni information updated so students can learn more
            about your professional journey.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            className="alumni-profile-edit-button"
            onClick={handleEdit}
          >
            Edit profile
          </button>
        )}
      </section>

      {/* =========================
          ALERTS
         ========================= */}

      {error && <div className="alumni-profile-error">{error}</div>}

      {success && <div className="alumni-profile-success">{success}</div>}

      {/* =========================
          IDENTITY CARD
         ========================= */}

      <section className="alumni-profile-card">
        <div className="alumni-profile-identity">
          <div className="alumni-profile-avatar">{getInitial()}</div>

          <div>
            <h2>{profile?.name || "Alumni"}</h2>

            <p>{profile?.email || "Email unavailable"}</p>

            <span>{profile?.role || "Alumni"}</span>
          </div>
        </div>
      </section>

      {/* =========================
          EDIT MODE
         ========================= */}

      {isEditing ? (
        <form className="alumni-profile-form" onSubmit={handleSubmit}>
          <div className="alumni-profile-section">
            <div className="alumni-profile-section-heading">
              <p>PROFESSIONAL INFORMATION</p>

              <h2>Update your profile</h2>
            </div>

            <div className="alumni-profile-form-grid">
              {/* COMPANY */}

              <div className="alumni-profile-field">
                <label htmlFor="company">Company</label>

                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Google"
                />
              </div>

              {/* JOB ROLE */}

              <div className="alumni-profile-field">
                <label htmlFor="jobRole">Job Role</label>

                <input
                  id="jobRole"
                  name="jobRole"
                  type="text"
                  value={formData.jobRole}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                />
              </div>

              {/* COURSE */}

              <div className="alumni-profile-field">
                <label htmlFor="course">Course</label>

                <input
                  id="course"
                  name="course"
                  type="text"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech"
                />
              </div>

              {/* DEPARTMENT */}

              <div className="alumni-profile-field">
                <label htmlFor="department">Department</label>

                <input
                  id="department"
                  name="department"
                  type="text"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                />
              </div>

              {/* GRADUATION YEAR */}

              <div className="alumni-profile-field">
                <label htmlFor="graduationYear">Graduation Year</label>

                <input
                  id="graduationYear"
                  name="graduationYear"
                  type="number"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="e.g. 2022"
                />
              </div>

              {/* LOCATION */}

              <div className="alumni-profile-field">
                <label htmlFor="location">Location</label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Bengaluru, India"
                />
              </div>

              {/* SKILLS */}

              <div className="alumni-profile-field alumni-profile-field-full">
                <label htmlFor="skills">Skills</label>

                <input
                  id="skills"
                  name="skills"
                  type="text"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. Java, React, Spring Boot"
                />
              </div>

              {/* LINKEDIN */}

              <div className="alumni-profile-field alumni-profile-field-full">
                <label htmlFor="linkedinUrl">LinkedIn URL</label>

                <input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/your-profile"
                />
              </div>

              {/* BIO */}

              <div className="alumni-profile-field alumni-profile-field-full">
                <label htmlFor="bio">About you</label>

                <textarea
                  id="bio"
                  name="bio"
                  rows="5"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell students about your professional journey..."
                />
              </div>
            </div>
          </div>

          {/* FORM BUTTONS */}

          <div className="alumni-profile-form-actions">
            <button
              type="button"
              className="alumni-profile-cancel-button"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="alumni-profile-save-button"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      ) : (
        /* =========================
           VIEW MODE
           ========================= */

        <section className="alumni-profile-section">
          <div className="alumni-profile-section-heading">
            <p>PROFESSIONAL INFORMATION</p>

            <h2>Your career details</h2>
          </div>

          <div className="alumni-profile-details-grid">
            <div className="alumni-profile-detail">
              <span>Company</span>

              <strong>{profile?.company || "Not specified"}</strong>
            </div>

            <div className="alumni-profile-detail">
              <span>Job Role</span>

              <strong>{profile?.jobRole || "Not specified"}</strong>
            </div>

            <div className="alumni-profile-detail">
              <span>Course</span>

              <strong>{profile?.course || "Not specified"}</strong>
            </div>

            <div className="alumni-profile-detail">
              <span>Department</span>

              <strong>{profile?.department || "Not specified"}</strong>
            </div>

            <div className="alumni-profile-detail">
              <span>Graduation Year</span>

              <strong>{profile?.graduationYear || "Not specified"}</strong>
            </div>

            <div className="alumni-profile-detail">
              <span>Location</span>

              <strong>{profile?.location || "Not specified"}</strong>
            </div>
          </div>

          {/* SKILLS */}

          <div className="alumni-profile-about">
            <span>SKILLS</span>

            <p>{profile?.skills || "No skills have been added yet."}</p>
          </div>

          {/* BIO */}

          <div className="alumni-profile-about">
            <span>ABOUT</span>

            <p>
              {profile?.bio || "No professional summary has been added yet."}
            </p>
          </div>

          {/* LINKEDIN */}

          {profile?.linkedinUrl && (
            <div className="alumni-profile-linkedin">
              <span>LINKEDIN</span>

              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View LinkedIn profile
              </a>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Profile;
