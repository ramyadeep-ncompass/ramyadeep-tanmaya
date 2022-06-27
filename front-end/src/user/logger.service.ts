import { Injectable } from "@nestjs/common";
const fs = require('fs');


@Injectable()
export class LoggerService {

   async log(args:{message:string, status:string, timestamp?:string}){
       args.timestamp = new  Date().toISOString();

       fs.appendFile("cron-logs.txt", JSON.stringify(args)+'\n', (err) => {
           if (err)
               console.log(err);
       });
    }

}