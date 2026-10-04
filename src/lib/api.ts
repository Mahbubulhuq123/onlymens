/**
 * API Integration Structure
 * 
 * This file outlines the API structure that will connect the Next.js frontend
 * to the Python/FastAPI backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Generic fetch wrapper with auth
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // In a real app, you would get the token from cookies or local storage
  const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  auth: {
    login: (credentials: any) => fetchWithAuth("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
    register: (userData: any) => fetchWithAuth("/auth/register", { method: "POST", body: JSON.stringify(userData) }),
    me: () => fetchWithAuth("/auth/me", { method: "GET" }),
  },
  
  services: {
    list: () => fetchWithAuth("/services", { method: "GET" }),
  },
  
  bookings: {
    create: (bookingData: any) => fetchWithAuth("/bookings", { method: "POST", body: JSON.stringify(bookingData) }),
    getAvailableHelpers: (bookingId: string) => fetchWithAuth(`/bookings/${bookingId}/helpers`, { method: "GET" }),
    requestHelper: (bookingId: string, helperId: string) => fetchWithAuth(`/bookings/${bookingId}/request`, { method: "POST", body: JSON.stringify({ helperId }) }),
    status: (bookingId: string) => fetchWithAuth(`/bookings/${bookingId}/status`, { method: "GET" }),
  },
  
  helper: {
    updateLocation: (lat: number, lng: number) => fetchWithAuth("/helper/location", { method: "PUT", body: JSON.stringify({ lat, lng }) }),
    toggleStatus: (isOnline: boolean) => fetchWithAuth("/helper/status", { method: "PUT", body: JSON.stringify({ isOnline }) }),
    getNearbyJobs: () => fetchWithAuth("/helper/jobs/nearby", { method: "GET" }),
    acceptJob: (bookingId: string) => fetchWithAuth(`/bookings/${bookingId}/accept`, { method: "POST" }),
  },
  
  admin: {
    getStats: () => fetchWithAuth("/admin/stats", { method: "GET" }),
    getPendingVerifications: () => fetchWithAuth("/admin/verifications/pending", { method: "GET" }),
    approveVerification: (helperId: string) => fetchWithAuth(`/admin/verifications/${helperId}/approve`, { method: "POST" }),
  }
};
