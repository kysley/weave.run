export function useInternetConnection() {
  return { online: window.navigator.onLine };
}
