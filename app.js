const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(morgan('common'));
const books = require('./books-data.js');
const playStore = require('./playstore.js');
app.get('/books', (req, res) => {
    const search = req.query.search;

    if (search != null || typeof search != 'undefined') {
        let results = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));
        if (results != null && results.length > 0) {
            res.json(results);
        }
        else {
            res.status(400);
            res.send('Unable to Find record.')
        }
    }
    else {
        res.json(books);
    }

});

app.get('/apps', (req, res) => {
    const gener = req.query.gener;
    const sort = req.query.sort;
    let playList = null;
    if (gener != null || typeof gener != 'undefined') {
        playList = playStore.filter(p => p.Genres.toLowerCase() === gener.toLowerCase());
        //console.log(`Playstore filtered lst : ${playStore}`);
        if (playList != null && playList.length > 0) {
            res.json(playList);
        }
        else {
            res.status(400);
            res.send('Unable to Find app in playstore with selected genres');
        }
    }
    if (sort != null || typeof sort != 'undefined') {
        if (!['Rating', 'App'].includes(sort)) {
            res.status(400);
            res.send('Sort must be one of rating or app')
        }
        else {
            if (playList != null && playList.length > 0) {
            playList.sort((a,b)=>{
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort]? -1 : 0;
            });
            res.json(playList);
            }
            else {
                playStore.sort((a,b)=>{
                    return a[sort] > b[sort] ? 1 : a[sort] < b[sort]? -1 : 0;
                    });
                    res.json(playStore);
            }
        }
    }
    else {
        res.json(playStore);
    }

});

app.listen(8000, () => {
    console.log('Server started on PORT 8000');
});