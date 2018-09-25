var cleaned_data = [];
var names = [];
var zoom = 1;
var empties = [];
var x = true;
var max_countries_absolute = [];
var min_countries_absolute = [];
var max_countries_relative = [];
var min_countries_absolute = [];
var background_diagram;
var algeria;
var Japan;
var Uganda;
var South_Africa;
var Kenya;
var Thailand;
var Turkey;
var Phillippines;
var Ethiopia;
var Mexico;
var Bangladesh;
var Brazil;
var United_States;
var Pakistan;
var Indonesia;
var China;
var India;
var flags = [];
var sorted = false;
var slider;




function preload(){

  earth_img = loadImage("https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/0,0,1,0/1024x512?access_token=pk.eyJ1IjoiYW5keWR1a2UiLCJhIjoiY2ptMzhvOXU3MHAxMDNrbXU3YWx0anZrOSJ9.G6VCejIJhAQp9RjLy_TSAQ");
  population = loadStrings("Bevoelkerung_Data.csv");
  test = loadStrings("https://opendata.socrata.com/resource/mnkm-8ram.csv");
  background_diagram = loadImage("New_York.1.jpg");
  algeria = loadImage("Countries_Flags/algeria.gif");
  flags[0]=algeria;
  Japan = loadImage("Countries_Flags/japan.gif");
  flags[1]=new Country_Flags("Japan",Japan);
  Uganda = loadImage("Countries_Flags/uganda.gif");
    flags[2]=new Country_Flags("Uganda",Uganda);
  South_Africa=loadImage("Countries_Flags/south_africa.gif");
  flags[3]=new Country_Flags("South Africa",South_Africa);
  Kenya = loadImage("Countries_Flags/kenya.gif");
  flags[4]=new Country_Flags("Kenya",Kenya);
  Thailand = loadImage("Countries_Flags/thailand.gif");
  flags[5]=new Country_Flags("Thailand",Thailand);
  Turkey = loadImage("Countries_Flags/turkey.gif");
  flags[6]=new Country_Flags("Turkey",Turkey);
  Philippines=loadImage("Countries_Flags/philippines.gif");
  flags[7]=new Country_Flags("Philippines",Philippines);
  Mexico=loadImage("Countries_Flags/mexico.gif");
  flags[8]=new Country_Flags("Mexico",Mexico);
  Bangladesh=loadImage("Countries_Flags/bangladesh.gif");
  flags[9]=new Country_Flags("Bangladesh",Bangladesh);
  Brazil=loadImage("Countries_Flags/brazil.gif");
  flags[10]=new Country_Flags("Brazil",Brazil);
  United_States=loadImage("Countries_Flags/united_states_of_america.gif");
  flags[11]=new Country_Flags("United States",United_States);
  Pakistan=loadImage("Countries_Flags/pakistan.gif");
  flags[12]=new Country_Flags("Pakistan",Pakistan);
  Indonesia=loadImage("Countries_Flags/indonesia.gif");
  flags[13]=new Country_Flags("Indonesia",Indonesia);
  China=loadImage("Countries_Flags/china.gif");
  flags[14]=new Country_Flags("China",China);
  India=loadImage("Countries_Flags/india.gif");
  flags[15]=new Country_Flags("India",India);
  Ethiopia = loadImage("Countries_Flags/ethiopia.gif");
  flags[16]=new Country_Flags("Ethiopia",Ethiopia);
}


function Country_Flags(name,flag){
  this.name=name;
  this.flag=flag;
}

function Country(name,long,lang,population_1960,population_2017){
  this.name = name;
  this.long = long;
  this.lang = lang;
  this.population_1960 = population_1960;
  this.population_2017 = population_2017;
  this.relative_change = (this.population_2017-this.population_1960)/this.population_1960;
  this.absolute_change = this.population_2017-this.population_1960;
}

function Countries_data(name,relative_change,absolute_change,population_1960,population_2017){
  this.name = name;
  this.relative_change = relative_change;
  this.absolute_change = absolute_change;
  this.population_1960 = population_1960;
  this.population_2017 = population_2017;
}

function setup(){
  var download = document.getElementById("download");
  var button = document.getElementById("absolute_change");
  slider = createSlider(0,198,100);
  slider.position(250,50);
  slider.style("width","80px");

  button.onclick= function(){
    if(x===false){
        slider.position(250,50);
      x=true;
    }
    else{
      x=false;
      slider.position(-20,-20);
        loop();
    }
  }
  createCanvas(1024,512);
  translate(width / 2, height / 2);
  imageMode(CENTER);
  image(earth_img,0,0);
}

function draw(){
  var cx = mercX(0);
  var cy = mercY(0);
  var val = slider.value();
  document.getElementById("number_of_countries").innerHTML="Number of Countries shown: "+val;
  translate(width / 2, height / 2);
  imageMode(CENTER);
  image(earth_img,0,0);

  function create_data(){
    for(i=0;i<test.length;i++){
      var data_geo = test[i].split(",");
      for(j=1;j<test.length;j++){
        var data_population = population[j].split(",");

      if(data_geo[0]==data_population[3]){

        cleaned_data[i] = new Country(data_geo[0],data_geo[4],data_geo[5],data_population[5],data_population[6]);
      }
    }
  }

  }
  function cleaning(){
    for(i=0;i<cleaned_data.length;i++){
      if(cleaned_data[i]===undefined){
        empties.push(cleaned_data[i]);
        cleaned_data.splice(i,1);
      }
    }
  }

  function mercX(lon) {
    lon = radians(lon);
    var a = (256 / PI) * pow(2, zoom);
    var b = lon + PI;
    return a * b;
  }

  function mercY(lat) {
    lat = radians(lat);
    var a = (256 / PI) * pow(2, zoom);
    var b = tan(PI / 4 + lat / 2);
    var c = PI - log(b);
    return a * c;
  }

  function draw_relative_population(array){
    var max = 0;
    var min = 0;
    var min_country ="";
    var country = "";
    array.sort(function(a,b){
        return b.relative_change-a.relative_change;
      });
    for(i=0;i<array.length;i++){
      if(i>=val){
        break;
      }
        var dataset= array[i];
        if(dataset===undefined){
          continue
        }
        else{
          var lat = dataset.long;
          var long = dataset.lang;
          var x = mercX(long)-cx;
          var y = mercY(lat)-cy;
          var d = dataset.relative_change;
          if(d>max){
            max=d;
            country = dataset.name;
          }
          if(d<0){
            var betrag = d*(-1);
            var f = map(betrag,0,0.10059048927888772,0,100,true);
            if(d<min){
              min = d;
              min_country=dataset.name;
            }
          }
          else{
            var e = map(d,0,100.47618584968802,0,100,true);
            fill(0);
            strokeWeight(2);
            textSize(10);
            var percent = dataset.relative_change*100;
            percent = percent.toString().split("");
            var percentage ="";
            for(a=0;a<percent.length;a++){
              if(percent[a]==="."){
              break;
              }
              percentage += percent[a];
            }
              text(percentage+"%",x-5,y-e);
              fill(200,100,100,200);
              rect(x-5,y-e,5,e);
          }
        }

    }

  }
  function sort_Countries(array){
    var dataset;
    for(i=0;i<array.length;i++){
      dataset=array[i];
      if(dataset===undefined){
        continue
      }
      max_countries_absolute[i] = new Countries_data(dataset.name,dataset.relative_change,dataset.absolute_change,dataset.population_1960,dataset.population_2017);
      min_countries_absolute[i] = new Countries_data(dataset.name,dataset.relative_change,dataset.absolute_change);

    }
  max_countries_absolute.sort(function(a,b){
      return b.absolute_change-a.absolute_change;
    });
    min_countries_absolute.sort(function(a,b){
      return a.absolute_change-b.absolute_change;
    });

    while(max_countries_absolute.length>15){
      max_countries_absolute.pop();
    }
    max_countries_absolute.sort(function(a,b){
      return a.absolute_change-b.absolute_change;
    })
    while(min_countries_absolute.length>15){
      min_countries_absolute.pop();
    }
  }

  function countries_information(x,y,w,h,n,b,e,r,a){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.name=n,
    this.population_1960=b;
    this.population_2017=e;
    this.relative_change = r;
    this.absolute_change=a;
    var Population_in_1960 = [];
    var Population_in_2017 = [];
    var Pop_1960 = this.population_1960.toString().split("").reverse();
    var counter = 0;
    for(j=0;j<Pop_1960.length;j++){
      if(counter%3===0&&j!==0){
          Population_in_1960.push(",");
        }
        Population_in_1960.push(Pop_1960[j]);
        counter++;
    }
    this.population_1960 = Population_in_1960.reverse().join("");

    var Pop_2017 = this.population_2017.toString().split("").reverse();
    var counter_2 = 0;
    for(a=0;a<Pop_2017.length;a++){
      if(counter_2%3===0&&a!==0){
        Population_in_2017.push(",");
      }
      Population_in_2017.push(Pop_2017[a]);
      counter_2++;
    }
    this.population_2017=Population_in_2017.reverse().join("");
    this.relative_change = this.relative_change*100;
    var rounded_relative_change = this.relative_change.toString().split("");
    while(rounded_relative_change.length>5){
      rounded_relative_change.pop();
    }

    this.relative_change=rounded_relative_change.join("")+("%");
  }
  function draw_diagram(){
    for(i=0;i<countries_diagrams.length;i++){
      if(countries_diagrams[i].x<mouseX && countries_diagrams[i].x+countries_diagrams[i].w>mouseX && mouseY>countries_diagrams[i].y && mouseY<height){
        fill(0);
        strokeWeight(4);
        for(j=0;j<flags.length;j++){
          if(countries_diagrams[i].name===flags[j].name){
            image(flags[j].flag,150,150,297,297);
          }
        }
        fill(255,255,255,60);
        rect(0,0,300,300);
        fill(30);
        textSize(16);
        text(countries_diagrams[i].name,10,40);
        text("Population in 1960: "+countries_diagrams[i].population_1960,10,80);
        text("Population in 2017: "+countries_diagrams[i].population_2017,10,130);
        text("Absolute Increase: "+countries_diagrams[i].absolute_change,10,180);
        text("Relative Increase: "+countries_diagrams[i].relative_change,10,230);

      }
    }
}
  countries_diagrams = [];
  function max_countries_diagram(){
    translate(-width/2,-height/2);
    var all_final_numbers = [];
    var y_coordinate;
      var x_coordinate;
      var rect_width;
      var rect_height;
    for(i=0;i<max_countries_absolute.length;i++){
      var country = max_countries_absolute[i];
      var x = width/max_countries_absolute.length;
      var y = map(country.absolute_change,32988839,889699519,100,height-100,true);
       y_coordinate = height-y;
       x_coordinate = x*i+5;
       rect_width = x-10;
       rect_height = y;

      strokeWeight(3);
      if(i<5){
        fill(200,50,0);
      }
      if(i>=5&&i<10){
        fill(0,200,0);
      }
      if(i>=10){
        fill(100,0,200);
      }
      if(i===0){
        x_coordinate=5;
        rect(x_coordinate,y_coordinate,rect_width,rect_height);
      }
      else{
        rect(x_coordinate,y_coordinate,rect_width,rect_height);
      }

      fill(0);
      textSize(8);
      textStyle(BOLD);
        text(country.name,x*i+12,height-50);
      var absolut = country.absolute_change;
      absolut = absolut.toString().split("").reverse();
      var absolut_number = [];
      var counter = 0;
      var final_number;
      for(j=0;j<absolut.length;j++){

        if(counter%3===0 && j!==0){
              absolut_number.push(",");
        }
        absolut_number.push(absolut[j]);
        counter++;
      }
      final_number=absolut_number.reverse().join("");
      all_final_numbers.push(final_number);
      text(final_number,x*i+14,height-y+10);
      countries_diagrams[i] = new countries_information(x_coordinate,y_coordinate,rect_width,rect_height,country.name,country.population_1960,country.population_2017,country.relative_change,final_number);
    }
  }

  if(x===true){
    if(sorted===false){
      //Show the Worldmap
      create_data();
      cleaning();
      sort_Countries(cleaned_data);
      sorted=true;
    }
    draw_relative_population(cleaned_data);
  }
  else{
    //Show the diagram
   image(background_diagram,0,0);
   max_countries_diagram();
   draw_diagram();
  document.getElementById("number_of_countries").innerHTML="";
}
}
