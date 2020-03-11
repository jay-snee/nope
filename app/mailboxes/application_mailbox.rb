class ApplicationMailbox < ActionMailbox::Base
  routing :all => :processing
end
