const API_BASE_URL = "http://localhost:8080/api";

export const getAllAlumni = async () => {
  const response = await fetch(`${API_BASE_URL}/alumni`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch alumni");
  }

  return data;
};

export const getAlumniById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/alumni/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch alumni profile");
  }

  return data;
};

export const getAlumniProfileByUserId = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/alumni/user/${userId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch alumni profile");
  }

  return data;
};

export const searchAlumniByCompany = async (company) => {
  const response = await fetch(
    `${API_BASE_URL}/alumni/search?company=${encodeURIComponent(company)}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to search alumni");
  }

  return data;
};

export const createAlumniProfile = async (profileData) => {
  const response = await fetch(`${API_BASE_URL}/alumni`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create alumni profile");
  }

  return data;
};

export const updateAlumniProfile = async (id, profileData) => {
  const response = await fetch(`${API_BASE_URL}/alumni/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update alumni profile");
  }

  return data;
};

export const deleteAlumniProfile = async (id) => {
  const response = await fetch(`${API_BASE_URL}/alumni/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete alumni profile");
  }

  return true;
};
