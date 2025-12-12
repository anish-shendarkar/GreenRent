import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/api";

export async function getProfile() {
    try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            throw new Error('No auth token found');
        }
        const response = await fetch(`${API_URL}/user/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
}

export async function updateName(name: string) {
    try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            throw new Error('No auth token found');
        }
        const response = await fetch(`${API_URL}/user/profile/name`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ name }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating name:', error);
        throw error;
    }
}

export async function updatePhone(phone: string) {
    try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            throw new Error('No auth token found');
        }
        const response = await fetch(`${API_URL}/user/profile/phone`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ phone }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating phone:', error);
        throw error;
    }
}

export async function updateAddress(address: string) {
    try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            throw new Error('No auth token found');
        }
        const response = await fetch(`${API_URL}/user/profile/address`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ address }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating address:', error);
        throw error;
    }
}
