/*jshint esversion: 8 */
const {Sequelize, DataTypes} = require('sequelize');
/* you will need to change this to connect to your db *
 * const sequelize = new Sequelize(
 *  'mysql://user:pass@example.com:5432/dbname'
 * );
 */

const sequelize = new Sequelize({
  // The `host` parameter is required for other databases
  // host: 'localhost'
  dialect: 'sqlite',
  storage: './database.sqlite'
});



// Define sample models
const Person = sequelize.define(
  'person',
  {
    name: DataTypes.STRING,
    awesome: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  }
);

// N.B. This was originally called FavouriteThings, which works when
// referenced directly but causes issues with assocations (Foreign keys)
// Sequelize adds methods and can only handle single word for some reason
// It try to be clever and will map e.g. Body -> getBodies
// so this may be why.
const Favourite = sequelize.define(
  'favourite',
  {description: DataTypes.TEXT}
);

// this creates an association (ie Foreign Key) this is a one to many
// (not denormalized as you can have duplicated descriptions)
Person.hasMany(Favourite);
Favourite.belongsTo(Person);


/*
 * Utility functions
 */

function authenticate(sequelize){
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
}
// call this in your own setup script to setup database tables
//note this destroys any existing data and (re)creates the tables
function sync(sequelize){
  sequelize.sync({ force: true }).then(
    () => {
      console.log(`Database & tables created!`);
  });
}

// Sync db table: note this destroys any existing data and (re)creates the
// tables
function setup(sequelize){
  sequelize.sync({ force: true }).then(
    () => {
      console.log(`Database & tables created!`);
      // Add some sample data
    Person.bulkCreate([{'name': 'Paul'}]).then(
      function() {
        return Person.findAll();
      }).then(function(people) {
        console.log(people);
      });
  });
}

module.exports = {authenticate, sequelize, sync, setup, Person, Favourite};
