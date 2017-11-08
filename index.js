var express = require('express')
var lt = require('localtunnel')
var bodyParser = require('body-parser')
var app = express()
var PythonShell = require('python-shell');
require('dotenv').config()

const port = 5050
var rpi = require('./rpi/rpi.js')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var tunnel = lt( process.env.port || port,
    { subdomain: process.env.link_token || 'default' },
    (err, tunnel) => {
        // the assigned public url for your tunnel
        // i.e. https://abcdefgjhij.localtunnel.me
        console.log('Internet accessible link:', tunnel.url)
        tunnel.url;
}) 

app.get('/', (req, res) => {
    res.send('Online!')
})
app.get('/test', (req, res) => {
    console.log('/test called')
    res.send(
        {
            set_attributes: {
                token_is_valid: true
            }
        }
    )
})

app.get('/menu', (req, res) => {
    console.log('/menu called')
    var menu = "";
    res.send(
        {
            "messages": [
                {"text": "Here are the list of appliances available: \n" + menu}
            ]
        }
    )
})

app.post('/on/:light_id', (req, res, next) => {
    var lightId = req.params.light_id
    // @TODO: Control rpi, set Write Pin, WRITE HIGH
    PythonShell.run('relayon.py', function(err){
        if(err) throw err;
        console.log('finished');
    });
    res.send(
        {
            "messages": [
                {"text": "You just turned on a lightblub! WOWWW!"}
            ]
        }
    )
})

app.post('/off/:light_id', (req, res, next) => {
    var lightId = req.params.light_id
    // @TODO: Control rpi, set Write Pin, WRITE LOW
        PythonShell.run('relayoff.py', function(err){
        if(err) throw err;
        console.log('finished');
    });
        res.send(
        {
            "messages": [
                {"text": "You just turned off a lightblub!"}
            ]
        }
    )
})

app.listen(process.env.port || port)
console.log('App running in port:', process.env.port || port)
