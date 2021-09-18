import { IsEmail, IsString, MinLength, ValidateIf } from 'class-validator';

export class UpdateCustomerDto {
  @ValidateIf((self) => !Object.keys(self).length)
  @IsString()
  @MinLength(3, {
    message:
      'Name is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  name: string;

  @ValidateIf((self) => !Object.keys(self).length)
  @IsEmail()
  email: string;
}
