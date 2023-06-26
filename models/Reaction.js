const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// Schema to create Post model
const reactionSchema = new Schema(
  {
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (time) => dateFormat(time),

    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

// Initialize our Reaction model
const Reaction = model('reaction', reactionSchema);

module.exports = Reaction;