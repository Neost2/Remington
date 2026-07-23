import { Router } from 'express'
import { lookupZipCode } from '../controllers/zipLookup.controller'

const router = Router()

router.get('/:zipCode', lookupZipCode)

export default router
