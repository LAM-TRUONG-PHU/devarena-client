import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ICompileRes } from "@/types/ICompileRes";
import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { setLoading } from "@/redux/slices/admin/exerciseStudySlice"
// Cấu hình socket với các options cần thiết
const socket = io("http://localhost:3001", {
  transports: ["websocket", "polling"],
  path: "/socket.io/",
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const useSocket = ({
  uniqueId,
  onCompiling,
  onOutput,
  onError,
  onWaitingInput,
  onCompleted,
  onReconnect,
}: {
  uniqueId: string;
  onCompiling?: (message: string) => void;
  onOutput?: (output: ICompileRes) => void;
  onError?: (error: string) => void;
  onWaitingInput?: (message: string) => void;
  onCompleted?: (result: any) => void;
  onReconnect?: (data: any) => void;
}) => {
  const [connected, setConnected] = useState(socket.connected);
  const dispatch = useAppDispatch()
  useEffect(() => {
    // Gửi uniqueId lên server khi kết nối
    socket.emit("register", { uniqueId });

    // Lắng nghe các sự kiện từ server
    socket.on("connect", () => {
      setConnected(true);
      console.log("Connected to WebSocket server");
    });

    socket.on("re-connect-response", (data) => {
      console.log(data);
      onReconnect?.(data);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection failed:", error);
    });

    socket.on("disconnect", (reason) => {
      setConnected(false);
      console.log("Disconnected:", reason);
    });

    socket.on("compiling", (message: string) => {
      console.log("Compiling:", message);
      onCompiling?.(message);
    });

    socket.on("output", (output: ICompileRes) => {
      console.log("Output:", output);
      onOutput?.(output);
    });

    socket.on("error", (error: string) => {
      console.error("Error:", error);
      onError?.(error);
    });

    socket.on("waitingInput", (message: string) => {
      console.log("Waiting for input:", message);
      onWaitingInput?.(message);
    });

    socket.on("completed", (result: any) => {
      console.log("Completed:", result);
      onCompleted?.(result);
      dispatch(setLoading(false))
    });

    // Cleanup function to remove listeners when the component is unmounted
    return () => {
      socket.off("compiling");
      socket.off("output");
      socket.off("error");
      socket.off("waitingInput");
      socket.off("completed");
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("re-connect-response");
    };
  }, [uniqueId, onCompiling, onOutput, onError, onWaitingInput, onCompleted, onReconnect]);

  const compileCode = useCallback(
    (code: string, testCases: string[][], exerciseId: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!socket.connected) {
          reject(new Error("Socket is not connected"));
          return;
        }

        const errorHandler = (error: string) => {
          socket.off("error", errorHandler);
          reject(new Error(error));
        };

        socket.on("error", errorHandler);
        socket.emit(
          "compile",
          { uniqueId, code, testCases, exerciseId },
          (response: any) => {
            socket.off("error", errorHandler);
            if (response?.error) {
              reject(new Error(response.error));
            } else {
              resolve();
            }
          }
        );
      });
    },
    [uniqueId]
  );

  const stopExecution = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!socket.connected) {
        reject(new Error("Socket is not connected"));
        return;
      }

      try {
        socket.emit("stopExecution");
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  const isConnected = useCallback(() => socket.connected, []);

  return {
    socket,
    connected,
    compileCode,
    stopExecution,
    isConnected,
  };
};

export default useSocket;
