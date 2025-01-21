(function() {
    console.log("Script iniciado");

    function getAllUrlParams() {
        return new URLSearchParams(window.location.search);
    }

    function enhancePageLinks() {
        console.log("Iniciando enhancePageLinks");
        var urlParams = getAllUrlParams();
        console.log("Parâmetros da URL atual:", urlParams.toString());

        var links = document.getElementsByTagName('a');
        console.log("Total de links encontrados:", links.length);

        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            var originalHref = link.href;
            console.log(`Processando link ${i + 1}:`, originalHref);

            try {
                var url = new URL(originalHref);
                
                // Adicionar todos os parâmetros da URL atual
                urlParams.forEach(function(value, key) {
                    url.searchParams.set(key, value);
                });

                link.href = url.toString();
                console.log(`Link ${i + 1} modificado:`, link.href);
            } catch (e) {
                console.error(`Erro ao processar link ${i + 1}:`, e);
            }
        }

        console.log("Modificação de links concluída");
    }

    if (document.readyState === 'loading') {
        console.log("DOM ainda carregando, adicionando evento listener");
        document.addEventListener('DOMContentLoaded', enhancePageLinks);
    } else {
        console.log("DOM já carregado, executando funções imediatamente");
        enhancePageLinks();
    }

    console.log("Script concluído");
})();
