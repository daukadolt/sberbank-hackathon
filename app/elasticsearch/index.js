const elastic = require('elasticsearch');

module.exports = new elastic.Client({
    host: "localhost:9200",
    log: "trace"
})