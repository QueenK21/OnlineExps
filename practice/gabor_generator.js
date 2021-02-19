var base_mapping, meshgrid, mk_gabor, map_radial, mk_grating, mk_gaussianEnvelope;  


mk_gabor = function(rows, cols, bg_lum, contrast, sine_freq, sine_phase, sine_tilt,
    env_sd, env_ratio, env_tilt){
    var mgrid, ref_x, ref_y, rot, rot_x, rot_y, gratingmat, tempEcc, gEnv, gabor;
    var gabor_temp = []; 
    mgrid = meshgrid(rows, cols); 
    ref_x = mgrid[0], ref_y = mgrid[1]; 
    rot = base_mapping(ref_x, ref_y, sine_tilt);
    rot_x = rot[0]; rot_y = rot[1];
    gratingmat = mk_grating(rot_x, sine_freq, sine_phase, contrast);
    tempEcc = map_radial(rot_x, rot_y, env_ratio, env_tilt); 
    gEnv = mk_gaussianEnvelope(tempEcc, env_sd); 

    for (var i=0; i < rows; i++){
        gabor_temp[i]=[]; 
        for (var j=0; j < cols; j++){
            gabor_temp[i].push(gratingmat[i][j]*gEnv[i][j] + (1-gEnv[i][j])*bg_lum);
        }
    }
    gabor = Math.round(gabor_temp); 

    /*save_image*/
    var buffer = new Uint8ClampedArray(rows*cols*4); //*4 at the end represent RGBA 

    //fill the buffer as source for canvas: 
    for (var y = 0; y < rows; y++){
        for (var x = 0; x < cols; x++){
            var pos = (y*cols+x)*4; //position in buffer base;
            buffer[pos ] = gabor[y][x];
            buffer[pos+1]= gabor[y][x];
            buffer[pos+2]= gabor[y][x];
            buffer[pos+3]= 255; //set a alpha channel 
        }
    }
    //use the buffer as source for canvas:
    var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
    canvas.width = cols;
    canvas.height = rows;
    var imgData = ctx.createImageData(rows, cols);
    imgData.data.set(buffer);
    ctx.putImageData(imgData, 0, 0); // Now the data in your custom array is copied to the canvas buffer
    //Create an image file
    var gaborImg = new Image();
    gaborImg.src = canvas.toDataURL(); //produces a PNG file

    return gaborImg;
}

/*make grid for grating*/ 
meshgrid = function(gx, gy){
    var mx = [];
    var my = []; 
    var x_array = []; var y_array = []; 
    var x_array, x_array_new, y_array, y_array_new;
    for (var it = 1; it <= gx; it++){
        x_array.push(it);
    }
    x_array_new = x_array.map(value => value - ((1+gx)/2)); 
    if (typeof gy === 'undefined' || gy === 'null'){
        y_array_new = x_array_new;  
    }
    else{
        for (var it2 = 1; it2 <= gy; it2++){
            y_array.push(it2);
        }
        y_array_new = y_array.map(value => value - ((1+gy)/2)); 
    }
    for (i = 0; i < gy; i++){
        mx.push(x_array_new); 
    }
    for (j = 0; j < gy; j++){
        my.push(y_array_new); 
    }
    my = transpose(my); 
    return [mx, my]; 
}

/*make base grid with rotation*/ 
base_mapping = function(mx, my, tilt){
    var rx, ry, rx_temp_x, ry_temp_x, rx_temp_y, ry_temp_y; 
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


mk_grating = function(rx, freq, phase, cont){
    var grating_temp, grating_contrast, grating_255;
    if (typeof phase === 'undefined' || phase === 'null'){
        phase = 90; 
    }
    grating_temp = rx.map(value => Math.sin((value*freq*360+phase)*Math.PI/180) * 0.5 + 0.5); 
    grating_contrast = grating_temp.map(value=>((grating*2-1)*cont+1)*bg_lum); 
    grating_255 = grating_contrast*255; 
    return grating_255; 
}

map_radial = function(rx, ry, env_ratio, env_tilt){
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

mk_gaussianEnvelope = function(ecc, env_sd){
    var gaussian_temp, gaussianEnvelope 
    gaussian_temp = ecc.map(value=>Math.pow(value/env_sd,2)*-0.5);
    gaussianEnvelope = gaussian_temp.map(value=>Math.exp(value));
    return gaussianEnvelope; 
}


/*additional function to use*/ 
let addvector = function(a,b){
    return a.map((e,i) => e + b[i]);
}

let transpose = function(arr){
    var tran_arr = [];
    for (var i=0; i<arr.length; i++){
        tran_arr[i] = [];
        for (var j=0; j<arr.length; j++){
            tran_arr[i].push = arr[j][i];
        }
    }
    return tran_arr; 
}






