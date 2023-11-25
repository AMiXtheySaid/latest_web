const express = require ('express');
const path = require ('path')
const app = express();
const port = 2999;


app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, `./frontend/html/main_page.html`))
})

app.listen(port, () =>
    console.log(`Website listening to port ${port}`)
)
