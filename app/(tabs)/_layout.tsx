import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { TabConfig } from '@/src/common/resource/tab.config';
import { Fonts } from '@/src/common/resource/fonts';
import { AppConfig } from '@/src/common/config/app.config';
import * as UserManagement from "@/src/data/management/user.management";
import * as CartManagement from "@/src/data/management/cart.management";
import * as UserActions from "@/src/data/store/actions/user/user.action";
import * as CartActions from "@/src/data/store/actions/cart/cart.action";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/data/types/global';
import { UserStoreState } from '@/src/data/store/reducers/user/user.reducer';
import { CartStoreState } from '@/src/data/store/reducers/cart/cart.reducer';

export default function TabLayout() {
  const notificationCount = 0;
  const preImage = new AppConfig().getPreImage();
  const userSelector = useSelector((state: RootState) => state.userLogged) as UserStoreState;
  const cartSelector = useSelector((state: RootState) => state.cart) as CartStoreState;
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUserInfo();
    fetchCart();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const user = await UserManagement.fetchInfoUser();
      dispatch(UserActions.SaveInfoLogged(user));
    } catch (error) {
      console.log(error);
    }
  }

  const fetchCart = async () => {
    try {
      const response = await CartManagement.fetchCartByUser();
      dispatch(CartActions.SaveCart(response));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: TabConfig.colorTabs["light"].tabIconSelected,
        tabBarInactiveTintColor: TabConfig.colorTabs["light"].tabIconDefault,
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

      <Tabs.Screen
        name="search/index"
        options={{
          title: "Khám phá",
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={24} name={'search'} color={color} />,
        }}
      />

      <Tabs.Screen
        name="notification/index"
        options={{
          title: "News",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <View>
              <FontAwesome size={20} name={'bell'} color={color} />
              {notificationCount > 0 && (
                <View style={style.notifiWrapper}>
                  <Text style={style.notifyText}>{notificationCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="cart/index"
        options={{
          title: "Giỏ hàng",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <View>
              <FontAwesome size={22} name={'shopping-cart'} color={color} />
              {notificationCount > 0 && (
                <View style={style.notifiWrapper}>
                  <Text style={style.notifyText}>{notificationCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="me/index"
        options={{
          title: "Tài khoản",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <View>
              <FontAwesome size={24} name={'user'} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const style = StyleSheet.create({
  notifiWrapper: {
    position: "absolute",
    right: -10,
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
    // position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    // borderRadius: 20,
    height: 60,
    // bottom: 10,
    // left: 20,
    // right: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  }
});
