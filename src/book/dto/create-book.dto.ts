import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ResponseWordDto } from 'src/word/dto/response-word.dto';

export class CreateBookDto {
    @ApiProperty({ description: 'book title', example: 'Les fleurs du Mal' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'book author', example: 'Charles Baudelaire' })
    @IsString()
    author: string;

    @ApiProperty({ description: 'bookid', example: '666' })
    @IsString()
    bookid: string;

    @ApiProperty({ description: 'book image', example: 'https://img.feur' })
    @IsString()
    imgUrl: string;

    mots?: ResponseWordDto[];
}
