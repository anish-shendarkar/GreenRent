import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/api';

export async function getUserRentals(): Promise<Rental[]> {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('No auth token found');
    }
    
    const response = await fetch(`${API_URL}/user/rental/getrentals`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If response is not JSON, use the default error message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user rentals:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch rentals');
  }
}

// export async function getRentalById(rentalId: string): Promise<Rental> {
//   try {
//     const token = await AsyncStorage.getItem('authToken');
//     if (!token) {
//       throw new Error('No auth token found');
//     }

//     const response = await fetch(`${API_URL}/rentals/${rentalId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching rental:', error);
//     throw error;
//   }
// }