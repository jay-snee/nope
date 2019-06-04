class LandingController < ApplicationController

  before_action :authenticate_user!, except: [
    :gdpr,
    :gmail,
    :data,
    :shared,
    :thank_you,
    :submit,
    :unsubscriber,
    :fcid
  ]

  skip_before_action :verify_authenticity_token

  layout 'landing-page'

  ######### Carrd Pages ################

  ### Endpoint for forms to be posted to
  # Send form email & id to Websand
  def submit
    if ENV['WEBSAND_API_KEY']
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
    end
    Processing::EventJob.perform_later("New expression of interest in: #{params['page']} From: #{params['email-address']}", "landing-page", true)

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

  def shared
  end

  def fcid
  end
end
