const { ObjectId } = require('mongoose').Types;
const { Thought, Reaction, User } = require('../models');

module.exports = {

// All thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      return res.json(thoughts);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
  },
  
// Single Thought
  async getSingleThought(req, res) {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .lean();

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
      //console.log("thought", thought);
      return res.json(thought);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
  },

// Create new Thought & add to thought array

async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
            { username: req.body.username },
            { $addToSet: { thoughts: thought._id }},
            { new: true } 
        );

        return res.json(user);            
    } catch (err) {
      res.status(500).json(err);
    }
  },

// Update Thought

async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true})
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

// Delete thought & reaction

async deleteThought(req, res) {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

        if (!thought) {
            return res.status(404).json({ message: 'No Thought exists' })
        } else {
            Reaction.deleteMany({ _id: { $in: thought.reactions } })
        }

        res.json({ message: 'Thought successfully deleted '});
    } catch (err) {
        res.status(500).json(err);
    }
},

// create reaction and add to thought

async createReaction(req, res) {
    try {
        const reaction = await Reaction.create(req.body)
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { reactions: reaction._id }}, 
            { new: true});

        if (!thought) {
            return res.status(404).json({ message: 'No thought exists' })
        }

        res.json({ message: 'Reaction successfully created '});
    } catch (err) {
        res.status(500).json(err);
    }
},

// delete a reaction from a thought

async deleteReaction (req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: req.params.reactionId }},
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID :(' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};