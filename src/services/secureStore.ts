
import * as SecureStore from "expo-secure-store";

export class SecureStorage {

    public static async set(key: string, value: string): Promise<void> {
        try {
            await SecureStore.setItemAsync(key, value);
        } catch (error) {
            console.error(`Failed to set secure storage key '${key}':`, error);
            throw new Error(`SecureStore.set failed for key '${key}': ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public static async get(key: string): Promise<string | null> {
        try {
            const value = await SecureStore.getItemAsync(key);
            return value;
        } catch (error) {
            console.error(`Failed to get secure storage key '${key}':`, error);
            throw new Error(`SecureStore.get failed for key '${key}': ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public static async remove(key: string): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (error) {
            console.error(`Failed to remove secure storage key '${key}':`, error);
            throw new Error(`SecureStore.remove failed for key '${key}': ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public static async clear(): Promise<void> {
        try {
            await Promise.all([
                SecureStore.deleteItemAsync("accessToken"),
                SecureStore.deleteItemAsync("refreshToken"),
                SecureStore.deleteItemAsync("user"),
            ]);
        } catch (error) {
            console.error("Failed to clear secure storage:", error);
            throw new Error(`SecureStore.clear failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}