const { findBy } = require("../users/users-model")

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    next({
      message: 'You shall not pass!',
      status: 401
    })
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  try {
    const { username } = req.body
    const taken = await findBy({ username }).first()
    if (taken) {
      next({
        status: 422,
        message: `Username taken`
      })
    } else {
      next()
    }
  } catch (err) {
    next(err)
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  try {
    const { username } = req.body
    const exists = await findBy(username).first()
    if (exists) {
      next()
    } else {
      next({
        status: 401,
        message: `Invalid credentials`
      })
    }
  } catch (err) {
    next(err)
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
async function checkPasswordLength(req, res, next) {
  try {
    const { password } = req.body
    if (!password || password.length <= 3){
      next({
        status: 422,
        message: "Password must be longer than 3 chars"
      })
    }
    next()
  } catch (err) {
    next({
      status: 422,
      message: err.message
    })
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
}
