import { AppError } from './app-error';

export const getParamAsString = (param: string | string[] | undefined, name: string): string => {
  if (param === undefined) {
    throw new AppError(`${name} is required`, 400);
  }

  if (Array.isArray(param)) {
    if (!param[0]) {
      throw new AppError(`${name} is required`, 400);
    }
    return param[0];
  }

  return param;
};
