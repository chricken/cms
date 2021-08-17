'use strict';
// Alle Ajax-Anfragen und Antworten werden grundsätzlich als JSON-Objekte verarbeitet
const ajax = {
    get(address) {
        return fetch(address).then(
            res => res.json()
        )
    },
    post(address,data) {
        console.log(address, data);
        
        const myResponse = new Response(address,{
            method: 'post',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(data)
        })
        
        return fetch(myResponse).then(
            res => res.json()
        )
        
       //return new Promise(res => 42)
    },
    delete(address,data) {
        const myResponse = new Response(address,{
            method: 'delete',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(data)
        })

        return fetch(myResponse).then(
            res => res.json()
        )
    },
    put(address,data) {
        const myResponse = new Response(address,{
            method: 'put',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(data)
        })

        return fetch(myResponse).then(
            res => res.json()
        )
    },
}

export default ajax;