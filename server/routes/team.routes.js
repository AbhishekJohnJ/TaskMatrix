const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const {
  createTeamValidator,
  updateTeamValidator,
  teamIdValidator,
  inviteMemberValidator
} = require('../validators/team.validator');

// All routes are protected
router.use(protect);

router.route('/')
  .get(teamController.getAllTeams)
  .post(createTeamValidator, validate, teamController.createTeam);

router.route('/:id')
  .get(teamIdValidator, validate, teamController.getTeam)
  .put(updateTeamValidator, validate, teamController.updateTeam)
  .delete(teamIdValidator, validate, teamController.deleteTeam);

router.post('/:id/invite', inviteMemberValidator, validate, teamController.inviteMember);
router.delete('/:id/members/:userId', teamIdValidator, validate, teamController.removeMember);

module.exports = router;
