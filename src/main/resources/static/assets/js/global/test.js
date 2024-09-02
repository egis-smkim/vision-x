var url='http://geo.dtwincloud.com/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap';


var param ='&layers='+encodeURIComponent('workspace_typhoon:al_00_d001_ctpsig');
    param +='&srs=EPSG%3A4326';
    param +='&format=image%2Fpng';
    param +="&info_format=application/json";
    param +="&exceptions=application%2Fvnd.ogc.se_inimage";					
    param +="&TRANSPARENT=true"
    param +="&HEIGHT=768";
    param +="&WIDTH=723";
    
    
var polygon = "MULTIPOLYGON (((6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913, 6293778.056688266 199999.99999999913)))";
var polygonURI = encodeURIComponent(polygon);

    param +="&cql_filter=INTERSECTS(geom,"+polygonURI+")";   

    var geoUrl = url+param;


//월파량 예측 공식
var g = 9.8; //중력가속도
var e = 2.71 //자연상수(?)
var hmo = 1.00 //유의파고 평상시 1, 너울성파도 2, 중형태풍 4, 대형태풍 6

var msl = 2.6 //평상시 2.6, 너울성파도 2.62, 중형태풍시 2.68, 대형태풍시 2.74
var heigth = 8.3 //마루 높이 -> 해발 고도(?)
var swl = 2.6 //조위

var msl = 0; // (?) 조위 + 2.42(?)

var L = 38.14 // 클릭한 라인 길이
var H = 1//(?)

var Sm = H/L;

var h = swl + 2.42; // (?)
var d = swl + 0.17; //(?)

var result = Math.pow(g,0.5)*(Math.pow(hmo,1.5))*()

var rubble_mound_bw = function(g,Hmo,swl,expNum,Rc,rf,rb){
    //경사형 방파제 월파량 산정
    //g 중력 가속도, Hmo 유의파고, swl 조위, expNum 자연 상수, Rc 해수면으로부터 호안 마루 높이 , rf 피복층 계수, rb 입사각 계수
    var q=0; //월파량
    
    //Rc 
    var expPow = function(Rc,Hmo,rf,rb){
        var result = Math.pow((1.35 * (Rc/(Hmo*rf*rb))),1.3);
        result= (-1) * result;
        return Math.round(result * 10) / 10;
    }

    Rc = 8.3 - swl;

    //Rc = 구조물의 높이 - (api 조위 데이터 / 2);

    var gs = Math.pow(g,0.5);
    var mw = Math.pow(Hmo,1.5);
    var powNum = expPow(Rc,Hmo,rf,rb); 

    q = gs*mw*0.1035*(Math.pow(expNum,powNum)) * 1000;

    var result = Math.round(q*1000) / 1000;

    return result;
}

var vertical_bw = function(g,Hmo,Rch,swl,lt){
    //직립형
    var q=0; //월파량
    //Hmo 유의파고
    //Sm 파형경사 H/l
    //Rc 호안마루 높이-SWL 
    
    var l=0; // 파봉으로부터 인접하는 파봉까지의 수평거리 L=CT 파장 = 파의 전파속도 * 파고 주기
    var d =0;
    var h=0;
    var msl =0;
    var Rc =0;
    var Sm =0;

    var H=0;

    if(swl==0){
        swl=2.60;
    }

    if(lt==0){
        l = 38.14;
        msl = 2.6;
        H=1;
    }else if(lt==1){
        l = 67.92;
        msl = 2.62;
        H=2;
    }else if(lt==2){
        l = 68.29;
        msl = 2.68;
        H=4;
    }else if(lt==3){
        l = 68.29;
        msl = 2.74;
        H=6;
    }else if(lt==4){
        //사용자 입력값
        l = parseFloat($("#").val());
        msl = parseFloat($("#").val());
    }

    Rc = Rch - swl;
    Rc = Math.round(Rc*100) / 100;
    
    h = swl + 2.42;
    d = swl + 0.17;

    Sm = H/l;
    //Sm = Math.round(Sm*1000)/1000;

    //Rc/Hm 값이 1.35 큰 경우 대형 태풍은 계산식 달라짐
    var calType = Rc/Hmo;
    calType = Math.round(calType*100)/100;
    
    console.log(calType);
    console.log('g :'+g+", Hmo : "+Hmo+", d : "+d+", h : "+h+", Sm : "+Sm+", Rc : "+Rc+", l : "+l);
    if(calType >= 1.35){
        //평상시, 소형, 중형
        q = (Math.pow(g,0.5) * Math.pow(Hmo,1.5) * 1.3 * Math.pow((d/h),0.5) * 0.0014 * Math.pow((Hmo/(h*Sm)),0.5) * Math.pow((Rc/Hmo),-3) ) * 1000;

    }else{
        //대형 태풍
        q= (Math.pow(g,0.5) * Math.pow(Hmo,1.5) * 1.3 * Math.pow((d/h),0.5) * 0.011 * Math.pow((Hmo/(h*Sm)),0.5) * Math.pow(2.71,(-2.2*Rc/Hmo)) ) * 1000;
    }

    q = Math.round(q*10000)/10000;

    return q;
}

var getSWL = function(){

}
