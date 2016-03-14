class RemoveImpressionsCountFromUsers < ActiveRecord::Migration
  def change
    remove_column :users, :impressions_count, :integer
  end
end
