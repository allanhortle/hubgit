require('dotenv').load();
require('babel-register')({
    ignore: /node_modules\/(?!hubgit)/
});
require('./src/hubgit/client/client.js');
