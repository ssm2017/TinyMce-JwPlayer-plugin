(function(){tinymce.PluginManager.requireLangPack('jwplayer');tinymce.create('tinymce.plugins.JwPlayerPlugin',{init:function(d,e){var f=this,lookup={},i,y,item,name;f.editor=d;d.addCommand('mceJwPlayer',function(){d.windowManager.open({file:e+'/dialog.htm',width:250+parseInt(d.getLang('jwplayer.delta_width',0)),height:280+parseInt(d.getLang('jwplayer.delta_height',0)),inline:1},{plugin_url:e,some_custom_arg:'custom arg'})});d.addButton('jwplayer',{title:'jwplayer.desc',cmd:'mceJwPlayer',image:e+'/img/jwplayer.gif'});function isJwpImg(a){return a&&a.nodeName==='IMG'&&d.dom.hasClass(a,'JwpPlayerImg')};d.onPreInit.add(function(){d.schema.addValidElements('script[language|type]');d.parser.addNodeFilter('div',function(a){var i=a.length;while(i--){if(a[i].attr('class')==='JwpPlayerItem'){f.objectToImg(a[i])}}});d.serializer.addNodeFilter('img',function(a,b,c){var i=a.length;while(i--){if(a[i].attr('class')==='JwpPlayerImg mceItem'){f.imgToObject(a[i],c)}}})});d.onInit.add(function(){tinyMCE.activeEditor.dom.loadCSS(e+'/css/jwplayer.css');if(d.theme&&d.theme.onResolveName){d.theme.onResolveName.add(function(a,b){if(b.name==='img.JwpPlayerImg'&&d.dom.hasClass(b.node,'JwpPlayerImg'))b.name='jwplayer'})}if(d&&d.plugins.contextmenu){d.plugins.contextmenu.onContextMenu.add(function(a,b,c){if(c.nodeName==='IMG'&&c.className.indexOf('JwpPlayerImg')!==-1)b.add({title:'jwplayer.edit',cmd:'mceJwPlayer'})})}});d.onNodeChange.add(function(a,b,c){b.setActive('jwplayer',isJwpImg(c))})},createControl:function(n,a){return null},getInfo:function(){return{longname:'JwPlayer plugin',author:'ssm2017 Binder',authorurl:'http://ssm2017.com',infourl:'https://github.com/ssm2017/TinyMce-JwPlayer-plugin',version:"1.0"}},objectToImg:function(a){if(!a.parent){return}var b=new tinymce.html.Node('img',1);b.attr({src:this.editor.theme.url+'/img/trans.gif'});if(a.firstChild.name.toLowerCase()==='input'){var c=tinymce.util.JSON.parse(a.firstChild.attr('value'));b.attr({'id':a.attr('id'),'class':'JwpPlayerImg mceItem','width':c.width,'height':c.height,'hspace':a.attr('hspace'),'vspace':a.attr('vspace'),'align':a.attr('align'),'bgcolor':a.attr('bgcolor'),"data-mce-json":a.firstChild.attr('value')});a.empty();a.replace(b)}},imgToObject:function(a,b){var c=a.attr('data-mce-json');if(!c){return}c=tinymce.util.JSON.parse(c);var d=new tinymce.html.Node('div',1);d.attr({'class':"JwpPlayerItem"});var e=new tinymce.html.Node('input',1);e.attr({'type':'hidden','value':a.attr('data-mce-json')});d.append(e);var f=new tinymce.html.Node('div',1);f.attr({'id':'mediaspace_'+c.id});var g=new tinymce.html.Node('p',1);var h=new tinymce.html.Node('#text',3);h.value='Media not computed.';g.append(h);f.append(g);d.append(f);var i=new tinymce.html.Node('script',1);i.attr({'type':'text/javascript'});var j=tinyMCE.baseURI.source;var k=j.substring(0,(j.length-26))+'/jwplayer';var l="'file': '"+c.file+"',";if(c.playlistfile!=''){l="'playlistfile': '"+c.playlistfile+"',";l+="'playlist.position': '"+c.playlist+"',";l+="'playlist.size': '"+c.playlistsize+"',"}var m=new tinymce.html.Node('#text',3);m.value="jwplayer('mediaspace_"+c.id+"').setup({"+"    'flashplayer': '"+k+"/player.swf',"+"    'controlbar': '"+c.controlbar+"',"+l+"    'width': '"+c.width+"',"+"    'height': '"+c.height+"'"+"  });";i.append(m);d.append(i);a.replace(d)}});tinymce.PluginManager.add('jwplayer',tinymce.plugins.JwPlayerPlugin)})();