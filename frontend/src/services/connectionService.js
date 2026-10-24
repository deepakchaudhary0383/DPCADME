const API_BASE_URL = "http://localhost:8080/api";

export const sendConnectionRequest = async (studentId, alumniId) => {
  const response = await fetch(
    `${API_BASE_URL}/connections/request?studentId=${studentId}&alumniId=${alumniId}`,
    {
      method: "POST",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send connection request");
  }

  return data;
};

export const getAllConnections = async () => {
  const response = await fetch(`${API_BASE_URL}/connections`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch connections");
  }

  return data;
};

export const getConnectionsByStudent = async (studentId) => {
  const response = await fetch(
    `${API_BASE_URL}/connections/student/${studentId}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch student connections");
  }

  return data;
};

export const getConnectionsByAlumni = async (alumniId) => {
  const response = await fetch(
    `${API_BASE_URL}/connections/alumni/${alumniId}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch alumni connections");
  }

  return data;
};

export const acceptConnection = async (id) => {
  const response = await fetch(`${API_BASE_URL}/connections/${id}/accept`, {
    method: "PUT",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to accept connection");
  }

  return data;
};

export const rejectConnection = async (id) => {
  const response = await fetch(`${API_BASE_URL}/connections/${id}/reject`, {
    method: "PUT",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to reject connection");
  }

  return data;
};
