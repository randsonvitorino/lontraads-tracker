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
            var originalHref = link.href;
            
            // Separar a URL base do hash
            var [baseUrl, hash] = originalHref.split('#');
            var url = new URL(baseUrl, window.location.href);
            
            // Adicionar ou atualizar parâmetros
            for (var key in urlParams) {
                if (key === 'campaign_id' || key === 'gclid' || key === 'fbclid' || key === 'msclkid' || key === 'wbraid') {
                    url.searchParams.set(key, urlParams[key]);
                }
            }
            
            // Reconstruir a URL com o hash, se existir
            var newHref = url.toString() + (hash ? '#' + hash : '');
            link.href = newHref;
            
            console.log(`Link ${i + 1} modificado:`, originalHref, "->", newHref);
        }

        console.log("Modificação de links concluída");
    }

    function sendVisitorData() {
        console.log("Iniciando sendVisitorData");
        if (!originUrl) {
            console.error('Origin URL não encontrada. O script não pode prosseguir.');
            return;
        }

        var currentDomain = window.location.hostname;
        var pluginDomain = new URL(originUrl).hostname;

        console.log("Current Domain:", currentDomain, "Plugin Domain:", pluginDomain);

        if (currentDomain !== pluginDomain) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', originUrl + '/wp-admin/admin-ajax.php', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log('Dados do visitante enviados com sucesso');
                    } else {
                        console.error('Erro ao enviar dados do visitante');
                    }
                }
            };

            var campaignId = getAllUrlParams()['campaign_id'] || '';
            console.log("Campaign ID:", campaignId);

            var data = 'action=lontraads_record_visit' +
                       '&domain=' + encodeURIComponent(currentDomain) +
                       '&campaign_id=' + encodeURIComponent(campaignId);
            xhr.send(data);
            console.log("Dados enviados:", data);
        }
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
