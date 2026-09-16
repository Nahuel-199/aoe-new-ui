export interface User {
  _id?: string;
  name?: string;
  email: string;
  image?: string | null;
  role: "user" | "admin";
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
