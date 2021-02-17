var base_mapping, meshgrid, mk_gabor, mk_envelope, mk_grating, mk_gaussian;  

/*make grid for grating*/ 
meshgrid = function(gx, gy){
    var mx, my, x_array, x_array_new, y_array, y_array_new;
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
        mx.push(x_array_new); 
    }
    for (j = 0; j < gy; j++){
        my.push(y_array_new); 
    }
    my = math.transpose(my); 
    return [mx, my]; 
}

/*make base grid with rotation*/ 
base_mapping = function(mx, my, tilt){
    var rx, ry, rx_temp_x, ry_temp_x, rx_temp_y. ry_temp_y; 
    if (typeof tilt === 'undefined' || tilt === 'null'){
        tilt = 0; 
    }
    if (tilt%360 == 0){
        rx = mx; 
        ry = my; 
    }
    else {
        rx_temp_x = rx_temp_x.map(value => value*Math.cos(tilt*Math.PI/180));
        ry_temp_x = ry_temp_x.map(value => value*Math.sin(tilt*Math.PI/180));
        rx = math.add(rx_temp_x, ry_temp_x); 
        rx_temp_y = rx_temp_y.map(value => value*Math.cos((tilt+90)*Math.PI/180)); 
        ry_temp_y = ry_temp_y.map(value => value*Math.sin((tilt+90)*Math.PI/180)); 
        ry = math.add(rx_temp_y, ry_temp_y); 
    } 
    return [rx, ry]; 
}
//rx, ry 반환하지만 1차원 grating 만들기 위함이기에 이후 mk_grating에서는 rx만 씀. map_radial
//같은 경우는 ry까지 사용 (2차원 좌표)

mk_grating = function(rx, freq, phase){
    var grating;
    if (typeof phase === 'undefined' || phase === 'null'){
        phase = 90; 
    }
    grating = rx.map(value => Math.sin((value*freq*360+phase)*Math.PI/180) * 0.5 + 0.5); 
    return grating; 
}

mk_envelope = function(rx, ry, env_ratio, env_tilt){
    var ecc, sum, rx_square, ry_square; 
    if (typeof env_tilt === 'undefined' || env_tilt === 'null'){
        env_tilt = 0; 
    }
    if (typeof env_ratio === 'undefined' || env_ratio === 'null'){
        env_ratio = 1; 
    }
    rx_square = rx.map(xvalue => Math.pow(xvalue, 2));
    ry_square = ry.map(yvalue => Math.pow(yvalue*ratio, 2));
    sum = addvector(rx_square, ry_square); 
    ecc = sum.map(Math.sqrt); //return matrix with the same size as rx and ry whose value is an eccentricity 
    return ecc; 
}

mk_gaussian = function(ecc, env_sd){
    //matlab: gaussianmat = exp(-.5*(ecc/sd).^2); 
}

function addvector(a,b){
    return a.map((e,i) => e + b[i]);
}






