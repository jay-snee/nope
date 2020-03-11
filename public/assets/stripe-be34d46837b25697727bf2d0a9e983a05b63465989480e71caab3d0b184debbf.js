(function() {
  var ready;

  ready = function() {
    var button;
    button = $('.stripe-button-el').first();
    button.removeClass('stripe-button-el');
    return button.addClass('btn btn-outline-primary btn-lg my-4 btn-block');
  };

  $(document).on('turbolinks:load', ready);

}).call(this);
