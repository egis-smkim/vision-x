/**
 * 
 */
var timerRemainId = null;
var timer = null;
var sessionExpiry = null;
var clientTimeOffset = null;
	
onmessage = function (e) {
	if (e.data === "start") {
		setTimeOffsetBetweenServerAndClient();
	}
	if (typeof e.data === 'object' && Object.keys(e.data).includes('timerNum')) {
		checkSessionRemainTime(e.data.timerNum);	
		timer = setInterval(function(){	
			if(!isSessionExpired(60*1000)){   	 	
				onClickTimeExtension();
			 }
		},10000);
	}
	if (e.data === "extension") {
		onClickTimeExtension();
	}
	if(typeof e.data === 'object' && Object.keys(e.data).includes('sessionExpiry')){
		sessionExpiry = e.data.sessionExpiry;
		clientTimeOffset = e.data.clientTimeOffset;
		checkSessionTimeout();
	}
}

function getCookie(cookieName){
	var x, y;
	var val = document.cookie.split(';');
	
	for (var i = 0; i < val.length; i++) {
		x = val[i].substr(0, val[i].indexOf('='));
		y = val[i].substr(val[i].indexOf('=') + 1);
		x = x.replace(/^\s+|\s+$/g, '');
		if (x == cookieName) {
		  return unescape(y);
		}
	}
}


function setTimeOffsetBetweenServerAndClient() {
	var latestTouch;
	
	var xhr;
    try {
        xhr = new XMLHttpRequest();
        xhr.open('POST', '/member/sessionCheck.do', false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var result = JSON.parse(xhr.responseText);
                latestTouch = result.latestTouch;
            }
        }; 
        xhr.send();
    } catch (e) {
        console.log('Error'+e.message);
    }
	
	latestTouch = latestTouch==null ? null : Math.abs(latestTouch);
	var clientTime = (new Date()).getTime();
	clientTimeOffset = clientTime - latestTouch;
	//setCookie('clientTimeOffset', clientTimeOffset);
	postMessage({"setCookie":{"clientTimeOffset":clientTimeOffset}});
}

function isSessionExpired(offset){

	var timeOffset = Math.abs(clientTimeOffset);
	 var localTime = (new Date()).getTime();
	 var accessedTime = sessionExpiry - (localTime - timeOffset);
	 //setCookie('remainTime',accessedTime);
	postMessage({"setCookie":{"remainTime":accessedTime}});
	 var minutes = new Date(accessedTime).getMinutes()+"";
	var seconds = new Date(accessedTime).getSeconds()+"";
	 seconds = (minutes * 60) + (seconds * 1);
	if(minutes.length == 1) minutes = "0"+minutes;
	if(seconds.length == 1) seconds = "0"+seconds;
	//$("#remainTime").text(minutes+":"+seconds);
	//document.getElementById('eg-remainTime').innerText = seconds;
	postMessage(seconds);
	if(accessedTime <= 0){
		//document.getElementById('eg-remainTime').innerText = 0;
		clearTimeout(timerRemainId);
		clearTimeout(timer);
		postMessage("sessionExpired");
		//D_MEMBER.TIMEOUT.checkSessionExpired();
	}
	
	return localTime - clientTimeOffset > (sessionExpiry-(offset||0));
	
}

function checkSessionTimeout(){
	var isTimeout = isSessionExpired(60*1000);  //세션만료예정시간을 60초 앞당겨서 검사
	if(isTimeout === true){	
		//$('#sessionModal').modal('show');
		//document.getElementById('sessionModal').style.display = "block";
		postMessage("modalShow");
	}  else {
		setTimeout('postMessage("sessionCheck");', 10*1000);
	}
}

function checkSessionRemainTime(number){
	var seconds = number - 1;

	postMessage(seconds);
	if(seconds > 0){
		timerRemainId = setTimeout('checkSessionRemainTime('+seconds+')', 1000);
	}else {
		clearTimeout(timerRemainId);
		//D_MEMBER.TIMEOUT.checkSessionExpired();
		postMessage("sessionExpired");
	}

}

function onClickTimeExtension(){
	var xhr;
    try {
        xhr = new XMLHttpRequest();
        xhr.open('POST', '/member/sessionRefresh.do', false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
				clearInterval(timer);
				clearTimeout(timerRemainId);
				postMessage("sessionCheck");
            }
        }; 
        xhr.send();
    } catch (e) {
        console.log('Error'+e.message);
    }
}
