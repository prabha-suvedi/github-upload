let EC = require('elliptic').ec,
    fs = require('fs');

const ec = new EC('secp256k1'),
    privateKeyLocation = __dirname + '/wallet/private_key';

exports.initWallet = () => {
    let privateKey;
    if (fs.existsSync(privateKeyLocation)) {
        const buffer = fs.readFileSync(privateKeyLocation, 'utf8');
        privateKey = buffer.toString();
    } else {
        privateKey = generatePrivateKey();
        fs.writeFileSync(privateKeyLocation, privateKey);
    }

    const key = ec.keyFromPrivate(privateKey, 'hex');
    const publicKey = key.getPublic().encode('hex');
    return({'privateKeyLocation': privateKeyLocation, 'publicKey': publicKey});
};

const generatePrivateKey = () => {
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
};
let express = require("express"),
    bodyParser = require('body-parser'),
    wallet = require('./wallet');
let initHttpServer = (port) => {
    let http_port = '80' + port.toString().slice(-2);
    let app = express();
    app.use(bodyParser.json());
    app.get('/blocks', (req, res) => res.send(JSON.stringify(
        chain.blockchain )));
    app.get('/getBlock', (req, res) => {
        let blockIndex = req.query.index;
        res.send(chain.blockchain[blockIndex]);
    });
    app.get('/getDBBlock', (req, res) => {
        let blockIndex = req.query.index;
        chain.getDbBlock(blockIndex, res);
    });