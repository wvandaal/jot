Jot.Models.User = Backbone.Model.extend({

  // specify a urlRoot to allow models to be accessed outside collections
  urlRoot: "api/users",


  authenticate: function(password, callback) {
    var that = this;

    $.ajax({
      type: 'POST',
      url: 'api/session',
      dataType: 'json',
      data: {
        username: this.get('username'),
        password: password
      }
    }).done(function(data) {
      console.log(data);
    }).fail(function(data) {

    });
  },

  authorize: function(attrs, callback) {
    var user = new Jot.Models.User({username: attrs.username});
    user.authenticate(attrs.password, callback);
  }
});
