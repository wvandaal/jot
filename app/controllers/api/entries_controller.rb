class Api::EntriesController < ApplicationController
  before_action :require_signed_in!, only: [:destroy, :create, :update]

  def index
    @entries = params[:user_id].nil? ? Entry.all : User.find(params[:user_id]).entries
    render json: @entries
  end

  def show
    @entry = Entry.find(params[:id])
    render json: @entry
  end

  # Use @current_user.entries.build to negate need for :user_id
  def create
    @entry = current_user.entries.build(entry_params)

    if @entry.save
      render json: @entry
    else
      render json: @entry.errors.full_messages, status: :unprocessable_entity 
    end
  end

  def update
    @entry = Entry.find(params[:id])
    if @entry.update_attributes(entry_params);
      render json: @entry
    else
      render json: @entry.errors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    @entry = current_user.entries.where(id: params[:id])
    if @entry
      @entry.destroy
      render json: "Jot successfully deleted."
    else
      render json: "You cannot delete this jot.", status: :unprocessable_entity
    end
  end

  private

  # Remove user_id to incorporate @current_user
  def entry_params
    params.require(:entry).permit(:title, :description, :content)
  end
end
