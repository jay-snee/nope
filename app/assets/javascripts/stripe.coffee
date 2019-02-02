ready = ->
  button = $('.stripe-button-el').first()
  button.removeClass('stripe-button-el')
  button.addClass('btn btn-outline-primary btn-lg my-4 btn-block')
$(document).on 'turbolinks:load', ready