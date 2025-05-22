const Tour = {
    tourId: '',
    step:0,
    resizeObserver: new ResizeObserver(()=>{Tour.set_mask();}),

};

Tour.start = function(tourId,startStep = 1){
    Tour.tourId = tourId;
    document.body.classList.add('tour');
    Tour.create_pagination();
    //this.list = Array.from(document.querySelectorAll('[data-tour-step]'));
    //console.log(this.list);
    Tour.set_step(startStep);
}

Tour.create_pagination = function(){
    var list = Array.from(document.querySelectorAll(`[data-tour-id="${this.tourId}"]:not(tour-data)`));
    document.querySelectorAll('tour-tooltip .tooltip-footer ul .page-item:not(:first-child):not(:last-child)').forEach(function(element){element.remove();});
    var pre_button = document.querySelector('tour-tooltip .tooltip-footer ul .page-item:last-child');
    for(let i = 0 ; i< list.length ;i++){
        //                    <li class="page-item"><button class="page-link" href="#">1</button></li>

        var li = document.createElement('li');
        li.classList.add('page-item');
        var button = document.createElement('button');
        button.classList.add('page-link');
        button.textContent = i+1;
        li.append(button);
        button.onclick = ()=>{
            Tour.set_step(i+1)
        };

        pre_button.before(li);
    }
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
    Tour.set_pagination_step();
}
Tour.set_pagination_step = function(){
    var numbers = Array.from(document.querySelectorAll('tour-tooltip .tooltip-footer ul .page-item:not(:first-child):not(:last-child)'));
    
    for(var n in numbers){
        if(Math.abs(Number(this.step)-n-1)>2){
            numbers[n].classList.add('d-none');
        }else{
            numbers[n].classList.remove('d-none');
        }
        if((Number(n)+1)==Number(this.step)){

            numbers[n].classList.add('active');
        }else{
            numbers[n].classList.remove('active');
        }
    }

}

Tour.get_step_element = function(){
    var tourselector="";
    if(this.tourId!=''){
        tourselector = `[data-tour-id="${this.tourId}"]`;
    }
    return  document.querySelector(`${tourselector}[data-tour-step="${this.step}"]`);
}
Tour.get_step_data = function(){
    var tourselector="";
    if(this.tourId!=''){
        tourselector = `[data-tour-id="${this.tourId}"]`;
    }
    return document.querySelector(`tour-data${tourselector}[data-tour-step="${this.step}"]`);
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

    //var data = document.querySelector(`[data-tour-step="${this.step}"]+tour-data`);
    var data = Tour.get_step_data();
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
