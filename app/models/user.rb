class User < ActiveRecord::Base
  has_many :identities, dependent: :destroy
  TEMP_EMAIL_PREFIX = 'change@me'
  TEMP_USER_PREFIX = 'changeme'
  TEMP_EMAIL_REGEX = /\Achange@me/

  devise :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :trackable, 
         :validatable, :authentication_keys => [:login]
         
  validates_format_of :email, :without => TEMP_EMAIL_REGEX, on: :update
  
  validates :username,
  :presence => true,
  :uniqueness => {
    :case_sensitive => false
  }
  
  validates :email,
  :presence => true,
  :uniqueness => {
    :case_sensitive => false
  }

  def self.find_for_oauth(auth, signed_in_resource = nil)
    # Get the identity and user if they exist
    identity = Identity.find_for_oauth(auth)

    # If a signed_in_resource is provided it always overrides the existing user
    # to prevent the identity being locked with accidentally created accounts.
    # Note that this may leave zombie accounts (with no associated identity) which
    # can be cleaned up at a later date.
    user = signed_in_resource ? signed_in_resource : identity.user

    logger.info "New article: #{auth}"
    # Create the user if needed
    if user.nil?
       
      # Get the existing user by email if the provider gives us a verified email.
      # If no verified email was provided we assign a temporary email and ask the
      # user to verify it on the next step via UsersController.finish_signup
      email_is_verified = auth.info.email # && (auth.info.verified || auth.info.verified_email || auth.extra.raw_info.email_verified)
      email = auth.info.email if email_is_verified
      user = User.where(:email => email).first if email

      # Create the user if it's a new registration
      if user.nil?
        user = User.new(
          #name: auth.extra.raw_info.name,
          username: auth.info.nickname ? auth.info.nickname : "#{TEMP_USER_PREFIX}#{auth.uid}",
          profile_set: auth.info.nickname ? 'yes' : 'no',
          email: email ? email : "#{TEMP_EMAIL_PREFIX}-#{auth.uid}-#{auth.provider}.com",
          email_set: email ? 'yes' : 'no',
          password: Devise.friendly_token[0,20]
        )
        #user.skip_confirmation!
        user.skip_confirmation! if user.respond_to?(:skip_confirmation)
        user.save!
      end
    end

    # Associate the identity with the user if needed
    if identity.user != user
      identity.user = user
      identity.save!
    end
    user
  end

  def email_verified?
    self.email && self.email !~ TEMP_EMAIL_REGEX
  end

  def login=(login)
    @login = login
  end

  def login
    @login || self.username || self.email
  end
  
  private
    def self.find_first_by_auth_conditions(warden_conditions)
      conditions = warden_conditions.dup
      if login = conditions.delete(:login)
        where(conditions).where(["lower(username) = :value OR lower(email) = :value", { :value => login.downcase }]).first
      else
        if conditions[:username].nil?
          where(conditions).first
        else
          where(username: conditions[:username]).first
        end
      end
    end
end
