
import { UserRecord } from '../models/types';

const USER_SERVICE_URL = "http://localhost:8081/register";

/**
 * Service to handle user registration via the Spring Boot User Service.
 * Attempts a real API call and falls back to mock data if the server is unreachable.
 */
export const registerUser = async (name: string, email: string): Promise<UserRecord> => {
  try {
    const response = await fetch(USER_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Map the backend response to our internal UserRecord structure
    // Backend sample: { id: 6, name: "Gaurav", email: "...", createdAt: "2026-02-19T..." }
    return {
      id: data.id.toString(),
      name: data.name,
      email: data.email,
      createdAt: data.createdAt 
        ? new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
        : new Date().toLocaleTimeString()
    };
  } catch (error) {
    console.warn("Backend API (8081) unreachable or failed. Simulation mode active.", error);
    
    // Fallback logic: Create a local mock record to keep the UI functional
    return {
      id: `local-${Math.floor(Math.random() * 10000)}`,
      name: name,
      email: email,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  }
};
