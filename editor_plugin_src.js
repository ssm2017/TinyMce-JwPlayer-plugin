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

(function() {
  // Load plugin specific language pack
  tinymce.PluginManager.requireLangPack('jwplayer');

  tinymce.create('tinymce.plugins.JwPlayerPlugin', {
    /**
     * Initializes the plugin, this will be executed after the plugin has been created.
     * This call is done before the editor instance has finished it's initialization so use the onInit event
     * of the editor instance to intercept that event.
     *
     * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
     * @param {string} url Absolute URL to where the plugin is located.
     */
    init : function(ed, url) {
      var self = this, lookup = {}, i, y, item, name;
      self.editor = ed;

      // Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceJwPlayer');
      ed.addCommand('mceJwPlayer', function() {
        ed.windowManager.open({
          file : url + '/dialog.htm',
          width : 250 + parseInt(ed.getLang('jwplayer.delta_width', 0)),
          height : 280 + parseInt(ed.getLang('jwplayer.delta_height', 0)),
          inline : 1
        }, {
          plugin_url : url, // Plugin absolute URL
          some_custom_arg : 'custom arg' // Custom argument
        });
      });

      // Register jwplayer button
      ed.addButton('jwplayer', {
        title : 'jwplayer.desc',
        cmd : 'mceJwPlayer',
        image : url + '/img/jwplayer.gif'
      });

      function isJwpImg(node) {
        return node && node.nodeName === 'IMG' && ed.dom.hasClass(node, 'JwpPlayerImg');
      };

      ed.onPreInit.add(function() {
        // Allow video elements
        ed.schema.addValidElements('script[language|type]');

        // Convert video elements to image placeholder
        ed.parser.addNodeFilter('div', function(nodes) {
          var i = nodes.length;

          while (i--) {
            if (nodes[i].attr('class') ==='JwpPlayerItem') {
              self.objectToImg(nodes[i]);
            }
          }
        });

        // Convert image placeholders to video elements
        ed.serializer.addNodeFilter('img', function(nodes, name, args) {
          var i = nodes.length;

          while (i--) {
            if (nodes[i].attr('class') ==='JwpPlayerImg') {
              self.imgToObject(nodes[i], args);
            }
          }
        });
      });

      ed.onInit.add(function() {
        // load the css
        tinyMCE.activeEditor.dom.loadCSS(url + '/css/jwplayer.css');

        // Display "jwplayer" instead of "img" in element path
        if (ed.theme && ed.theme.onResolveName) {
          ed.theme.onResolveName.add(function(theme, path_object) {
            if (path_object.name === 'img.JwpPlayerImg' && ed.dom.hasClass(path_object.node, 'JwpPlayerImg'))
              path_object.name = 'jwplayer';
          });
        }

        // Add contect menu if it's loaded
        if (ed && ed.plugins.contextmenu) {
          ed.plugins.contextmenu.onContextMenu.add(function(plugin, menu, element) {
            if (element.nodeName === 'IMG' && element.className.indexOf('JwpPlayerImg') !== -1)
              menu.add({
                title : 'jwplayer.edit',
                cmd : 'mceJwPlayer'
              });
          });
        }
      });

      // Update media selection status
      ed.onNodeChange.add(function(ed, cm, node) {
        cm.setActive('jwplayer', isJwpImg(node));
      });

    },

    /**
     * Creates control instances based in the incomming name. This method is normally not
     * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
     * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
     * method can be used to create those.
     *
     * @param {String} n Name of the control to create.
     * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
     * @return {tinymce.ui.Control} New control instance or null if no control was created.
     */
    createControl : function(n, cm) {
      return null;
    },

    /**
     * Returns information about the plugin as a name/value array.
     * The current keys are longname, author, authorurl, infourl and version.
     *
     * @return {Object} Name/value array containing information about the plugin.
     */
    getInfo : function() {
      return {
        longname : 'JwPlayer plugin',
        author : 'ssm2017 Binder',
        authorurl : 'http://ssm2017.com',
        infourl : 'https://github.com/ssm2017/TinyMce-JwPlayer-plugin',
        version : "1.0"
      };
    },

    objectToImg : function(node) {

      // If node isn't in document
      if (!node.parent){
        return;
      }

      // Setup new image object
      var img = new tinymce.html.Node('img', 1);
      img.attr({
        src : this.editor.theme.url + '/img/trans.gif'
      });

      // get elements
      if (node.firstChild.name.toLowerCase() === 'input') {
        var data = tinymce.util.JSON.parse(node.firstChild.attr('value'));

        img.attr({
          'id'      : node.attr('id'),
          'class'   : 'JwpPlayerImg mceItem',
          'width'   : data.width,
          'height'  : data.height,
          'hspace'  : node.attr('hspace'),
          'vspace'  : node.attr('vspace'),
          'align'   : node.attr('align'),
          'bgcolor' : node.attr('bgcolor'),
          "data-mce-json" : node.firstChild.attr('value')
        });
        node.empty();
        node.replace(img);
      }

    },

    imgToObject : function(node, args) {
      var data = node.attr('data-mce-json');
      if (!data) {
        return;
      }

      data = tinymce.util.JSON.parse(data);

      // create the root element
      var root = new tinymce.html.Node('div', 1);
      root.attr({
        //'id'    : "jwp_"+ data.mediaspace_id,
        'class' : "JwpPlayerItem"
      });

      // create the data container element
      var data_container = new tinymce.html.Node('input', 1);
      data_container.attr({
        'type':'hidden',
        'value':node.attr('data-mce-json')
      });
      root.append(data_container);

      // create the trigger element
      var trigger = new tinymce.html.Node('div', 1);
      trigger.attr({
        'id':'mediaspace_'+ data.id
      });
      var trigger_text_container = new tinymce.html.Node('p', 1);
      var trigger_text = new tinymce.html.Node('#text', 3);
      trigger_text.value = 'Media not computed.';
      trigger_text_container.append(trigger_text);
      trigger.append(trigger_text_container);
      root.append(trigger);

      // create the script element
      var script_tag = new tinymce.html.Node('script', 1);
      script_tag.attr({
        'type':'text/javascript'
      });

      // get the player's url
      var full_url = tinyMCE.baseURI.source;
      var jwplayer_url = full_url.substring(0,(full_url.length - 26))+ '/jwplayer';

      var extra = "'file': '"+ data.file+ "',";
      if (data.playlistfile != '') {
        extra = "'playlistfile': '"+ data.playlistfile+ "',"; // http://www.longtailvideo.com/jw/upload/mrss.xml
        extra += "'playlist.position': '"+ data.playlist+ "',";
        extra += "'playlist.size': '"+ data.playlistsize+ "',";
      }

      // fill the values
      var script_text = new tinymce.html.Node('#text', 3);
      script_text.value = "jwplayer('mediaspace_"+ data.id+ "').setup({"
      +"    'flashplayer': '"+ jwplayer_url+ "/player.swf',"
      +"    'controlbar': '"+ data.controlbar+ "',"
      + extra
      +"    'width': '"+ data.width+ "',"
      +"    'height': '"+ data.height+ "'"
      +"  });";
      script_tag.append(script_text);
      root.append(script_tag);

      node.replace(root);
    }
  });

  // Register plugin
  tinymce.PluginManager.add('jwplayer', tinymce.plugins.JwPlayerPlugin);
})();
