const { User, Thought } = require('../models');

const userController = {
    // get all users
    getAllUsers(req, res) {
      User.find({})
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },
  
    // get user by id
    getUserById({ params }, res) {
      User.findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        select: '-__v'})
        .populate({
         path:'friends',
         select: '-__v'})
        .select('-__v')
        .then(dbUsersData => {
          // If no user is found, send 404
          if (!dbUsersData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(dbUsersData);
        })
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
    },

    // create User
createUser({ body }, res) {
    User.create(body)
      .then(dbUsersData => res.json(dbUsersData))
      .catch(err => res.status(400).json(err));
  },

  // Update a current User by ID
updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbUsersData => {
        if (!dbUsersData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUsersData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete user
deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUsersData => {
        if (!dbUsersData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUsersData);
      })
    
      .catch(err => res.status(400).json(err));
  },

  // add friend
  addFriend({params}, res) {
    User.findOneAndUpdate({_id: params.id}, {$push: { friends: params.friendId}}, {new: true})
    .populate({path: 'friends', select: ('-__v')})
    .select('-__v')
    .then(dbUsersData => {
        if (!dbUsersData) {
            res.status(404).json({message: 'No User with this particular ID!'});
            return;
        }
    res.json(dbUsersData);
    })
    .catch(err => res.json(err));
},

// Delete a current Friend
deleteFriend({ params }, res) {
  
    User.findOneAndUpdate({_id: params.id}, {$pull: { friends: params.friendId}}, {new: true})
    .populate({path: 'friends', select: '-__v'})
    .select('-__v')
    .then(dbUsersData => {
        if(!dbUsersData) {
            res.status(404).json({message: 'No User with this particular ID!'});
            return;
        }
        res.json(dbUsersData);
    })
    .catch(err => res.status(400).json(err));
}

};

// Export module users controller
module.exports = userController;