// import config from "../config";
// import { UserModel } from "../modules/users/users.model";
// import { USER_ROLE, USER_STATUS } from "../constants/status.constants";

// const superUser = {
//   name: "Super Admin",
//   email: "admin@nursary.com",
//   password: config.super_admin_password,
//   needsPasswordChange: false,
//   role: USER_ROLE.SUPER_ADMIN,
//   status: USER_STATUS.ACTIVE,
//   isDeleted: false,
//   isEmailVerified: true,
// };

// const seedSuperAdmin = async () => {
//   const isSuperAdminExist = await UserModel.findOne({ role: USER_ROLE.SUPER_ADMIN });
//   if (!isSuperAdminExist) {
//     await UserModel.create(superUser);
//   }
// };

// export default seedSuperAdmin;
