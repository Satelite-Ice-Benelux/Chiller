import { http } from '@google-cloud/functions-framework';
const fs = require('fs');

http('helloHttp', (req, res) => {
    if (!req.url.endsWith('.json')) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('Not found');
    }

    const filePath = path.join(__dirname+"/jsons", req.url);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            return res.end('File not found');
        }
        console.log(filePath.split('/').pop());
        res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' // Enable CORS
        });
        res.end(data);
    });
});

//lijst met de ID van de chilllers?
const chillerlijst = {
    'berendrecht' : '1' ,
    'bergenopzoom' : '2' ,
    'beringen' : '3' ,
    'beveren' : '4',
    'bree' : '5',
    'deurne1' : '6', 
    'deurne2': '7',
    'dongen' : '8',
    'genk' : '9',
    'halle1' : '10',
    'halle2' : '11',
    'kapellen' : '12',
    'keerbergen1' : '13',
    'keerbergen2' : '14',
    'merelbeke' : '15',
    'oosterhout1' : '16',
    'oosterhout2' : '17',
    'puurs' : '18',
    'PWP' : '19',
    'schilde1' : '20',
    'schilde2' : '21',
    'son1' : '22',
    'son2' : '23',
    'sintniklaas1' : '24',
    'sintniklaas2' : '25',
    'tilburg' : '26',
    'uden1' : '27',
    'uden2' : '28',
    'wenduine' : '29',
    'wilrijk1' : '30',
    'wilrijk2' : '31',
    'woerden' : '32'
};

function Baan(id, name, tijd, tempin, tempuit,status,verbruik,ambient) {
    this.id = id;
    this.name = name;
    this.tijd = tijd;
    this.tempin = tempin;
    this.tempuit = tempuit;
    this.foutmelding = status;
    this.verbruik = verbruik;
    this.ambient = ambient;
}

async function Vraag101(){
    const API_URL = "https://api.101connect.nl/v2/ObjectValue/getValues";
    const API_KEY = "YKKiCVcce6sKUPcid__y2QfnA_eu02g60N7Sjw1LluYyMkgE";
        try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Access-Token ${API_KEY}`,
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        const t = data.items[0];
        const id = t.id;
        const nm = t.name;
        const tijd = t.lastContact;
        const tin = t.variables[0].value.value;
        const tuit = t.variables[1].value.value;
        const sta = t.variables[2].value.value;

        const b  = new Baan(id,nm,tijd,tin,tuit,sta,null,null);
        let lijn =  b.name+";"+b.tijd+";"+b.id+";"+b.tempin+";"+b.tempuit+";"+b.foutmelding+";"+b.verbruik+";"+b.ambient+"\n";

        const son = 'jsons/'+ nm+".json";
        const cv = 'csvs/'+nm+".csv";
        fs.writeFile(son, JSON.stringify(b),(err) => {if (err) {console.log(err);}});
        fs.appendFile(cv, lijn, "utf8",(err) => {if (err) {
            console.log(err);
            fs.writeFile(cv, JSON.stringify(b),(err) => {if (err) {console.log(err);}});
        }});
        
    } catch (error) {
        console.error("Request failed:", error.message);
    }
}

Vraag101()