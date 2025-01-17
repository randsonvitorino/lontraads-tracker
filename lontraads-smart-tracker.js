(function() {
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

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    var urlParams = getAllUrlParams();
    var storedData = {};

    for (var param in urlParams) {
        storedData[param] = urlParams[param];
        setCookie(param, urlParams[param], 30);
    }

    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        var href = links[i].href;
        var separator = href.indexOf('?') !== -1 ? '&' : '?';
        for (var key in storedData) {
            href += separator + key + '=' + encodeURIComponent(storedData[key]);
            separator = '&';
        }
        links[i].href = href;
    }

    var currentDomain = window.location.hostname;
    var pluginDomain = 'chatwavedigital.com.br';
    if (currentDomain !== pluginDomain) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://chatwavedigital.com.br/wp-admin/admin-ajax.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var data = 'action=lontraads_record_visit&domain=' + encodeURIComponent(currentDomain) + '&user_agent=' + encodeURIComponent(navigator.userAgent);
        for (var key in storedData) {
            data += '&' + key + '=' + encodeURIComponent(storedData[key]);
        }
        xhr.send(data);
    }
})();