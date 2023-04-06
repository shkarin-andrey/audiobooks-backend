import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller()
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('books')
  getBooks(@Query('page') page: string) {
    return this.booksService.books(page);
  }

  @Get('books/:id')
  findBook(@Param('id') id: string) {
    Logger.log(id);
    return this.booksService.findBook(id);
  }
}
