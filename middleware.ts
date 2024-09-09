import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_API_ROOT, DEFAULT_APP_URL, LOCAL_STORAGE_KEYS, API_ENDPOINTS } from "./config/constants";

export default async function middleware(req: NextRequest) {
    const cookies = req.cookies
    const cookie_name = LOCAL_STORAGE_KEYS.token
    const CHECK_URL = `${DEFAULT_API_ROOT}${API_ENDPOINTS.CHECK_LOGIN_STATUS}/`
    const token = cookies.get(cookie_name)

    try {
        const res = await fetch(CHECK_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token?.value}`,
            },
        });

        // if (!res.ok) {
        //     throw new Error(`Error: ${res.status}`)
        // }

        const data = await res.json()

        if (data?.logged_in) {
            return NextResponse.next()
        } else {
            const response = NextResponse.redirect(`${DEFAULT_APP_URL}/auth/login?message=token-expired`)
            response.cookies.delete(LOCAL_STORAGE_KEYS.token)
            response.cookies.delete(LOCAL_STORAGE_KEYS.user)
            response.cookies.delete(LOCAL_STORAGE_KEYS.user_id)
            response.cookies.delete(LOCAL_STORAGE_KEYS.login_status)
            return response
        }
    } catch (error) {
        // console.log("Error: ", )
        // Handle the case where the fetch fails (e.g., network error)
        const response = NextResponse.redirect(`${DEFAULT_APP_URL}/auth/login?message=network-error`)
        // response.cookies.delete(LOCAL_STORAGE_KEYS.token)
        // response.cookies.delete(LOCAL_STORAGE_KEYS.user)
        // response.cookies.delete(LOCAL_STORAGE_KEYS.user_id)
        // response.cookies.delete(LOCAL_STORAGE_KEYS.login_status)
        return response
    }
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/account/:path*",
        "/courses/:path/:path/:path+",
    ],
};
