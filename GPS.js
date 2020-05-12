const serialPort = require('serialport')
const serialPortParser = require('@serialport/parser-readline')
const GPS = require('gps')
//
console.log('starting GPS module')
const port = new serialPort('/dev/ttyS0', {baudRate: 9600})
const gps = new GPS()
const parser = port.pipe(new serialPortParser())
//
let protocolsCount = {}
gps.on('data', data => {
    if(data.type) {
        if(protocolsCount.hasOwnProperty(data.type)) {
            protocolsCount[data.type]++
        } else {
            protocolsCount[data.type] = 0
        }
    }
    //if(!data.quality) return
    //if(data) console.log(data)
    //if(data.type) console.log(data.type)
})
//
gps.on('GGA', data => {
    if(!data.quality) return
    console.log('GGA')
    console.log(data)
})
//
gps.on('HDT', data => {
    console.log('HDT')
    console.log(data)
})
//
//
console.log('defining the callback for parser.on')
//every time a data is read from serial port
//it will be sent to gps for decoding
let parserOnDataCounter = 0
parser.on('data', data => {
    parserOnDataCounter++
    if(parserOnDataCounter % 15 === 0) {
        console.log(`parsed data ${parserOnDataCounter} times`)
        console.log(JSON.stringify(protocolsCount, null, 2))
    }
    gps.update(data)
})