import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TabConfig } from '@/src/common/resource/tab.config';
import { Fonts } from '@/src/common/resource/fonts';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const tabScreens = TabConfig.screenTabs;
  const notificationCount = 30;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: TabConfig.colorTabs["light"].tabIconSelected,
        tabBarInactiveTintColor: TabConfig.colorTabs["light"].tabIconDefault,
        headerShown: false,
        tabBarStyle: style.tabBarStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />,
        }}
      />
      {tabScreens.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: title,
            headerShown: false,
            tabBarIcon: icon
              ? ({ color }) => (
                <View>
                  <FontAwesome
                    size={name === "notification/index" ? 22 : 24}
                    name={icon}
                    color={color}
                  />
                  {name === "notification/index" && notificationCount > 0 && (
                    <View style={style.notifiWrapper}>
                      <Text style={style.notifyText}>{notificationCount}</Text>
                    </View>
                  )}
                  {name === "cart/index" && notificationCount > 0 && (
                    <View style={style.notifiWrapper}>
                      <Text style={style.notifyText}>{notificationCount}</Text>
                    </View>
                  )}
                </View>
              )
              : undefined,
          }}
        />
      ))}
    </Tabs>
  );
}

const style = StyleSheet.create({
  notifiWrapper: {
    position: "absolute",
    right: -8,
    top: -6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFF",
    width: 20,
    height: 20,
  },
  notifyText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: Fonts.POPPINS_REGULAR,
  },
  tabBarStyle: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    height: 60,
    bottom: 10,
    left: 20,
    right: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  }
});
