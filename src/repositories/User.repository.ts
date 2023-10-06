import { User } from "./../model/User.model";
import { UserSchema } from "../database/schema/User.schema";
import mongoose, { Model } from "mongoose";
import { UserUpdateDTO } from "../dto/User.dto";

export interface IUserRepository {
  getAllUser(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: string, updates: UserUpdateDTO): Promise<User | null>;
  isEmailExists(email: String): Promise<boolean>;
  findByEmail(email: String): Promise<User | null>;
}

export class UserRepository implements IUserRepository {
  private dbInstance: Model<User>;
  private tableName: string = "User";

  constructor() {
    this.dbInstance = mongoose.model<User>(this.tableName, UserSchema);
  }

  async update(id: string, updates: UserUpdateDTO): Promise<User | null> {
    return await this.dbInstance
      .findByIdAndUpdate(id, updates, {
        new: true,
      })
      .exec();
  }

  async getAllUser(): Promise<User[]> {
    return await this.dbInstance.find();
  }

  async findById(id: string): Promise<User | null> {
    return await this.dbInstance.findById(id).exec();
  }

  async findByEmail(email: String): Promise<User | null> {
    return await this.dbInstance.findOne({ email: email }).exec();
  }
  async isEmailExists(email: String): Promise<boolean> {
    const count = await this.dbInstance.countDocuments({ email: email });
    return count > 0;
  }

  async create(user: User): Promise<User> {
    return await this.dbInstance.create(user);
  }
}
