class User < ActiveRecord::Base
  attr_reader :password

  has_many :entries

  validates :username, presence: true
  validates :password_digest, presence: {message: "Password can't be blank"}
  validates :password, length: {minimum: 6, allow_nil: true}
  validates :email, :username, uniqueness: true
  validates :session_token, presence: true

  after_initialize :ensure_session_token

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

  def self.generate_session_token
    SecureRandom::urlsafe_base64(16);
  end

  def reset_session_token!
    self.session_token = self.class.generate_session_token
    self.save!
    self.session_token
  end

  private

  def ensure_session_token
    self.session_token ||= self.class.generate_session_token
  end

end
