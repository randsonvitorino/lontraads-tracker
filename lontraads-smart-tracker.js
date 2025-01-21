(function() {
    console.log("Script iniciado");

    function sendVisitorData() {
        console.log("Iniciando sendVisitorData");
        var scriptElement = document.querySelector('script[data-origin-url]');
        var originUrl = scriptElement ? scriptElement.getAttribute('data-origin-url') : null;

        if (!originUrl) {
            console.error('Origin URL não encontrada. O script não pode prosseguir.');
            return;
        }

        console.log("Origin URL encontrada:", originUrl);

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

            var campaignId = getCampaignId();
            console.log("Campaign ID:", campaignId);

            var data = 'action=lontraads_record_visit' +
                       '&domain=' + encodeURIComponent(currentDomain) +
                       '&campaign_id=' + encodeURIComponent(campaignId);
            xhr.send(data);
            console.log("Dados enviados:", data);
        }
    }

    function getCampaignId() {
        var urlParams = new URLSearchParams(window.location.search);
        var campaignId = urlParams.get('campaign_id') || 
                         urlParams.get('gclid') || 
                         urlParams.get('fbclid') || 
                         urlParams.get('msclkid') || 
                         urlParams.get('wbraid') || 
                         '';
        console.log("getCampaignId retornou:", campaignId);
        return campaignId;
    }

    function enhancePageLinks() {
        console.log("Iniciando enhancePageLinks");
        var currentUrlParams = new URLSearchParams(window.location.search);
        console.log("Parâmetros da URL atual:", currentUrlParams.toString());

        var pageLinks = document.getElementsByTagName('a');
        console.log("Total de links encontrados:", pageLinks.length);

        for (var i = 0; i < pageLinks.length; i++) {
            var link = pageLinks[i];
            var originalHref = link.href;
            var linkUrl = new URL(link.href, window.location.href);
            var linkParams = new URLSearchParams(linkUrl.search);

            // Adiciona todos os parâmetros da URL atual ao link
            currentUrlParams.forEach(function(value, key) {
                linkParams.set(key, value);
            });

            linkUrl.search = linkParams.toString();
            link.href = linkUrl.toString();

            console.log(`Link ${i + 1} modificado:`, originalHref, "->", link.href);
        }

        console.log("Modificação de links concluída");
    }

    // Executa as funções principais
    sendVisitorData();
    
    if (document.readyState === 'loading') {
        console.log("DOM ainda carregando, adicionando evento listener");
        document.addEventListener('DOMContentLoaded', enhancePageLinks);
    } else {
        console.log("DOM já carregado, executando enhancePageLinks imediatamente");
        enhancePageLinks();
    }

    console.log("Script concluído");
})();
