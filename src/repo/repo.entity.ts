import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Repo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    repoName: string;

    @Column()
    contribution: string;

}