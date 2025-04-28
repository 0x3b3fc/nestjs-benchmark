import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  // This is a temporary in-memory storage for demo purposes
  // In a real application, this would use TypeORM or another database
  private users: User[] = [];

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: Date.now().toString(),
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const data = this.users.slice(startIndex, endIndex);
    
    return {
      data,
      meta: {
        total: this.users.length,
        page,
        limit,
        totalPages: Math.ceil(this.users.length / limit),
      },
    };
  }

  findOne(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  update(id: string, updateUserDto: UpdateUserDto): User | undefined {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return undefined;
    }
    
    const updatedUser = {
      ...this.users[userIndex],
      ...updateUserDto,
      updatedAt: new Date(),
    };
    
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  remove(id: string): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    return this.users.length !== initialLength;
  }
}