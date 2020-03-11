(function() {
  var ready;

  ready = function() {
    var check;
    check = function() {
      var field;
      if ($('#countries-input-0').length) {
        field = $('#countries-input-0');
        field.removeClass('countries-input');
        field.addClass('form-control form-control-lg');
      } else {
        setTimeout(check, 50);
      }
    };
    return check();
  };

  $(document).on('turbolinks:load', ready);

}).call(this);
