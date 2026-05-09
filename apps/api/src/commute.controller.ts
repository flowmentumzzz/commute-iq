import { Body, Controller, Get, Post } from "@nestjs/common";
import { calculateTrueCost, demoTrueCostInput, parseCommuteTransactions } from "@commute-iq/domain";
import type { TrueCostInput } from "@commute-iq/domain";

@Controller("commute")
export class CommuteController {
  @Get("demo")
  getDemoCost() {
    const result = calculateTrueCost(demoTrueCostInput);

    return {
      input: demoTrueCostInput,
      result
    };
  }

  @Post("true-cost")
  calculate(@Body() body: TrueCostInput) {
    return calculateTrueCost(body);
  }

  @Post("parse-sms")
  parseSms(@Body() body: { messages?: string[] }) {
    return {
      transactions: parseCommuteTransactions(body.messages ?? [])
    };
  }
}
