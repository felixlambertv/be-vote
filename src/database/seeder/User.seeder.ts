import { User } from "../../model/User.model";
import { UserSchema } from "../schema/User.schema";
import mongoose from "mongoose";
import { Role } from "../../enum/Role";
import bcrypt from "bcryptjs";
import { config } from "../../config/vars";

const UserModel = mongoose.model<User>("User", UserSchema);

async function seedUsers() {
  const users = [
    {
      name: "Admin",
      email: "admin@admin.com",
      password: await bcrypt.hash("default", 10),
      role: Role.ADMIN,
    },
    {
      name: "User 1",
      email: "user1@user.com",
      password: await bcrypt.hash("default", 10),
      role: Role.USER,
    },
  ];

  for (let user of users) {
    await UserModel.create(user);
  }

  console.log("Users seeded successfully");
}

(async () => {
  try {
    const db = await mongoose.connect(config.dbUrl);
    await seedUsers();
    await db.disconnect();
  } catch (error) {
    console.error("Error during seeding:", error);
  }
})();
