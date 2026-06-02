import { supabase } from "./client";
import type { Database } from "./types";

export type AppRole = Database["public"]["Enums"]["app_role"];

export async function getUserRoles(userId: string): Promise<AppRole[]> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to load user roles:", error);
    return [];
  }

  return (data || []).map((row) => row.role as AppRole);
}

export async function getPrimaryRole(userId: string): Promise<AppRole | null> {
  const roles = await getUserRoles(userId);
  if (roles.includes("admin")) return "admin";
  if (roles.includes("user")) return "user";
  return null;
}

export function isAdminRole(role: AppRole | null): role is "admin" {
  return role === "admin";
}
