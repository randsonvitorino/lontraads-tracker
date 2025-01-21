(function() {
    function updateLinks() {
        var currentParams = new URLSearchParams(window.location.search);
        var links = document.getElementsByTagName('a');
        
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            var url = new URL(link.href, window.location.href);
            
            currentParams.forEach(function(value, key) {
                url.searchParams.set(key, value);
            });
            
            link.href = url.toString();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateLinks);
    } else {
        updateLinks();
    }
})();
