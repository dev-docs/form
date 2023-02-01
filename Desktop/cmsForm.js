var isEmpty = function(fieldText) {
    return (fieldText === undefined || fieldText === null || fieldText.length === 0) ? true : false
};

var isNotEmpty = function(fieldText) {
    if (isEmpty(fieldText)) {
        return false;
    } else {
        return true;
    }
};

var formData = {}; 
var cmsForm = function() {
    return {
        bindToContent: function(formId, content) {
            const $this = this;
            const $form = $(formId);
            $.each(content, function(key, value) {
                let name = key;
                if (typeof value == 'number') {
                    if (isNotEmpty(value) && value != 'null') {
                        value = value.toString();
                    }
                }
                $this.setValueOnForm($form, name, value);
            });
        },


        // TODO: TEST 일단 FORM 전체 데이터 검증
        // 파라미터 formId, 필수 key 배열
        isMandatoryValid: function(formId, keys) {
            const elements = this.fnGetFormParams('#' + formId, false);
        	 if(elements.constructor === Object && Object.keys(elements).length === 0)  {
        	 	console.log("not exists elements");
                return false;
        	 }


            $.each(elements, function(key, value) {
                let element = $('input[name="' + key + '"]');

                switch (element.attr('type')) {
                    case 'button':
                        break;

                    case 'date'    : break; 
                    case 'month'   : break;
                    case 'file'    : 
                    case 'image'   : break;
                    case 'checkbox':
                    case 'radio'   : break;
   
                    case 'time'    :
                    case 'url'     :
                    case 'search'  :
                    case 'number'  :
                    case 'email'   :
                    case 'password':
                    case 'text'    :
                    case 'hidden'  :
                        if (isEmpty(value)) {
                            // alert(key);                    
                            console.log("not exists " + element.prop('title'));
                            return false;
                        }

                        break;
                }
            });

            return
        },

        setValueOnForm: function($form, name, value) {
            const matched = $form.find(":input[name='" + name + "']");
            this.setValueOnSelector(matched, value);

        },

        setValueOnSelector: function($selector, value) {
            $selector.each(function() {
                const $obj = $(this);

                if ($obj.is("textarea")) {
                    if (isNotEmpty(value)) {
                        $(obj).val(value);
                    }
                    return;
                }

                if ($obj.is("select")) {
                    value = value || '';
                    if (isNotEmpty(value) && value != 'null') {
                        value = value.toString();
                    }

                    $obj.children().each(function() {
                        if ($(this).prop("value") == value) {
                            $(this).val(value).prop('selected', 'selected');
                            $(this).val(value).trigger('change');
                        } else if ($(this).prop("value") === value.toString()) {
                            $(this).val(value).prop('selected', 'selected');
                            $(this).val(value).trigger('change');
                        }

                    });
                    return;
                }

                const attr = $obj.attr('type');
                switch (attr) {
                    case 'checkbox':
                        let values = String(value).split(',');
                        for (let i = 0; i < values.length; i++) {
                            if ($obj.prop('value') == values[i] || 'true' == values[i]) {
                                $obj.prop("checked", "checked");
                            } else {
                                $obj.prop("checked", false);
                            }
                        }
                        break;

                    case 'radio':
                        if ($obj.prop('value') == value) {
                            $obj.prop("checked", "checked");
                        }
                        break;

                    case 'text':
                        $obj.val(value);
                        break;

                    case 'hidden':
                        if (isNotEmpty(value)) {
                            $obj.val(value);
                        }
                        break;
                    case 'password':
                        $obj.val(value);
                        break;

                    default:
                        break;

                }
                return;

            });
        },

        fnGetFormParams: function(formId, isIncludeDisabled) {
            isIncludeDisabled = isIncludeDisabled || true;
            let params = {};
            $(formId + ' :input').each(function() {
                if (!isIncludeDisabled) {
                    if ('disabled' != $(this).attr('disabled')) {
                        params[this.name] = $(this).val();
                    }
                } else {
                    
                    switch(this.type){
                        case 'checkbox' :
                            params[this.name] = (this.checked) ? $(this).val() : ""; 
                            break;
                        case 'radio' :
                            if (this.checked) params[this.name] = $(this).val();
                            break;                
                        case 'button' : break;
                        default: 
                            params[this.name] = $(this).val();
                            break;            
                    }

                    // if (this.type == "checkbox") {
                    //     params[this.name] = (this.checked) ? $(this).val() : "";
                    // } else if (this.type == "radio") {
                    //     if (this.checked) params[this.name] = $(this).val();
                    // } else if (this.type != 'button') {
                    //     params[this.name] = $(this).val();
                    // }
                }

            });

          
            return params;
        },

        clearForm: function(formId) {
            $(formId)[0].reset();

        },
    };
}();

  
 
  
