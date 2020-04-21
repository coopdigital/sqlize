/*jshint esversion: 8 */
const bodyParser = require('body-parser');
const express = require('express');
const Sequelize = require('sequelize');

const db = require('./modules/db');

/* you will need to change this to connect to your db *
 * const sequelize = new Sequelize(
 *  'mysql://user:pass@example.com:5432/dbname'
 * );
 *
 * do this is src/modules/index.js
 *
 * This is done elsewhere are Sequelizes reuses db connections so you only
 * want one instance of it.
 */
const sequelize = db.sequelize;

// Database models: see src/modules/db/index.js
const Person = db.Person;
const Event = db.Event;
const Address = db.Address;
const Attendee = db.Attendee;

const app = express();
app.use(bodyParser.json());
const port = 3000;
app.listen(port, () => console.log(`listening on port ${port}!`));

// setup the db connection
db.authenticate(sequelize);




app.get('/', (req, res) => res.send('Sample App'));

// list people like 'SELECT * FROM person', curl 127.0.0.1:3000/people
app.get(
  '/people', (req, res) => { // noqa
    Person.findAll().then(people => res.json(people));
  }
);

// get an individual by id, like
// 'SELECT name, awesome from person WHERE id IS :id
// N.B. the id field is automatically created
// curl 127.0.0.1:3000/person/1
app.get(
  '/person/:id', (req, res) => {
    Person.findAll({
      attributes: ['name', 'awesome'],
      where: {
        id: req.params.id
      }
    }).then(
      person => res.json(person)
    );
  }
);

// search for someone using query params
// SELECT name, awesome from person WHERE name LIKE :name
// curl "127.0.0.1:3000/search?name=paul"   use quotes
// Note the url should probably be person/search, if this was the case, you
// would have to put above the '/person:id' otherwise it won't work.
app.get(
  '/search', (req, res) => {
    Person.findAll({
      attributes: ['name', 'awesome'],
      where: {
        // be default where uses equality, Op(erations) allow you to make
        // more complex queries
        name: {
          [Sequelize.Op.like]: req.query.name
        }
      }
    }).then(
      people => res.json(people)
    );
  }
);

// create a person using a json post
// eslint-disable-next-line max-len
// curl -d '{"name":"Dracula","awesome":"false"}' -H "Content-Type: application/json" -X POST http://localhost:3000/person
app.post('/person', function (req, res) {
  Person.create({
    name: req.body.name,
    awesome: req.body.awesome
  }).then(function (person) {
    res.json(person);
  });
});

// 



// update a person using disable and put
// eslint-disable-next-line max-len
// curl -d '{"name":"Vlad the Impaler"}' -H "Content-Type: application/json" -X PUT http://localhost:3000/person/2
app.put(
  '/person/:id', (req, res) => {
    // gets a single record by id
    Person.findByPk(req.params.id).then(
      person => {
        person.update({
          name: req.body.name,
          awesome: req.body.awesome
        });
      }
    ).then(
      person => res.json(person)
    );
  }
);

// delete someone
// curl -X "DELETE" 127.0.0.1:3000/person/2
app.delete('/person/:id', function (req, res) {
  Person.findByPk(req.params.id).then(function (person) {
    person.destroy();
  }).then(() => {
    res.sendStatus(200);
  });
});


// create a favourite  for person (whose id == :id)
// eslint-disable-next-line max-len
// curl -d '{"description":"Books",}' -H "Content-Type: application/json" -X POST http://localhost:3000/like/1
app.post(
  '/like/:id', (req, res) => {
    Person.findByPk(req.params.id).then(
      person => person.addFavourite({
        description: req.body.description,
      })
    ).then(
      person => res.json({
        person: {
          id: person.id,
          name: person.name
        },
        likes: req.body.description
      })
    );
  }
);

app.get(
  '/like/:id', (req, res) => {
    Person.findByPk(req.params.id).then(
      person => person.getFavourites() // method added autoamtically
    ).then(
      likes => res.json(likes)
    );
  }
);


// create an attendee
app.post('/attendee/create', function (req, res) {
  Attendee.create({
    name: req.body.name,
    email: req.body.email,
    date_of_birth: req.body.dob,
  }).then(function (attendee) {
    res.json(attendee);
  });
});

// create an event
app.post('/event/create', function (req, res) {
  console.log("create event");
  const event = Event.create({
    title: req.body.title,
    description: req.body.description,
    time: req.body.time,
    cost: req.body.cost,
  }).then(function (event) {
    event.createAddress({
      line1: req.body.address.line1,
      line2: req.body.address.line2,
      city: req.body.address.city,
      county: req.body.address.county,
      country: req.body.address.country,
      postal_code: req.body.address.postal_code
    });
  }).then(function (event) {
    res.json(event);
  });
});

app.get(
  '/events', (req, res) => { // noqa
    Event.findAll().then(events => res.json(events));
  }
);


app.get(
  '/attendee/:id',
  (req, res) => {
    const attendee = Attendee.findByPk(req.params.id).then(
      async (attendee) => {
        const events = await attendee.getEvents({
          attributes: ["id", "title", "description", "cost"]
        }).map(async (event) => {
          return {
            id: event.id,
            title: event.title,
            description: event.description,
            cost: event.cost,
            // address: await event.getAddress()
          };
        }); // method added autoamtically
        res.json({
          id: attendee.id, 
          event: events
          // title: attendee.title,
          // description: attendee.description,
          // cost: attendee.cost,
        });
      });
  });

app.post(
  '/attendee/:id', (req, res) => {
    // gets a single record by id
    const attendee = Attendee.findByPk(req.body.id).then(
      async (attendee) => {
        await attendee.addEvent(req.params.id);
        const events = await attendee.getEvents(); // method added autoamtically
        res.json({
          name: attendee.name,
          email: attendee.email,
          events: events
        });
      }
    );
  }
);

app.delete('/event/delete/:id', function (req, res) {
  Event.findByPk(req.params.id).then(function (event) {
    event.destroy();
  }).then(() => {
    res.sendStatus(200);
  });
});

app.delete(
  '/attendee/:user/:eventid', (req, res) => {
    // gets a single record by id
    const attendee = Attendee.findByPk(req.params.user).then(
      async (attendee) => {
        await attendee.removeEvent(req.params.eventid);
        const events = await attendee.getEvents(); // method added automatically
        res.json({
          name: attendee.name,
          email: attendee.email,
          events: events
        });
      }
    );
  }
);

app.get("/event/:id", (req, res) => {
  const event = Event.findByPk(req.params.id).then(
    async (event) => {
      const attendees = await event.getAttendees({
        attributes: ["id", "name", "email"],
        raw: true
      }).map(attendee => {
        return {
          id: attendee.id,
          name: attendee.name,
          email: attendee.email
        };
      }); // method added autoamtically
      console.log(attendees);
      res.json({
        title: event.title,
        description: event.description,
        time: event.time,
        cost: event.cost,
        attendees: attendees
      });
    });
});