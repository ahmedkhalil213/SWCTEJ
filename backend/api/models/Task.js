module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
      label: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      description: DataTypes.TEXT,
      estimation: DataTypes.INTEGER,
      Done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Set as active by default
      },
      ToDo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, 
      },
      inProgress: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, 
      },
      isActive: { 
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });
    
  
    Task.associate = (models) => {
      Task.belongsTo(models.Sprint);
      Task.belongsTo(models.User);
    };
  
    return Task;
  };