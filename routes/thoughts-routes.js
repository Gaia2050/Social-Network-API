const router = require('express').Router();
const {
    getThoughts,
    getThoughtsById,
    createThoughts,
    updateThoughts,
    deleteThoughts,
    createReaction,
    removeReaction,
} = require('../controllers/thoughts-controllers');

router.route('/')
    .get(getThoughts)
    .post(createThoughts);

router.route('/:id')
    .get(getThoughtsById)
    .put(updateThoughts)
    .delete(deleteTHoughts);

router.route('/thoughtId/reaction')
    .post(createReaction);

router.route('/thoughtId/reactions/:reactionId')
    .delete(removeReaction);

module.exports = router;