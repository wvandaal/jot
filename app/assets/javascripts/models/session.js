Jot.Models.Session = Backbone.Model.extend({
  urlRoot: 'api/session',

  // Set id to empty string to allow session.destroy without id
  id: '',

  // Override isNew() method to allow session.destroy without id
  isNew: function(){ 
    return this.get('session_token') ? false : true;
  }
});