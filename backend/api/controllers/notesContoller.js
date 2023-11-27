const { Op ,Sequelize} = require('sequelize');
const models = require('../models');
const Project  = require('../models').Project;
const Note  = require('../models').Note;
async function getNotesbyProjectDate(req, res) {
    try {
      const projectId = req.query.projectId;
      const startDate =req.query.startDate; 
      const endDate =req.query.endDate; 
      // Retrieve notes for the specified project within the date range
      const notes = await Note.findAll({
        where: Sequelize.literal(`
        ProjectId = :projectId
        AND DATE_FORMAT(Note.createdAt, '%Y-%m-%d %H:%i') BETWEEN DATE_FORMAT(:startDate, '%Y-%m-%d %H:%i') AND DATE_FORMAT(:endDate, '%Y-%m-%d %H:%i')
      `),
      replacements: {
        projectId: projectId,
        startDate: startDate,
        endDate: endDate,
      },
          include: [
            {
              model: models.User,
              attributes: ['username'],
            }],
            attributes: ['id','content',  [Sequelize.fn('DATE_FORMAT', Sequelize.literal('`Note`.`createdAt`'), '%d/%m/%Y %H:%i:%s'), 'createdAt']],
      });
      res.json(notes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  module.exports = {getNotesbyProjectDate}