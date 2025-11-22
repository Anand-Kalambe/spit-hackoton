const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Generic handler for HTTP requests
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle Backend Errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `API Error: ${response.status} ${response.statusText}`);
    }

    // Handle empty responses (common for DELETE or void returns)
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);

  } catch (error) {
    console.error(`API Request Failed: ${endpoint}`, error);
    throw error;
  }
}

// --- API Methods ---

export const api = {
  // GET request
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),

  // POST request
  post: <T>(endpoint: string, body: any) => 
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  // PUT request
  put: <T>(endpoint: string, body: any) => 
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),

  // DELETE request
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};