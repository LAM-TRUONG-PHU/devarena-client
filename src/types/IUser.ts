export interface IUser {
  username: string; // Tên người dùng
  email: string; // Email người dùng
  isEmailVerified: boolean; // Trạng thái xác thực email
  role: "client" | "admin" // Vai trò của người dùng (có thể thêm giá trị khác nếu cần)
  isCreatePassword: boolean; // Trạng thái tạo mật khẩu
  providers: string[]; // Danh sách các provider (e.g., github, google)
  _id: string; // ID người dùng
}
