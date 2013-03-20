;if(!window.TCE) window.TCE = {};
  
TCE.MorphDOM = function(config){
  _.bindAll(this,"on_device_change");
  _.extend(this, 
    _({morphs:{}}).chain().extend(this.defaults, config)
      .pick("rel", "default_device", "morphs", "target")
      .value()
  );
  
  this.elements = _.chain($("[data-morph='"+this.rel+"']"))
    .map(function(html_element){
      html_element = $(html_element);
      _(html_element.data("morph-devices").split(/\s*,\s*/)).each(function(device){
        html_element.data("morph-into-"+device, true);
      })
      return html_element;
    })
    .sortBy(function(element){
      return element.data("morph-stack");
    })
    .value();
  
  this.current_device = this.default_device;
  
  this.init();
};

_.extend(TCE.MorphDOM.prototype,{
  defaults:{
    rel: "morph",
    default_device: "desktop"
  },
  init:function(){
    var device;
    if(this.current_device != (device = Device.device_type())){
      this.morph_into(device);
    }
    $(window).on("device_change", this.on_device_change);
  },
  morph_into:function(device){
    
    var target;
    this.init_device(device);
    
    target = $(this.target);
    _(this.elements).each(_.bind(function(element){
      var morph = element.data("morph-into-"+device),
          clone = element.data("morph-type") == "clone",
          morph_current = element.data("morph-into-"+this.current_device),
          parent, position;
        if(morph && !morph_current){
          position = element.data("morph-target")
          if(!position) position = target;
          else position = $(position);
          if(clone){
            this.clone_element(element, position);
          }else{
            this.placeholder(element);
            position.append(element);
          }
        }else if(this.default_device == device || !morph_current || !morph){
          if(clone)
            this.declone_element(element);
          else
            this.replace_placeholder(element);
        }
      
    },this));
    
    this.destroy_current_device_with(device);
    
    this.current_device = device;
    
  },
  clone_element:function(element, position){
    var clone;
    position.each(function(){
      var current_clone = element.clone()
      if(!clone) clone = current_clone;
      else
        clone = clone.add(current_clone)
      $(this).append(current_clone);
    });
    element.data("morph-clone", clone)
  },
  declone_element:function(element){
    var clone;
    if(!(clone = element.data("morph-clone"))) return;
    clone.remove();
    element.data("morph-clone",null)
  },
  init_device:function(device){
    this.exec_morph_function(device, this.current_device, "init");
  },
  destroy_current_device_with:function(device){
    this.exec_morph_function(this.current_device, device, "destroy");
  },
  exec_morph_function:function(device, last_device, method_name){
    var morph_methods = this.morphs[device] || {},
        method = morph_methods[method_name];
        
    if(method && method != last_device 
        && (this.morphs[last_device] || {})[method_name] != device ){
      if(typeof method == "string"){
        method = this.morphs[method][method_name];
      }
      method.call(this, device, last_device)
    }
  },
  placeholder:function(element){
    var uid = _.uniqueId("morph_"+this.rel+"_"),
        placeholder = $("<input type='hidden' data-morph-placeholder='"+uid+"'/>");
    element
      .before(placeholder)
      .data("morph-placeholder-id", uid);
  },
  replace_placeholder:function(element){
    var placeholder_id = element.data("morph-placeholder-id"),
        placeholder;
    if(placeholder_id){
      placeholder = $("[data-morph-placeholder='"+placeholder_id+"']");
      placeholder
        .after(element)
        .remove();
      element.data("morph-placeholder-id", null);
    }
  },
  on_device_change:function(event){
    if(event.device != this.current_device)
      this.morph_into(event.device);
  }
})
;
