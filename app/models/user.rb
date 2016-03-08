class User < ActiveRecord::Base

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, 
         :validatable, :authentication_keys => [:login]
         
  
  
  validates :username,
  :presence => true,
  :uniqueness => {
    :case_sensitive => false
  }
  

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
