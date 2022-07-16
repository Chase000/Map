import express from 'express'
import {getNote, createNote, searchNote, test} from '../../controllers/v1/noteController.js'


const router = express.Router()
router.route('/getNote').get(getNote)
router.route('/createNote').post(createNote)
router.route('/searchNote/:search').get(searchNote)
router.route('/test').get(test)

export default router