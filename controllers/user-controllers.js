const {User, Thoughts} = require('../models');

const UserController = {
    //get all users
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')
        .sort({_id: -1})
        .then(dbUser => res.json(dbUser))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },
    //get one user by id
    getUserById({params}, res) {
        User.findOne({_id: params.id})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUser => res.json(dbUser))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },
    //create user
    createUser({params, body}, res) {
        User.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
        .then(dbUser => {
            if (!dbUser) {
                res.status(404).json({message: 'No user found with this id'});
                return;
            }
            res.json(dbUser);
        })
        .catch(err => res.json(err));
    },
    //update user
    updateUser({body}, res) {
        User.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
        .then(dbUser => {
            if (!dbUser) {
                res.status(404).json({message: 'No user by this id'});
                return;
            }
            res.json(dbUser);
        })
        .catch(err => res.json(err));
    },
    //delete user
    deleteUser({params}, res) {
        User.findByIdAndDelete({_id: params.id})
        .then(dbUser => {
            dbUser.thoughts.forEach(thought => {
                Thoughts.fineOneAndDelete({_id: thought})
                .then(dbThoughts => {
                    if (!dbThoughts) {
                        res.status(500).json({message: 'Error'});
                        return;
                    }
                    res.json(dbUser)
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err);
                });
            })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    // //add a friend
    addFriend({params}, res) {
        User.findOneAndUpdate(
            {_id: params.userId},
            {$push: {friends: params.friendId}},
            {new: true}, 
        )
        .then(dbUser => {
            if (!dbUser) {
                res.status(404).json({message: 'No user by this id'});
                return;
            }
            res.json(dbUser)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    // //delete a friend
    deleteFriend({params}, res) {
        User.findOneAndDelete(
            {_id: params.userId},
            {$pull: {friends: params.friendId}},
            {$pull: {friends: params.friendId}},
            {new: true}
        )
        .then(dbUser => {
            if (!dbUser) {
                res.status(404).json({message: 'No user by this id'});
                return;
            }
            res.json(dbUser);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    }

};

module.exports = UserController;