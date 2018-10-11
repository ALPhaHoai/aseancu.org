// var base = window.location.protocol + "://" + window.location.host;
var hisSeqno = 0;
getHisSeqno();

var learnTimeSum = 0;
var tocEdTime = 0;//Thời lượng của video
getViewerTopicItemAjaxList();
if(!isNumber(learnTimeSum)) learnTimeSum = 0;

var learnTime = 0;

if (typeof lectureSeqno === 'undefined') {
    var lectureSeqno = getPath("lectureSeqno");
}
if (typeof wsSeqno === 'undefined') {
    var wsSeqno = getPath("wsSeqno");
}
if (typeof tocSeqno === 'undefined') {
    var tocSeqno = getPath("tocSeqno");
}

console.log("lectureSeqno: " + lectureSeqno);
console.log("wsSeqno: " + wsSeqno);
console.log("tocSeqno: " + tocSeqno);

function getPath(name){
	var pieces = window.location.href.split("=");
	for (let i = 0; i < pieces.length; i++) {
		if(pieces[i].endsWith(name)) {
			return pieces[i+1].split("&")[0];
		}
	}
	return null;
}


function isNumber(str) {
    return /^\d+$/.test(str);
}
// getHisSeqno();
// run();

function run(){
let min = 0;
while(++min <= (tocEdTime/60 + 2)){//Mỗi bài được chia làm nhiều phần 60 giây
	learnTimeSum = learnTimeSum + 59;
	learnTime = learnTime + 59;

	let data = new FormData();
	data.append('lectureSeqno', lectureSeqno);
	data.append('wsSeqno', wsSeqno);
	data.append('tocSeqno', tocSeqno);
	data.append('saveMode', '1');

let sumData = '{"NUM":0,"DATA":{"tocSeqno":"'+tocSeqno+'","learnTimeSum":'+learnTimeSum+',"pobtYn":"N","pobtDttm":null}}';
console.log("sumData : " + sumData);

let hisData = '{"NUM":0,"DATA":{"tocSeqno":"'+tocSeqno+'","learnTime":'+learnTime+',"deviceGb":"01","viewerRunYn":"Y","learnHisTypeGb":"01","hisSeqno":"'+hisSeqno+'"}}';
console.log("hisData : " + hisData);

	data.append('sumData', sumData);
	data.append('hisData', hisData);

	data.append('deviceGb', '01');

	let http = new XMLHttpRequest;
	http.open('POST', '/lms/lecture/classroom/saveRuntimeData.a170y.acu', false);//Asynchronous request, browser chờ cho tới khi nhận được response
	http.onreadystatechange = function(){
	    if(http.readyState == 4 && http.status == 200){
	    	console.log("Done: " + http.responseText);
	    } else console.log("Error: " + http.responseText);
	}
	http.send(data);
}
console.log("Done");
}

function getHisSeqno(){
let data = new FormData();
data.append('lectureSeqno', lectureSeqno);
data.append('wsSeqno', wsSeqno);
data.append('tocSeqno', tocSeqno);
data.append('learnTimeSum', '0');
data.append('learnHisTypeGb', '01');
data.append('deviceGb', '01');
data.append('viewerRunYn', 'Y');

let http = new XMLHttpRequest;
http.open('POST', '/lms/lecture/classroom/insertLmsMbrTocRelHis.a170y.acu');
http.onreadystatechange = function(){
    if(http.readyState == 4 && http.status == 200){
    	hisSeqno = parseInt(JSON.parse(http.responseText).hisSeqno);
    	console.log("hisSeqno: " + hisSeqno);

    }
}
http.send(data);

}


function getViewerTopicItemAjaxList(){//http://www.aseancu.org/lms/lecture/classroom/getViewerTopicItemAjaxList.a999n.acu
let data = new FormData();
data.append('lectureSeqno', lectureSeqno);
data.append('wsSeqno', wsSeqno);
data.append('tocSeqno', tocSeqno);

let http = new XMLHttpRequest;
http.open('POST', '/lms/lecture/classroom/getViewerTopicItemAjaxList.a999n.acu');
http.onreadystatechange = function(){
    if(http.readyState == 4 && http.status == 200){
    	let JSON_Object = JSON.parse(http.responseText).itemList;
    	for(let j = 0; j < JSON_Object.length; j++){
    		let itemList = JSON_Object[j];
    		learnTimeSum = parseInt(itemList.learnTimeSum);
    		tocEdTime = parseInt(itemList.tocEdTime);
			if(isNumber(learnTimeSum) && isNumber(tocEdTime) && tocEdTime > 0){
			    console.log("learnTimeSum :" + learnTimeSum);
			    console.log("tocEdTime :" + tocEdTime);
			    break;
			}
    	}
    }
}
http.send(data);

}

