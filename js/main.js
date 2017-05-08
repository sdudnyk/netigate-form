jQuery.fn._form = function(){
  var form = this;
  form.fields = {
    company: form.find('#company'),
    email: form.find('#email'),
    callNeeded: form.find('#call-needed'),
    phone: form.find('#phone')
  }

  form.validation = function(){

  }

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
      form.fields.phone.parent().removeClass('displaynone');
    }else{
      form.fields.phone.parent().addClass('displaynone');
    }
  });

  form.fields.email.blur(function(){

  })

  $('.form-input').on('keyup change click blur', function(){
    if(isFormValide()){
      $("#submit-b").prop( "disabled", false );
    }else{
      $("#submit-b").prop( "disabled", true );
    }
  });


  function isFormValide(){
    var isCompanyValid = form.fields.company.val().length;
    var isPhoneValid = form.fields.phone.val().length > 3;
    var isEmailValid = form.fields.email.val().length && form.isEmailValid(form.fields.email.val());

    if(form.fields.callNeeded.find('option:selected').val() === 'no'){
      isPhoneValid = true;
    }

    return (isCompanyValid && isPhoneValid && isEmailValid)
  }


  // function lengthValidation(input){
  //   if(input.value.length === 0){
  //     $(input).parent().removeClass('valid');
  //     $(input).parent().addClass('invalid');
  //     return false;
  //   }else{
  //     $(input).parent().removeClass('invalid');
  //     $(input).parent().addClass('valid');
  //     return true;
  //   }
  // }



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
