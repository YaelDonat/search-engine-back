import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ResponseWordDto {
    @ApiProperty({ description: 'Id', example: '1' })
    @IsNumber()
    id: number;

    @ApiProperty({ description: 'Words', example: 'ajhze' })
    @IsString()
    mot: string;

    @ApiProperty({ description: 'nb of iterations', example: '5' })
    @IsNumber()
    nbOccurrences: number;

    @ApiProperty({ description: 'id book', example: '5' })
    @IsNumber()
    livreId: number;
}
