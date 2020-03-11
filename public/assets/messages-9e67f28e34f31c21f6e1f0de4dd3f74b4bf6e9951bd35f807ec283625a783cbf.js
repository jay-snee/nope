(function() {
  var ready;

  ready = function() {
    return $('#message_render').on('load', function() {
      var js_height;
      js_height = $('#message_render').contents().find('html').height();
      console.log(js_height);
      if (js_height > 500) {
        $('#message_render').height(js_height + 20);
        console.log('js_height');
      } else {
        $('#message_render').height(500);
        console.log('500');
      }
    });
  };

  $(document).on('turbolinks:load', ready);

}).call(this);
