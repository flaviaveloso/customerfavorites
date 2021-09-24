import { mustBe, a, validate } from 'joi-decorator';

export class EnvironmentVariables {
  @mustBe(a.number().integer().min(1).max(65535).default(3000).required())
  HTTP_PORT: number;

  @mustBe(a.string().hostname())
  MYSQL_HOST: string;

  @mustBe(a.number().integer().min(1).max(65535).default(3306))
  MYSQL_PORT: number;

  @mustBe(a.string())
  MYSQL_USER: string;

  @mustBe(a.string())
  MYSQL_PASSWORD: string;

  @mustBe(a.string())
  MYSQL_DATABASE: string;

  @mustBe(a.string().hostname())
  REDIS_HOST: string;

  @mustBe(a.number().integer().min(1).max(65535).default(6379))
  REDIS_PORT: number;

  @mustBe(a.number().integer().min(10))
  PAGINATION_SIZE: number;

  @mustBe(a.string())
  JWT_SECRET: string;

  constructor() {
    Object.keys(process.env).forEach((key: string) => {
      this[key] = process.env[key];
    });
    validate(this, EnvironmentVariables, { allowUnknown: true }).catch(
      (err) => {
        throw err;
      },
    );
  }
}

export default (): EnvironmentVariables => {
  return new EnvironmentVariables();
};
