class User < ActiveRecord::Base
  validates :username, presence: true
  validates :password_digest, presence: {message: "Password can't be blank"}
  validates :password, length: {minimum: 6, allow_nil: true}
  validates :email, :username, uniqueness: true

  def self.find_by_credentials(username, pwd)
    user = User.find_by_username(username)
    return nil if user.nil?
    user.is_password?(pwd) ? user : nil
  end

  def password=(pwd)
    @password = pwd
    self.password_digest = BCrypt::Password.create(pwd)
  end

  def is_password?(pwd)
    BCrypt::Password.new(self.password_digest).is_password?(pwd)
  end
end
