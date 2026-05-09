import { Module } from "@nestjs/common";

import { CommuteController } from "./commute.controller.js";
import { HealthController } from "./health.controller.js";

@Module({
  controllers: [CommuteController, HealthController]
})
export class AppModule {}
