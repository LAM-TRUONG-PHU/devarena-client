import { useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import { mainInstance } from "@/axios/MainInstance";
import { useRouter } from "next/navigation";

// Tạo một Axios instance

// Hook usePrivate để gắn interceptor
export const usePrivate = () => {
  const axiosInstancePrivate = mainInstance;
  const {data:session, update}=useSession()
  const router = useRouter()
  useEffect(() => {
    // Thêm interceptor khi component mount
    console.log(session)
    const requestInterceptor = axiosInstancePrivate.interceptors.request.use(
      async (config) => {
        try {
          const session = await getSession(); // Lấy session từ NextAuth

          if (session?.access_token) {
            const bear = `Bearer ${session.access_token}`;

            config.headers["Authorization"] = bear;
          }
        } catch (error) {
          console.error("Error attaching token:", error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    const responseInterceptor = axiosInstancePrivate.interceptors.response.use(
      (response) => response, // Trả về response nếu không có lỗi
      async (error) => {
        const originalRequest = error.config;
        // console.log(error)
        // Kiểm tra lỗi 401 với thông báo "Jwt expired"
        if (
          error.response?.status === 401 &&
          error.response?.data?.message === "Jwt expired" &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true; // Đánh dấu rằng request này đã retry
          try {
            const session = await getSession();
            const refreshToken = session?.refresh_token;

            if (refreshToken) {
              const { data } = await axiosInstancePrivate.post("/auth/refresh", {
                refreshToken: refreshToken,
              });

              // Cập nhật session (nếu cần)
              // session.access_token = data.access_token;
              // session.refresh_token = data.refresh_token;
              console.log(data.data.access_token)
              update({
                access_token: data.data.access_token,
                refresh_token: data.data.refresh_token
              })
              // Gắn token mới vào header
              // originalRequest.headers["Authorization"] = `Bearer ${data.data.access_token}`;
              return axiosInstancePrivate(originalRequest);
            }
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            router.push("/auth/login")
            // signIn(); // Redirect đến trang đăng nhập
          }
        }

        return Promise.reject(error);
      }
    );
    // Cleanup: xóa interceptor khi component unmount
    return () => {
      axiosInstancePrivate.interceptors.request.eject(requestInterceptor);
      axiosInstancePrivate.interceptors.response.eject(responseInterceptor);

    };
  }, [session]);

  return axiosInstancePrivate;
};
