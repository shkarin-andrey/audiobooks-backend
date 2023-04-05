import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from 'src/schemas/books.schema';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async books(page = '1') {
    const limit = 25;
    const skip = (+page - 1) * limit;

    try {
      const result = await this.bookModel
        .find()
        .sort({ series: 1 })
        .limit(limit)
        .skip(skip);
      const pages = await this.bookModel.find().count();

      return {
        result,
        pages: Math.ceil(pages / limit),
      };
    } catch (error) {
      throw new BadRequestException('Произошла ошибка');
    }
  }

  async findBook(_id: string) {
    try {
      const book = await this.bookModel.findOne({ _id });

      return book;
    } catch (error) {
      throw new BadRequestException('Аудиокнига не найдена');
    }
  }
}
