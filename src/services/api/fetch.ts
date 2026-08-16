
const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL ?? "https://api.aurenith.space"

type FetchOptions = RequestInit & {
    token?: string;
};


export async function apiFetch<T>(
    endpoint: string,
    options: FetchOptions = {}
) {
    const { token, headers, ...rest } = options;

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...rest,
        headers: {
            "Content-Type": "application/json",
            ...(token && {
                Authorization: `Bearer ${token}`,
            }),
            ...headers
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
}