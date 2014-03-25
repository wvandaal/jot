Jot.Views.UsersShow = Backbone.View.extend({
  className: 'container',
  template: JST['users/show'],

  events: {
    "click .jot": "toggleJot",
    "click #DOWNLOAD": "download"
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

  toggleJot: function(e) {
    var $jots = this.$('.jot').removeClass('selected'),
        $jot  = $(e.currentTarget),
        title = $jot.find('.jot-title').text();

    $jot.addClass('selected');
    this.renderPreview(title);
  },

  renderPreview: function(title) {
    var $title        = $('#PREVIEW-TITLE'),
        $description  = $('#PREVIEW-DESCRIPTION'),
        $output       = $('#MARKDOWN-OUTPUT'),
        $viewLink     = $('#VIEW'),
        $editLink     = $('#EDIT'),
        $downloadLink = $('#DOWNLOAD'),
        $deleteLink   = $('#DELETE'),
        jot           = this.collection.findWhere({title: title}),
        id            = jot.get('id');

    $viewLink.attr('href', '#/jots/' + id );
    $editLink.attr('href', '#/jots/' + id + '/edit');
    $downloadLink.data('id', id);
    $deleteLink.attr('href', '#/jots/' + id + '/delete');
    $title.html(jot.escape('title'));
    $description.html(jot.escape('description'));
    $output.html(this.renderMarkdown(jot.get('content')));
  },

  download: function(e) {
    var id  = $(e.currentTarget).data('id'),
        url = 'api/jots/' + id + '/download';
    $.fileDownload(url);
  }

});
