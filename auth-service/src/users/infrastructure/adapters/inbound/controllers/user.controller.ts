import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserUseCase } from 'src/users/application/ports/input/create-user.use-case';
import { GetUserByIdUseCase } from 'src/users/application/ports/input/get-user-by-id.use-case';
import { UpdateUserUseCase } from 'src/users/application/ports/input/update-user.use-case';
import { DeleteUserUseCase } from 'src/users/application/ports/input/delete-user.use-case';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '../../../../application/dtos/create-user.dto';
import { UserMapper } from '../../outbound/mappers/user.mapper';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.execute(createUserDto);
    return UserMapper.toResponseDto(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.getUserByIdUseCase.execute(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return UserMapper.toResponseDto(user);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.updateUserUseCase.execute(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return UserMapper.toResponseDto(updatedUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    const deleted = await this.deleteUserUseCase.execute(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
  
}
