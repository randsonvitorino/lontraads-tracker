(function() {
    function sendVisitorData() {
        var scriptElement = document.querySelector('script[data-origin-url]');
        var originUrl = scriptElement ? scriptElement.getAttribute('data-origin-url') : null;

        if (!originUrl) {
            console.error('Origin URL não encontrada. O script não pode prosseguir.');
            return;
        }

        var currentDomain = window.location.hostname;
        var pluginDomain = new URL(originUrl).hostname;

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

            var data = 'action=lontraads_record_visit' +
                       '&domain=' + encodeURIComponent(currentDomain) +
                       '&campaign_id=' + encodeURIComponent(campaignId);
            xhr.send(data);
        }
    }

    function getCampaignId() {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('campaign_id') || 
               urlParams.get('gclid') || 
               urlParams.get('fbclid') || 
               urlParams.get('msclkid') || 
               urlParams.get('wbraid') || 
               '';
    }

    function enhancePageLinks() {
        var queryParams = new URLSearchParams(window.location.search);
        var campaignId = getCampaignId();

        var pageLinks = document.getElementsByTagName('a');
        for (var i = 0; i < pageLinks.length; i++) {
            var link = pageLinks[i];
            var linkUrl = new URL(link.href, window.location.href);

            var hashPart = linkUrl.hash;
            linkUrl.search = new URLSearchParams([...queryParams, ...new URLSearchParams(linkUrl.search)]);
            
            if (campaignId) {
                linkUrl.searchParams.set('campaign_id', campaignId);
            }

            link.href = linkUrl.toString().split('#')[0] + hashPart;
        }
    }

    // Executa as funções principais
    sendVisitorData();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhancePageLinks);
    } else {
        enhancePageLinks();
    }
})();
