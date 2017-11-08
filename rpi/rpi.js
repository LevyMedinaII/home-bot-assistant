var router = require('express').Router()

router.post('/on/:light_id', (req, res, next) => {
    var lightId = req.params.light_id
    // @TODO: Control rpi, set Write Pin, WRITE HIGH
    res.send('Success')
})

router.post('/off/:light_id', (req, res, next) => {
    var lightId = req.params.light_id
    // @TODO: Control rpi, set Write Pin, WRITE LOW
    res.send('Success')
})

module.exports = router