export class User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  isActive: boolean;
  isVerified: boolean = false;
  otp?: string | null;
  otpExpiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    name: string,
    email: string,
    password?: string,
    isActive: boolean = true,
    isVerified: boolean = false,
    otp?: string,
    otpExpiresAt?: Date,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    id?: string,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.isActive = isActive;
    this.isVerified = isVerified;
    this.otp = otp;
    this.otpExpiresAt = otpExpiresAt; 
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  markAsInactive(): void {
    this.isActive = false;
    this.isVerified = false;
    this.updatedAt = new Date();
  }
}
