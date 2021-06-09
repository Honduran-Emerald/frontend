import * as SecureStore from 'expo-secure-store';

// Returns
// A promise that will reject if value cannot be stored on the device.
export async function saveItemLocally(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

// Returns:
// A promise that resolves to the previously stored value, or null if there is no entry for the given key.
// The promise will reject if an error occurred while retrieving the value.
export async function loadItemLocally(key: string) {
  return await SecureStore.getItemAsync(key);
}

// Returns
// A promise that will reject if the value couldn't be deleted.
export async function deleteItemLocally(key: string){
  await SecureStore.deleteItemAsync(key);
}
