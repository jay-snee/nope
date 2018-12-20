$(document).ready(function () {
    $( "#user_terms_consent").change(function() {
        if(document.getElementById("user_terms_consent").checked) {
        sub = document.getElementsByName("commit")[0]
        sub.disabled = false;
        sub.classList.remove("disabled")
      }
      else  {
        sub = document.getElementsByName("commit")[0]
        sub.disabled = true;
        sub.classList.add("disabled")
      }
    });
});
