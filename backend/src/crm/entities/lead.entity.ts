import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

export enum LeadStage {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  WON = 'won',
  LOST = 'lost',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.leads, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  customer: Customer;

  @Column()
  title: string;

  @Column({ type: 'varchar', default: LeadStage.NEW })
  stage: LeadStage;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  value: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
