import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Set a session value
 * @param key - The key for the session value
 * @param value - The value to store
 * @returns A NextResponse object with the cookie set
 */
export const setSession = (key: string, value: string): NextResponse => {
  const response = NextResponse.next();
  response.cookies.set(key, value, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
};

/**
 * Get a session value
 * @param key - The key for the session value
 * @returns The value stored in the session (or undefined if not found)
 */
export const getSession = async (key: string): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
};

/**
 * Delete a session value
 * @param key - The key for the session value to delete
 * @returns A NextResponse object with the cookie deleted
 */
export const deleteSession = (key: string): NextResponse => {
  const response = NextResponse.next();
  response.cookies.delete({
    name: key,
    path: "/",
  });
  return response;
};
