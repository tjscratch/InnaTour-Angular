$(document).ready(function () {
    $('#Pan').live('focus', function() {
        $('#Pan').css('border-color', '#D6D5CC');
    });
    $('#Pan').live('blur', function() {
        $('#Pan').css('border-color', '#000000');
    });
    $('#ExpMonth, #ExpYear').live('focus', function() {
        $('#ExpMonth').css('border-color', '#D6D5CC');
        $('#ExpYear').css('border-color', '#D6D5CC');
    });
    $('#ExpMonth, #ExpYear').live('blur', function() {
        $('#ExpMonth').css('border-color', '#000000');
        $('#ExpYear').css('border-color', '#000000');
    });
    $('#CardholderName').live('focus', function() {
        $('#CardholderName').css('border-color', '#D6D5CC');
    });
    $('#CardholderName').live('blur', function() {
        $('#CardholderName').css('border-color', '#000000');
    });
    $('#Email').live('focus', function() {
        $('#Email').css('border-color', '#D6D5CC');
    });
    $('#Email').live('blur', function() {
        $('#Email').css('border-color', '#000000');
    });
    $('#Cvc2').live('focus', function() {
        $('#Cvc2').css('border-color', '#D6D5CC');
    });
    $('#Cvc2').live('blur', function() {
        $('#Cvc2').css('border-color', '#000000');
    });
    $('#btnPay').click(function() {
        var errorObjName = '';
        var vPan = $('#Pan').inputmask('unmaskedvalue');
        if (typeof $('#Pan').val() != 'undefined' && $.trim($('#Pan').val()) == '') {
            errorObjName = 'Pan';
        } else if (typeof $('#Pan').val() != 'undefined' && !is_valid_luhn(vPan)) {
            errorObjName = 'Pan';
        } else if (typeof $('#CardholderName').val() != 'undefined' && $.trim($('#CardholderName').val()) == '') {
            errorObjName = 'CardholderName';
        } else if (typeof $('#Pan').val() != 'undefined'
            && (String(vPan).length < 12 || String(vPan).length > 19 || isNaN(vPan))
        ) {
            errorObjName = 'Pan';
        } else if (typeof $('#Cvc2').val() != 'undefined'
            && isNaN($.trim($('#Cvc2').val()))
        ) {
            errorObjName = 'Cvc2';
        } else if ( typeof $('#Cvc2').val() != 'undefined' && $.trim($('#Cvc2').val()).length < 3) {
            var firstDigit = parseInt($('#Pan').val().substr(0, 1));
            if (6 !== firstDigit) {
                errorObjName = 'Cvc2';
            }
        }
        if (errorObjName == '') {
            var $ExpMonth = $('#ExpMonth')
            , $ExpYear = $('#ExpYear');
            if ($ExpMonth.length == 1 && $ExpYear.length == 1) {
                if ($ExpMonth.val() != '' && $ExpYear.val() != '') {
                    var fullDate = new Date()
                    , digitMonth = fullDate.getMonth() + 1
                    , fourDigitYear = fullDate.getFullYear();
                    if (fourDigitYear > $ExpYear.val()) {
                        errorObjName = 'ExpYear';
                    } else if (fourDigitYear == $ExpYear.val() && digitMonth > $ExpMonth.val()) {
                        errorObjName = 'ExpMonth';
                    }
                }
            }
        }
        if (errorObjName != '') {
            $('#'+errorObjName).css('border-color', 'red');
            $('#btnPay').blur();
            return false;
        }
    });
    
    $('#btnPay_card').click(function() {
        
        var errorObjName = '';
        
        if (typeof $('#Cvc2').val() != 'undefined' && isNaN($.trim($('#Cvc2').val()))
        ) {
            errorObjName = 'Cvc2';
        } else if ( typeof $('#Cvc2').val() != 'undefined' && $.trim($('#Cvc2').val()).length < 3) {
            errorObjName = 'Cvc2';
        } else if ( typeof $('#cid').val() != 'undefined' && $('#cid').val() == '') {
            errorObjName = 'cid';
            
        }
        
        if (errorObjName != '') {
            $('#'+errorObjName).css('border-color', 'red');
            $('#btnPay').blur();
            return false;
        }
    });
    
    function showStandartForm(){
        $("input[name=doPay]").val("");
        $("#showStandartForm").attr("name", "showStandartForm");
        $("#returnForm").submit();
    }
        
    $("#cid").change(function(){
        _id = $("#cid option:selected").attr('id');
        if('showStandartFormSelect' == _id){
            showStandartForm();
        }
    });
});

