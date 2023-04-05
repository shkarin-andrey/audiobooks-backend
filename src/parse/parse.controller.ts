import { Controller, Get } from '@nestjs/common';
import { ParseService } from './parse.service';

@Controller()
export class ParseController {
  constructor(private readonly parseService: ParseService) {}

  @Get('api/v1/parse')
  getParse() {
    return this.parseService.getParse();
  }
}
