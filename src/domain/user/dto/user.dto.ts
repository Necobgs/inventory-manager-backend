import { Exclude, Expose } from 'class-transformer';
import { AggregateRootDto } from '../../shared/aggregate-root.dto';


@Exclude()
export class UserDto extends AggregateRootDto{

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  cep: string;

  @Expose()
  enabled: boolean;
}