var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
var logger = require('morgan');
const db=require('./models')
const authRouter = require('./routes/authRouter');
const apiRoutes = require('./routes/apiRouter');
const app = express();
process.env.TZ = 'Africa/Tunis';
app.use(cors());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth', authRouter);
app.use('/api', apiRoutes);
/*db.sequelize.sync({alter:true}).then(()=>{

});*/

app.listen(8000, () => {
  console.log('Server is running on port 8000');

});
module.exports = app;
