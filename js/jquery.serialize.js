
/**
  jQuery plugin to serialize a form and populate a javascript object
  
  Example:
  var formObject = $("#form-selector").serializeObject();

**/
(function ($) {
    $.fn.serializeObject = function () {
        var arrayData, objectData;
        arrayData = this.serializeArray();
        objectData = { querySelectors: {} };
        var formId = this.attr("id");
        $.each(arrayData, function () {
            var value;

            if (this.value != null) {
                value = this.value;
            } else {
                value = '';
            }

            if (objectData[this.name] != null) {
                if (!objectData[this.name].push) {
                    objectData[this.name] = [objectData[this.name]];
                }

                objectData[this.name].push(value);
            } else {
                objectData[this.name] = value;
                objectData.querySelectors[this.name] = $.stringFormat("#{0} [name='{1}']", formId, this.name);
            }
        });

        return objectData;
    };
}(jQuery));

/**
  jQuery plugin to deserialize a json object and populate a form
  
  Example:
  $("#form-selector").deserialize(jsonString);

**/
(function ($) {
    $.fn.deserialize = function (serializedString, traditional) {
        var $form = $(this);

        traditional = traditional || false; // use traditional or classic style deserializing

        // in case we get a JSON object
        if (typeof (serializedString) == "object") {
            serializedString = $.param(serializedString, traditional);
        }

        serializedString = serializedString.replace(/\+/g, '%20'); // (B)
        var formFieldArray = serializedString.split("&");

        // Loop over all name-value pairs
        $.each(formFieldArray, function (i, pair) {
            var nameValue = pair.split("=");
            var name = decodeURIComponent(nameValue[0]); // (C)
            var value = decodeURIComponent(nameValue[1]);

            // check for brackets and change to dot access
            if (name.indexOf('[') > -1) {
                name = name.replace('[', '\\.').replace(']', '');
            }
            // Find one or more fields
            try {
                var $field = $form.find('[name=' + name + ']');
            } catch (e) {
                if (DEBUG)
                    console.log("$.fn.deserialize: Exception: " + e);
            }

            // continue if we can't find the field
            if ($field && $field[0]) {

                // Checkboxes and Radio types need to be handled differently
                if ($field[0].type == "radio" || $field[0].type == "checkbox") {
                    var $fieldWithValue = $field.filter('[value="' + value + '"]');
                    var isFound = ($fieldWithValue.length > 0);
                    // Special case if the value is not defined; value will be "on"
                    if (!isFound && value == "on") {
                        $field.first().prop("checked", true).change();

                    } else {
                        $fieldWithValue.prop("checked", isFound).change();

                    }
                } else { // input, textarea                    
                    $field.val(value).change();

                }
            } else {
                if (DEBUG)
                    console.log("$.fn.deserialize: no input element named " + name + " found!");
            }

        });

        return this;
    }
}(jQuery));

