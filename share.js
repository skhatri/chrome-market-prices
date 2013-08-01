var loadGenerator = {
    /**
     * http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20%3D%20'NAB'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=
     *
     * @type {string}
     * @private
     *
     */
    lookupURL_: 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20($symbol)%20&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=',

    /**
     * @public
     */
    loadStock: function (symbols) {
        var req = new XMLHttpRequest();
        var symbolsQuotes = symbols.split(",").map(function (val) {
            return "'" + val + "'";
        }).join(",");
        var symbolUrl = this.lookupURL_.replace(/\$symbol/g, symbolsQuotes);
        req.open("GET", symbolUrl, true);
        req.onload = this.showSymbol_.bind(this);
        req.send(null);
    },


    /**
     * @param {ProgressEvent} e The XHR ProgressEvent.
     * @private
     */
    showSymbol_: function (e) {
        var text = e.target.responseText;
        var div = document.querySelector("#result");
        var response = JSON.parse(text);
        var tableHeader = '<table class="table border-striped"><tr><th>Symbol</th><th>Price</th></tr>';
        var tableBody = '';
        var quote = response.query.results.quote;
        if (Array.isArray(quote)) {
            for (var i = 0; i < quote.length; i += 1) {
                tableBody += '<tr><td>' + quote[i].symbol + '</td><td>' + quote[i].LastTradePriceOnly + '</td></tr>';
            }
        } else {
            tableBody += '<tr><td>' + quote.symbol + '</td><td>' + quote.LastTradePriceOnly + '</td></tr>';
        }
        div.innerHTML = tableHeader + tableBody + '</table>';
        document.body.appendChild(div);
    }




};

document.addEventListener('DOMContentLoaded', function () {
    loadGenerator.loadStock("WPA.AX,CBA.AX,YHOO,NAB.AX,MQG.AX");
    document.querySelector("#load").addEventListener('click', function () {
        var symbols = document.querySelector("#symbols").value;
        loadGenerator.loadStock(symbols);
    });
});

