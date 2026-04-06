import { PushNotifications, Token } from '@capacitor/push-notifications';

export const initPushNotifications = async () => {
  const permission = await PushNotifications.requestPermissions();
  if (permission.receive === 'granted') {
    await PushNotifications.register();
  }

  await PushNotifications.addListener('registration', (token: Token) => {
    console.log('Push token:', token.value);
    fetch('/api/register-push-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token.value })
    }).catch(err => console.error('Failed to send token', err));
  });

  await PushNotifications.addListener('registrationError', (err) => {
    console.error('Registration error:', err.error);
  });

  await PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Notification received:', notification);
  });

  await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('Notification tapped:', notification);
  });
};