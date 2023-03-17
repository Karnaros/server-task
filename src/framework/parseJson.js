module.exports = (req, res) => {    
    res.send = (data, resultCode) => {
        res.writeHead(resultCode, {
            'Content-type': 'application/json'
        })
        res.end(JSON.stringify(data));
    }
}
