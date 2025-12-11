// src/notificationService.js
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Configura como as notificações devem ser tratadas quando o app está aberto.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Solicita permissão e obtém o token Expo Push Token do dispositivo.
 * @returns {string | null} O token do Expo ou null em caso de falha.
 */
export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    // Configuração de canal para Android (Importante para Android 8.0+)
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  
  // Verifica se é um dispositivo físico (para o token ser real)
  if (!Device.isDevice) {
      console.warn('Simulador não pode obter token de notificação. Retornando null.');
      return null;
  }
  
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.error("Permissão para notificações não concedida!");
    return null;
  }

  // CAPTURA TOKEN
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Token obtido para cadastro:", token);

  return token;
}