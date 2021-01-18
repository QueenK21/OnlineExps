var base_mapping, meshgrid, mk_gabor, mk_grating, mk_gaussian;  


mk_grating = function(pixelmap, freq, phase){

}

/*make base grid with rotation*/ 
base_mapping = function(mx, my, tilt){
    var rx, ry;
    if (typeof tilt === 'undefined' || tilt === 'null'){
        tilt = 0; 
    }
    if (tilt%360 == 0){
        rx = mx; 
        ry = my; 
    }
    else {
        rx_temp_x = rx_temp_x.map(value => value*Math.cos(tilt*Math.PI/180)) 
        ry_temp_x = ry_temp_x.map(value => value*Math.sin(tilt*Math.PI/180)) 
        rx = math.add(rx_temp_x, ry_temp_x); 
        rx_temp_y = rx_temp_y.map(value => value*Math.cos((tilt+90)*Math.PI/180)) 
        ry_temp_y = ry_temp_y.map(value => value*Math.sin((tilt+90)*Math.PI/180)) 
        ry = math.add(rx_temp_y, ry_temp_y); 
    } 
    return [rx, ry]; 
}

/*make grid for grating*/ 
meshgrid = function(gx, gy){
    var mx = [];
    var my = [];
    x_array = math.range(1, gx, true);
    x_array_new = x_array.map(value => value - ((1+gx)/2)); 
    if (typeof gy === 'undefined' || gy === 'null'){
        y_array_new = x_array_new;  
    }
    else{
        y_array = math.range(1, gy, true); 
        y_array_new = y_array.map(value => value - ((1+gy)/2)); 
    }
    for (i = 0; i < gy; i++){
        mx[i].push = x_array_new; 
    }
    for (j = 0; j < gy; j++){
        my[j].push = y_array_new; 
    }
    my = math.transpose(my); 
    return [mx, my]; 
}