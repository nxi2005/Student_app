import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const subscribeToPush = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push messaging is not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      const response = await axios.get(`${API}/notifications/vapid-public-key`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const publicVapidKey = response.data.publicKey;
      
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });
    }

    // Send subscription to server
    await axios.post(`${API}/notifications/push-subscription`, 
      { subscription },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    
    console.log('Push subscription saved.');
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
  }
};
