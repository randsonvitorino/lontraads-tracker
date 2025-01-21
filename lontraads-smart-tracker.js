(function() {
    console.log("Script iniciado");

    var originUrl = document.currentScript.getAttribute('data-origin-url');
    console.log("Origin URL:", originUrl);

    function getAllUrlParams() {
        var queryString = window.location.search.slice(1);
        console.log("Query string:", queryString);
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
        console.log("Parâmetros extraídos:", JSON.stringify(obj));
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
            var originalHref = link.href;
            console.log(`Processando link ${i + 1}:`, originalHref);
            
            // Separar a URL base do hash
            var [baseUrl, hash] = originalHref.split('#');
            console.log("Base URL:", baseUrl, "Hash:", hash);
            
            var url = new URL(baseUrl, window.location.href);
            console.log("URL objeto criado:", url.toString());
            
            // Adicionar todos os parâmetros da URL atual
            for (var key in urlParams) {
                console.log(`Adicionando parâmetro: ${key}=${urlParams[key]}`);
                url.searchParams.set(key, urlParams[key]);
            }
            
            // Reconstruir a URL com o hash, se existir
            var newHref = url.toString() + (hash ? '#' + hash : '');
            link.href = newHref;
            
            console.log(`Link ${i + 1} modificado:`, originalHref, "->", newHref);
        }

        console.log("Modificação de links concluída");
    }

    // Executa as funções principais
    if (document.readyState === 'loading') {
        console.log("DOM ainda carregando, adicionando evento listener");
        document.addEventListener('DOMContentLoaded', function() {
            console.log("Evento DOMContentLoaded disparado");
            enhancePageLinks();
        });
    } else {
        console.log("DOM já carregado, executando funções imediatamente");
        enhancePageLinks();
    }

    console.log("Script concluído");
})();
