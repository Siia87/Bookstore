const express = require('express')
const sql = require('mssql')
const path = require('path')

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

    const connection = await sql.connect(connectionset)
    const result = await connection.request()
      .query(`
          select 
            ISBN,
            Title,
            FirstName + ' ' + LastName as 'Author',
            Price
          from 
            Books,
            Authors
            `)

    res.render('index.pug', { Books: result.recordset });
    console.log(query);

  }
  catch (ex) {
    console.log(ex)
  }

})

app.get('/book/:ISBN', async (req, res) => {
  try {
    const query = `
     select
            Books.ISBN,
            Title,
			      Language.Name as 'Language',
            Price,
		      	FirstName + ' ' + LastName as 'Author',
				Rating.Rating

          from
            Books

		join Rating
			ON Books.RatingID = Rating.ID
        join language
          ON Books.languageID = language.[639-1]
	  	  Join AuthorsBooks
          ON Books.ISBN = AuthorsBooks.ISBN
	  	  Join Authors
          ON Authors.ID = AuthorsBooks.AuthorID
		  where
            Books.ISBN =  @ISBN
            `

    const connection = await sql.connect(connectionset)
    const result = await connection.request()
      .input('ISBN', sql.NVarChar, req.params.ISBN)
      .query(query)
    //res.send(req.params.ISBN)
    //res.json(result)

    res.render('book.pug', { Books: result.recordset });
    console.log(query);
  }
  catch (ex) {
    console.log(ex)
  }
})



app.listen(3000, () => {
  console.log('welcome')
})