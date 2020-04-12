import { AuthRole } from "@models";

export const checkAuth = next => (root, args, context, info) => {
  if (!context.user) throw new Error('Unauthenticated!');
  return next(root, args, context, info);
};


export const checkHasRole = (roles: Array<AuthRole>, next) => async (root, args, context, info) => {
  try {
    const hasRole = context.user.roles.filter(x => roles.includes(x)).length !== 0;
    if (hasRole) return next(root, args, context, info);
    else throw new Error('Insufficient Permissions');
  } catch (e) {
    throw new Error('Insufficient Permissions!');
  }
}
