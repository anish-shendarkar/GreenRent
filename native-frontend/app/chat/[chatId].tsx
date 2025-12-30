import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { API_URL } from "@/constants/api";
import { getMessages, postMessage } from "@/api/chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const socket = io(API_URL, { autoConnect: false });

export default function ChatDetail() {
    const params = useLocalSearchParams();
    const chatId =
        Array.isArray(params.chatId)
            ? params.chatId[0]
            : params.chatId;
    const chatIdNum = Number(chatId);
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const socketRef = useRef<any>(null);
    const userIdRef = useRef<string | null>(null);

    useEffect(() => {
        const initChat = async () => {
            try {
                // Get userId once
                userIdRef.current = await AsyncStorage.getItem("userId");
                const token = await AsyncStorage.getItem("authToken");

                if (!token) {
                    setError("Authentication required");
                    setLoading(false);
                    router.replace("/login");
                    return;
                }

                // Load messages
                await loadMessages();

                // Connect socket
                socketRef.current = io(API_URL, {
                    auth: {
                        token: token
                    },
                    transports: ['websocket', 'polling']
                });

                socketRef.current.on("connect", () => {
                    console.log("Socket connected");
                    socketRef.current?.emit("join-chat", Number(chatId));
                });

                socketRef.current.on("new-message", (msg: any) => {
                    console.log("New message received:", msg);
                    const messageWithMine = {
                        ...msg,
                        isMine: msg.senderId === parseInt(userIdRef.current || "0")
                    };
                    console.log("Processed message:", messageWithMine);
                    setMessages((prev) => {
                        // Prevent duplicates
                        const exists = prev.some(m => m.id === msg.id);
                        if (exists) {
                            console.log("Message already exists, skipping");
                            return prev;
                        }
                        const currentUserId = parseInt(userIdRef.current || "0");
                        const isMine = msg.senderId === currentUserId;
                        const messageWithMine = {
                            ...msg,
                            isMine: isMine
                        };

                        return [messageWithMine, ...prev];
                    });
                });

                socketRef.current.on("connect_error", (err: any) => {
                    console.error("Socket connection error:", err.message);
                    setError("Failed to connect to chat server");
                });

                socketRef.current.on("disconnect", (reason: any) => {
                    console.log("Socket disconnected:", reason);
                });

            } catch (err) {
                console.error("Chat init error:", err);
                setError("Failed to load chat");
            } finally {
                setLoading(false);
            }
        };

        initChat();

        return () => {
            if (socketRef.current) {
                socketRef.current.off("connect");
                socketRef.current.off("new-message");
                socketRef.current.off("connect_error");
                socketRef.current.off("disconnect");
                socketRef.current.disconnect();
            }
        };
    }, [chatId]);

    const loadMessages = async () => {
        // if(isNaN(chatIdNum)) return;

        try {
            const data = await getMessages(chatIdNum);
            console.log("Chat messages fetched:", chatIdNum);
            console.log("Messages loaded:", data);
            // Reverse for inverted FlatList
            setMessages(data.reverse());

            setError("");
        } catch (err) {
            console.error("Error loading messages:", err);
            setError("Failed to load messages");
        }
    };

    const sendMessage = async () => {
        if (!text.trim()) return;

        const messageContent = text.trim();
        setText("");
        console.log("Sending message:", messageContent);

        try {
            const response = await postMessage(chatIdNum, messageContent);
            console.log("Message sent:", response);
        } catch (err) {
            console.error("Error sending message:", err);
            setError("Failed to send message");
            setText(messageContent);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-primary justify-center items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-primaryText/60 mt-4">Loading chat...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-primary" edges={['top']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={0}
            >
                {error ? (
                    <View className="p-3 bg-red-500/20 border-b border-red-500">
                        <Text className="text-red-500 text-center">{error}</Text>
                    </View>
                ) : null}

                {/* Messages */}
                <FlatList
                    data={messages}
                    inverted
                    keyExtractor={(item) => item.id.toString()}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ padding: 12, flexGrow: 1, justifyContent: 'flex-end' }}
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-primaryText/60 text-center">
                                No messages yet.{"\n"}Start the conversation!
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View
                            className={`p-3 my-1 rounded-lg max-w-[75%] ${item.isMine
                                ? "bg-blue-500 self-end"
                                : "bg-secondary self-start"
                                }`}
                        >
                            <Text className="text-white">{item.content}</Text>
                            <Text className="text-white/60 text-xs mt-1">
                                {new Date(item.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Text>
                        </View>
                    )}
                />

                {/* Input */}
                <View className="flex-row items-center p-3 border-t border-gray-700 bg-primary">
                    <TextInput
                        value={text}
                        onChangeText={setText}
                        placeholder="Type a message..."
                        placeholderTextColor="#aaa"
                        className="flex-1 bg-secondary rounded-full px-4 py-3 text-white"
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        className="ml-2 px-4 py-3"
                        disabled={!text.trim()}
                    >
                        <Text className={`font-bold ${text.trim() ? 'text-blue-500' : 'text-gray-500'}`}>
                            Send
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
