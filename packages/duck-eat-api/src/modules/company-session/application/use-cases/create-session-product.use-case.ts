import { CreateSessionProduct } from "../dto/create-session-product.dto";

export class CreateSessionProductUseCase {
  async execute(props: CreateSessionProduct) {
    console.log(props);
  }
}
