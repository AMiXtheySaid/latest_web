const exp = require('constants');
const express = require ('express');
const path = require ('path')
const app = express();
const port = 2999;

app.use(express.static(path.join(__dirname, '/frontend')))

app.get('/home', (req, res) => {
    res.sendFile(path.resolve(__dirname, `frontend/main_page.html`))
})

app.listen(port, () =>
    console.log(`Website listening to port ${port}`)
)
