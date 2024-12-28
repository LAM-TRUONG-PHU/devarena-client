import { useEffect } from "react";
import { getSession } from "next-auth/react";
import { mainInstance } from "@/axios/MainInstance";

// Tạo một Axios instance

// Hook usePrivate để gắn interceptor
export const usePrivate = () => {
  useEffect(() => {
    // Thêm interceptor khi component mount
    const requestInterceptor = mainInstance.interceptors.request.use(
      async (config) => {
        try {
          const session = await getSession(); // Lấy session từ NextAuth
          console.log("session");

          if (session?.access_token) {
            const bear = `Bearer ${session.access_token}`;

            config.headers["Authorization"] = bear;
            console.log(bear);
          }
        } catch (error) {
          console.error("Error attaching token:", error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Cleanup: xóa interceptor khi component unmount
    return () => {
      axiosInstancePrivate.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  return axiosInstancePrivate;
};
