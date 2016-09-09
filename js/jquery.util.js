/**
    outerHTML - get the full html of an element, not just inner html
**/
(function ($) {
    $.fn.outerHTML = function () {
        return $('<div />').append(this.eq(0).clone()).html();
    }
}(jQuery));

/**
   jQuery.QueryString - allow easy access to querystring parameters

   usage: $.QueryString["param"]
**/
(function ($) {
    $.QueryString = (function (a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);