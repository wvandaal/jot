Jot.Models.User = Backbone.Model.extend({

  // specify a urlRoot to allow models to be accessed outside collections
  urlRoot: "api/users",


  authenticate: function(callback) {
    var that = this;

    $.ajax({
      type: 'POST',
      url: 'api/session',
      dataType: 'json',
      data: {
        username: this.get('username'),
        password: this.get('password')
      }
    }).done(function(data) {
      console.log(data);
    }).fail(function(data) {
      console.log(data);
    });
  }
});
