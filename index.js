import { http } from '@google-cloud/functions-framework';

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
