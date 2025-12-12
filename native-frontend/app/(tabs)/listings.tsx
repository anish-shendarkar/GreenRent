import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
import { getListings } from '@/api/listing';
import ListingCard from '../components/ListingCard';

const listings = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true);
        setError(null);
        const data = await getListings();
        setListings(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listings:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch listings';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  return (
    <View className='flex-1 bg-primary'>
      <View className='mt-12'>
        <Text className='text-primaryText text-center text-lg font-bold mb-4'>Your Listings</Text>
        <FlatList
          data={listings}
          renderItem={({ item }) => <ListingCard {...item} />}
          keyExtractor={(item) => item.id}
          className='px-5'
          numColumns={1}
        />
      </View>
    </View>
  )
}

export default listings