const express = require('express')
const sql = require('mssql')
const pug = require('pug')

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
			Books.ISBN,
            Title,
			case
				when count(FirstName) > 1 then min(FirstName + ' ' + LastName) +', m.fl'
				else min(FirstName + ' ' + LastName)
			end as 'Author',
            Price
          from
            Books

			right join AuthorsBooks
			ON Books.ISBN = AuthorsBooks.ISBN
			right join Authors
			ON AuthorsBooks.AuthorID = Authors.ID
			group by
			Books.ISBN,
			Books.Price,
			Books.Title
            `)

    //res.json(result)
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
            Books.ISBN =  @ISBN;
          
    select
      Name,
      isnull((
        Select
          Quantity
        from
          Stock
        Where StoreID = StoreFronts.ID and ISBN = 9780008264444
      ),0) as 'Stock'

from  StoreFronts
            `

    const connection = await sql.connect(connectionset)
    const result = await connection.request()
      .input('ISBN', sql.NVarChar, req.params.ISBN)
      .query(query)
    //res.send(req.params.ISBN)
    //res.json(result)

    res.render('book.pug', { Books: result.recordsets[0], Stores: result.recordsets[1] });
    console.log(query);
  }
  catch (ex) {
    console.log(ex)
  }
})



app.listen(3000, () => {
  console.log('welcome')
})