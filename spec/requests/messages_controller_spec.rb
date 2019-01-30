require 'rails_helper'

RSpec.describe MessagesController, :type => :request do
  context '#show' do
    it 'returns a 200' do
      message = FactoryBot.create(:message)
      get '/'
      expect(response).to have_http_status(200)
    end
  end
end