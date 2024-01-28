export default class Device {
   static isIphone = (): boolean => /iphone|ipod|ipad/i.test(window.navigator.userAgent);
   static isAndroid = (): boolean => /android/i.test(window.navigator.userAgent);
   static isMobile = (): boolean => /Mobi/i.test(window.navigator.userAgent);
   static isDesktop = (): boolean => !Device.isMobile();
   static isPwa = (): boolean => window.matchMedia('(display-mode: standalone)').matches;
   static isTouchScreen = (): boolean => 'ontouchstart' in window;
   static hasInstalledApp = (): boolean => !window.matchMedia('(display-mode: browser)').matches;
   static isUsingBrowser = (): boolean => window.matchMedia('(display-mode: browser)').matches;
   static isOnline = (): boolean => window.navigator.onLine;
   static hasPushNotifSupport = (): boolean => 'PushManager' in window;
   static isSystemDarkTheme = (): boolean =>
      window.matchMedia(`(prefers-color-scheme: dark)`).matches;
}
