class LandingController < ApplicationController

  before_action :authenticate_user!, except: [
    :gdpr,
    :gmail,
    :data,
    :thank_you,
    :submit
  ]

  layout 'landing-page'

  ######### Carrd Pages ################

  ### Endpoint for forms to be posted to
  # Send form email & id to Websand
  def submit
    response = HTTParty.post(
      'https://fair-custodian.websandhq.com/api/data/subscriber',
      {
        'headers': {"Authorization": "Token #{ENV['WEBSAND_API_KEY']}"},
        'body': {
          "subscriber": {
            "email": params['email-address'],
            "source": params['page'],
            "subscribed_at": DateTime.now.iso8601,
            "marketing_consent": "marketing_consent_true"
          }
        }
      }
    )

    redirect_to thank_you_path
  end

  # Thank you page
  def thank_you
  end

  def gdpr
  end

  def gmail
  end

  def data
  end
end
