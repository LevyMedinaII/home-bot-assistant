var express = require('express')
var lt = require('localtunnel')
var bodyParser = require('body-parser')
var app = express()
var PythonShell = require('python-shell');
require('dotenv').config()

const port = 5050
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

/* Chatfuel Utilities */
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

/*-- RASPBERRY PI CONTROLLERS --*/
/* Relay Controls */
app.post('/on/:relay_id', (req, res, next) => {
    var names = [
        req.body.appliance_1_name,
        req.body.appliance_2_name,
        req.body.appliance_3_name,
        req.body.appliance_4_name
    ]
    var relay_id = req.params.relay_id
    var options = { args: [relay_id] } 
    // @TODO: Control rpi, set Write Pin, WRITE HIGH
    PythonShell.run('relayon.py', options, (err, res) => {
        if(err) throw err;
        console.log('finished')
    })
    var msg ="Error encountered. Please restart me :("
    if (parseInt(relay_id) < 5) {
        msg = `You just turned on ${names[parseInt(relay_id)-1]}!`
    } else if (parseInt(relay_id) == 5){
        msg = 'You turned on all four appliances!'
    }
    res.send(
        {
            "messages": [
                {"text": msg}
            ]
        }
    )
})

app.post('/off/:relay_id', (req, res, next) => {
    var names = [
        req.body.appliance_1_name,
        req.body.appliance_2_name,
        req.body.appliance_3_name,
        req.body.appliance_4_name
    ]
    var relay_id = req.params.relay_id
    var options = { args: [relay_id]  }
    // @TODO: Control rpi, set Write Pin, WRITE LOW
        PythonShell.run('relayoff.py', options, (err, res) => {
        if(err) throw err
        console.log('finished')
    })
    var msg ="Error encountered. Please restart me :("
    if (parseInt(relay_id) < 5) {
        msg = `You just turned off ${names[parseInt(relay_id)-1]}!`
    } else if (parseInt(relay_id) == 5){
        msg = 'You turned off all four appliances!'
    }
    res.send(
        {
            "messages": [
                {"text": msg}
            ]
        }
    )
})

/* Relay Status */
// app.get('/status/one/:relay_id', (req, res, next) => {
//     var relay_id = req.params.relay_id
//     var options = { args: [relay_id] }
//     // @TODO: Control rpi, set Write Pin, WRITE LOW
//     PythonShell.run('getdata.py', options, (err, result) => {
//         if(err) throw err
//         console.log(result)
//         var status = ""
//         if (result[0] === true) {
//             status = "on"
//         } else {
//             status = "off"
//         }
//         res.send({
//             "messages": [
//                 {"text": `Appliance ${relay_id} is ${status}!`}
//             ]
//         })
//     })
// })

app.get('/status/all', (req, res, next) => {
    var names = [
        req.query.appliance_1_name,
        req.query.appliance_2_name,
        req.query.appliance_3_name,
        req.query.appliance_4_name
    ]
    // @TODO: Control rpi, set Write Pin, WRITE LOW
    PythonShell.run('getdata_all.py', (err, result) => {
        if(err) throw err
        console.log(result)
        var status = []

        status[0] = result[2]=='True' ? 'ON' : 'OFF'
        status[1] = result[5]=='True' ? 'ON' : 'OFF'
        status[2] = result[8]=='True' ? 'ON' : 'OFF'
        status[3] = result[11]=='True' ? 'ON' : 'OFF'

        res.send({
            "messages": [
                {
                    "text": `${names[0]} is ${status[0]} \n${names[1]} is ${status[1]} \n${names[2]} is ${status[2]} \n${names[3]} is ${status[3]}`
                }
            ]
        })
    })
})

app.listen(process.env.port || port)
console.log('App running in port:', process.env.port || port)
