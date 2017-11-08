var router = require('express').Router()
const raspi = require('raspi');
const I2C = require('raspi-i2c').I2C;
var PythonShell = require('python-shell');

raspi.init(() => {
    const i2c = new I2C();

    console.log(i2c.readByteSync(0x18));
    
}) 




router.post('/on/:light_id', (req, res, next) => {
    var lightId = req.params.light_id
    // @TODO: Control rpi, set Write Pin, WRITE HIGH
    PythonShell.run('relay.py', function(err){
        if(err) throw err;
        console.log('finished');
    });
    res.send('Success')
})

router.post('/off/:light_id', (req, res, next) => {
    var lightId = req.params.light_id
    // @TODO: Control rpi, set Write Pin, WRITE LOW
    res.send('Success')
})

module.exports = router