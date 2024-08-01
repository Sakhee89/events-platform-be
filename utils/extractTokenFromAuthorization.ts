export const extractTokenFromAuthorization = (authorization: string) => {
  return authorization.split(" ")[1];
};
