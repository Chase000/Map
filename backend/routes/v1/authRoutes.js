import express from 'express'
import {getUser, createUser} from '../../controllers/v1/authController.js'


const router = express.Router()
router.route('/getuser').get(getUser)
router.route('/createuser').post(createUser)

export default router
