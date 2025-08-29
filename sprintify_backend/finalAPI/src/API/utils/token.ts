import { sign } from "jsonwebtoken";
import { Token } from "../enums/token";
import { ITokenPayload } from "../types";

export const genToken = (payload: Partial<ITokenPayload>): string => {
  if (!payload.tokenType) payload.tokenType = Token.ACCESS;
  return sign(payload, "secretKeyPlaceHolderWillReplaceLater", {
    expiresIn: "24h",
  });
};
