export class User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    name: string,
    email: string,
    password?: string,
    isActive: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    id?: string,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  markAsInactive(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }
}
