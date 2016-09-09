/** 
  Simple templating methods for jQuery based on John Resig's microtemplates
  
  two templating methods are provided:
  
  $.template(str, data) -> rendered template as string
  $(sel).renderTemplate(str, data) -> render template and replace html in selector
  
  note: str can be a jquery selector (e.g. #template-id )
  
  example:
   $.template("Hello <%= t.name %>", {name:"Joe"}) -> "Hello Joe"    
**/
(function ($) {
    $.template = function (str, data) {

        // Figure out if we're getting a template, or if we need to load the template     
        // Generate a reusable function that will serve as a template generator 
        // all template context is in an object t (which differs from the microtemplates that use the with statement)
        var fn = new Function("t",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
            "p.push('" +
            // Convert the template into pure JavaScript
            str.replace(/[\r\t\n]/g, " ")
            .replace(/'(?=[^%]*%>)/g, "\t")
            .split("'").join("\\'")
            .split("\t").join("'")
            .replace(/<%=(.+?)%>/g, "',$1,'")
            .split("<%").join("');")
            .split("%>").join("p.push('")
            + "');return p.join('');");
        return fn(data);
    };

    $.fn.renderTemplate = function (str, data) {
        return this.each(function () {
            // check for id selector
            if (str.indexOf("#") === 0) {
                $(this).html($.template($(str).text(), data));
            } else {
                $(this).html($.template(str, data));
            }
        });
    }


}(jQuery));

/**
 String formatting similar to .net String.Format
 example:
 $.stringFormat("Hello {0}", userName);
**/
(function ($) {
    $.stringFormat = function () {
        var s = arguments[0];        
        for (var i = 0; i < arguments.length - 1; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace(reg, arguments[i + 1]);
        }
        return s;
    }
}(jQuery));