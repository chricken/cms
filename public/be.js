'use strict';

// IMPORTS
import dom, { $, $$ } from './dom.js';
import ajax from './ajax.js';

// DOM-Mapping
const formNewContent = $('#formNewContent');
const pageSelection = $('#pageSelection');

const testBtn = $('#testBtn');

// FUNKTIONEN
const clearForm = () => {
    [...formNewContent.querySelectorAll('textarea')].forEach(el => el.value='');
    [...formNewContent.querySelectorAll('input[type="text"]')].forEach(el => el.value='');
    [...formNewContent.querySelectorAll('input[type="radio"]')].forEach(el => el.checked=false);
    [...formNewContent.querySelectorAll('input[type="checkbox"]')].forEach(el => el.checked=false);
}

const processPagetree = pagetree => {
    // Navigation zeichnen
    pagetree.forEach(page => {

        // Navigationselement zeichnen
        const container = dom.create({
            eltern: pageSelection,
            typ: 'p',
        })

        dom.create({
            typ: 'input',
            eltern: container,
            attr: {
                type: 'checkbox',
                name: `page_${page._id}`
            }
        })

        dom.create({
            typ: 'span',
            inhalt: page.name,
            eltern: container
        })
    })
}
const loadPagetree = () => {
    ajax.get('/load_pagetree').then(
        res => processPagetree(res.data)
    ).catch(
        console.log
    )
}

const submitNewContent = evt =>{
    evt.preventDefault();
    fetch('/submit_new_content', {
        method: 'post',
        body: new FormData(formNewContent)
    }).then(
        res => res.json()
    ).then(
        clearForm
    ).catch(
        console.log        
    )
}

const init = () => {
    loadPagetree();
}

// Eventlistener
formNewContent.addEventListener('submit', submitNewContent);
//testBtn.addEventListener('click', clearForm);

// INIT
init()