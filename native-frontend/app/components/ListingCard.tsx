import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

const ListingCard = ({
  id,
  name,
  description,
  pricePerDay,
  advancePayment,
  available,
  imageUrl
}: Listing) => {
  return (
    <Link href={`/listings/${id}`} asChild>
      <TouchableOpacity className="bg-secondary p-4 rounded-lg mb-4 border border-blue-100 flex-row">
        
        {/* LEFT SIDE - IMAGE */}
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-20 h-20 rounded-lg mr-4"
            resizeMode="cover"
          />
        ) : (
          <View className="w-20 h-20 rounded-lg bg-gray-300 mr-4" />
        )}

        {/* RIGHT SIDE - TEXT */}
        <View className="flex-1">
          <Text className="text-lg text-primaryText font-bold">{name}</Text>
          <Text className="text-primaryText mt-1 number-of-lines-2">
            {description}
          </Text>

          <Text className="text-green-500 mt-2 font-semibold">
            ₹{pricePerDay}/day
          </Text>
        </View>

      </TouchableOpacity>
    </Link>
  );
};

export default ListingCard;
