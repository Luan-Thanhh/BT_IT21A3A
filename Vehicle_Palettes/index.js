const http = require('http');
const queryString = require('query-string');

const port = 3033;

const { readFile, readFileSync, writeFileSync } = require('fs');

const file = readFileSync('./vietnameseVehiclePalettes.txt', 'utf-8');
writeFileSync('./vietnameseVehiclePalettes.txt', file);

const vehiclePalettes = JSON.parse(file);


const server = http.createServer((req, res) => {

  let dataForm = '';
  isCity = false;

  req.on('data', data => {
    dataForm = data + '';
    dataForm = queryString.parse(dataForm);

    isCity = vehiclePalettes.some(vehiclePalette => vehiclePalette.city = dataForm.name);

  });

  function getPalette(vehiclePalettes) {
    let str = '';

    vehiclePalettes.forEach(vehiclePalette => {
      if (dataForm.name === vehiclePalette.city)
        str = vehiclePalette.plate_no;
    });

    return str;
  }

  readFile('./index.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    if (isCity) {
      res.write(data);
      res.write(`<h1>Biển số xe ${getPalette(vehiclePalettes)}</h1>`);
    } else {
      res.write(data);
    }
    return res.end();
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}: http://localhost:${port}`);
});