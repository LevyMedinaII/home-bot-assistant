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
    var menu = ""
    var buttons = []
    res.send(
        {
            "messages": [
                {"text": "Here are the list of appliances available: \n" + menu}
            ]
        }
    )
})

/* Relay Controls */
app.post('/on/:relay_id', (req, res, next) => {
    var options = { args: [req.params.relay_id], pythonPath: './py_scripts' } 
    // @TODO: Control rpi, set Write Pin, WRITE HIGH
    PythonShell.run('relayon.py', options, (err, res) => {
        if(err) throw err;
        console.log('finished')
    })
    res.send(
        {
            "messages": [
                {"text": `You just turned on lightbulb ${req.params.relay_id}!`}
            ]
        }
    )
})

app.post('/off/:relay_id', (req, res, next) => {
    var options = { args: [req.params.relay_id], pythonPath: './py_scripts'  }
    // @TODO: Control rpi, set Write Pin, WRITE LOW
        PythonShell.run('relayoff.py', options, (err, res) => {
        if(err) throw err
        console.log('finished')
    })
        res.send(
        {
            "messages": [
                {"text": `You just turned off a lightblub ${req.params.relay_id}!`}
            ]
        }
    )
})

/* Relay Status */
app.get('/status/:relay_id', (req, res, next) => {
    var relay_id = req.params.relay_id
    var options = { args: [relay_id], pythonPath: './py_scripts'  }
    // @TODO: Control rpi, set Write Pin, WRITE LOW
    PythonShell.run('getdata.py', options, (err, result) => {
        if(err) throw err
        console.log(result)
        var status = ""
        if (result[0] === true) {
            status = "on"
        } else {
            status = "off"
        }
        res.send({
            "messages": [
                {"text": `Appliance ${relay_id} is ${status}!`}
            ]
        })
    })
})

app.get('/status/all', (req, res, next) => {
    var options = { args: [relay_id], pythonPath: './py_scripts'  }
    // @TODO: Control rpi, set Write Pin, WRITE LOW
    PythonShell.run('getdata_all.py', options, (err, result) => {
        if(err) throw err
        console.log(result)
        var status = []

        status[0] = result[0] ? 'ON' : 'OFF'
        status[1] = result[1] ? 'ON' : 'OFF'
        status[2] = result[2] ? 'ON' : 'OFF'
        status[3] = result[3] ? 'ON' : 'OFF'

        res.send({
            "messages": [
                {
                    "text": `Appliance 1 is ${status[0]},
                                Appliance 2 is ${status[1]},
                                Appliance 3 is ${status[2]},
                                and Appliance 4 is ${status[3]}`
                }
            ]
        })
    })
})

app.listen(process.env.port || port)
console.log('App running in port:', process.env.port || port)
