// app/listing/[id].tsx
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { getListingById } from '@/api/listing'
import { icons } from '@/constants/icons'
import { getOrCreateChat } from '@/api/chat'

export interface Owner {
  name: string
  phone: number,
  email: string
}

interface Listing {
  id: number
  name: string
  description: string
  pricePerDay: number
  advancePayment: number
  available: boolean
  imageUrl?: string | null
  phone?: number
  owner: Owner
}

export default function ListingDetails() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasRented, setHasRented] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch listing details
        const data = await getListingById(Number(id))
        setListing(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load listing'
        setError(errorMessage)
        console.error('Error fetching listing:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchListingDetails()
    }
  }, [id])

  const handleCall = () => {
    console.log(listing?.owner.phone);
    if (!listing?.owner.phone) {
      Alert.alert('Error', 'Owner phone number not available')
      return
    }

    Alert.alert(
      'Call Owner',
      `Do you want to call ${listing.owner.name || 'the owner'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${listing.owner.phone}`)
          }
        }
      ]
    )
  }

  const handleChat = async () => {
    if (!listing) return;

    try {
      // Create or get existing chat
      const chatData = await getOrCreateChat(listing.id);

      // Navigate to the chat
      router.push(`/chat/${chatData.id}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      Alert.alert("Error", "Failed to start chat. Please try again.");
    }
  };

  const handleReview = () => {
    if (!hasRented) {
      Alert.alert(
        'Cannot Review',
        'You can only review items that you have rented before.',
        [{ text: 'OK' }]
      )
      return
    }
  }

  const handleRentNow = () => {
    if (!listing) return

    if (!listing.available) {
      Alert.alert('Unavailable', 'This item is currently not available for rent')
      return
    }
  }

  if (loading) {
    return (
      <View className='flex-1 bg-primary justify-center items-center'>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className='text-primaryText/60 mt-4'>Loading listing...</Text>
      </View>
    )
  }

  if (error || !listing) {
    return (
      <View className='flex-1 bg-primary justify-center items-center px-5'>
        <Text className='text-red-500 text-lg text-center mb-4'>
          {error || 'Listing not found'}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className='bg-blue-500 px-6 py-3 rounded-lg'
        >
          <Text className='text-white font-semibold'>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className='flex-1 bg-primary'>
      <SafeAreaView className='flex-1'>
        {/* Header */}
        <View className='flex-row items-center justify-between px-5 py-4 border-b border-blue-100/30'>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Image
              source={icons.back}
              style={{ width: 24, height: 24, tintColor: 'white' }}
            />
          </TouchableOpacity>
          <Text className='text-primaryText text-lg font-semibold'>Listing Details</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image */}
          {listing.imageUrl ? (
            <Image
              source={{ uri: listing.imageUrl }}
              className='w-full h-80'
              resizeMode='cover'
            />
          ) : (
            <View className='w-full h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 justify-center items-center'>
              <Text className='text-8xl'>📦</Text>
            </View>
          )}

          {/* Availability Badge */}
          <View className='absolute top-4 right-4'>
            <View className={`px-4 py-2 rounded-full ${listing.available ? 'bg-green-500' : 'bg-red-500'}`}>
              <Text className='text-white font-bold text-sm'>
                {listing.available ? 'Available' : 'Not Available'}
              </Text>
            </View>
          </View>

          {/* Content */}
          <View className='px-5 py-6'>
            {/* Title */}
            <Text className='text-primaryText text-3xl font-bold mb-2'>
              {listing.name}
            </Text>

            {/* Pricing */}
            <View className='flex-row items-center gap-4 mb-6'>
              <View className='bg-secondary px-4 py-2 rounded-lg border border-blue-100'>
                <Text className='text-primaryText/60 text-xs'>Per Day</Text>
                <Text className='text-primaryText text-2xl font-bold'>
                  ${listing.pricePerDay}
                </Text>
              </View>
              <View className='bg-secondary px-4 py-2 rounded-lg border border-blue-100'>
                <Text className='text-primaryText/60 text-xs'>Advance</Text>
                <Text className='text-primaryText text-2xl font-bold'>
                  ${listing.advancePayment}
                </Text>
              </View>
            </View>

            {/* Description */}
            <View className='mb-6'>
              <Text className='text-primaryText text-xl font-semibold mb-3'>Description</Text>
              <Text className='text-primaryText/80 text-base leading-6'>
                {listing.description}
              </Text>
            </View>

            {/* Action Buttons Row 1: Call, Chat, Review */}
            <View className='flex-row gap-3 mb-4'>
              <TouchableOpacity
                onPress={handleCall}
                className='flex-1 bg-green-500/20 border border-green-500 py-4 rounded-lg flex-row items-center justify-center'
                activeOpacity={0.7}
              >
                <Text className='text-4xl mr-2'>📞</Text>
                <Text className='text-green-500 font-semibold text-base'>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleChat}
                className='flex-1 bg-blue-500/20 border border-blue-500 py-4 rounded-lg flex-row items-center justify-center'
                activeOpacity={0.7}
              >
                <Text className='text-4xl mr-2'>💬</Text>
                <Text className='text-blue-500 font-semibold text-base'>Chat</Text>
              </TouchableOpacity>
            </View>

            {/* Review Button */}
            <TouchableOpacity
              onPress={handleReview}
              className={`py-4 rounded-lg flex-row items-center justify-center mb-4 border ${hasRented
                ? 'bg-yellow-500/20 border-yellow-500'
                : 'bg-gray-500/10 border-gray-500/30'
                }`}
              activeOpacity={0.7}
            >
              <Text className='text-4xl mr-2'>⭐</Text>
              <Text className={`font-semibold text-base ${hasRented ? 'text-yellow-500' : 'text-gray-500'
                }`}>
                {hasRented ? 'Rate & Review' : 'Review (Rent First)'}
              </Text>
            </TouchableOpacity>

            {/* Rent Now Button */}
            <TouchableOpacity
              onPress={handleRentNow}
              disabled={!listing.available}
              className={`py-5 rounded-lg ${listing.available
                ? 'bg-blue-500'
                : 'bg-gray-500/30'
                }`}
              activeOpacity={0.7}
            >
              <Text className='text-white text-center font-bold text-lg'>
                {listing.available ? 'Rent Now' : 'Currently Unavailable'}
              </Text>
            </TouchableOpacity>

            {/* Info Note */}
            {!hasRented && (
              <View className='mt-4 bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg'>
                <Text className='text-yellow-500/80 text-sm text-center'>
                  💡 You can only review this item after renting it
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}