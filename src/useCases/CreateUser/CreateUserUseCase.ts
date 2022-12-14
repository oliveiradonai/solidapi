import { User } from "../../entities/User";
import { IMailProvider } from "../../providers/IMailProvider";
import { IUserRepository } from "../../repositories/IUserRepository";
import { ICreateUserRequestDTO } from "./CreateUserDTO";

export class CreateUserUseCase {
  constructor(
    private usersRespository: IUserRepository,
    private mailProvider: IMailProvider,
  ) { }

  async execute(data: ICreateUserRequestDTO) {
    const userAlreadyExists = await this.usersRespository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new Error('User already exists.');
    }

    const user = new User(data);

    await this.usersRespository.save(user);

    await this.mailProvider.sendMail({
      to: {
        name: data.name,
        email: data.email,
      },
      from: { 
        name: 'Equipe do meu app',
        email: 'equipe@meuapp.com'
      },
      subject: 'Seja bem-vindo ao Meu App',
      body: '<p>Você já pode fazer login em nossa plataforma.</p>',
    })
  }
}