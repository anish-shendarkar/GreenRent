import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Image, ImageBackground } from 'expo-image'
import { icons } from '@/constants/icons'

const TabIcon = ({ focused, icon, title }: any) => (
    <View className='flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-9 justify-center items-center rounded-full overflow-hidden'>
        <Image
            source={icon}
            tintColor={focused ? '#1651FF' : '#A0A0A0'}
            style={{ width: 20, height: 20, marginRight: 10 }}
            
        />
        <Text style={{ color: focused ? '#1651FF' : '#A0A0A0', fontSize: 12, marginTop: 2 }}>
            {title}
        </Text>
    </View>
)


const _layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                },
                tabBarStyle: {
                    backgroundColor: '#1E1E1E',
                    borderRadius: 50,
                    marginHorizontal: 20,
                    marginBottom: 36,
                    position: 'absolute',
                    overflow: 'hidden',
                    borderWidth: 1,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.home}
                            title="Home"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.explore}
                            title="Search"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="listings"
                options={{
                    title: 'Listings',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.list}
                            title="Listings"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.profile}
                            title="Profile"
                        />
                    ),
                }}
            />
        </Tabs>
    )
}

export default _layout