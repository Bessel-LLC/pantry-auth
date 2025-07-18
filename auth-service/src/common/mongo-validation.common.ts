//Validate ObjectID

import { BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

export const assertValidMongoId = (id: string) =>
  isValidObjectId(id) || raiseBadRequest();

const raiseBadRequest = () => {
  throw new BadRequestException('The provided ID is not valid.');
};