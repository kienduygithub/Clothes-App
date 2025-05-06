import { Fonts } from '@/src/common/resource/fonts';
import { ToastProvider } from '@/src/customize/toast.context';
import store from '@/src/data/store/store.config';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';

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
    <Provider store={store}>
      <ToastProvider>
        <StatusBar />
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
            name="(routes)/search-result/index"
            options={{
              title: 'Tìm kiếm sản phẩm',
              headerTitleAlign: 'center',
              headerShown: false
            }}
          />

          <Stack.Screen
            name="(routes)/info-detail/index"
            options={{
              title: 'Chi tiết người dùng',
              headerTitleAlign: 'center',
              headerShown: false
            }}
          />

          {/* Chatbot */}
          <Stack.Screen
            name="(routes)/chatbot/index"
            options={{
              title: 'Chatbot hỏi đáp',
              headerTitleAlign: 'center',
              headerShown: false
            }}
          />
          {/* Explore */}
          <Stack.Screen
            name="(routes)/category-search/index"
            options={{
              title: 'Tìm kiếm danh mục',
              headerTitleAlign: 'center',
              headerShown: false
            }}
          />

          {/* Favorite */}
          <Stack.Screen
            name="(routes)/favorite/index"
            options={{
              title: 'Danh sách sản phẩm yêu thích',
              headerTitleAlign: 'center',
              headerShown: false
            }}
          />

          {/* Order Manage */}
          <Stack.Screen
            name="(routes)/order-manage/index"
            options={{
              title: 'Quản lý đơn hàng',
              headerTitleAlign: 'center',
              headerShown: false
            }}
          />

          <Stack.Screen
            name="(routes)/order-detail/index"
            options={{
              title: 'Chi tiết đơn hàng',
              headerTitleAlign: 'center',
              headerShown: false
            }}
          />

          <Stack.Screen
            name="(routes)/review/index"
            options={{
              title: 'Quản lý đánh giá',
              headerTitleAlign: 'center',
              headerShown: false
            }}
          />

          <Stack.Screen
            name="(routes)/product-review/index"
            options={{
              title: 'Danh sách đánh giá sản phẩm',
              headerTitleAlign: 'center',
              headerShown: false
            }}
          />

          <Stack.Screen
            name="(routes)/register-shop/index"
            options={{
              title: 'Đăng ký cửa hàng',
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
      </ToastProvider>
    </Provider>
  );
}
