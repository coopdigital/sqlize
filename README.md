Skeleton/example node project using express and sequelize

To set up the project run

```node src/setup.js```

This will initialize the database and add sample data. It should only need
to be run once. Its drop any exiting tables and data so you can rerun it to
reset the database to its initial state (nmake sure this is what you want to do)

Then run
```
node/src/index.js
```
to run the app

The project requires the latest stable versino of Node.


To use this you will need to edit src/modules/db/index.js to define your own models and adapt setup.js to run syn not setup (or make your own version of setup to add sample data)

Then add suitable views is src/index.js

based on:

https://stackabuse.com/using-sequelize-orm-with-nodejs-and-express/


 - https://sequelize.org/master/index.html
- https://sequelize.org/v5/identifiers.html
