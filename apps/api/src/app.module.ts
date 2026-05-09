import { Module } from "@nestjs/common";

import { CommuteController } from "./commute.controller";
import { HealthController } from "./health.controller";

@Module({
  controllers: [CommuteController, HealthController]
})
export class AppModule {}
