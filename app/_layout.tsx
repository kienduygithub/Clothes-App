import { Fonts } from '@/src/common/resource/fonts';
import { ToastProvider } from '@/src/customize/toast.context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
    [Fonts.POPPINS_REGULAR]: require("@/assets/fonts/Poppins-Regular.ttf"),
    [Fonts.POPPINS_ITALIC]: require("@/assets/fonts/Poppins-Italic.ttf"),
    [Fonts.POPPINS_BOLD]: require("@/assets/fonts/Poppins-Bold.ttf"),
    [Fonts.POPPINS_LIGHT]: require("@/assets/fonts/Poppins-Light.ttf"),
    [Fonts.POPPINS_MEDIUM]: require("@/assets/fonts/Poppins-Medium.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {

  return (
    <ToastProvider>
      <>
        <StatusBar style='auto' />
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: 'Trang chủ',
              headerShown: false
            }}
          />
          <Stack.Screen
            name="(routes)/welcome-intro/index"
            options={{
              title: 'Welcome',
              headerShown: false
            }}
          />
          <Stack.Screen
            name="(routes)/sign-in/index"
            options={{
              headerShown: false,
              presentation: 'modal'
            }}
          />
          <Stack.Screen
            name="(routes)/sign-up/index"
            options={{
              headerShown: false,
              presentation: 'modal'
            }}
          />

          <Stack.Screen
            name="(routes)/product-details/index"
            options={{
              title: 'Chi tiết sản phẩm'
            }}
          />

          {/* Cart & Payment */}

          <Stack.Screen
            name="(routes)/payment/index"
            options={{
              title: 'Thanh toán',
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="(routes)/payment-success/index"
            options={{
              title: 'Thanh toán thành công',
              headerShown: false,
            }}
          />

          {/* Address */}

          <Stack.Screen
            name="(routes)/address/index"
            options={{
              title: 'Địa chỉ người dùng',
              headerTitleAlign: 'center'
            }}
          />

          <Stack.Screen
            name="(routes)/cru-address/index"
            options={{
              title: 'CRU địa chỉ người dùng',
              headerTitleAlign: 'center',
              headerShown: false
            }}
          />

          <Stack.Screen
            name="(routes)/select-address/index"
            options={{
              title: 'Chọn địa chỉ',
              headerTitleAlign: 'center',
            }}
          />

          {/* Shop */}

          <Stack.Screen
            name="(routes)/shop/index"
            options={{
              title: 'Cửa hàng',
              headerTitleAlign: 'center',
              headerShown: false
            }}
          />

          <Stack.Screen
            name="(routes)/shop-search/index"
            options={{
              title: 'Nơi tìm kiếm sản phẩm cửa hàng',
              headerTitleAlign: 'center',
              headerShown: false
            }}
          />

          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false
            }}
          />
        </Stack>
      </>
    </ToastProvider>
  );
}
