import { View, Text, ScrollView, Image, TouchableOpacity, Modal, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '@/constants/icons'
import { getProfile, updateAddress, updateName, updatePhone } from '@/api/profile'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const router = useRouter();

  // Edit modal states
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [isPhoneModalVisible, setIsPhoneModalVisible] = useState(false);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);

  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedAddress, setEditedAddress] = useState('');

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);
        const data = await getProfile();
        setProfile(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
        setError(errorMessage);
        if (errorMessage.toLowerCase().includes('token') ||
          errorMessage.toLowerCase().includes('unauthorized') ||
          errorMessage.toLowerCase().includes('401')) {
          await logout();
          router.push('/(auth)/login');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Handle Name Update
  const handleUpdateName = async () => {
    if (!editedName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setIsUpdating(true);
    try {
      await updateName(editedName);
      setProfile(prev => prev ? { ...prev, name: editedName } : null);
      Alert.alert('Success', 'Name updated successfully');
      setIsNameModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update name');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Phone Update
  const handleUpdatePhone = async () => {
    if (!editedPhone.trim()) {
      Alert.alert('Error', 'Phone number cannot be empty');
      return;
    }

    setIsUpdating(true);
    try {
      await updatePhone(editedPhone);
      setProfile(prev => prev ? { ...prev, phone: editedPhone } : null);
      Alert.alert('Success', 'Phone number updated successfully');
      setIsPhoneModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update phone number');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Address Update
  const handleUpdateAddress = async () => {
    if (!editedAddress.trim()) {
      Alert.alert('Error', 'Address cannot be empty');
      return;
    }

    setIsUpdating(true);
    try {
      await updateAddress(editedAddress);
      setProfile(prev => prev ? { ...prev, address: editedAddress } : null);
      Alert.alert('Success', 'Address updated successfully');
      setIsAddressModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update address');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View className='flex-1 bg-primary'>
      <SafeAreaView className='flex-1'>
        <ScrollView className='flex-1 px-5' showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: '100%', paddingBottom: 20 }}>
          <View className='flex flex-row items-center mt-5'>
            <Image
              source={icons.profile}
              style={{ width: 35, height: 35, tintColor: 'white' }}
            />
            <Text className='text-primaryText ml-4 text-2xl font-semibold'>
              Profile
            </Text>
          </View>

          {/* Profile Info */}
          {profile && !loading && (
            <View className='mt-12 space-y-6'>
              {/* Name */}
              <View className='bg-secondary p-4 rounded-lg border border-blue-100 mb-4'>
                <Text className='text-primaryText text-lg font-semibold'>Name</Text>
                <Text className='text-primaryText/80 text-base'>{profile.name}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setEditedName(profile.name);
                    setIsNameModalVisible(true);
                  }}
                  style={{ position: 'absolute', top: 16, right: 16 }}
                  activeOpacity={0.7}
                >
                  <Image
                    source={icons.edit}
                    style={{ width: 20, height: 20, tintColor: 'white' }}
                  />
                </TouchableOpacity>
              </View>

              {/* Phone */}
              <View className='bg-secondary p-4 rounded-lg border border-blue-100 mb-4'>
                <Text className='text-primaryText text-lg font-semibold'>Phone</Text>
                <Text className='text-primaryText/80 text-base'>{profile.phone}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setEditedPhone(profile.phone);
                    setIsPhoneModalVisible(true);
                  }}
                  style={{ position: 'absolute', top: 16, right: 16 }}
                  activeOpacity={0.7}
                >
                  <Image
                    source={icons.edit}
                    style={{ width: 20, height: 20, tintColor: 'white' }}
                  />
                </TouchableOpacity>
              </View>

              {/* Address */}
              <View className='bg-secondary p-4 rounded-lg border border-blue-100 mb-4'>
                <Text className='text-primaryText text-lg font-semibold'>Address</Text>
                <Text className='text-primaryText/80 text-base'>{profile.address}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setEditedAddress(profile.address);
                    setIsAddressModalVisible(true);
                  }}
                  style={{ position: 'absolute', top: 16, right: 16 }}
                  activeOpacity={0.7}
                >
                  <Image
                    source={icons.edit}
                    style={{ width: 20, height: 20, tintColor: 'white' }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Edit Name Modal */}
      <Modal
        visible={isNameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsNameModalVisible(false)}
      >
        <View className='flex-1 justify-center items-center bg-black/50'>
          <View className='bg-secondary p-6 rounded-lg w-4/5 border border-blue-100'>
            <Text className='text-primaryText text-xl font-semibold mb-4'>Edit Name</Text>

            <TextInput
              value={editedName}
              onChangeText={setEditedName}
              className='bg-primary border border-blue-100 rounded-lg p-3 text-primaryText mb-4'
              placeholder="Enter your name"
              placeholderTextColor="#666"
            />

            <View className='flex-row gap-3'>
              <TouchableOpacity
                onPress={() => setIsNameModalVisible(false)}
                className='flex-1 bg-gray-600 p-3 rounded-lg'
                disabled={isUpdating}
              >
                <Text className='text-white text-center font-semibold'>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdateName}
                className='flex-1 bg-blue-500 p-3 rounded-lg'
                disabled={isUpdating}
              >
                <Text className='text-white text-center font-semibold'>
                  {isUpdating ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Phone Modal */}
      <Modal
        visible={isPhoneModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPhoneModalVisible(false)}
      >
        <View className='flex-1 justify-center items-center bg-black/50'>
          <View className='bg-secondary p-6 rounded-lg w-4/5 border border-blue-100'>
            <Text className='text-primaryText text-xl font-semibold mb-4'>Edit Phone</Text>

            <TextInput
              value={editedPhone}
              onChangeText={setEditedPhone}
              className='bg-primary border border-blue-100 rounded-lg p-3 text-primaryText mb-4'
              placeholder="Enter your phone number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
            />

            <View className='flex-row gap-3'>
              <TouchableOpacity
                onPress={() => setIsPhoneModalVisible(false)}
                className='flex-1 bg-gray-600 p-3 rounded-lg'
                disabled={isUpdating}
              >
                <Text className='text-white text-center font-semibold'>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdatePhone}
                className='flex-1 bg-blue-500 p-3 rounded-lg'
                disabled={isUpdating}
              >
                <Text className='text-white text-center font-semibold'>
                  {isUpdating ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Address Modal */}
      <Modal
        visible={isAddressModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAddressModalVisible(false)}
      >
        <View className='flex-1 justify-center items-center bg-black/50'>
          <View className='bg-secondary p-6 rounded-lg w-4/5 border border-blue-100'>
            <Text className='text-primaryText text-xl font-semibold mb-4'>Edit Address</Text>

            <TextInput
              value={editedAddress}
              onChangeText={setEditedAddress}
              className='bg-primary border border-blue-100 rounded-lg p-3 text-primaryText mb-4'
              placeholder="Enter your address"
              placeholderTextColor="#666"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <View className='flex-row gap-3'>
              <TouchableOpacity
                onPress={() => setIsAddressModalVisible(false)}
                className='flex-1 bg-gray-600 p-3 rounded-lg'
                disabled={isUpdating}
              >
                <Text className='text-white text-center font-semibold'>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdateAddress}
                className='flex-1 bg-blue-500 p-3 rounded-lg'
                disabled={isUpdating}
              >
                <Text className='text-white text-center font-semibold'>
                  {isUpdating ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Profile