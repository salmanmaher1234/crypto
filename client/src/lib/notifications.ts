// Notification sound utility
export class NotificationSound {
  private static audioContext: AudioContext | null = null;
  private static isEnabled = true;

  // Initialize audio context
  private static getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Create a beep sound using Web Audio API
  static playNotificationSound(frequency = 800, duration = 200, volume = 0.3) {
    if (!this.isEnabled) return;

    try {
      const audioContext = this.getAudioContext();
      
      // Create oscillator for tone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Connect audio nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configure oscillator
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';
      
      // Configure gain (volume)
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      // Play sound
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Failed to play notification sound:', error);
    }
  }

  // Play new order notification (double beep)
  static playNewOrderNotification() {
    this.playNotificationSound(800, 150, 0.4);
    setTimeout(() => {
      this.playNotificationSound(1000, 150, 0.4);
    }, 200);
  }

  // Enable/disable notifications
  static setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Check if notifications are enabled
  static isNotificationEnabled() {
    return this.isEnabled;
  }
}

// Hook for managing notification preferences
export const useNotificationSound = () => {
  const playNewOrderSound = () => {
    NotificationSound.playNewOrderNotification();
  };

  const toggleNotifications = () => {
    const currentState = NotificationSound.isNotificationEnabled();
    NotificationSound.setEnabled(!currentState);
    return !currentState;
  };

  const isEnabled = NotificationSound.isNotificationEnabled();

  return {
    playNewOrderSound,
    toggleNotifications,
    isEnabled
  };
};