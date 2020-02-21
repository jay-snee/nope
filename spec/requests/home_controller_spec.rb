require 'rails_helper'

RSpec.describe HomeController, :type => :request do
  context '#index' do
    it 'returns a 200' do
      get '/'
      expect(response).to have_http_status(200)
    end

    it 'displays the company number' do
      get '/'
      assert_select '#company-number', :text => 'Company Number: 11609558'
    end
  end

  context '#dashboard', :type => :request do
    context 'when not logged in' do
      it 'redirects unauthenticated users' do
        get '/home/dashboard'
        expect(response).to have_http_status(302)
      end
    end

    context 'when logged in as a user' do
      before(:each) do
        user = FactoryBot.create(:user)
        sign_in user
      end

      it 'renders a 200' do
        get '/home/dashboard'
        expect(response).to have_http_status(200)
      end

      it 'shows the upgrade button' do
        get '/home/dashboard'
        expect(response.body).to include('Upgrade to a paid subscription')
      end

      it 'shows the referral button' do
        get '/home/dashboard'
        expect(response.body).to include('Refer a friend')
      end
    end
  end

  context '#privacy', :type => :request do
    it 'returns a 200' do
      get '/privacy'
      expect(response).to have_http_status(200)
    end
  end

  context '#terms', :type => :request do
    it 'returns a 200' do
      get "/terms"
      expect(response).to have_http_status(200)
    end
  end
end
