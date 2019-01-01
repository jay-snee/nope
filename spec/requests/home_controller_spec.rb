require 'rails_helper'

RSpec.describe "homepage", :type => :request do
  it "displays the company number" do
    get "/"
    assert_select "#company-number", :text => "Company Number: 11609558"
  end
end