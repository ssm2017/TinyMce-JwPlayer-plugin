/**
 * @package   jwplayer tinymce plugin
 * @copyright Copyright (C) 2012 Wene - ssm2017 Binder ( S.Massiaux ). All rights reserved.
 * @license   GNU/GPL, http://www.gnu.org/licenses/gpl-2.0.html
 * jwplayer plugin is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses.
 *
 * this plugin is made to be able to insert the jwplayer from http://www.longtailvideo.com/
 * with the wysiwyg editor tinymce from http://www.tinymce.com/
 */

tinyMCEPopup.requireLangPack();

var JwPlayerDialog = {
  init : function(ed) {
    var f = document.forms[0], dom = ed.dom, n = ed.selection.getNode();

    tinyMCEPopup.resizeToInnerSize();
    TinyMCE_EditableSelects.init();

    // Get the selected contents as text and place it in the input
    if (n.nodeName == 'IMG' && dom.getAttrib(n, 'class') == 'JwpPlayerImg') {
      // get the values in the input hidden field
      var values = tinymce.util.JSON.parse(dom.getAttrib(n, 'data-mce-json'));
      f.file.value          = values.file;
      f.width.value         = dom.getAttrib(n, 'width');
      f.height.value        = dom.getAttrib(n, 'height');
      f.controlbar.value    = values.controlbar;
      f.playlistfile.value  = values.playlistfile;
      f.playlist.value      = values.playlist;
      f.playlistsize.value  = values.playlistsize;
    }
    else {
      f.file.value          = tinyMCEPopup.getWindowArg('file', '');
      f.width.value         = tinyMCEPopup.getWindowArg('width', '320');
      f.height.value        = tinyMCEPopup.getWindowArg('height', '240');
      f.controlbar.value    = tinyMCEPopup.getWindowArg('controlbar', 'bottom');
      f.playlistfile.value  = tinyMCEPopup.getWindowArg('playlistfile', '');
      f.playlist.value      = tinyMCEPopup.getWindowArg('playlist', 'right');
      f.playlistsize.value  = tinyMCEPopup.getWindowArg('playlistsize', '150');
    }
  },

  insert : function(file, title) {
    var ed = tinyMCEPopup.editor, t = this, f = document.forms[0];

    if (f.file.value === '' && f.playlistfile.value === '') {
      if (ed.selection.getNode().nodeName == 'DIV') {
        ed.dom.remove(ed.selection.getNode());
        ed.execCommand('mceRepaint');
      }

      tinyMCEPopup.close();
      return;
    }

    t.insertAndClose();
  },

  insertAndClose : function() {
    var ed = tinyMCEPopup.editor, f = document.forms[0], nl = f.elements, v, el;

    tinyMCEPopup.restoreSelection();

    // Fixes crash in Safari
    if (tinymce.isWebKit)
      ed.getWin().focus();

    // build id
    var d=new Date();
    var id = this.generateUUID();

    // build the values container
    var data = tinymce.util.JSON.serialize({
      'id'            : id,
      'file'          : nl.file.value,
      'width'         : nl.width.value,
      'height'        : nl.height.value,
      'controlbar'    : nl.controlbar.value,
      'playlistfile'  : nl.playlistfile.value,
      'playlist'      : nl.playlist.value,
      'playlistsize'  : nl.playlistsize.value
    }, "'");
    // Insert the contents from the input into the document

    ed.execCommand('mceInsertContent',false, tinyMCEPopup.editor.dom.createHTML(
      'img',
      {
        'src'     : ed.theme.url + '/img/trans.gif',
        'id'      : id,
        'class'   : 'JwpPlayerImg',
        'width'   : nl.width.value,
        'height'  : nl.height.value,
        'data-mce-json' : data
      }
    ),
    {skip_undo : 1});
    ed.undoManager.add();

    tinyMCEPopup.editor.execCommand('mceRepaint');
    tinyMCEPopup.editor.focus();
    tinyMCEPopup.close();
  },

  generateUUID : function () {
    var S4 = function () {
      return Math.floor(
        Math.random() * 0x10000 /* 65536 */
      ).toString(16);
    };

    return (
      S4() + S4() + "-" +
      S4() + "-" +
      S4() + "-" +
      S4() + "-" +
      S4() + S4() + S4()
    );
  }
};

tinyMCEPopup.onInit.add(JwPlayerDialog.init, JwPlayerDialog);
