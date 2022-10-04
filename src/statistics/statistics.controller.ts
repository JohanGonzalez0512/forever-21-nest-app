import { Controller, Get,  Param } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}


  @Get(':startDate/:endDate',)
  findAll(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ) {
    return this.statisticsService.findAll(
      startDate,
      endDate,
    );
  }

  
}
