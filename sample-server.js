var caesar = require('caesar-npm-pkg')

const express = require('express')
const app = express()
const port = 3000

caesar.printMsg()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

