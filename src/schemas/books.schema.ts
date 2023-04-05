import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema()
export class Book {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  img: string;

  @Prop({ type: Array, required: true })
  playlist: [
    {
      title: string;
      file: string;
      id: string;
    },
  ];

  @Prop({ type: String, required: true })
  author: string;

  @Prop({ type: String })
  reader: string;

  @Prop({ type: String })
  year: string;

  @Prop({ type: String })
  duration: string;

  @Prop({ type: String, required: true })
  description: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
