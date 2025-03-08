import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { TabConfig } from "@/src/common/resource/tab.config";
import { Fonts } from "@/src/common/resource/fonts";

export default function TabLayout() {
    const tabScreens = TabConfig.screenTabs;
    const notificationCount = 30;
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: TabConfig.colorTabs["light"].tabIconSelected,
                tabBarInactiveTintColor: TabConfig.colorTabs["light"].tabIconDefault,
                headerShown: false,
                tabBarStyle: {
                    position: "absolute",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: 20,
                    height: 60,
                    marginHorizontal: 2,
                    bottom: 10,
                    left: 20,
                    right: 20,
                    elevation: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                },
            }}
        >
            <Tabs.Screen name="index" options={{ href: null }} />
            {tabScreens.map(({ name, title, icon }) => (
                <Tabs.Screen
                    key={name}
                    name={name}
                    options={{
                        title: title,
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
});
