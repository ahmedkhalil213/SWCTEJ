module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    label: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    description: DataTypes.TEXT,
  });

  Project.associate = (models) => {
    Project.belongsToMany(models.User, {
      through: 'UserProject', // Use the actual table name if not specified
      foreignKey: 'ProsjectId', // Name of the foreign key in UserProject
    });
    Project.hasMany(models.Sprint);
    Project.hasMany(models.Note);
  };

  return Project;
};