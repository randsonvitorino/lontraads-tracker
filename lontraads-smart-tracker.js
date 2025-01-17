(function() {
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

    var urlParams = getAllUrlParams();

    // Modificar links
    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        var href = links[i].href;
        var separator = href.indexOf('?') !== -1 ? '&' : '?';
        for (var key in urlParams) {
            href += separator + key + '=' + encodeURIComponent(urlParams[key]);
            separator = '&';
        }
        links[i].href = href;
    }

    // Enviar dados de IP
    var xhr = new XMLHttpRequest();
    xhr.open('POST', originUrl + '/wp-admin/admin-ajax.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var data = 'action=lontraads_record_visit&domain=' + encodeURIComponent(window.location.hostname) + '&user_agent=' + encodeURIComponent(navigator.userAgent);
    xhr.send(data);
})();
