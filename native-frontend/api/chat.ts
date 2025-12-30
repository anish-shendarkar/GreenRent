import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getOrCreateChat(listingId: number) {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
        throw new Error("No auth token found");
    }
    const res = await fetch(`${API_URL}/user/chat/new/${listingId}`, { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    
    if (!res.ok) {
        const text = await res.text();
        console.error("getOrCreateChat error:", text);
        throw new Error(`Server error: ${res.status}`);
    }
    
    return res.json();
}

export async function getMessages(chatId: number) {
    const token = await AsyncStorage.getItem("authToken");
    const res = await fetch(`${API_URL}/user/chat/${chatId}/messages`, { 
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });
    
    if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
    }
    
    return res.json();
}

export async function postMessage(chatId: number, content: string) {
    const token = await AsyncStorage.getItem("authToken");
    const res = await fetch(`${API_URL}/user/chat/${chatId}/message`, { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ content }), 
    });
    
    if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
    }
    
    return res.json();
}

export async function getChats() {
    const token = await AsyncStorage.getItem("authToken");
    const res = await fetch(`${API_URL}/user/chat/allchats`, { 
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });
    
    if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
    }
    
    return res.json();
}