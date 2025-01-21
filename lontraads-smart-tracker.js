(function() {
    console.log("Script iniciado");

    var originUrl = document.currentScript.getAttribute('data-origin-url');

    function getAllUrlParams() {
        var queryString = window.location.search.slice(1);
        var obj = {};
        if (queryString) {
            queryString = queryString.split('#')[0];
            var arr = queryString.split('&');
            for (var i = 0; i < arr.length; i++) {
                var a = arr[i].split('=');
                var paramName = a[0];
                var paramValue = typeof (a[1]) === 'undefined' ? true : decodeURIComponent(a[1]);
                obj[paramName] = paramValue;
            }
        }
        return obj;
    }

    function enhancePageLinks() {
        console.log("Iniciando enhancePageLinks");
        var urlParams = getAllUrlParams();
        console.log("Parâmetros da URL atual:", JSON.stringify(urlParams));

        var links = document.getElementsByTagName('a');
        console.log("Total de links encontrados:", links.length);

        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            var href = link.href;
            var originalHref = href;
            var url = new URL(href);
            
            for (var key in urlParams) {
                if (key === 'campaign_id' || key === 'gclid' || key === 'fbclid' || key === 'msclkid' || key === 'wbraid') {
                    url.searchParams.append(key, urlParams[key]);
                }
            }
            
            link.href = url.toString();
            console.log(`Link ${i + 1} modificado:`, originalHref, "->", link.href);
        }

        console.log("Modificação de links concluída");
    }

    function sendVisitorData() {
        // ... (mantenha o código existente para sendVisitorData)
    }

    // Executa as funções principais
    if (document.readyState === 'loading') {
        console.log("DOM ainda carregando, adicionando evento listener");
        document.addEventListener('DOMContentLoaded', function() {
            enhancePageLinks();
            sendVisitorData();
        });
    } else {
        console.log("DOM já carregado, executando funções imediatamente");
        enhancePageLinks();
        sendVisitorData();
    }

    console.log("Script concluído");
})();
