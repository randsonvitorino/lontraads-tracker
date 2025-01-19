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
                        console.log('Visita registrada com sucesso');
                    } else {
                        console.error('Erro ao registrar visita');
                    }
                }
            };

            var referrer = document.referrer || '';
            var campaignId = getCampaignId();

            var data = 'action=lontraads_record_visit' +
                       '&domain=' + encodeURIComponent(currentDomain) +
                       '&user_agent=' + encodeURIComponent(navigator.userAgent) +
                       '&referrer=' + encodeURIComponent(referrer) +
                       '&campaign_id=' + encodeURIComponent(campaignId);
            xhr.send(data);
        } else {
            console.log('Visita não registrada: domínio do plugin');
        }
    }

    function getCampaignId() {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('campaign_id') || '';
    }

    function enhancePageLinks() {
        var scriptElement = document.querySelector('script[data-origin-url]');
        var originUrl = scriptElement ? scriptElement.getAttribute('data-origin-url') : null;

        if (!originUrl) {
            console.error('Origin URL não encontrada. O script não pode prosseguir.');
            return;
        }

        var queryParams = new URLSearchParams(window.location.search);
        var campaignId = getCampaignId();

        var pageLinks = document.getElementsByTagName('a');
        for (var i = 0; i < pageLinks.length; i++) {
            var link = pageLinks[i];
            var linkUrl = new URL(link.href);
            var hashPart = linkUrl.hash;
            linkUrl.search = new URLSearchParams([...queryParams, ...new URLSearchParams(linkUrl.search)]);
            
            if (campaignId) {
                linkUrl.searchParams.set('campaign_id', campaignId);
            }

            link.href = linkUrl.toString().split('#')[0] + hashPart;
        }
    }

    if (!sessionStorage.getItem('lontraads_visit_recorded')) {
        sendVisitorData();
        sessionStorage.setItem('lontraads_visit_recorded', 'true');
    }

    window.addEventListener('beforeunload', function() {
        sessionStorage.removeItem('lontraads_visit_recorded');
    });

    enhancePageLinks();
})();
