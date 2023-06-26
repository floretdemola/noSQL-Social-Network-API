const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction').schema;
const dateFormat = require('../utils/dateFormat');

// Schema to create Post model
const thoughtSchema = new Schema(
  {
    thoughtText: {
        type: String, 
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [Reaction],
    createdAt: {
        type: Date,
        default: Date.now,
        get: (time) => dateFormat(time),
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

thoughtSchema
  .virtual('getReactions')
  .get(function () {
      return this.reactions.length;
  });

// Initialize our Thought model
const Thought = model('thought', thoughtSchema);

module.exports = Thought;