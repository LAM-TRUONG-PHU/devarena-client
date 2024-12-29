import axios from "axios";

// Tạo một instance
export const mainInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_MAIN_URL, // Đặt URL API gốc
    headers: {
        "Content-Type": "application/json", // Định dạng dữ liệu gửi đi
        Accept: "application/json", // Định dạng dữ liệu nhận về
    },
    withCredentials: true,
    fetchOptions: {
        credentials: "include",
    },
});
