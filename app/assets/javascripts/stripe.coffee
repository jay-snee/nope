handler = StripeCheckout.configure(
  key: 'pk_test_TYooMQauvdEDq54NiTphI7jx'
  image: 'https://stripe.com/img/documentation/checkout/marketplace.png'
  locale: 'auto'
  token: (token) ->
    # You can access the token ID with `token.id`.
    # Get the token ID to your server-side code for use.
    return
)
document.getElementById('customButton').addEventListener 'click', (e) ->
  # Open Checkout with further options:
  handler.open
    name: 'Stripe.com'
    description: '2 widgets'
    zipCode: true
    amount: 2000
  e.preventDefault()
  return
# Close Checkout on page navigation:
window.addEventListener 'popstate', ->
  handler.close()
  return