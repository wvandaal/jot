Jot.Views.JotsNew = Jot.Views.JotsEdit.extend({
  template: JST["jots/new"],

  events: function() {
    return _.extend({}, Jot.Views.JotsEdit.prototype.events, {
      "reset form": "resetOutput"
    });
  },

  initialize: function() {
    this.render();
  },

  render: function() {
    var content = this.template();
    this.$el.html(content);

    return this;
  },

  submit: function(e) {
    e.preventDefault();

    var params = $(e.currentTarget).serializeJSON(),
        newJot = new Jot.Models.Jot(params);

    newJot.save({}, {
      success: function(json) {
        Backbone.history.navigate('', {trigger: true});
      },
      error: function(model, errors) {
        Jot.renderMessages(errors.responseJSON);
      }
    });
  },

  resetOutput: function() {
    var $output     = $('#MARKDOWN-OUTPUT'),
        placeholder = $('<div id="PLACEHOLDER">markdown preview</div>');

    $output.html(placeholder);
  }
});