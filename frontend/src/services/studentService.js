const API_BASE_URL = "http://localhost:8080/api";

export const getAllStudents = async () => {
  const response = await fetch(`${API_BASE_URL}/students`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch students");
  }

  return data;
};

export const getStudentById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/students/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch student");
  }

  return data;
};

export const getStudentProfileByUserId = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/students/user/${userId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch student profile");
  }

  return data;
};

export const updateStudentProfile = async (id, profileData) => {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update student profile");
  }

  return data;
};

export const createStudentProfile = async (profileData) => {
  const response = await fetch(`${API_BASE_URL}/students`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create student profile");
  }

  return data;
};

export const deleteStudentProfile = async (id) => {
  const response = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete student profile");
  }

  return true;
};
