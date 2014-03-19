Jot.Collections.Jots = Backbone.Collection.extend({
  model: Jot.Models.Jot,

  url: function() {
    // If this collection is initialized with a user object, it will return only
    // the jots associated with that user. If no user is provided, all jots
    // will be returned
    if (!!this.user) {
      return this.user.url() + "/jots";     // Maps to 'api/users/:user_id/jots'
    } else {
      return Jot.Models.Jot.prototype.urlRoot || 'api/jots';  // Maps to 'api/jots'
    }
  },
  
  initialize: function(models, options) {
    this.user = options.user;
  }
});


function curLine(textarea) {
  var lines   = $(textarea).val().split("\n"),
      curPos  = textarea.selectionStart,
      lineNum = 0,
      i       = 0,
      line;

  while ((i < curPos) && (lineNum < lines.length)) {
    line = lines[lineNum++];
    i += !!line.length ? line.length : 1;
  }

  return line;
}
