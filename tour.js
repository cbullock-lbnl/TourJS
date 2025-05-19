const Tour = {
    tourId: '',
    step:0,
    resizeObserver: new ResizeObserver(()=>{Tour.set_mask();}),

};

Tour.start = function(tourId,startStep = 1){
    Tour.tourId = tourId;
    document.body.classList.add('tour');
    //this.list = Array.from(document.querySelectorAll('[data-tour-step]'));
    //console.log(this.list);
    Tour.set_step(startStep);
}

Tour.next = function(){
    Tour.set_step(this.step+1);
}
Tour.prev = function(){
    Tour.set_step(this.step-1);
}
Tour.set_step = function(stepnum){
    if(stepnum<=0){
        Tour.end();
    }

    this.step = stepnum;
    Tour.set_mask();
}
Tour.get_step_element = function(){
    var tourselector="";
    if(tourId!=''){
        tourselector = `[data-tour-id="${this.tourId}]`;
    }
    return  document.querySelector(`${tourselector}[data-tour-step="${this.step}"]`);
}
Tour.get_step_data = function(){
    var tourselector="";
    if(tourId!=''){
        tourselector = `[data-tour-id="${this.tourId}]`;
    }
    return document.querySelector(`tour-data[data-tour-step="${this.step}"]${tourselector}`);
}
Tour.set_mask = function(){
    var element = Tour.get_step_element();
    if(!element){Tour.end();return;}
    this.resizeObserver.disconnect();
    this.resizeObserver.observe(element);

    var mask = document.querySelector('.tourHighlight');
    //var element = this.list[this.step];
    var r = element.getBoundingClientRect();
    mask.style.left = r.x+"px";
    mask.style.top = r.y+"px";
    mask.style.height = (r.bottom-r.top)+"px";
    mask.style.width = (r.right-r.left)+"px";
    Tour.show_data();
}

Tour.show_data = function(){
    var box = document.querySelector('tour-tooltip');
    if(!box){return;}
    var element = Tour.get_step_element();

    var data = document.querySelector(`[data-tour-step="${this.step}"]+tour-data`);
    if(!data){
        box.classList.remove('show');
        return;
    }
    if(typeof data.onplay==='function'){
        
        data.dispatchEvent(new Event('play'));
    }
    Tour.position_tooltip(element);
    //Tour.position_tooltip_right(element);
/*    Tour.position_tooltip_left(element);
    Tour.position_tooltip_right(element);
    Tour.position_tooltip_top(element);
    Tour.position_tooltip_bottom(element);*/
    
    var xmldatafields = Array.from(box.querySelectorAll('[data-xml-field]'));
    for(var x of xmldatafields){
        var d = data.querySelector(x.getAttribute('data-xml-field'));
        if(!d){continue;}
        x.innerHTML = d.innerHTML;
    }

    box.classList.add('show');

}
Tour.position_tooltip = function(element){
    var elbox = element.getBoundingClientRect();
    var tooltipbox = document.querySelector('tour-tooltip').getBoundingClientRect();
    var tw = tooltipbox.width
    var th = tooltipbox.height
    var bw = window.innerWidth;
    var bh = window.innerHeight;
    var margin = 20;
    if(elbox.right<(bw-tw-margin)){
        return Tour.position_tooltip_right(element);
    }else if(elbox.bottom<(bh-th-margin)){
        return Tour.position_tooltip_bottom(element);
    }else if(elbox.left>(tw+margin)){
        return Tour.position_tooltip_left(element);
    }else if(elbox.top>(th+margin)){
        return Tour.position_tooltip_top(element);
    }
    Tour.position_tooltip_inner(element);
}
Tour.position_tooltip_right = function(element){
    var box = document.querySelector('tour-tooltip');

    var r = element.getBoundingClientRect();
    box.style.top = r.y+'px';
    box.style.left = (r.x+(r.right-r.left))+'px';
    box.classList.remove(['ms-2','mt-2','mb-2','me-2']);
    box.classList.add('ms-2');
}
Tour.position_tooltip_left = function(element){
    var box = document.querySelector('tour-tooltip');

    var r = element.getBoundingClientRect();
    var r2 = box.getBoundingClientRect('tour-tooltip');
    box.style.top = r.y+'px';
    box.style.left = (r.x-(r2.right-r2.left))+'px';
    box.classList.remove(['ms-2','mt-2','mb-2','me-2']);
    box.classList.add('me-2');
}
Tour.position_tooltip_top = function(element){
    var box = document.querySelector('tour-tooltip');

    var r = element.getBoundingClientRect();
    var r2 = box.getBoundingClientRect('tour-tooltip');
    
    box.style.top = (r.y-(r2.bottom-r2.top))+'px';
    box.style.left = r.x+'px';
    box.classList.remove(['ms-2','mt-2','mb-2','me-2']);
    box.classList.add('mb-2');
}
Tour.position_tooltip_bottom = function(element){
    var box = document.querySelector('tour-tooltip');

    var r = element.getBoundingClientRect();
    box.style.top = (r.y+(r.bottom-r.top))+'px';
    box.style.left = r.x+'px';
    box.classList.remove(['ms-2','mt-2','mb-2','me-2']);
    box.classList.add('mt-2');
}

Tour.position_tooltip_inner = function(element){
    var box = document.querySelector('tour-tooltip');

    var r = element.getBoundingClientRect();
    var r2 = box.getBoundingClientRect('tour-tooltip');

    box.style.top = r.y+'px';
    box.style.left = (r.x+r.width-r2.width)+'px';
    box.classList.remove(['ms-2','mt-2','mb-2','me-2']);
    box.classList.add('me-2');
}

Tour.end = function(){
    this.step = 0;
    document.body.classList.remove('tour');
}
