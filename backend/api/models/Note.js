module.exports = (sequelize, DataTypes) => {
    const Note = sequelize.define('Note', {
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    });
  
    Note.associate = (models) => {
      // Belongs to User
      Note.belongsTo(models.User);
      Note.belongsTo(models.Project);
    };
  
    return Note;
  };