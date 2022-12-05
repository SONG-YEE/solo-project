///////////////////////////////////////
// 1. 지도 생성 & 확대 축소 컨트롤러 //
///////////////////////////////////////

let container = document.getElementById("map"); // 지도를 담을 영역의 DOM 레퍼런스
let options = {
    // 지도를 생성할 때 필요한 기본 옵션
    center : new kakao.maps.LatLng(37.566353, 126.977953), // 지도의 중심좌표.
    level  : 8                                              // 지도의 레벨(확대, 축소 정도)

};

let map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

// 지도 확대 축소 줌 컨트롤 생성
let zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);





/////////////////////////////////////////////////////
// 2. 더미 데이터 준비 (제목, 주소, url, 카테고리) //
////////////////////////////////////////////////////

async function getDataSet(category) {
	let qs = category;
	if(!qs) {
		qs = "";

	}

	const dataSet = await axios({
		method 	: "get",									// http method
		url	   	:  url + `/restaurants?category=${qs}`,
	//  url	   	: `http://localhost:3000/restaurants?category=${qs}`,
		headers : {},										// packet header
		data	: {}										// packet body

	});
	
	return dataSet.data.result;

}

getDataSet();





//////////////////
// 3. 마커 찍기 //
//////////////////

// 주소-좌표 변환 객체 생성
let geocoder = new kakao.maps.services.Geocoder();


//주소-좌표 변환 함수
function getCoordsByAddress(address) {

	return new Promise((resolve, reject) => {
		
        // 주소로 좌표 검색
		geocoder.addressSearch(address, function(result, status) {
		
			// 정상적으로 검색이 완료됐으면 
			 if(status === kakao.maps.services.Status.OK) {
				let coords = new kakao.maps.LatLng(result[0].y, result[0].x);
				resolve(coords);
				
                return;

			} 

            // 검색 에러
			reject(new Error("getCoordsByAddress Error : not Vaild Address"));

		});		

	});

}





/////////////////////////////////
// 4. 마커에 윈포윈도우 붙이기 //
/////////////////////////////////

function getContent(data) {

	//유튭 썸네일 id 가져오기
	let replaceUrl = data.videoUrl;
	let finUrl = "";
	replaceUrl = replaceUrl.replace("https://youtu.be/", "");
	replaceUrl = replaceUrl.replace("https://www.youtube.com/embed/", "");
	replaceUrl = replaceUrl.replace("https://www.youtube.com/watch?v=", "");
	finUrl = replaceUrl.split("&")[0];


	//인포윈도우 가공하기
	return `
		<div class="infowindow">
			<div class="infowindow-img-container">
                <img
                    src="https://img.youtube.com/vi/${finUrl}/mqdefault.jpg" 
                    class="infowindow-img"
                />
			</div>
			<div class="infowindow-body">
				<h5 class="infowindow-title">${data.title}</h5>
				<p class="infowindow-address">${data.address}</p>
				<a href="${data.videoUrl}" class="infowindow-btn" target="_blank">영상이동</a>
			</div>
		</div>
    `;

}

async function setMap(dataSet) {

    markerArray 	 = [];
    infowindowArray  = [];

	for(let i = 0; i < dataSet.length; i++) {
		
		let coords = await getCoordsByAddress(dataSet[i].address);
		let marker = new kakao.maps.Marker({
			map : map, position : coords    // map      : 마커 표시할 지도
                                            // position : 마커 표시할 위치
		});

		markerArray.push(marker);

		 // 마커에 표시할 인포윈도우 생성 
		 let infowindow = new kakao.maps.InfoWindow({
			content : getContent(dataSet[i])  // 인포윈도우에 표시할 내용

		});
	
		infowindowArray.push(infowindow);

		// 마커에 mouseover, mouseout 등록
		// 클로저를 만들어서 등록 
		// for문이 끝나면 마지막 마커에만 이벤트 등록
		kakao.maps.event.addListener(marker, "click", makeOverListener(map, marker, infowindow, coords));
		kakao.maps.event.addListener(map, "click", makeOutListener(infowindow));

	}

}


// 인포윈도우를 표시하는 클로저
function makeOverListener(map, marker, infowindow, coords) {

    return function() {
		// 1. 클릭시 원래 열려있는 인포윈도우는 닫기
		closeInfoWindow();
        infowindow.open(map, marker);
		// 2. 클릭한 곳으로 지도 중심 옮기기
		map.panTo(coords);

    };

}

let infowindowArray = [];
function closeInfoWindow() {

	for(let infowindow of infowindowArray) {
		infowindow.close();

	}

}


// 인포윈도우를 닫는 클로저
function makeOutListener(infowindow) {

    return function() {
        infowindow.close();
    
    };

}





//////////////////////
// 5. 카테고리 분류 //
//////////////////////

// 카테고리
const categoryMap = {
	korea   : "한식",
	china   : "중식",
	japan   : "일식",
	america : "양식",
	wheat   : "분식",
	meat    : "구이",
	sushi   : "회/초밥",
	etc     : "기타"

};

const categoryList = document.querySelector(".category-list");
categoryList.addEventListener("click", categoryHandler);

async function categoryHandler(event) {

	const categoryId = event.target.id;
	const category 	 = categoryMap[categoryId];

	try {
		// 데이터 분류
		let categorizedDataSet = await getDataSet(category);
	
		// 기존 마커 삭제
		closeMarker();
	
		//기존 인포윈도우 닫기
		closeInfoWindow();
	
		setMap(categorizedDataSet);
		
	} catch(error) {
		console.error(error);

	}

}

let markerArray = [];
function closeMarker() {

	for(marker of markerArray) {
		marker.setMap(null);

	}

}

async function setting() {

	try {
		const dataSet = await getDataSet();
		setMap(dataSet);

	} catch (error) {
		console.error(error);

	}
    
}

setting();