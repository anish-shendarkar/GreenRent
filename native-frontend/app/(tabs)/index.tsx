import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getUserRentals } from '@/api/rental'
import { useRouter } from 'expo-router'

interface Listing {
  id: number
  ownerId: number
  name: string
  description: string
  pricePerDay: number
  advancePayment: number
  available: boolean
  availableFrom: string
  createdAt: string
}

interface Rental {
  id: number
  listingId: number
  renterId: number
  startDate: string
  endDate: string
  totalPrice: number
  status: string
  createdAt: string
  listing: Listing
}

export default function Index() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchRentals = async () => {
    try {
      setError(null)
      const data = await getUserRentals()
      setRentals(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load rentals'
      console.error('Error fetching rentals:', errorMessage, err)
      setError(errorMessage)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchRentals()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchRentals()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
      case 'ACTIVE':
        return 'bg-green-500/20 border-green-500'
      case 'COMPLETED':
        return 'bg-gray-500/20 border-gray-500'
      case 'PENDING':
        return 'bg-yellow-500/20 border-yellow-500'
      case 'CANCELLED':
        return 'bg-red-500/20 border-red-500'
      default:
        return 'bg-blue-500/20 border-blue-500'
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
      case 'ACTIVE':
        return 'text-green-500'
      case 'COMPLETED':
        return 'text-gray-500'
      case 'PENDING':
        return 'text-yellow-500'
      case 'CANCELLED':
        return 'text-red-500'
      default:
        return 'text-blue-500'
    }
  }

  if (loading) {
    return (
      <View className='flex-1 bg-primary justify-center items-center'>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className='text-primaryText/60 mt-4'>Loading your rentals...</Text>
      </View>
    )
  }

  return (
    <View className='flex-1 bg-primary'>
      <SafeAreaView className='flex-1'>
        <ScrollView
          className='flex-1'
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />
          }
        >
          {/* Header */}
          <View className='px-5 pt-5 pb-4'>
            <Text className='text-primaryText text-3xl font-bold'>My Rentals</Text>
            <Text className='text-primaryText/60 text-base mt-1'>
              {rentals.length} {rentals.length === 1 ? 'item' : 'items'} rented
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className='mx-5 mb-4 bg-red-500/20 border border-red-500 p-4 rounded-lg'>
              <Text className='text-red-500 font-semibold'>{error}</Text>
            </View>
          )}

          {/* Rentals List */}
          {rentals.length === 0 ? (
            <View className='flex-1 justify-center items-center px-5 py-20'>
              <Text className='text-primaryText/40 text-lg text-center'>
                No rentals yet
              </Text>
              <Text className='text-primaryText/30 text-sm text-center mt-2'>
                Start browsing items to rent!
              </Text>
            </View>
          ) : (
            <View className='px-5 pb-5'>
              {rentals.map((rental) => (
                <TouchableOpacity
                  key={rental.id}
                  className='bg-secondary rounded-lg border border-blue-100 mb-4 overflow-hidden'
                  activeOpacity={0.7}
                  onPress={() => {
                    // Navigate to rental details
                    router.push({
                      pathname: '/listings/[id]',
                      params: { id: rental.listing.id },
                    })
                  }}
                >
                  {/* Item Image - Since your backend doesn't have imageUrl, show placeholder */}
                  <View className='w-full h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 justify-center items-center border-b border-blue-100/30'>
                    <Text className='text-6xl'>📦</Text>
                    <Text className='text-primaryText/60 text-sm mt-2'>{rental.listing.name}</Text>
                  </View>

                  {/* Rental Info */}
                  <View className='p-4'>
                    {/* Status Badge */}
                    <View className={`self-start px-3 py-1 rounded-full border mb-3 ${getStatusColor(rental.status)}`}>
                      <Text className={`text-xs font-semibold uppercase ${getStatusTextColor(rental.status)}`}>
                        {rental.status}
                      </Text>
                    </View>

                    {/* Item Name & Description */}
                    <Text className='text-primaryText text-xl font-bold mb-1'>
                      {rental.listing.name}
                    </Text>

                    <Text className='text-primaryText/60 text-sm mb-3' numberOfLines={2}>
                      {rental.listing.description}
                    </Text>

                    {/* Rental Period */}
                    <View className='flex-row items-center mb-2'>
                      <Text className='text-primaryText/80 text-sm'>
                        📅 {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                      </Text>
                    </View>

                    {/* Price */}
                    <View className='flex-row items-center justify-between mt-3 pt-3 border-t border-blue-100/30'>
                      <Text className='text-primaryText/60 text-sm'>Total Price</Text>
                      <Text className='text-primaryText text-xl font-bold'>
                        ₹{rental.totalPrice.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({})