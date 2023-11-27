module.exports = (sequelize, DataTypes) => {
    const Sprint = sequelize.define('Sprint', {
      label: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      description: DataTypes.TEXT,
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Set as active by default
      },
    });
  
    Sprint.associate = (models) => {
      Sprint.belongsTo(models.Project);
      Sprint.hasMany(models.Task);
    };
  
    return Sprint;
  };