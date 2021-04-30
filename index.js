const express = require('express')
const sql = require('mssql')

require('dotenv').config()

const app = express()

app.set("view engine", "pug")

const connectionset = {
  server: 'localhost',
  database: 'store',
  user: 'user1',
  password: 'user1'
}

app.get('/', async (req, res) => {
  try {
    /*const query = `
    select 
      Title 
    from 
     books
      `*/
    const connection = await sql.connect(connectionset)
    const result = await connection.request()
      .query('select * from Books')

    //res.json(result);
    res.render('index.pug', { Books: result.recordset });
    console.log(query);

  }
  catch (ex) {
    console.log(ex)
  }

})

/*app.get('/', (req, res) => {
  res.render("index");
})*/

app.listen(3000, () => {
  console.log('welcome')
})