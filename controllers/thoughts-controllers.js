const {Thoughts, User} = require('../models');

thoughtsControllers = {
    //GET all of the thoughts 
    getThoughts(req, res) {
        Thoughts.find({})
        .populate({
            path: 'reaction',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughts => {
            res.json(dbThoughts);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    getThoughtsById({params}, res) {
        Thoughts.findOne({_id: params.id})
        .populate({
            path: 'reactions',
            select: (-__v)
        })
        .select('-__v')
        .then(dbThoughts => {
            if (!dbThoughts) {
                res.status(400).json({message: 'No thoughts found with this id'});
                return;
            }
            res.json(dbThoughts);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    createThoughts({body}, res) {
        Thoughts.create(body)
        .then(({username, _id}) => {
            return User.findOneAndUpdate(
                {username: username},
                {$push: {thoughts: _id}},
                {new: true, runValidators: true}
            )
        })
        .then(dbUser => {
            if (!dbUser) {
                res.status(400).json({message: 'No user found with this id'});
                return;
            }
            res.json(dbUser);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    updateThoughts({body, params}, res) {
        Thoughts.findOneAndUpdate({_id: params.id}.body,{new: true, runValidators: true})
        .then(dbThoughts => {
            if (!dbThoughts) {
                res.status(400).json({message: 'No thought found at this id'});
            }
            res.json(dbThoughts);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    deleteThoughts({params}, res) {
        Thoughts.findOneAndDelete({_id: params.id})
        .then(({username}) => {
            return User.findOneAndUpdate(
                {username: username},
                {$pull: {thoughts: params.id }},
                {new: true}
            )
        })
        .then(dbUser => {
            if (!dbUser) {
                res.status(404).json({message: 'No user found at this id'});
                return;
            }
            res.json(dbUser);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    crateReaction({params, body}, res) {
        Thoughts.findOneAndUpdate(
            {_id: params.thought.id},
            {$push: {reactions: body}},
            {new: true, runValidators: true}
        )
            .then(dbThoughts => {
                if (!dbThoughts) {
                    res.status(404).json({message: 'NO thought found with this id'});
                    return;
                }
                res.json(dbThoughts);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    removeReactions({params}, res) {
        Thoughts.findOneAndUpdate(
            {_id: params.thoughtId},
            {$pull: {reactions: {reactionId: params.reactionId}}},
            {new: true}
        )
        .then(dbThoughts => {
            if (!dbThoughts) {
                res.status(404).json({message: 'No thoughts found with this id'});
                return;
            }
            res.json(dbThoughts);
        })
        .catch(err => {
            console.log(err);
            res.status(404).json(err);
        })
    }
}

module.exports = thoughtsControllers;