import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "src/user/user.controller";
import { UserService } from "src/user/user.service";
import { Repo } from "./repo.entity";
import { RepoService } from "./repo.service";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, }),
        TypeOrmModule.forFeature([Repo])
    ],
    providers: [RepoService],
    exports: [RepoService]
})
export class RepoModule { }