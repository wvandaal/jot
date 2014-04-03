Jot.Views.UsersShow = Backbone.View.extend({
  className: 'container',
  template: JST['users/show'],

  events: {
    "click .jot": "toggleJot",
    "click #DOWNLOAD": "download",
    "click #DELETE": "delete"
  },

  initialize: function() {
    var p    = this.collection.fetch(),
        that = this;

    p.done(function() {
      that.render();
      that.$('.jot').first().trigger('click');  
    });
  },

  render: function() {
    var content = this.template({
      user: this.model,
      jots: this.collection
    });

    this.$el.html(content);

    return this;
  },

  renderMarkdown: function(md) {
    return marked(md);
  },

  // Select the clicked jot and display it in the preview
  toggleJot: function(e) {
    var $jots = this.$('.jot').removeClass('selected'),
        $jot  = $(e.currentTarget),
        title = $jot.find('.jot-title').text();

    $jot.addClass('selected');
    this.renderPreview(title);
  },

  // Render the preview of the jot with the given title
  renderPreview: function(title) {
    this._currentJot = this.collection.findWhere({title: title});
    var $title        = $('#PREVIEW-TITLE'),
        $description  = $('#PREVIEW-DESCRIPTION'),
        $output       = $('#MARKDOWN-OUTPUT'),
        $viewLink     = $('#VIEW'),
        $editLink     = $('#EDIT'),
        $downloadLink = $('#DOWNLOAD'),
        $deleteLink   = $('#DELETE'),
        id            = this._currentJot.get('id');

    $viewLink.attr('href', '#/jots/' + id );
    $editLink.attr('href', '#/jots/' + id + '/edit');
    $downloadLink.data('id', id);
    $deleteLink.attr('href', '#/jots/' + id + '/delete');
    $title.html(this._currentJot.escape('title'));
    $description.html(this._currentJot.escape('description'));
    $output.html(this.renderMarkdown(this._currentJot.get('content')));
  },

  // Request the file for download and save it when returned
  download: function(e) {
    var id  = $(e.currentTarget).data('id'),
        url = 'api/jots/' + id + '/download';
    $.fileDownload(url);
  },

  delete: function() {
    var promise = this._currentJot.destroy(),
        that    = this;

    promise.done(function(msgs) {
      that.$('[data-id="' + that._currentJot.get('id') + '"]').remove();
      Jot.renderMessages(msgs);
      that.$('.jot').first().trigger('click'); 
    }).fail(function(model, errors) {
      Jot.renderMessages(errors.responseJSON);
    });
  }
});
