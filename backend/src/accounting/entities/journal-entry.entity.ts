import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('journal_entries')
export class JournalEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column()
  description: string;

  @OneToMany(() => JournalLine, (line) => line.entry, {
    cascade: true,
    eager: true,
  })
  lines: JournalLine[];
}

@Entity('journal_lines')
export class JournalLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => JournalEntry, (entry) => entry.lines, {
    onDelete: 'CASCADE',
  })
  entry: JournalEntry;

  @ManyToOne(() => Account, { eager: true })
  @JoinColumn()
  account: Account;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  debit: number;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  credit: number;
}
