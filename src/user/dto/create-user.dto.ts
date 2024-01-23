import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  name: string;
}
