import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; 

interface IPayload {
  sub: string;
  email: string;
  password: string;

}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken = (payload: { email: string; sub: string }): string => {
    return this.jwtService.sign(payload);  // Create and sign a token with the payload, expires in 1 hour
  }
  
  verifyToken = (access_token: string) => {
    try {
      const decoded = this.jwtService.verify(access_token);  // Verify and decode the token
      return decoded;
    } catch (error) {
      throw error;
    }
  }
  
}
