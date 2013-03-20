;var Device = function(window, Device, ranges){
  var window = $(window),
      window_width = window.width(),
      range, min, max, device, event, has_touchevents,
      current_device;
  
  // Si estamos en una version inferior a IE9, siempre es desktop
  
  if(Browser.is_msie("< 9")){
    for(device in ranges){
      Device["is_"+device] = device == "desktop" ? true : false;
    }
    Device.device_type = function(){ return "desktop"; }
    Device.is = function(device_type){ return device_type == "desktop"; }
    Device.refresh = $.noop;
    return Device; // Cortamos la ejecucion y devolvemos "Device" con todas las
                   // propiedades y metodos para IE8- 
  }
  
  Device.device_type = function(){
    window_width = window.width();
    for (device in ranges){
      range = ranges[device],
      min = range[0], max = range[1];
      if(window_width >= min && (!max || window_width <= max))
        return device;
    }
    return null;
  }
  
  Device.is = function(device_type){
    window_width = window.width(),
    range = ranges[device_type],
    min = range[0], 
    max = range[1];
    
    return window_width >= min && (!max || window_width <= max)
  }
  
  Device.refresh = function(){
    var changed = false,
        val, new_val, last_device_type;
    for (device in ranges){
      val = Device[ 'is_'+device ],
      new_val = Device.is(device);
      if(val != new_val){
        Device[ 'is_'+device ] = new_val;
        if(!!new_val){
          last_device_type = current_device
          current_device = device;
        }
        if(!changed) changed = true;
      }
    }  
    if(changed){
      window.trigger($.Event("device_change", {device: current_device, prev_device: last_device_type}));
    }
  }  
  
  window.on("resize", _.debounce(function(){
    Device.refresh();
  },100))
  
  Device.refresh();
  
  return Device;
}(window, {}, {
                'desktop' :[992],
                'tablet' : [768, 991],
                'mobile' : [0, 767]
              });
