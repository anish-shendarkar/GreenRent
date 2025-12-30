// app/(tabs)/search.tsx
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { searchListings } from '@/api/listing';
import { icons } from '@/constants/icons';

interface Listing {
  id: number;
  name: string;
  description: string;
  pricePerDay: number;
  imageUrl?: string | null;
  available: boolean;
}

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search function
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError('');

    // Debounce: wait 500ms after user stops typing
    const timeoutId = setTimeout(async () => {
      try {
        const data = await searchListings(query);
        setResults(data);
        setHasSearched(true);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search listings');
      } finally {
        setLoading(false);
      }
    }, 500);

    // Cleanup: cancel previous timeout if user keeps typing
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleListingPress = (listingId: number) => {
    router.push({
      pathname: '/listings/[id]',
      params: { id: listingId },
    });
  };

  const renderListingItem = ({ item }: { item: Listing }) => (
    <TouchableOpacity
      onPress={() => handleListingPress(item.id)}
      className="bg-secondary rounded-lg mb-3 overflow-hidden border border-blue-100/30"
      activeOpacity={0.7}
    >
      <View className="flex-row">
        {/* Image */}
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            className="w-24 h-24"
            resizeMode="cover"
          />
        ) : (
          <View className="w-24 h-24 bg-blue-500/20 justify-center items-center">
            <Text className="text-4xl">📦</Text>
          </View>
        )}

        {/* Content */}
        <View className="flex-1 p-3 justify-between">
          <View>
            <Text className="text-primaryText font-semibold text-base" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="text-primaryText/60 text-sm mt-1" numberOfLines={2}>
              {item.description}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-blue-500 font-bold text-lg">
              ${item.pricePerDay}/day
            </Text>
            <View
              className={`px-2 py-1 rounded-full ${item.available ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}
            >
              <Text
                className={`text-xs font-semibold ${item.available ? 'text-green-500' : 'text-red-500'
                  }`}
              >
                {item.available ? 'Available' : 'Unavailable'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Header */}
      <View className="px-5 py-4 border-b border-blue-100/30">
        <Text className="text-primaryText text-2xl font-bold">Search Listings</Text>
      </View>

      {/* Search Input */}
      <View className="px-5 py-4">
        <View className="flex-row items-center bg-secondary rounded-full px-4 py-3 border border-blue-100/30">
          <Image
            source={icons.search}
            className="w-5 h-5 mr-3"
            style={{ tintColor: '#9CA3AF' }}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name or description..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-primaryText text-base"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} className="ml-2">
              <Text className="text-primaryText/60 text-xl">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Error Message */}
      {error && (
        <View className="px-5 mb-3">
          <View className="bg-red-500/20 border border-red-500 rounded-lg p-3">
            <Text className="text-red-500 text-center">{error}</Text>
          </View>
        </View>
      )}

      {/* Results */}
      <View className="flex-1 px-5">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-primaryText/60 mt-3">Searching...</Text>
          </View>
        ) : !hasSearched ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-6xl mb-4">🔍</Text>
            <Text className="text-primaryText/60 text-center text-base">
              Search for rentals by name or description
            </Text>
          </View>
        ) : results.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-6xl mb-4">😔</Text>
            <Text className="text-primaryText text-lg font-semibold mb-2">
              No results found
            </Text>
            <Text className="text-primaryText/60 text-center">
              Try searching with different keywords
            </Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderListingItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListHeaderComponent={
              <Text className="text-primaryText/60 mb-3">
                Found {results.length} {results.length === 1 ? 'result' : 'results'}
              </Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}