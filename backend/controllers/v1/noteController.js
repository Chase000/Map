import Note from '../../models/Note.js'
import mongoose from 'mongoose'

const getNote = async(req,res) => {
  const notes = await Note.find().select('user latitude longitude content')
  res.json({
    notes
  })
}

const createNote = async(req,res) => {
  const {latitude, longitude, content} = req.body
  const id = mongoose.Types.ObjectId('62c90c26e0f34b0479736c8c');
  const note = await Note.create({
    createdBy: id,
    user: 'Chase',
    latitude: latitude,
    longitude: longitude,
    content: content
  })
  res.json({
    latitude: note.latitude,
    longitude: note.longitude,
    content: note.content
  })
}

const searchNote = async(req,res) => {
  const search = req.params
  let notes = []
  if (search) {
    notes = await Note.find({$or:[{"user":search.search},{"content": {$regex:search.search, $options:'i'}}]}).select('user latitude longitude content')
  } else {
    notes = await Note.find().select('user latitude longitude content')
  }
  
  res.json({
    notes
  })
}

const test = async(req,res) => {
  res.json({
    test:'test success'
  })
}


export {getNote, createNote, searchNote, test}
