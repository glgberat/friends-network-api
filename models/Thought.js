const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ThoughtSchema = new Schema({
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280

    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
      },
      username: {  
        type: String,
        required:true
    },
    reactions: [ReactionSchema]
},
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false
    }
    );

    const ReactionSchema = new Schema(
        {

        reactionId: { type: Schema.Types.ObjectId,
        default: ()=> new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280
        },

        username: {
            type: String,
            required: true
        },

        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
        }

    },

           {
        toJSON: {
                getters: true
                } 
            
            }            
    


    );

    // total count of reactions
ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
})

// create the Users model using the Users Schema
const Thought = model('Thought', ThoughtSchema);

// Export Thought module
module.exports = Thought;