const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {

// All users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
  },
  
// Single user
  async getSingleUser(req, res) {
    try {
        const user = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .lean();

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      //console.log("user", user);
      return res.json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
  },

// Create new user

async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

// Update user

async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true})
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

// Delete user & thought

async deleteUser(req, res) {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });

        if (!user) {
            return res.status(404).json({ message: 'No user exists' })
        } else {
            Thought.deleteMany({ _id: { $in: user.thoughts } })
        }

        res.json({ message: 'User successfully deleted '});
    } catch (err) {
        res.status(500).json(err);
    }
},

// Add user to user friends

async addNewFriend(req, res) {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $push: { friends: req.params.friendId }}, 
            {runValidators:true, new: true});

        if (!user) {
            return res.status(404).json({ message: 'No user exists' })
        }

        res.json({ message: 'User successfully added '});
    } catch (err) {
        res.status(500).json(err);
    }
},

// delete a user's friend

async deleteFriend (req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId }},
        { runValidators: true, new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID :(' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};