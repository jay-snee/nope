var ready;

ready = function() {
  return $('#user_terms_consent').change(function() {
    var sub;
    if (document.getElementById('user_terms_consent').checked) {
      sub = document.getElementsByName('commit')[0];
      sub.disabled = false;
      sub.classList.remove('disabled');
    } else {
      sub = document.getElementsByName('commit')[0];
      sub.disabled = true;
      sub.classList.add('disabled');
    }
  });
};

$(document).on('turbolinks:load', ready);
