import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ICompileRes } from "@/types/ICompileRes";
import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import {
    setCompile,
    setLoading,
    setLoadingSubList,
    setLoadingTestCase,
    setResultSubmit,
    setSubList,
} from "@/redux/slices/admin/exerciseStudySlice";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { useSearchParams } from "next/navigation";
import { IResultSubmit } from "@/types/IResultSubmit";
import { now } from "next-auth/client/_utils";
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
    onOutputSubmit,
}: {
    uniqueId: string;
    onCompiling?: (message: string) => void;
    onOutput?: (output: ICompileRes) => void;
    onOutputSubmit?: (output: ICompileRes) => void;
    onError?: (error: string) => void;
    onWaitingInput?: (message: string) => void;
    onCompleted?: (result: any) => void;
    onReconnect?: (data: any) => void;
}) => {
    const [connected, setConnected] = useState(socket.connected);
    const dispatch = useAppDispatch();
    const axiosPrivate = usePrivate();
    const searchParams = useSearchParams();

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
            dispatch(setLoadingTestCase(true));
            dispatch(setLoadingSubList(true));
        });

        socket.on("output", (output: ICompileRes) => {
            console.log("Output:", output);
            onOutput?.(output);
        });
        socket.on("output_submit", (output: ICompileRes) => {
            console.log("Output_submit:", output);
            onOutputSubmit?.(output);
        });
        socket.on("error", (error) => {
            dispatch(setLoadingSubList(false));
            dispatch(setLoadingTestCase(false));
            dispatch(setCompile("Compile Error"));
            const date = new Date();
            const formattedDate = new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }).format(date);

            dispatch(
                setResultSubmit({
                    submittedAt: formattedDate,
                    result: "Compile Error", // Default result
                    codeFailed: error.message,
                })
            );

            console.error("Error:", error);
        });

        socket.on("waitingInput", (message: string) => {
            console.log("Waiting for input:", message);
            onWaitingInput?.(message);
        });

        socket.on("completed", (result: any) => {
            dispatch(setLoadingTestCase(false));
            dispatch(setCompile("Test Result"));

            console.log("Completed test result:", result);
            onCompleted?.(result);
        });
        socket.on("complete_submit", (result: IResultSubmit) => {
            const date = new Date();
            const formattedDate = new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }).format(date);

            dispatch(setResultSubmit({ ...result, submittedAt: formattedDate }));
            dispatch(setLoadingSubList(false));
            if (result.status == 200) {
                dispatch(setCompile("Accepted"));
                onCompleted?.("Accepted");
            } else if (result.status == 400) {
                dispatch(setCompile("Wrong Answer"));
                onCompleted?.("Wrong Answer");
            }
        });

        // Cleanup function to remove listeners when the component is unmounted
        return () => {
            socket.off("compiling");
            socket.off("output");
            socket.off("output_submit");

            socket.off("error");
            socket.off("waitingInput");
            socket.off("completed");
            socket.off("connect");
            socket.off("connect_error");
            socket.off("disconnect");
            socket.off("re-connect-response");
            socket.off("complete_submit");
        };
    }, [uniqueId, onCompiling, onOutput, onError, onWaitingInput, onCompleted, onReconnect]);

    const compileCode = useCallback(
        (
            code: string,
            testCases: string[][],
            exerciseId: string,
            language: string,
            userId: string
        ): Promise<void> => {
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
                    { uniqueId, code, testCases, exerciseId, language, userId },
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

    const submitCode = useCallback(
        async (code: string, exerciseId: string, userId: string, language: string): Promise<void> => {
            dispatch(setLoadingSubList(true));

            return new Promise((resolve, reject) => {
                // Kiểm tra xem socket có kết nối không
                if (!socket.connected) {
                    console.error("Socket is not connected before emitting submit event");
                    reject(new Error("Socket is not connected"));
                    return;
                } else {
                    console.log("Socket is connected. Preparing to emit...");
                }

                // Xử lý lỗi nếu có
                const errorHandler = (error: string) => {
                    socket.off("error", errorHandler);
                    dispatch(setLoadingSubList(false));
                    reject(new Error(error));
                };

                socket.on("error", errorHandler);

                // Gửi yêu cầu submit code
                socket.emit("submit", { code, exerciseId, userId, language }, async (response: any) => {
                    dispatch(setLoadingSubList(false));
                    // Kiểm tra xem có lỗi trong phản hồi không
                    if (response?.error) {
                        reject(new Error(response.error));
                    } else {
                        try {
                            axiosPrivate.put(`/exercise-status/exercise/${exerciseId}`);
                            resolve();
                        } catch (axiosError) {
                            console.error("Failed to update exercise status:", axiosError);
                            reject(axiosError);
                        }
                    }
                });
            });
        },
        [] // Dùng empty array để callback không thay đổi trừ khi có thay đổi về dependencies
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
        submitCode,
    };
};

export default useSocket;
