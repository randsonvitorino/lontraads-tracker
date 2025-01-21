(function() {
    function updateAffiliateLinks() {
        var currentParams = new URLSearchParams(window.location.search);
        var links = document.getElementsByTagName('a');
        
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            if (link.href.includes('balmorexpro.com/welcome/')) {
                var affUrl = new URL(link.href);
                currentParams.forEach(function(value, key) {
                    affUrl.searchParams.append(key, value);
                });
                link.href = affUrl.toString();
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateAffiliateLinks);
    } else {
        updateAffiliateLinks();
    }
})();
