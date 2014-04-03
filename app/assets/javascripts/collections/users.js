Jot.Collections.Users = Backbone.Collection.extend({
  url: "api/users",
  model: Jot.Models.User,

  search: function(letters) {
    if (letters === "") return this;

    // Note: it is important to exclude 'g' from regex definition; this is b/c
    // the 'g' tag is stateful, picking up where the last test left off. 
    var pat = new RegExp(letters, 'i');

    // Wrap in underscore to return collection instead of array
    return _(this.filter(function(u) {
      return pat.test(u.get('username'));
    }));
  }
});
