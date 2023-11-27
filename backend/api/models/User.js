module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Set as active by default
      },
    });
  
    // Define associations for the User model
    User.associate = (models) => {
      User.belongsToMany(models.Project, {
        through: 'UserProject', // Use the actual table name if not specified
        foreignKey: 'UserId', // Name of the foreign key in UserProject
      });
      User.hasMany(models.Task)
      User.hasMany(models.Note);
    };
  //User.sync({alter: true})
    return User;
  };