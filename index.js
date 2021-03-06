const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const {
  Client
} = require('pg');

// Initialise postgres client
// const client = new Client({
//   user: '1ung',
//   host: '127.0.0.1',
//   database: 'pokemons',
//   port: 5432,
// });

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride('_method'));


// Set handlebars to be the default view engine
app.engine('handlebars', exphbs.create().engine);
app.set('view engine', 'handlebars');


/**
 * ===================================
 * Routes
 * ===================================
 */
app.get('/new', (request, response) => {
  // respond with HTML page with form to create new pokemon
  response.render('new');
});

app.get('/:id/edit', (request, response) => {

  let client = new Client({
    user: '1ung',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432
  });

  let context = {}

  client.connect((err) => {
    if (err) {
      console.log("connection error", err.message);
    }

    let query = "SELECT * FROM pokemon WHERE id = $1;";
    values = [request.params.id];

    client.query(query, values, (err, res) => {

      if (err) {
        console.log("query error", err.message);
      } else {
        context.pokemon = res.rows[0];
      }
      response.render('edit', context);
      client.end();
    });
  });
});

app.put('/:id', (reqest, response) => {
  let client = new Client({
    user: '1ung',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432
  });

  let pokeData = request.body;
  let query = "UPDATE pokemon SET num=$1, name=$2, img=$3, weight=$4, height=$5;";
  let values = [pokeData.num, pokeData.name, pokeData.img, pokeData.weight, pokeData.height];

  client.connect((err) => {
    if (err) {
      console.log("connection error", err.message);
    }
    client.query(query, values, (err, res) => {
      if (err) {
        console.log("query error", err.message);
      }
      response.redirect('/' + pokeData.id);
      client.end();
    });
  });
});

app.delete('/:id', (request, response) => {
  let client = new Client({
    user: '1ung',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432
  });

  let pokeData = req.body;

  let query = "DELETE FROM pokemon WHERE id = $1;";
  let values = [params.id];

  client.connect((err) => {
    if (err) {
      console.log("connection error", err.message);
    }
    client.query(query, values, (err, res) => {
      if (err) {
        console.log("query error", err.message);
      }
      response.redirect('/');
      client.end();
    });
  });
});

app.get('/:id', (request, response) => {

  let client = new Client({
    user: '1ung',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432
  });

  let context = {};

  client.connect((err) => {
    if (err) {
      console.log("connection error", err.message);
    }

    let query = "SELECT * FROM pokemon WHERE id = $1;";
    values = [request.params.id];

    client.query(query, values, (err, res) => {

      if (err) {
        console.log("query error", err.message);
      } else {
        context.pokemon = res.rows[0];
      }
      response.render('pokemon', context);
      client.end();
    });
  });
});

app.get('/', (request, response) => {
  // query database for all pokemon
  let client = new Client({
    user: '1ung',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432
  });

  let context = {
    "pokemon": []
  };
  client.connect((err) => {
    if (err) {
      console.log("connection error", err.message);
    }

    let query = "SELECT * FROM pokemon;"

    client.query(query, (err, res) => {
      if (err) {
        console.log("query error", err.message);
      } else {
        res.rows.forEach((pokemon) => {
          context.pokemon.push(pokemon);
        });
      }
      response.render('home', context);
      client.end();
    });
  });
  // respond with HTML page displaying all pokemon
});

app.post('/', (request, response) => {
  let client = new Client({
    user: '1ung',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432
  });
  let newPokemon = request.body;

  let query = "INSERT INTO pokemon(name, img, weight, height) VALUES($1, $2, $3, $4);"
  let values = [newPokemon.name, newPokemon.img, newPokemon.weight, newPokemon.height];

  client.connect((err) => {
    client.query(query, values, (err, res) => {
      if (err) {
        console.log("query error", err.message);
      }
      response.redirect('/');
      client.end();
    });
  });
});



app.post('/pokemon', (req, response) => {

  let client = new Client({
    user: '1ung',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432
  });

  let params = req.body;

  const queryString = 'INSERT INTO pokemon(name, height) VALUES($1, $2)'
  const values = [params.name, params.height];

  client.connect((err) => {
    if (err) console.error('connection error:', err.stack);

    client.query(queryString, values, (err, res) => {
      if (err) {
        console.error('query error:', err.stack);
      } else {
        console.log('query result:', res);

        // redirect to home page
        response.redirect('/');
      }
      client.end();
    });
  });
});


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));