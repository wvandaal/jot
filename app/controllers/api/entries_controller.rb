class Api::EntriesController < ApplicationController
  before_action :require_signed_in!, only: [:destroy, :create, :update]

  def index
    @entries = params[:user_id].nil? ? Entry.all : 
      User.find(params[:user_id]).entries.order(updated_at: :desc)
    render json: @entries
  end

  def show
    @entry = Entry.find(params[:id])
    render json: @entry
  end

  def download
    @entry = Entry.find(params[:id])
    if !@entry.nil?
      render  pdf:          "#{@entry.title}", 
                              template:     "entries/download",
                              show_as_html: true,
                              redirect_delay: 2000,
                              disable_internal_links: false,
                              disable_external_links: false

      # send_data(pdf, filename: @entry.title.parameterize, type: "application/pdf")
    else
      render json: {errors: ["There is no jot with an ID of #{params[:id]}"]}
    end
  end

  # Use @current_user.entries.build to negate need for :user_id
  def create
    @entry = current_user.entries.build(entry_params)

    if @entry.save
      render json: @entry
    else
      render json: {errors: @entry.errors.full_messages}, status: :unprocessable_entity 
    end
  end

  def update
    @entry = current_user.entries.find(params[:id])
    if @entry.nil?
      render json: {errors: ["You do not have permission to edit this jot"]}, status: :unauthorized
    else
      if @entry.update_attributes(entry_params);
        render json: @entry
      else
        render json: {errors: @entry.errors.full_messages}, status: :unprocessable_entity
      end
    end
  end

  def destroy
    @entry = current_user.entries.where(id: params[:id])
    if @entry
      @entry.destroy
      render json: {msgs: ["Jot successfully deleted."]}
    else
      render json: {msgs: ["You cannot delete this jot."]}, status: :unprocessable_entity
    end
  end

  private

  # Remove user_id to incorporate @current_user
  def entry_params
    params.require(:entry).permit(:title, :description, :content)
  end
end
