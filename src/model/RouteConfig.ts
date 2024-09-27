import { ComponentType } from "react";

// Enum for roles (adjust based on your project's roles)
export enum RoleEnum {
  Guest = "Guest",
  User = "User",
  Admin = "Admin",
}

// Define RouteConfig to expect optional layouts and a required component
export interface RouteConfig {
  path: string;
  component: ComponentType;  // Component that renders the page
  layout?: ComponentType | null;  // Optional layout, can be null or a component
  role: RoleEnum;  // Role associated with the route
}

export interface User{
  userId: number,
  fullName: string, 
  email: string, 
  password: string, 
  createDate: string, 
  updateDate: string
}
export interface Post{
  title: string,
  dateCreate: number,
  content: string,
  userId: number,
  postId: number,
  image:string
  updateDate: string,
}
