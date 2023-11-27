import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getAppRunningStatus(): string {
    return "App is Running on port: 3000!";
  }
}
