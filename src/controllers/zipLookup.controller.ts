import { Request, Response, NextFunction } from 'express'
import { lookupZipCodeFromServerside } from '../services/zipLookup.service'
import { AppError } from '../middleware/errorHandler'

export const lookupZipCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { zipCode } = req.params

    if (!zipCode || !/^\d{5}$/.test(zipCode)) {
      return next(new AppError('A valid 5-digit ZIP code is required.', 400))
    }

    const result = await lookupZipCodeFromServerside(zipCode)

    if (!result) {
      return next(new AppError('Unable to resolve that ZIP code.', 404))
    }

    res.json(result)
  } catch (err) {
    next(err)
  }
}
