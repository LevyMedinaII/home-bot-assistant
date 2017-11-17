var app = require('express')
var lt = require('localtunnel')
var bodyParser = require('body-parser')
require('dotenv').config()

const port = 5050

var lights = require('./lights/lights')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var tunnel = localtunnel( process.env.port || port,
    { subdomain: process.env.link_token || 'default' },
    (err, tunnel) => {
        // the assigned public url for your tunnel
        // i.e. https://abcdefgjhij.localtunnel.me
        console.log('Internet accessible link:', tunnel.url)
        tunnel.url;
}) 

app.get('/test', (req, res) => {
    res.send(
        {
            set_attributes: {
                token_is_valid: true
            }
        }
    )
})

app.listen(process.env.port || port)
console.log('App running in port:', process.env.port || port)
