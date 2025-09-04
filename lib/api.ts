// lib/api.ts

const getAuthToken = (): string | null => {
  // This function can be expanded later if you move to httpOnly cookies
  return localStorage.getItem("medai-token");
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // Try to parse the error message from the backend
    const errorData = await response.json().catch(() => ({})); // Gracefully handle non-json errors
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const token = getAuthToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  post: async <T>(endpoint: string, body: any): Promise<T> => {
    const token = getAuthToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  put: async <T>(endpoint: string, body: any): Promise<T> => {
    const token = getAuthToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  patch: async <T>(endpoint: string, body: any): Promise<T> => {
    const token = getAuthToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },
};

export default api;