import { API_URL } from '../constants/api';

export async function loginAPI(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        throw new Error('Login failed');
    }
    return response.json();
}

export async function signupAPI(email: string, password: string, name: string, phone: string, address: string) {
    const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name, phone, address }),
    });
    if (!response.ok) {
        throw new Error('Signup failed');
    }
    return response.json();
}

// Logout function can be handled client-side by clearing tokens or session data
