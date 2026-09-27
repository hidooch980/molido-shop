import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Lead } from './lead.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  company: string;

  @OneToMany(() => Lead, (lead) => lead.customer)
  leads: Lead[];
}
