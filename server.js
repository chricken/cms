'use strict';

// Module
const fs = require('fs');
const opn = require('better-opn');
const formidable = require('formidable');

// Express
const express = require('express');
const server = express();

server.use(express.static('public', {
    extensions: ['html']
}));

server.use(express.json());

// Couch
const config = require('./config.js');
const db = require('nano')(`http://${config.credentials.user}:${config.credentials.pw}@${config.address}`).db;

// FUNKTIONEN
const init = () => {
    server.listen(80, err => {
        if (err) console.log(err);
        else {
            console.log('Server läuft');
            opn('http://localhost');
        }
    });
}

// ROUTEN
server.get('/load_pagetree', (req, res) => {
    let dbName = 'cms_pages';
    let dbPages = db.use(dbName);

    dbPages.list({ include_docs: true }).then(
        data => data.rows.map(row => row.doc)
    ).then(
        data => res.send(JSON.stringify({
            status: 'ok',
            data
        }))
    ).catch(
        err => res.send(JSON.stringify({
            status: 'err',
            err
        }))
    )

})

server.post('/load_contents', (req, res) => {

    let dbName = 'cms_content';
    let dbContents = db.use(dbName);

    // console.log(req.body);

    dbContents.fetch({
        keys: req.body
    }).then(
        res => res.rows.map(row => row.doc)
    ).then(
        data => res.send(JSON.stringify(data))
    ).catch(
        console.log
    )

})

server.post('/submit_new_content', (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields) => {
        // console.log(fields);
        let dbPages = db.use('cms_pages');
        let dbContent = db.use('cms_content');
        let contentID;

        dbContent.insert({
            header: fields.header,
            content: fields.content
        }).then(
            res => {
                contentID = res.id;
                //console.log(res);
                //console.log(contentID);

                const keys = Object.keys(fields)
                    .filter(key => key.startsWith('page_'))
                    .map(key => key.substr(5));

                return Promise.all(keys.map(key => dbPages.get(key)))
            }
        ).then(
            res => Promise.all(
                res.map(page => {
                    page.contents.push(contentID);
                    return dbPages.insert(page);
                })
            )
        ).then(
            () => res.send(JSON.stringify({
                status: 'ok'
            }))
        ).catch(
            console.log
        )

    })
})

// AnswerAll
server.get('*', (req, res) => {
    // Das geht auch eleganter
    // Aber erstmal soll es funktionieren
    fs.readFile(
        'public/index.html',
        (err, content) => {
            if (err) console.log();
            else {
                res.send(content.toString());
            }
        }
    )
})


// INIT
init();