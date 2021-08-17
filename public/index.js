'use strict';

// console.log(window.location.pathname);
// IMPORTS
import dom, { $, $$ } from './dom.js';
import ajax from './ajax.js';


// VARIABLEN
const nav = $('nav');
const main = $('main');

let pageID;
let contentIDs;
const mapToHome = ['/', '/index'];
const homeURL = '/Home';

// FUNKTIONEN
const processContents = contents => {
    // console.log(contents);
    contents.forEach(content => {
        const container = dom.create({
            klassen: ['el'],
            eltern: main
        });

        dom.create({
            typ: 'h3',
            eltern: container,
            inhalt: content.header
        })

        dom.create({
            typ: 'p',
            eltern: container,
            inhalt: content.content
        })
    })
}


const loadContents = () => {
    // Inhalte laden
    console.log('loadContent');

    fetch('/load_contents',{
        method: 'post',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(contentIDs)
    }).then(
        res => res.json()
    ).then(
        processContents
    ).catch(
        console.log        
    )

    /*
    ajax.post('/load_contents', contentIDs).then(
        processContents
    ).catch(
        console.log
    )

    */
}

const processPagetree = pagetree => {
    // Navigation zeichnen
    pagetree.forEach(page => {
        let location = window.location.pathname;
        console.log(location);
        console.log(homeURL);

        location = mapToHome.includes(location) ? homeURL : location;
        if (location == `/${page.name.replaceAll(' ', '%20')}`) {
            pageID = page._id;
            contentIDs = page.contents;
        }

        // Navigationselement zeichnen
        dom.create({
            eltern: nav,
            typ: 'a',
            inhalt: page.name,
            klassen: ['navLink'],
            listeners: {
                click() {
                    window.location = `/${page.name}`
                }
            }
        })
    })

    // Inhalte laden
    loadContents();

}

const loadPagetree = () => {
    ajax.get('/load_pagetree').then(
        res => processPagetree(res.data)
    ).catch(
        console.log
    )
}

const init = () => {
    loadPagetree();
}

// INIT
init();
