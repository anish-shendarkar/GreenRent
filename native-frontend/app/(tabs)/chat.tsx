import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getChats } from "@/api/chat";

const ChatTab = () => {
    const [chats, setChats] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        loadChats();
    }, []);

    const loadChats = async () => {
        const data = await getChats();
        console.log("Fetched chats:", data);
        setChats(data);
    };

    return (
        <View className="flex-1 bg-primary p-4">
            <Text className="mt-12 text-xl font-bold text-primaryText mb-4">
                Chats
            </Text>

            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="bg-secondary p-4 rounded-lg mb-3"
                        onPress={() => router.push(`/chat/${item.id}`)}
                    >
                        <Text className="font-semibold text-primaryText">
                            {item.listingId}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

export default ChatTab;