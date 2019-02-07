console.log('aklsdjflkasdjfladsjfal;sdkjfa;lsdkfja')
ready = ->
  field = $('#countries-input-0')
  field.addClass('form-control')
  field.addClass('form-control-lg')
$(document).on 'turbolinks:load', ready