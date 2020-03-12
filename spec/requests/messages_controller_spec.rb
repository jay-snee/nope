require 'rails_helper'

RSpec.describe MessagesController, :type => :request do
  context '#show' do
    context 'with an existing object' do
      before(:each) do
        @user = FactoryBot.create(:user)
        @profile = FactoryBot.create(:profile_with_message, user: @user)
        @message = @profile.messages.first
      end

      context 'when not signed in' do
        it 'redirects to login' do
          get "/messages/#{@message.id}"
          expect(response).to redirect_to('/users/sign_in')
        end
      end

      context 'when signed in' do
        before(:each) do
          sign_in @user
        end

        it 'renders a 200' do
          get "/messages/#{@message.id}"
          expect(response).to have_http_status(200)
        end

        it 'increments the messages read status' do
          expect {
            get "/messages/#{@message.id}"
          }.to change{
           @profile.messages.last.read_status
          }.from(false).to(true)
        end

        it 'increments the message open count' do
          expect {
            get "/messages/#{@message.id}"
          }.to change{
            @profile.messages.last.open_count
          }.from(0).to(1)

          expect {
            get "/messages/#{@message.id}"
          }.to change{
            @profile.messages.last.open_count
          }.from(1).to(2)

          expect {
            get "/messages/#{@message.id}"
          }.to change{
            @profile.messages.last.open_count
          }.from(2).to(3)
        end
      end

      context 'when signed in as another user' do
        before(:each) do
          @user_2 = FactoryBot.create(:user)
          sign_in(@user_2)
        end

        it 'raises ActiveRecord::RecordNotFound' do
          expect {
            get "/messages/#{@message.id}"
          }.to raise_error(ActiveRecord::RecordNotFound)
        end
      end
    end
  end
end