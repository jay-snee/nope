class ProfilesController < ApplicationController
  def create
    if current_user.can_create_profile?
      @profile = current_user.profiles.create(name: profile_params[:name])

      if @profile.save
        Processing::EventJob.perform_later("profile created", 'lifecycle', false)
        redirect_to @profile, notice: "new profile created - '#{@profile.name}'"
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

  def edit
    @profile = current_user.profiles.find params[:id]
  end

  def update
    @profile = current_user.profiles.find params[:id]
    @profile.update(name: profile_params['name'])
    @profile.save
    Processing::EventJob.perform_later("profile updated", 'lifecycle', false)
  end

  def destroy
    @profile = current_user.profiles.find params[:id]
    @profile.destroy
    Processing::EventJob.perform_later("profile destroyed", 'lifecycle', false)
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
