class HomeController < ApplicationController

  before_action :authenticate_user!, except: [
    :index, 
    :privacy, 
    :premium_acct, 
    :free_acct, 
    :terms, 
    :get_started,
    :submit,
    :thank_you,
    :gdpr
  ]

  def index
    if current_user
      redirect_to action: 'dashboard'
    else
      render layout: 'front-page'
    end
  end

  def privacy
  end

  def free_acct
    Processing::EventJob.perform_later 'Signup free', 'signup_pref', false
    redirect_to new_user_registration_path
  end

  def premium_acct
    Processing::EventJob.perform_later 'Signup premium', 'signup_pref', false
    redirect_to new_user_registration_path
  end

  def get_started
    Processing::EventJob.perform_later 'Get Started', 'signup_pref', false
    redirect_to new_user_registration_path
  end

  def terms
  end

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
    render layout: false
  end

  def dashboard
    @messages = current_user.messages
    @profiles = current_user.profiles
  end

end
