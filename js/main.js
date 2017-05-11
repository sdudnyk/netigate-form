jQuery.fn._form = function(){
  var form = this;
  form.fields = {
    company: form.find('#company'),
    email: form.find('#email'),
    callNeeded: form.find('#call-needed'),
    phone: form.find('#phone'),
    password: form.find('#password-field input')
  }

  form.validate = function(){
    //company field validate
    if(form.fields.company.val().length){
      addValidStyle(form.fields.company);
    }else{
      addInvalidStyle(form.fields.company);
    }

    //email field validate
    if(form.isEmailValid(form.fields.email.val()) && form.fields.email.val().length){
      addValidStyle(form.fields.email);
    }else{
      addInvalidStyle(form.fields.email);
    }

    //phone field validate
    if(form.fields.company.val().length){
      addValidStyle(form.fields.phone);
    }else{
      addInvalidStyle(form.fields.phone);
    }
  }

  $('.form-input').on('focus blur', function (e) {
      $(this).closest('.form-field').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
  }).trigger('blur');

  // autofocus for IE
  $('[autofocus]:not(:focus)').eq(0).focus();

  // company input autocomplete
  var suggestionslist = form.find('#n_suggestions-list');
  companyAutocomplete();
  $('.form-field.company').on('mousedown', '#n_suggestions-list ul li', function(e) {
      var url = $(this).attr('data-url');
      suggestionslist.addClass('displaynone');

      // Company name in input
      suggestionslist.siblings('.form-field.company input').val(jQuery(this).text()).attr('data-isfound', 'true');
  });

  //hide phone input
  form.fields.callNeeded.change(function(){
    if(form.fields.callNeeded.find('option:selected').val() === 'yes'){
      form.fields.phone.closest('.form-field').removeClass('displaynone');
    }else{
      form.fields.phone.closest('.form-field').addClass('displaynone');
    }
  });


  if($.fn.intlTelInput){
    $('.form-field.phone label').addClass('phone-label');

    $('.form-field.phone #phone').intlTelInput({
      initialCountry: "auto",
      geoIpLookup: function(callback) {
      $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
        var countryCode = (resp && resp.country) ? resp.country : "";
        callback(countryCode);
      });
      }
      // utilsScript: "/js/intl-tel-input/utils.js" // just for formatting/placeholders etc
    });
  }

  form.fields.email.on('change blur', function(){
    if(this.value.length){
      if(form.isEmailValid(this.value)){
        addValidStyle(this);
      }else{
        addInvalidStyle(this);
      }
    }
  })

  $('.form-input').on('keyup change click blur', function(){
    if(isFormValide()){
      $("#submit-b").prop( "disabled", false );
    }else{
      $("#submit-b").prop( "disabled", true );
    }
  });


  function addValidStyle(input){
    $(input).parent().removeClass('invalid');
    $(input).parent().addClass('valid');
  }

  function addInvalidStyle(input){
    $(input).parent().removeClass('valid');
    $(input).parent().addClass('invalid');
  }


  function isFormValide(){
    var isCompanyValid = form.fields.company.val().length;
    var isPhoneValid = form.fields.phone.val().length >= 3;
    var isEmailValid = form.fields.email.val().length && form.isEmailValid(form.fields.email.val());

    if(form.fields.callNeeded.find('option:selected').val() === 'no'){
      isPhoneValid = true;
    }

    return (isCompanyValid && isPhoneValid && isEmailValid);
  }

  this.submit(function(e){
    e.preventDefault();

    //if field for bot is filled
    if(form.fields.password.val()){
      return false;
    }else{
      if(isFormValide()){
        // ajax request here

        for(var field in form.fields){
          console.log(field + ' : ' + form.fields[field].val());
        }

        if(true){
          // then animation if success
          form.slideUp('slow', function(){
            $('.form-submit-info').append('The form was successfully sent, thank you!')
            $('.form-submit-info').slideDown('slow');
          })
        }else{
          // if failed
          form.slideUp('slow', function(){
            $('.form-submit-info').append('Form sending error, please try again later.<br>Thank you for understanding');
            $('.form-submit-info').css('background-color', '#fb4242');
            $('.form-submit-info').slideDown('slow');
          });
        }
      }else{
        form.validate();
        return false;
      }
    }
  });

  function companyAutocomplete(){
      var minlength = 3;

      form.fields.company.keyup(function() {
      var that = this,
          value = $(this).val();

      $(this).attr('data-isfound', 'false');

      $(this).siblings('#logo img').addClass('displaynone').attr('src', 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=');
      if (value.length >= minlength) {
        //show the loading icon
        $(this).siblings('.loading-icon').removeClass('displaynone');
        if (searchRequest != null)
            searchRequest.abort();
        var searchRequest = jQuery.ajax({
            type: "GET",
            url: "https://autocomplete.clearbit.com/v1/companies/suggest?query=:" + value,
            dataType: "json",
            success: function(msg) {
                //we need to check if the value is the same
                if (value == jQuery(that).val()) {
                    //Receiving the result of search here
                    createList(msg);

                    //remove loading icon
                    setTimeout(function() {
                        $('.loading-icon').addClass('displaynone');
                    }, 1500);
                }
            }
        });
      }
    });

    $(form.fields.company).blur(function() {
        $('.loading-icon').addClass('displaynone');
        suggestionslist.addClass('displaynone');
    });
  }

  function createList(results) {
    var html = '';

    for (var i = 0; i < results.length; i++) {
        // Populate List
        html += '<li data-url="' + results[i].logo + '">';
        html += '<img src="' + results[i].logo + '">';
        html += '<span>';
        html += results[i].name;
        html += '</span>';
        html += '</li>'
    }

    suggestionslist.removeClass('displaynone').find('ul').empty().append(html);
    suggestionslist.removeClass('displaynone');
  }

  form.isEmailValid = function(email){
    var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regEx.test(email);
  }


  return form;
}


var myForm = $('#form')._form();
