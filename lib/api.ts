import jwt_decode from "jwt-decode";
import { NextApiRequest } from "next";

export function getAuthenticatedUser(req: NextApiRequest) {
  const parts = req.headers.authorization?.split(" ");

  const bearerToken = parts && parts.length === 2 ? parts[1] : undefined;

  if (!bearerToken) {
    return undefined;
  }

  const decodedToken: any = jwt_decode(bearerToken);

  return decodedToken.sub;
}
