/**
 * SUBJECT : 도시계획 -> 건물편집 객체 AUTHOR : 윤수민 COMMENT : 종료시 관련 이벤트 모두 해제되어야함.
 */

var M_EDITBUILDING = {

	/* constant */
	CONTROLLER_URL : "http://192.168.1.8:8080/digitalTwin",

	/* variables(private) */
	buildingManager : null, // API 호출 객체(JSBuildingManager)
	mapAPI : null,

	mouseState : "none", // 건물 편집 마우스 컨트롤 상태 (none, add, edit, delete)

	isLibraryInit : false, // 라이브러리 초기화
	isActive : false, // 모듈 활성화 상태
	isMouseClickDown : false, // 마우스가 지도 위에서 눌려진 상태

	/* data */
	libraryInfo : {}, // 등록 라이브러리 정보
	selectLibraryInfo : null, // 선택 된 라이브러리 정보

	projectInfo : {}, // 저장 프로젝트 정보
	currentProjectInfo : null, // 로드 된 프로젝트 정보

	/* delete real3d info */
	deleteReal3dInfo : [], // 삭제한 real3d 타일 건물 정보

	/* functions */
	// 초기화
	init : function() {

		console.log("init")

		if (this.buildingManager == null) {
			this.buildingManager = Module.GetBuildingManager();
		}

		if (this.mapAPI == null) {
			this.mapAPI = Module.getMap();
		}

		// 필요 스크립트 로드
		this.initReferenceScript([ {
			src : "./assets/js/module/M_EDITBUILDING_LIB/XDViewer.js",
			onload : function() {
				XDViewer.canvas.style.display = "none";
				XDViewer.resize(128, 128);
				XDViewer.camera.zoom(3000);

				// 디버그용 sumin 200915
				// XDViewer.canvas.style.display = "block";
				// document.body.append(XDViewer.canvas);
			}
		} ]);

		this.initLibrary();
		this.initProject();
		this.initEvent();

		this.buildingManager.SetActiveLibrary(true);
		this.isActive = true;

		// 기본 마우스 State는 객체 선택 상태
		Module.XDSetMouseState(Module.MML_SELECT_POINT);
	},

	// 종료
	destory : function() {

		this.destoryEvent();
		this.displayEditInterface(false);

		this.buildingManager.SetActiveLibrary(false);
		this.isActive = false;

		Module.XDSetMouseState(Module.MML_MOVE_GRAB);
	},

	/**
	 * 이벤트
	 * *******************************************************************************
	 */
	// 마우스 Down
	onMouseDown : function(e) {

		M_EDITBUILDING.isMouseClickDown = true;
	},

	// 마우스 Move
	onMouseMove : function(e) {

		// 마우스 버튼이 눌려진 상태면(드래그 중이면)
		if (this.isMouseClickDown) {

			// 선택 된 오브젝트의 화면 상 위치를 찾는다
			var screenPosition = this.getSelectedLibraryObjectScreenPosition();
			if (screenPosition == null) {
				return;
			}

			var selectedObjectType = this.getSelectedLibraryObjectType();
			if (selectedObjectType == 'real3d') {

				// Real3d 타일 객체
				this.setTileObjectOptionInterfacePosition(screenPosition.x,
						screenPosition.y);

			} else if (selectedObjectType == 'library') {

				// 오브젝트 위에 모델 이동 인터페이스가 올라오도록 위치를 재조정한다
				this.setEditModelInterfacePosition(screenPosition.x,
						screenPosition.y);

				Module.XDRenderData();
			}
		}
	},

	// 마우스 Up
	onMouseUp : function(e) {

		this.isMouseClickDown = false;

		// 선택 된 오브젝트의 화면 상 위치를 찾는다
		var screenPosition = this.getSelectedLibraryObjectScreenPosition();
		if (screenPosition == null) {

			// 선택 된 객체가 없으면 건물 편집 인터페이스를 끈다
			document.getElementById("editModelInterface").style.display = "none";
			document.getElementById("tileObjectOptionInterface").style.display = "none";
			return;

		} else {

			// 선택한 건물이 Real3d 타일 객체인지 건물 편집으로 추가한 객체인지 판별
			var selectedObjectType = this.getSelectedLibraryObjectType();

			if (selectedObjectType == 'real3d') {

				// Real3d 타일 객체
				this.setTileObjectOptionInterfacePosition(screenPosition.x,
						screenPosition.y);
				document.getElementById("tileObjectOptionInterface").style.display = "block";

				// 건물 편집 인터페이스는 끈다
				document.getElementById("editModelInterface").style.display = "none";

				this.setMouseState('edit');

				return;

			} else if (selectedObjectType == 'library') {

				// 건물 편집으로 추가한 건물. 오브젝트 위에 모델 이동 인터페이스가 올라오도록 위치를 재조정한다
				this.setEditModelInterfacePosition(screenPosition.x,
						screenPosition.y);
				document.getElementById("editModelInterface").style.display = "block";

				// 타일 오브젝트(real3d) 인터페이스는 끈다
				document.getElementById("tileObjectOptionInterface").style.display = "none";

				this.setMouseState('edit');

			} else {
				return;
			}
		}
	},

	// 마우스 Wheel
	onMouseWheel : function(e) {

		// 마우스 휠로 지도가 줌 인, 아웃 중일 때는 인터페이스를 숨긴다
		document.getElementById("editModelInterface").style.display = "none";
		document.getElementById("tileObjectOptionInterface").style.display = "none";

		setTimeout(
				function() {

					// 선택 된 오브젝트의 화면 상 위치를 찾는다
					var screenPosition = M_EDITBUILDING
							.getSelectedLibraryObjectScreenPosition();
					if (screenPosition == null) {
						return;
					}

					var selectedObjectType = M_EDITBUILDING
							.getSelectedLibraryObjectType();

					if (selectedObjectType == 'real3d') {

						M_EDITBUILDING.setTileObjectOptionInterfacePosition(
								screenPosition.x, screenPosition.y);
						document.getElementById("tileObjectOptionInterface").style.display = "block";

					} else if (selectedObjectType == 'library') {

						// 오브젝트 위에 모델 이동 인터페이스가 올라오도록 위치를 재조정한다
						M_EDITBUILDING.setEditModelInterfacePosition(
								screenPosition.x, screenPosition.y);
						document.getElementById("editModelInterface").style.display = "block";
					}

				}, 500);
	},

	// 이벤트 리셋
	initEvent : function() {

		// 인터페이스 이벤트 설정
		$("#editModelMove").mousedown(function() {
			M_EDITBUILDING.buildingManager.SetMoveOperation(true);
		});
		$("#editModelMove").mouseup(function() {
			M_EDITBUILDING.buildingManager.SetMoveOperation(false);
		});
		$("#editModelInterface").mousemove(
				function(e) {

					if (M_EDITBUILDING.buildingManager.GetMoveOperation()) {

						var screenPosition = M_EDITBUILDING
								.getSelectedLibraryObjectScreenPosition();
						M_EDITBUILDING.setEditModelInterfacePosition(
								screenPosition.x, screenPosition.y);
					}
				});

		// 엔진 이벤트 설정
		canvas.addEventListener("Fire_EventRegistLibrary",
				M_EDITBUILDING.Fire_EventRegistLibrary);

		// 지도 canvas 이벤트 설정
		canvas.onmousedown = function(e) {
			M_EDITBUILDING.onMouseDown(e);
		};
		canvas.onmouseup = function(e) {
			M_EDITBUILDING.onMouseUp(e);
		};
		canvas.onmousemove = function(e) {
			M_EDITBUILDING.onMouseMove(e);
		};
		canvas.onmousewheel = function(e) {
			M_EDITBUILDING.onMouseWheel(e);
		};

	},

	// 이벤트 삭제
	destoryEvent : function() {

		canvas.removeEventListener("Fire_EventRegistLibrary",
				M_EDITBUILDING.Fire_EventRegistLibrary);

		// 지도 canvas 이벤트 해제
		canvas.onmousedown = null;
		canvas.onmouseup = null;
		canvas.onmousemove = null;
		canvas.onmousewheel = null;
	},

	// 엔진 내 라이브러리 모델 등록 완료 이벤트
	Fire_EventRegistLibrary : function(e) {

		var libraryInfo = M_EDITBUILDING.libraryInfo[e.libraryKey];
		if (libraryInfo == null) {
			return;
		}

		if (libraryInfo.model_type == 'U') {

			M_EDITBUILDING.buildingManager
					.SetLibraryTexture(
							libraryInfo.mlid.toString(),
							M_EDITBUILDING.CONTROLLER_URL
									+ "/moduleHelper/editBuilding/getUserLibraryTexture.do?MLID="
									+ libraryInfo.mlid.toString() + "&MID="
									+ D_MEMBER.MID);

		} else {

			// 라이브러리 텍스쳐 로드
			M_EDITBUILDING.buildingManager
					.SetLibraryTexture(
							libraryInfo.mlid.toString(),
							M_EDITBUILDING.CONTROLLER_URL
									+ "/moduleHelper/editBuilding/getTemplateLibraryTexture.do?MLID="
									+ libraryInfo.mlid.toString());
		}
	},

	/**
	 * 환경 초기화
	 * **********************************************************************************
	 */
	initReferenceScript : function(_scriptInfo) {

		for (var i = 0; i < _scriptInfo.length; i++) {

			var script = document.createElement('script');
			script.src = _scriptInfo[i].src;
			script.onload = _scriptInfo[i].onload;

			document.body.appendChild(script);
		}
	},

	/**
	 * 라이브러리 관리
	 * *******************************************************************************
	 */
	// 라이브러리 리스트 초기화
	initLibrary : function() {

		if (this.isLibraryInit) {
			return;
		}

		this.loadLibraryList('F'); // 시설물 로드
		this.loadLibraryList('S'); // 건물 로드
		this.loadLibraryList('U'); // 사용자 추가 모델 로드

		this.isLibraryInit = true;
	},

	// 타입 별(시설물, 건물, 사용자 모델.. 등) 라이브러리 리스트 요청
	loadLibraryList : function(_libraryType) {
		// 요청 URL 생성
		var reqURL = this.CONTROLLER_URL;
		if (_libraryType == 'U') {
			reqURL += ("/moduleHelper/editBuilding/getUserModuleList.do?MID="+D_MEMBER.MID);
		} else {
			reqURL += ("/moduleHelper/editBuilding/getDefaultModuleList.do?M_TYPE="+_libraryType);
		}
		// var reqURL = this.CONTROLLER_URL
				// + "/moduleHelper/editBuilding/getDefaultModuleList.do?M_TYPE="
				// + _libraryType;
		// if (_libraryType == 'U') {
			// reqURL += ("&MID=" + D_MEMBER.MID);
		// }

		// 라이브러리 리스트 로드
		$.ajax({

			url : reqURL,
			method : "get",
			libraryType : _libraryType,
			success : function(_data, _status, _xhr) {

				// 데이터 체크
				if (_data.lenght == 0) {
					console.log("[Error] Invalid Library List Data");
					return false;
				}

				// 기존 리스트는 모두 지운다
				var data = JSON.parse(_data);
				console.log(data);
				var libraryList = data.modelList;

				// 모든 라이브러리 선택 버튼 삭제
				document.getElementById("libraryList_" + this.libraryType).innerHTML = "";

				// 라이브러리 데이터 요청
				for (var i = 0; i < libraryList.length; i++) {

					// 라이브러리 모델 및 텍스쳐 로드
					M_EDITBUILDING.loadLibraryModel(libraryList[i]);

					// 라이브러리 정보 저장
					M_EDITBUILDING.libraryInfo[libraryList[i].mlid] = libraryList[i];

					// 라이브러리 선택 버튼 생성
					M_EDITBUILDING.createLibrarySelectButton(libraryList[i]);
				}
			},

			error : function(xhr, status, thrown) {
				console.log("[Error] Failed Load Library List");
			}
		});
	},

	// 라이브러리 모델 등록
	loadLibraryModel : function(_libraryInfo) {

		var temp = _libraryInfo.model_save_file_name.split(".");
		var format = temp[temp.length - 1];

		if (_libraryInfo.model_type == 'U') {

			// 모델을 엔진에 라이브러리 모델로 저장. 저장이 완료되면 Fire_EventRegistLibrary 이벤트 발생
			this.buildingManager.AddLibrary({
				id : _libraryInfo.mlid.toString(),
				format : format,
				url : this.CONTROLLER_URL
						+ "/moduleHelper/editBuilding/getUserLibraryModel.do?MLID="
						+ _libraryInfo.mlid.toString() + "&MID="
						+ D_MEMBER.MID
			});

		} else {

			// 모델을 엔진에 라이브러리 모델로 저장. 저장이 완료되면 Fire_EventRegistLibrary 이벤트 발생
			this.buildingManager.AddLibrary({
				id : _libraryInfo.mlid.toString(),
				format : format,
				url : this.CONTROLLER_URL
						+ "/moduleHelper/editBuilding/getTemplateLibraryModel.do?MLID="
						+ _libraryInfo.mlid.toString()
			});
		}

	},

	openFileSelector : function() {

		var fileSelector = document.getElementById("uploadLibarayFile");
		fileSelector.click();
	},

	// 사용자 라이브러리 저장
	uploadLibrary : function(_files) {

		// 썸네일 생성
		var formData = new FormData();
		formData.append("MID", D_MEMBER.MID);
		formData.append("THUMB", "");

		// uploadLibarayFile
		for (var i = 0; i < _files.length; i++) {
			formData.append("modelFiles", _files[i]);
		}

		$.ajax({

			url : "/digitalTwin/moduleHelper/editBuilding/insertUserModel.do",
			type : "POST",
			data : formData,
			processData : false,
			contentType : false,
			dataType : "json",
			enctype : 'multipart/form-data',
			success : function(result) {

				var newMLID = result.MLID;

				// 디스크에 파일이 올라올 때까지 잠시 대기 후 썸네일 이미지 전송
				setTimeout(
					function() {

						// 썸네일 생성 후 결과 base64 이미지 데이터를 콜백 함수로 수신
						M_EDITBUILDING.createLibraryThumbnail(

							M_EDITBUILDING.CONTROLLER_URL
								+ "/moduleHelper/editBuilding/getUserLibraryModel.do?MLID="
								+ result.MLID.toString()
								+ "&MID=" + D_MEMBER.MID,
							M_EDITBUILDING.CONTROLLER_URL
								+ "/moduleHelper/editBuilding/getUserLibraryTexture.do?MLID="
								+ result.MLID.toString()
								+ "&MID=" + D_MEMBER.MID,

							function(base64Thumbnail,	_callbackParam) {
								// 생성한 썸네일 이미지를 컨트롤러로 전송
								M_EDITBUILDING.uploadLibraryThumbnail(_callbackParam.MLID,	base64Thumbnail);
							}, {
								MLID : newMLID
							}
						);
					}, 5000
				);
			}
		});
	},

	// 라이브러리 썸네일 생성
	createLibraryThumbnail : function(_modelURL, _textureURL, _complateCallback, _callbackParam) {

		XDViewer.loadModel({
			key : "thumbnail",
			url : _modelURL,
			texture : _textureURL,
			format : "3ds",
			callback : function(_key) {

				XDViewer.renewFrame();
				_complateCallback(XDViewer.canvas.toDataURL(), _callbackParam);
				XDViewer.clearModels();
			}
		});
	},

	// 라이브러리의 썸네일 갱신
	uploadLibraryThumbnail : function(mlid, base64Thumbnail) {

		var formData = new FormData();
		formData.append("MID", D_MEMBER.MID);
		formData.append("MLID", mlid);
		formData.append("THUMB", base64Thumbnail);

		$.ajax({

			url : "/digitalTwin/moduleHelper/editBuilding/updateModelThumbnail.do",
			type : "POST",
			data : formData,
			processData : false,
			contentType : false,
			dataType : "json",
			enctype : 'multipart/form-data',
			success : function(result) {

				// 사용자 모델 리스트 갱신
				M_EDITBUILDING.loadLibraryList('U');
			}
		});
	},

	/**
	 * 인터페이스
	 * *******************************************************************************
	 */
	setTileObjectOptionInterfacePosition : function(_screenX, _screenY) {

		var editInterface = document.getElementById("tileObjectOptionInterface");

		// 오브젝트 화면 좌표 위치에 건물 편집 인터페이스를 올린다
		editInterface.style.left = (_screenX - 26) + "px";
		editInterface.style.top = (_screenY) + "px";
		editInterface.style.display = "block";
	},

	setEditModelInterfacePosition : function(_screenX, _screenY) {

		var editInterface = document.getElementById("editModelInterface");

		// 오브젝트 화면 좌표 위치에 건물 편집 인터페이스를 올린다
		editInterface.style.left = (_screenX - 57) + "px";
		editInterface.style.top = (_screenY - 57 + 40) + "px";
		editInterface.style.display = "block";
	},

	// 라이브러리 리스트 출력 타입 설정 (S:건물, F:시설물, U:사용자모델)
	setLibraryDisplayType : function(_type) {

		$(".moduleEditBuildingLibrayListWrap").addClass("hide");
		$("#libraryList_" + _type).removeClass('hide');

		// 사용자 모델 타입의 경우 업로드가 잦으므로 다시 갱신해준다
		if (_type == 'U') {
			this.loadLibraryList('U');
		}
	},

	// 라이브러리 선택 버튼 추가
	createLibrarySelectButton : function(_libraryInfo) {

		var libraryListWrap = $("#libraryList_" + _libraryInfo.model_type)[0];

		// 라이브러리 선택 버튼 생성
		var libButton = document.createElement("li");

		// 버튼 이미지로 모델 썸네일 이미지 지정
		var libButtonImage = document.createElement("img");
		libButtonImage.classList.add("moduleEditBuildingLibraryListImage");
		
		if (_libraryInfo.thumb_base64 == null) {
			libButtonImage.src = "./assets/img/misc/empty_building_library_preview.png"
		} else {
			libButtonImage.src = _libraryInfo.thumb_base64;
		}
		
		// 라이브러리 버튼에 이미지 붙이고 라이브러리 리스트에 추가
		libButton.appendChild(libButtonImage);
		libButton.mlid = _libraryInfo.mlid;
		libButton.id = "btn_library_" + _libraryInfo.mlid;
		libButton.classList.add("btn_library");
		//libraryListWrap.appendChild(libButton);
		if (libraryListWrap.childNodes.length == 0) {
			libraryListWrap.appendChild(libButton);
		} else {
			libraryListWrap.insertBefore(libButton, libraryListWrap.childNodes[0]);
		}
		
		// 라이브러리 선택 시 실행할 기능 지정
		libButton.onclick = function() {

			// 선택한 건물을 추가 건물로 지정
			M_EDITBUILDING.selectLibrary(this.mlid);
		};
	},

	// 라이브러리 미리보기 이미지 설정
	setLibraryPreview : function(_thumbnailImageSrc) {

		var preview = document.getElementById("libraryPreview");
		preview.src = _thumbnailImageSrc;
	},

	// 건물 추가 버튼 선택 활성화
	setActiveAddObjectButton : function(_active) {

		if (_active) {
			$("#addLibraryObject").addClass("active");
		} else {
			$("#addLibraryObject").removeClass("active");
		}
	},

	// 건물 삭제 버튼 선택 활성화
	setActiveDeleteObjectButton : function(_active) {

		if (_active) {
			$("#deleteLibraryObject").addClass("active");
		} else {
			$("#deleteLibraryObject").removeClass("active");
		}
	},

	// 프로젝트 저장 인터페이스 열기
	openProjectSaveInterface : function(_) {

		if ($("#projectSaveInterface").css("display") == "block") {
			return;
		}

		// 현재 시간으로 프로젝트 이름 자동 지정
		var date = new Date();
		document.getElementById("editBuildingProjectNameInput").value = "Project_"
				+ date.getTime();

		// 프로젝트 리스트, 프로젝트 저장 인터페이스 스위칭
		$("#projectSaveInterface").fadeIn();
	},

	// 프로젝트 저장 인터페이스 닫기
	closeProjectSaveInterface : function() {

		if ($("#projectSaveInterface").css("display") == "none") {
			return;
		}

		// 프로젝트 리스트, 프로젝트 저장 인터페이스 스위칭
		$("#projectSaveInterface").fadeOut();
	},

	// 프로젝트 선택 버튼 추가
	createProjectSelectButton : function(_projectInfo) {

		var projectListWrap = $("#editbuildingProjectList")[0];

		// 프로젝트 선택 버튼 생성
		var projectButton = document.createElement("li");

		// 프로젝트 이름 텍스트 설정
		projectButton.innerHTML += "<i class='col-1 fa fa-home'></i>";
		projectButton.innerHTML += "<span class='col'>"
				+ _projectInfo.project_name + "</span>";
		projectButton.innerHTML += "<button type='button' class='col-3 btn icon-btn btn-sm btn-secondary'><i class='fa fa-download'></i></button>";

		// 프로젝트 버튼 PID 지정 및 클래스 설정
		projectButton.classList.add("btn_project");
		projectButton.pid = _projectInfo.pid;

		// 프로젝트 버튼 리스트에 추가
		projectListWrap.appendChild(projectButton);

		// 프로젝트 선택 시 실행할 기능 지정
		projectButton.onclick = function() {

			// 선택한 건물을 추가 건물로 지정
			M_EDITBUILDING.loadProject(this.pid);
		};
	},

	/**
	 * 건물 편집
	 * *******************************************************************************
	 */

	selectLibrary : function(_mlid) {

		// 선택한 라이브러리 정보 저장
		this.selectLibraryInfo = this.libraryInfo[_mlid];

		// 선택한 건물 이미지를 건물 미리보기 이미지로 출력
		this.setLibraryPreview(this.selectLibraryInfo.thumb_base64);

		// 버튼 선택 상태 재설정
		this.setActiveAddObjectButton(true);

		// 마우스 모드 설정
		this.setMouseState('add');

		// 추가할 라이브러리 지정
		this.buildingManager.SelectLibrary(_mlid.toString());
	},

	getSelectedLibraryObjectType : function() {

		var selectObjectInfo = this.buildingManager.GetSelectedLibraryObject();
		if (selectObjectInfo == 'NG') {
			return 'null';
		}

		var objectType = 'null';

		switch (selectObjectInfo.split("#")[8]) {

		case '0':
			objectType = "library";
			break;
		case '1':
			objectType = "real3d"
			break;
		default:
			break;
		}

		return objectType;
	},

	getSelectedLibraryObjectScreenPosition : function() {

		var selectObjectInfo = this.buildingManager.GetSelectedLibraryObject();
		if (selectObjectInfo == 'NG') {
			return null;
		}

		var screenPosition = selectObjectInfo.split("#")[0].split(",");

		return new Module.JSVector2D(parseInt(screenPosition[0]),
				parseInt(screenPosition[1]));
	},

	// 지정한 마우스 상태 on/off 전환. off 시 마우스 상태를 none으로 둔다.
	toggleMouseState : function(_mode) {

		if (this.mouseState == _mode) {
			this.setMouseState('none');
		} else {
			this.setMouseState(_mode);
		}
	},

	// 마우스 상태 설정
	setMouseState : function(_mode) {

		// 지도 내 모델 추가, 삭제 버튼 비활성화 상태로 리셋
		switch (_mode) {

		// 라이브러리에서 선택한 건물을 지도에 추가하는 모드
		case 'add':

			this.buildingManager.SetLibraryStatus(2);
			this.setActiveAddObjectButton(true);
			this.setActiveDeleteObjectButton(false);

			break;

		case 'edit':

			// 마우스 상태를 건물 편집 상태로 바꾸고 건물 편집 오브젝트 활성화
			this.buildingManager.SetLibraryStatus(3);
			this.buildingManager.SetEditObject(true);

			this.setActiveAddObjectButton(false);
			this.setActiveDeleteObjectButton(false);

			break;

		case 'delete':

			this.buildingManager.SetLibraryStatus(1);
			this.setActiveAddObjectButton(false);
			this.setActiveDeleteObjectButton(true);

			break;

		case 'none':
			this.buildingManager.SetLibraryStatus(0);

			this.setActiveAddObjectButton(false);
			this.setActiveDeleteObjectButton(false);

			return;

		default:
			return;
		}

		this.mouseState = _mode;
	},

	// 건물 높이 설정
	modifyObjectHeight : function(_amount) {

		this.buildingManager.EditObjectScaleZ(_amount);
	},

	// 건물 횡 방향 스케일 설정 sumin 201113
	modifyObjectWideScale : function(_amount) {

		this.buildingManager.EditObjectScaleX(_amount);
		this.buildingManager.EditObjectScaleY(_amount);
	},

	// 건물 방향 설정
	setObjectDirection : function(_angle) {

		// 선택 된 라이브러리 오브젝트 받아오기
		var editLibraryObject = this.buildingManager.GetEditObject();
		editLibraryObject.setDirection(parseFloat(_angle));
		Module.XDRenderData();

		// 건물 방향 출력 값 갱신
		document.getElementById("editModelDirectionText").innerHTML = _angle
				+ "(º)";
	},

	/**
	 * 프로젝트
	 * *******************************************************************************
	 */
	// 프로젝트 기능 및 인터페이스 초기화
	initProject : function() {

		this.loadProjectList();
	},

	// 프로젝트 리스트 로드
	loadProjectList : function() {

		// 프로젝트 리스트 URL
		var reqURL = this.CONTROLLER_URL
				+ "/moduleHelper/editBuilding/getProjectList.do?MID="
				+ D_MEMBER.MID;

		$
				.ajax({

					url : reqURL,
					method : "get",
					dataType : "json",
					success : function(_data, _status, _xhr) {

						// 프로젝트 리스트 클리어
						document.getElementById("editbuildingProjectList").innerHTML = "";

						var projectList = _data.projectList;

						for (var i = 0; i < projectList.length; i++) {

							// 프로젝트 로드 버튼 추가
							M_EDITBUILDING
									.createProjectSelectButton(projectList[i]);

							// 프로젝트 정보 저장
							M_EDITBUILDING.projectInfo[projectList[i].pid] = projectList[i];
						}
					},

					error : function(xhr, status, thrown) {
						console.log("[Error] Failed Load Project List");
					}

				});
	},

	// 프로젝트 데이터 로드
	loadProject : function(pid) {

		// 프로젝트 데이터
		var projectInfo = this.projectInfo[pid];
		if (typeof projectInfo == 'undefined') {
			return;
		}

		// 프로젝트 로드
		var projectContent = projectInfo.project_content;
		if (typeof projectContent == 'undefined') {
			return;
		}

		// 이미 로드 된 프로젝트가 있으면 프로젝트 로드 전으로 초기화
		if (this.currentProjectInfo != null) {
			// 기존 추가 된 라이브러리 오브젝트 클리어
			this.buildingManager.ClearLibraryObject();

			// 기존 삭제 처리한 real3d 건물들 다시 복원
			var layerList = new Module.JSLayerList(false);
			for (var i = 0; i < this.currentProjectInfo.DELETE.length; i++) {

				// 건물 레이어 정보 반환 후 건물이 보이거나 다시 로드되지 않도록 설정
				var layer = layerList
						.nameAtLayer(this.currentProjectInfo.DELETE[i].layerName);
				if (layer == null) {
					return;
				}

				layer.SetDefineVisibleByFileName(
						this.currentProjectInfo.DELETE[i].xdoName, 2, true);
			}
		}

		// 프로젝트 데이터 파싱 정보 파싱
		var projectContent = JSON.parse(projectContent);

		// 추가 된 건물 리스트
		var libraryObjects = projectContent.ADD;

		// 라이브러리 오브젝트 추가
		for (var i = 0; i < libraryObjects.length; i++) {

			var libraryObjectInfo = libraryObjects[i];

			var result = M_EDITBUILDING.buildingManager
					.AddLibraryObject({
						position : new Module.JSVector3D(
								libraryObjectInfo.LONGITUDE,
								libraryObjectInfo.LATITUDE,
								libraryObjectInfo.ALTITUDE),
						library_name : libraryObjectInfo.MLID,
						object_key : i.toString(),
						scale : new Module.JSSize3D(
								libraryObjectInfo.SCALE_WIDTH,
								libraryObjectInfo.SCALE_HEIGHT,
								libraryObjectInfo.SCALE_DEPTH),
						direction : libraryObjectInfo.DIRECTION
					});
		}

		// 삭제 타일 건물 숨김 처리
		if (projectContent.DELETE) {

			var layerList = new Module.JSLayerList(false);
			for (var i = 0; i < projectContent.DELETE.length; i++) {

				// 건물 레이어 정보 반환 후 건물이 보이거나 다시 로드되지 않도록 설정
				var layer = layerList
						.nameAtLayer(projectContent.DELETE[i].layerName);
				if (layer == null) {
					return;
				}

				layer.SetDefineVisibleByFileName(
						projectContent.DELETE[i].xdoName, 2, false);
			}
		}

		this.currentProjectInfo = projectContent;

		Module.XDRenderData();
	},

	// 프로젝트 데이터를 컨트롤러로 전송, 저장
	uploadProject : function() {

		var projectData = {};

		// 라이브러리 오브젝트 배치 데이터 가져오기
		projectData.ADD = this.getLibraryObjectAddInformation();
		projectData.DELETE = this.deleteReal3dInfo;

		// 프로젝트 저장 인터페이스 닫기
		this.closeProjectSaveInterface();

		// 프로젝트 저장
		var formData = new FormData();
		formData.append("PROJECT_JSON", JSON.stringify(projectData));
		formData.append("MID", D_MEMBER.MID.toString());

		var projectCenter = this.getProjectCenterPosition();
		formData.append("MOVE_LON", 0.0);
		formData.append("MOVE_LAT", 0.0);
		formData.append("MOVE_ALT", 0.0);

		formData.append("PROJECT_NAME", document
				.getElementById("editBuildingProjectNameInput").value);
		formData.append("THUMB", this.getProjectThumbnail());

		$
				.ajax({

					url : "/digitalTwin/moduleHelper/editBuilding/insertEditBuildingProject.do",
					type : "POST",
					data : formData,
					processData : false,
					contentType : false,
					dataType : 'json',
					enctype : 'multipart/form-data',
					success : function(result) {
						M_EDITBUILDING.loadProjectList();
						console.log(result);
					},
					error : function(xhr, status, thrown) {
						console.log("[Error] Failed Upload Project");
					}
				});
	},

	// 추가 된 건물 정보 반환
	getLibraryObjectAddInformation : function() {

		var libraryObjects = [];
		var objectCount = this.buildingManager.GetObjectCount();

		for (var i = 0; i < objectCount; i++) {

			var libraryObject = this.buildingManager.IndexAtObject(i);

			var libraryObjectData = {
				MLID : libraryObject.getLibraryName()
			};

			// position
			var position = libraryObject.getPosition();
			libraryObjectData.LONGITUDE = position.Longitude;
			libraryObjectData.LATITUDE = position.Latitude;
			libraryObjectData.ALTITUDE = position.Altitude;
			libraryObjectData.DIRECTION = libraryObject.getDirection();

			// scale
			var scale = libraryObject.getScale();
			libraryObjectData.SCALE_WIDTH = scale.width;
			libraryObjectData.SCALE_HEIGHT = scale.height;
			libraryObjectData.SCALE_DEPTH = scale.depth;

			libraryObjects.push(libraryObjectData);
		}

		return libraryObjects;
	},

	// 추가 된 건물 정보 반환
	getProjectCenterPosition : function() {

		var libraryObjects = [];
		var objectCount = this.buildingManager.GetObjectCount();

		// 모든 추가 된 건물의 위치 평균 값을 구한다
		var totalPosition_lon = 0.0;
		var totalPosition_lat = 0.0;
		var totalPosition_alt = 0.0;

		for (var i = 0; i < objectCount; i++) {

			var libraryObject = this.buildingManager.IndexAtObject(i);

			var position = libraryObject.getPosition();

			totalPosition_lon += position.Longitude;
			totalPosition_lat += position.Latitude;
			totalPosition_alt += position.Altitude;
		}

		return {
			longitude : totalPosition_lon / objectCount,
			latitude : totalPosition_lat / objectCount,
			altitude : totalPosition_alt / objectCount
		};
	},

	// 현재 이미지를 프로젝트 썸네일 이미지로 저장
	getProjectThumbnail : function() {

		return "TEST";
	},

	// 현재 배치 된 건물들을 하나의 3ds 통으로 저장
	downloadProjectFile : function() {

		// var data =
		// this.buildingManager.exportAllLibraryObjectsAsFormatData();
	},

	/**
	 * 타일 건물 제어
	 * *******************************************************************************
	 */

	// 타일 로드 된 건물 오브젝트 삭제
	deleteReal3dObject : function() {

		// 삭제 대상 건물 정보 반환
		var selectObjectInfo = this.buildingManager.GetSelectedLibraryObject();
		if (selectObjectInfo == 'NG') {
			return;
		}

		selectObjectInfo = selectObjectInfo.split("#");
		if (selectObjectInfo[8] != '1') { // real3d('1'), library('0')
			return;
		}

		// 건물 레이어 정보 반환 후 건물이 보이거나 다시 로드되지 않도록 설정
		var layerList = new Module.JSLayerList(false);
		var layer = layerList.nameAtLayer(selectObjectInfo[1]);
		if (layer == null) {
			return;
		}

		layer.SetDefineVisibleByFileName(selectObjectInfo[2], 2, false);
		this.mapAPI.clearSelectObj();

		// 삭제 건물 등록
		this.deleteReal3dInfo.push({
			layerName : selectObjectInfo[1],
			xdoName : selectObjectInfo[2]
		});

		// 타일 건물 버튼 인터페이스 닫기
		document.getElementById("tileObjectOptionInterface").style.display = "none";
	},

	// Real3d 건물을 라이브러리로 등록
	uploadReal3dObjectAsLibrary : function() {

		// 건물 선택 정보 반환
		var selectObjectInfo = this.buildingManager.GetSelectedLibraryObject();
		if (selectObjectInfo == 'NG') {
			return;
		}

		selectObjectInfo = selectObjectInfo.split("#");
		if (selectObjectInfo[8] != '1') { // real3d('1'), library('0')
			return;
		}

		// real3d 건물 데이터를 3ds로 변환해 받아오기
		var layerList = new Module.JSLayerList(false);
		var layer = layerList.nameAtLayer(selectObjectInfo[1]);
		if (layer == null) {
			return;
		}

		var real3dTo3dsData = layer.GetReal3DFormatData(selectObjectInfo[9],
				"3ds");
		if (real3dTo3dsData == null) {
			return;
		}

		// XDServer로부터 텍스쳐 이미지 받아오기
		var textureRequestURL = "http://xdworld.vworld.kr:8080/XDServer/requestLayerObject?Layer=facility_build";
		textureRequestURL += ("&Level=" + selectObjectInfo[4]);
		textureRequestURL += ("&IDX=" + selectObjectInfo[6]);
		textureRequestURL += ("&IDY=" + selectObjectInfo[7]);
		textureRequestURL += ("&DataFile=" + selectObjectInfo[10]);
		textureRequestURL += ("&APIKey=6BA0B27D-FA9D-331E-B30E-A967B9C86B60");

		$
				.ajax({

					url : textureRequestURL,
					type : "GET",
					modelData : real3dTo3dsData,
					modelFormat : "3ds",
					imageFormat : selectObjectInfo[10].split('.')[1],
					xhrFields : {
						responseType : 'blob'
					},
					success : function(_imageData) {

						// 엔진에서 출력한 3ds 건물 데이터 wrapping
						var modelBlob = new Blob([ this.modelData ], {
							type : "application/octet-stream"
						});

						var formData = new FormData();
						formData.append("MID", D_MEMBER.MID);
						formData.append("MODEL_DATA", new File([ modelBlob ],
								"name"));
						formData.append("MODEL_FORMAT", this.modelFormat);
						formData.append("TEXTURE_IMAGE", new File(
								[ _imageData ], "name"));
						formData.append("TEXTIRE_FORMAT", this.imageFormat);

						// 라이브러리로 저장
						$
								.ajax({

									url : "/digitalTwin/moduleHelper/editBuilding/insertUserModelForBinary.do",
									type : "POST",
									data : formData,
									processData : false,
									contentType : false,
									dataType : "json",
									enctype : 'multipart/form-data',
									success : function(result) {

										console.log(result);

										var newMLID = result.MLID;

										// 디스크에 파일이 올라올 때까지 잠시 대기 후 썸네일 이미지 전송
										setTimeout(
												function() {

													// 썸네일 생성 후 결과 base64 이미지
													// 데이터를 콜백 함수로 수신
													M_EDITBUILDING
															.createLibraryThumbnail(

																	M_EDITBUILDING.CONTROLLER_URL
																			+ "/moduleHelper/editBuilding/getUserLibraryModel.do?MLID="
																			+ result.MLID
																					.toString()
																			+ "&MID="
																			+ D_MEMBER.MID,
																	M_EDITBUILDING.CONTROLLER_URL
																			+ "/moduleHelper/editBuilding/getUserLibraryTexture.do?MLID="
																			+ result.MLID
																					.toString()
																			+ "&MID="
																			+ D_MEMBER.MID,

																	function(
																			base64Thumbnail,
																			_callbackParam) {

																		// 생성한
																		// 썸네일
																		// 이미지를
																		// 컨트롤러로
																		// 전송
																		M_EDITBUILDING
																				.uploadLibraryThumbnail(
																						_callbackParam.MLID,
																						base64Thumbnail);

																	},
																	{
																		MLID : newMLID
																	});
												}, 5000);
									}
								});

					},
					error : function(xhr, status, thrown) {
						console.log("[Error] Failed Upload Project");
					}
				});
	}
}