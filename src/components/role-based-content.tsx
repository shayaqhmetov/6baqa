import { getToken, decodeToken } from "@/lib/auth";

export const RoleBasedContent = ({ allowedRoles, children }: { allowedRoles: string[], children: React.ReactNode }) => {
  const token = getToken(); // Get token from your authentication mechanismƒ
  if (allowedRoles.includes("unauthorized") && !token) {
    return children;
  }
  if (!token) {
    return null;
  }
  const userData = decodeToken(token);
  if (allowedRoles.includes("authorized") && token) {
    return children;
  }
  if (!userData.role || !allowedRoles.includes(userData.role)) {
    // User doesn't have required role, render nothing or a message
    return null;
  }

  return children;
}