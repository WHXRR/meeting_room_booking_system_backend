import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '密码长度不能小于6',
  })
  password: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
