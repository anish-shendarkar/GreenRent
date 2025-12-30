import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getListings() {
    try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            throw new Error('No auth token found');
        }
        const response = await fetch(`${API_URL}/user/listing/listings`, {
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
        return data.map((listing: any) => ({
            ...listing,
            imageUrl:
                listing.media?.length > 0
                ? `${API_URL}/${listing.media[0].url}`
                :null,
        }));
    } catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
    }
}

export async function getListingById(listingId: number) {
    try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            throw new Error('No auth token found');
        }
        const response = await fetch(`${API_URL}/user/listing/${listingId}`, {
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
        console.error('Error fetching listing:', error);
        throw error;
    }
}