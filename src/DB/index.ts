import config from "../config";
import { USER_ROLE, USER_STATUS } from "../constants/status.constants";
import { UserModel } from "../modules/users/users.model";

const superUser = {
    name: "Super Admin",
    emailOrPhone: "admin@super.com",
    password: config.super_admin_password,
    // needsPasswordChange: true,
    role: USER_ROLE.SUPER_ADMIN,
    status: USER_STATUS.ACTIVE,
    isDeleted: false,
};

const seedSuperAdmin = async () => {
    const isSuperAdminExist = await UserModel.findOne({ role: USER_ROLE.SUPER_ADMIN });
    if (!isSuperAdminExist) {
        // const hashedPassword = await hashPassword(config.super_admin_password as string);
        await UserModel.create({
            ...superUser,
            // password: hashedPassword
        });
    }
};

export default seedSuperAdmin;
