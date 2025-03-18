/* eslint-disable */
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIntIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {

    if (metadata.type != 'param' || metadata.data != 'id') {
      return value;
    }

    const parsedValue = Number(value);
    
    if (isNaN(parsedValue)) {
      throw new BadRequestException('ParsedIntIdPipe espera um valor numérico');
    }

    if(parsedValue < 0) {
      throw new BadRequestException('ParsedIntIdPipe espera um valor numérico positivo');
    }

    return parsedValue;
  }
}