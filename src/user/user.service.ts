/* eslint-disable prettier/prettier */
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateUser(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, ...rest } = createUserDto;
    const data: Prisma.UserCreateInput = {
      ...rest,
      password: await bcrypt.hash(createUserDto.password, 10),
      name: name || null,
    };

    try {
      const createdUser = await this.prisma.user.create({ data });

      console.log('Usuário criado com sucesso:', createdUser);

      // Validar o usuário após a criação
      await this.validateUser(createdUser.id);

      return {
        ...createdUser,
        password: undefined,
      };
    } catch (error) {
      // Tratar erro específico de violação de restrição única
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('E-mail já está em uso.');
      }

      // Outros erros, lançar exceção padrão
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
