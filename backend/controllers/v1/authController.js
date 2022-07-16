import User from '../../models/User.js'

const getUser = async(req,res) => {
  const user = await User.find()
  res.json({
    user: user
  })
}

const createUser = async(req,res) => {
  // const name = {name: 'Chase'}
  const user = await User.create({name: 'User3'})
  res.json({
    user: user
  })
}


export {getUser, createUser}
