jQuery.fn._form = function(){
  var form = this;
  form.fields = {
    company: form.find('#company'),
    email: form.find('#email'),
    callNeeded: form.find('#call-needed'),
    phone: form.find('#phone')
  }

  form.fullValidation = function(){

  }


  var suggestionslist = form.find('#n_suggestions-list');
  companyAutocomplete();
  $('.form-field.company').on('mousedown', '#n_suggestions-list ul li', function(e) {

      var url = $(this).attr('data-url');

      // Logo
      jQuery('#logo img').removeClass('displaynone').attr('src', url);
      suggestionslist.addClass('displaynone');

      // Company name in input
      suggestionslist.siblings('.form-field.company input').val(jQuery(this).text()).attr('data-isfound', 'true');
  });




  form.fields.callNeeded.change(function(){
    if(form.fields.callNeeded.find('option:selected').val() === 'yes'){
      form.fields.phone.parent().removeClass('displaynone');
    }else{
      form.fields.phone.parent().addClass('displaynone');
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



  return form;
}


var myForm = $('#form')._form();
