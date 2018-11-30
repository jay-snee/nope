class ProfilesController < ApplicationController
  def create
    if current_user.can_create_profile?
      @profile = current_user.profiles.create(name: profile_params[:name])

      if @profile.save
        redirect_to @profile, notice: "New profile '#{@profile.name}' created"
      else
        redirect_to root_path, alert: "Nope, that didn't work"
      end
    else
      redirect_to root_path, alert: "Sorry, you're out of profiles!"
    end
  end

  def show
    @profile = current_user.profiles.find params[:id]
  end

  def destroy
    @profile = current_user.profiles.find params[:id]
    @profile.destroy
    redirect_to root_path, notice: 'Profile destroyed'
  end

  def toggle_forwarding
    @profile = current_user.profiles.find params[:id]
    @profile.toggle!(:email_forward)
    redirect_to @profile, notice: "Forwarding preference updated"
  end

  def toggle_processing
    @profile = current_user.profiles.find params[:id]
    @profile.toggle!(:email_process)
    redirect_to @profile, notice: "Processing preference updated"
  end

  private

  def profile_params
    params.require(:profile).permit(:name)
  end
end
