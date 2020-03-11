(function() {
  var ready;

  ready = function() {
    $('.toggle-button').each(function(index) {
      if ($(this).data('state') === 'true') {
        $(this).removeClass('btn-outline-warning');
        return $(this).addClass('btn-outline-success');
      }
    });
    new ClipboardJS('.copy-button');
    return $('.copy-button').on('click', function() {
      return $.growl.notice({
        title: "",
        message: "Copied to your clipboard!"
      });
    });
  };

  $(document).on('turbolinks:load', ready);

}).call(this);
