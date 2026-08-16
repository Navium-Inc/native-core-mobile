import { apiFetch } from "./fetch";


export const getUserPostCount = async (username: string) => {
    console.log(username);
    return (await apiFetch(`/api/v1/account/posts/count?username=${username}`)).count
}