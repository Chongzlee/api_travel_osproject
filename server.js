let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    return res.send({ 
        error: false, 
        message: 'travel ลับแล in Thailand',
        
    })
})

let dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'os_project'
})
dbCon.connect();

app.get('/thailands', (req, res) => {
    dbCon.query('SELECT * FROM thailand', (error, results, fields) => {
        if (error) throw error;

        let message = ""
        if (results === undefined || results.length == 0) {
            message = "table is empty";
        } else {
            message = "Successfully retrieved all";
        }
        return res.send({ error: false, data: results, message: message});
    })
})

// add a new book
app.post('/thailand', (req, res) => {
    let name = req.body.name;
    let detail = req.body.detail;
    let address = req.body.address;
    let open_close = req.body.open_close;
    let coordinates = req.body.coordinates;
    let image = req.body.image;

    // validation
    if (!name || !detail|| !address|| !open_close|| !coordinates|| !image) {
        return res.status(400).send({ error: true, message: "Please provide information"});
    } else {
        dbCon.query('INSERT INTO books (name, detail, address, open_close, coordinates, image) VALUES(?, ?, ?, ?, ?, ?)', [name, detail, address, open_close, coordinates, image], (error, results, fields) => {
            if (error) throw error;
            return res.send({ error: false, data: results, message: "successfully added"})
        })
    }
});

// retrieve book by id 
app.get('/thailand/:id', (req, res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide data id"});
    } else {
        dbCon.query("SELECT * FROM thailand WHERE id = ?", id, (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results === undefined || results.length == 0) {
                message = "data not found";
            } else {
                message = "Successfully retrieved data";
            }

            return res.send({ error: false, data: results[0], message: message })
        })
    }
})

// update book with id 
app.put('/book', (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let detail = req.body.detail;
    let address = req.body.address;
    let open_close = req.body.open_close;
    let coordinates = req.body.coordinates;
    let image = req.body.image;

    // validation
    if (!id || !name || !detail|| !address|| !open_close|| !coordinates|| !image) {
        return res.status(400).send({ error: true, message: 'Please provide data id and other'});
    } else {
        dbCon.query('UPDATE books SET name = ?, detail = ?, address = ?, open_clos = ?, coordinates = ?, image = ?,  WHERE id = ?', [name, detail, address, open_close, coordinates, image], (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results.changedRows === 0) {
                message = "Book not found or data are same";
            } else {
                message = "Book successfully updated";
            }

            return res.send({ error: false, data: results, message: message })
        })
    }
})

// delete book by id
app.delete('/thailand', (req, res) => {
    let id = req.body.id;

    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide book id"});
    } else {
        dbCon.query('DELETE FROM thailand WHERE id = ?', [id], (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results.affectedRows === 0) {
                message = "Data not found";
            } else {
                message = "Data successfully deleted";
            }

            return res.send({ error: false, data: results, message: message })
        })
    }
})

app.listen(3000, () => {
    console.log('Node App is running on port 3000');
})

module.exports = app;
