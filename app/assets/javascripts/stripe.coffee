ready = ->

  if document.getElementById('card-button')
    stripe = Stripe($('#stripe-field').data('key'), betas: [ 'payment_intent_beta_3' ])
    elements = stripe.elements()
    cardElement = elements.create('card')
    cardElement.mount '#card-element'
    cardholderName = document.getElementById('cardholder-name')
    cardButton = document.getElementById('card-button')
    clientSecret = cardButton.dataset.secret
    
    cardButton.addEventListener 'click', (ev) ->
      ev.preventDefault()
      stripe.createToken(clientSecret, cardElement, tokenData: owner: name: cardholderName.value).then (result) ->
        if result.error
          console.log result
        else
          console.log result
          console.log result.token
        return
      return    

    # cardButton.addEventListener 'click', (ev) ->
    #   ev.preventDefault()
    #   stripe.handleCardPayment(clientSecret, cardElement, source_data: owner: name: cardholderName.value).then (result) ->
    #     if result.error
    #       console.log result
    #     else
    #       console.log result
    #       console.log result.token
    #     return
    #   return

  # Legacy
  #button = $('.stripe-button-el').first()
  #button.removeClass('stripe-button-el')
  #button.addClass('btn btn-outline-primary btn-lg my-4 btn-block')
$(document).on 'turbolinks:load', ready