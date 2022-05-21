/*

	A Tile Map Editor v1
	By Ola Persson
	ola@kongotec.com
	www.kongotec.com
	
	Free to use and modify! If you extend it i would be glad if you e-mailed me your new functionality. 

*/

$(document).ready(function() {
    _mp.init();
    $(document).bind("contextmenu",function(e){
        return false;
    });
});

var _mp = {};
_mp.parentElement = null;

_mp.currentProject = {};
_mp.design = {};
_mp.currentLevelIndex = null;

_mp.init = function(){
	_mp.scrollBarWidth = 15;// scrollbarWidth();
	_mp.setParentElement();
	var html = "";
	html += _mp.create.navigation();
	html += '<div class="MainView">';
	html += _mp.create.toolbar();
	html += _mp.create.palette();
	html += _mp.create.canvas();
	html += '</div>';
	html += _mp.create.ProjectOrganizer();
	html += _mp.create.StartPopup();
//	html += _mp.create.Blocks();
	_mp.parentElement.html(html);
	_mp.project.createNew("New Project",64,256,"images/tile-game-1.png",0);
};

// Application Functions ---------------------------------------------------------------------------------------------------------------------------
$(window).resize(function(){
	_mp.updateDesign();
	clearTimeout(_mp.resizeEndTimeout);
	_mp.resizeEndTimeout = setTimeout('_mp.updateDesign()',100);
});

$(window).keypress(function(event){
	var key= event.which;
	switch(key){
		case 49 : // 1
			_mp.palette.shortcut(0);
		break;
		case 50 : // 2
			_mp.palette.shortcut(1);
		break;
		case 51 : // 3
			_mp.palette.shortcut(2);
		break;
		case 52 : // 4
			_mp.palette.shortcut(3);
		break;
		case 53 : // 5
			_mp.palette.shortcut(4);
		break;
		case 54 : // 6
			_mp.palette.shortcut(5);
		break;
		case 55 : // 7
			_mp.palette.shortcut(6);
		break;
		case 56 : // 8
			_mp.palette.shortcut(7);
		break;
		case 57 : // 9
			_mp.palette.shortcut(8);
		break;
		case 48 : // 0
			_mp.palette.shortcut(9);
		break;
		case 43 : // ?
			_mp.palette.shortcut(10);
		break;
	}
});

function scrollbarWidth() { 
    var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>'); 
    // Append our div, do our calculation and then remove it 
    $('body').append(div); 
    var w1 = $('div', div).innerWidth(); 
    div.css('overflow-y', 'scroll'); 
    var w2 = $('div', div).innerWidth(); 
    $(div).remove(); 
    return (w1 - w2); 
}

function ElementExists(Element){
	return Element.length>0;
}

_mp.setParentElement = function(){
	if(!ElementExists($("#TileMapEditor"))){
		var html = '<div id="TileMapEditor" class="TileMapEditor"></div>';
		$("body").append(html);
	}
	_mp.parentElement = $("#TileMapEditor");
	_mp.setParentElementToWindowSize();
}

_mp.setParentElementToWindowSize = function(){
	_mp.parentElement.height($(window).height());
	_mp.parentElement.width($(window).width());
}

_mp.updateDesign = function(){
	_mp.setParentElementToWindowSize();
	_mp.setMainViewHeight();
	_mp.setCanvasWidth();
}

_mp.setMainViewHeight = function(){
	if(ElementExists($('.MainView'))){
		
		_mp.design.navigationHeight = ElementExists($('.Navigation')) ? $('.Navigation').height() : 0;
		_mp.design.ProjectOrganizerHeight = ElementExists($('.ProjectOrganizer')) ? $('.ProjectOrganizer').height() : 0;
		
		var height = _mp.parentElement.height() - _mp.design.navigationHeight - _mp.design.ProjectOrganizerHeight;
		$('.MainView').height(height);
	}
}

_mp.setCanvasWidth = function(){
	if(ElementExists($('.Canvas'))){
		var width = _mp.parentElement.width() - _mp.design.paletteWith - _mp.design.toolbarWith;
		$('.Canvas').width(width);
	}
}

_mp.convertToString = function(VariableToString){

	var string = '';
	switch(VariableToString.constructor){
		case String : 
		string += '"' + VariableToString + '"';
		break;
		case Array : 
		string += '[';
		for(var i = 0; i<VariableToString.length;i++){
			string += _mp.convertToString(VariableToString[i]);
			string += ', '
		}
		if(string.length>1){
			string = string.slice(0, -2);
		}
		string += ']';
		break;
		case Object :
			string += '{';
			$.each(VariableToString, function(key, value) {
				string += key + " : " + _mp.convertToString(value);
				string += ', '
			});
			if(string.length>1){
				string = string.slice(0, -2);
			}
			string += '}';
		break;
		case Number :
			string += VariableToString;
		break; 
	}
	return string;
}

ArrayRemoveAtIndex = function(arrayName,arrayIndex){
	arrayName.splice(arrayIndex,1); 
}

_mp.initialiseDesign = function(){

	_mp.design.navigationHeight = ElementExists($('.Navigation')) ? $('.Navigation').height() : 0;
	_mp.design.ProjectOrganizerHeight = ElementExists($('.ProjectOrganizer')) ? $('.ProjectOrganizer').height() : 0;
	_mp.design.paletteWith = 0;
	_mp.design.toolbarWith = 0;
	
	_mp.setMainViewHeight();
	
	if(ElementExists($('.Palette'))){
		_mp.design.paletteWith = _mp.currentProject.tileSize + _mp.scrollBarWidth;
		$('.Palette').width(_mp.design.paletteWith);
		var paletteTilesCss = {
			'height' : _mp.currentProject.tileSize * _mp.currentProject.tileSetTileCount,
			'background-image' : 'url('+_mp.currentProject.tileSetImageUrl+')'
		};
		$('.PaletteTiles').css(paletteTilesCss);
	}
	
	_mp.setCanvasWidth();
	_mp.palette.init();
}

// Prompt ---------------------------------------------------------------------------------------------------------------------------
_mp.prompt = function(qObject, callback, text){
	_mp.promptCancel();
	var html = '<div class="PromptBox">';
	html += '<span class="PromptBoxTitle">' + text + '</span>';
	html += '<form>';
	html += '<table class="PromptForm">';
	$.each(qObject, function(key, value) {
		html += '<tr><td class="PromptKey">'+key+'</td><td><input type="text" name="'+key+'" value="'+value+'"/></td></tr>';
	});
	html += '</table>';
	html += '</form>';
	html += '<a href="#" onclick="'+callback+'" class="Button">OK</a>';
	html += '<a href="#" onclick="_mp.promptCancel()" class="Button">Cancel</a>';
	html += "</div>";
	$("body").append(html);
}
_mp.promptCancel = function(){
	if(ElementExists($('.PromptBox'))){
		$('.PromptBox').remove();
	}
}
_mp.getPromptResults = function(){
	if(ElementExists($('.PromptBox'))){
		var PromptResult = 'PromptResult = {';
		if(ElementExists($('.PromptForm'))){
			var trArray = $('.PromptForm').find("input");
			for(var i=0; i< trArray.length; i++){
				var name = $(trArray[i]).attr("name");
				var value = $(trArray[i]).attr("value");
				var evilString = name.split(" ");
				var stringType = evilString.pop();
				evilString = evilString.join('');
				var isString = stringType==="(String)"?"'":"";
				PromptResult += evilString + ' : ' + isString + value + isString + ', ';
			}
		}
		PromptResult = PromptResult.slice(0, -2) + '}';
		eval(PromptResult);
		_mp.promptCancel();
		return PromptResult;
	}
}

// Create Html ---------------------------------------------------------------------------------------------------------------------------
_mp.create = {};
_mp.create.navigation = function(){
	var html = '';
	html += '<div class="Navigation">';
	
	html += '<ul class="Menu">';
	html += '<li class="MenuItem"><a href="#" onclick="_mp.startPopup.show()" class="Button">About</a></li>';
	html += '</ul>';
	
	html += '<ul class="Menu">';
	html += '<li class="MenuItem"><a href="#" onclick="_mp.project.createNewButton()" class="Button">New Project</a></li>';
	html += '<li class="MenuItem"><a href="#" onclick="_mp.project.loadButton()" class="Button">Load Project</a></li>';
	html += '<li class="MenuItem"><a href="#" onclick="_mp.project.saveButton()" class="Button">Save Project</a></li>';
	html += '</ul>';
	
	html += '<ul class="Menu">';
	html += '<li class="MenuItem"><a href="#" onclick="_mp.project.exportButton()" class="Button">Export CONEMAN Project</a></li>';
	html += '</ul>';
	
	html += '<ul class="Menu">';
	html += '<li class="MenuItem"><a href="#" onclick="_mp.project.addNewLevelButton()" class="Button">Add New Level</a></li>';
	html += '<li class="MenuItem"><a href="#" onclick="_mp.project.deleteLevelButton()" class="Button">Delete This Level</a></li>';
	html += '</ul>';

	html += '<ul class="Menu">';
	html += '<li class="MenuItem"><span class="MenuLabel">Add Row:</span></li>';
	html += '<li class="MenuItem"><a href="#" onclick="_mp.editLevel.addRow(\'top\')" class="Button">Top+</a></li>';
	html += '<li class="MenuItem"><a href="#" onclick="_mp.editLevel.addRow(\'bottom\')" class="Button">Bottom+</a></li>';
	html += '<li class="MenuItem"><a href="#" onclick="_mp.editLevel.addRow(\'left\')" class="Button">Left+</a></li>';
	html += '<li class="MenuItem"><a href="#" onclick="_mp.editLevel.addRow(\'right\')" class="Button">Right+</a></li>';
	html += '</ul>';
	
	html += '<ul class="Menu">';
	html += '<li class="MenuItem"><span class="MenuLabel">Remove Row:</span></li>';
	html += '<li class="MenuItem"><a href="#" onclick="_mp.editLevel.removeRow(\'top\')" class="Button">Top-</a></li>';
	html += '<li class="MenuItem"><a href="#" onclick="_mp.editLevel.removeRow(\'bottom\')" class="Button">Bottom-</a></li>';
	html += '<li class="MenuItem"><a href="#" onclick="_mp.editLevel.removeRow(\'left\')" class="Button">Left-</a></li>';
	html += '<li class="MenuItem"><a href="#" onclick="_mp.editLevel.removeRow(\'right\')" class="Button">Right-</a></li>';
	html += '</ul>';
	
	html += '</ul>';
	html += '<ul class="Menu">';
	html += '<li class="MenuItem"><a href="#" onclick="_mp.canvas.drawlevel()" class="Button">Redraw Level</a></li>';
	html += '</ul>';
	
	html += "</div>";
	return html;
};
_mp.create.toolbar = function(){
	var html = "<div class='Toolbar' id='Toolbar'>";
	
	html += "</div>";
	return html;
};
_mp.create.palette = function(){
	var html = "<div class='Palette'>";
	html += '<div class="PaletteTiles">';
	html += '<div id="PaletteTileMarker" class="TileMarker"></div>';
	html += '<div id="PaletteMouseCatcher" class="MouseCatcher"></div>';
	html += '</div>';
	html += "</div>";
	return html;
};
_mp.create.canvas = function(){
	var html = "<div class='Canvas'>";
	
	html += "</div>";
	return html;
};
_mp.create.ProjectOrganizer = function(){
	var html = "<div class='ProjectOrganizer'>";
	
	html += "</div>";
	return html;
};

_mp.create.StartPopup = function(){
	var html = "<div id='StartPopup' class='StartPopup'>";

	html += '<a href="#" onclick="_mp.startPopup.hide()" class="CloseButton"></a>';
	
	html += "<p>";
	html += "<span>A Tile Map Editor v1</span>";
	html += '<span>By <a href="mailto:ola@kongotec.com" class="RegularLink">Ola Persson</a></span>';
	html += '<span><a href="http://www.kongotec.com" target="_blank" class="RegularLink">www.kongotec.com</a></span>';
	html += "</p>";

	html += "<p>";
	html += '<span>Originally created for the game <a href="http://itunes.apple.com/us/app/coneman/id484977154?mt=8" target="_blank" class="RegularLink">CONEMAN.</a></span>';
	html += '<span>Support this editor by <a href="http://itunes.apple.com/us/app/coneman/id484977154?mt=8" target="_blank" class="RegularLink">downloading CONEMAN!</a></span>';
	html += "</p>";
	
	html += "<p>";
	html += '<span><a href="http://www.kongotec.com/a-tile-map-editor/images/tile-game-1.psd" class="RegularLink">Download tile set template (PSD).</a></span>';
	html += "</p>";
	
	html += "<p>";
	html += '<span>Free to use online or <a href="http://www.kongotec.com/a-tile-map-editor/a-tile-map-editor.zip" class="RegularLink">download</a> and modify! If you extend it i would be glad if you <a href="mailto:ola@kongotec.com" class="RegularLink">e-mailed</a> me your new functionality.</span>';
	html += "</p>";
	
	html += "<p>";
	html += '<span>Instructions / Shortcuts:</span>';
	html += '<span>Mouse left: draw. Mouse right: draw air block.</span>';
	html += '<span>Numerical keys and "?" key: palette shortcuts</span>';
	html += '<span>Hold down "alt" key while left clicking a tile on the map to set that tile as current brush.</span>';
	html += '<span>Drag & drop level indexes to sort level order.</span>';
	html += "</p>";
	
	html += "<p>";
	html += '<span>Enjoy! / Ola Persson.</span>';
	html += "</p>";
	
	html += "</div>";
	return html;
};

// StartPopup ---------------------------------------------------------------------------------------------------------------------------

_mp.startPopup = {};
_mp.startPopup.show = function () {
	$('#StartPopup').css({
		visibility: 'visible'
	});
}

_mp.startPopup.hide = function () {
	$('#StartPopup').css({
		visibility: 'hidden'
	});
}

// Project ---------------------------------------------------------------------------------------------------------------------------
_mp.project = {};
_mp.project.createNewButton = function(){
		_mp.prompt({"Project Name (String)" : "New Project", "Tile Size (Int)" : 64, "Tile Set Tile Count (Int)" : 256, "Tile Set Url (String)" : "images/tile-game-1.png", "Air Tile (Int)" : 0}, "_mp.project.createNew()", "Warning! This Replaces The Current Project.");
}
_mp.project.createNew = function(ProjectName,TileSize,TileSetTileCount,TileSetUrl,AirTile){
	var promptResults = _mp.getPromptResults();
	if(promptResults){
		ProjectName = promptResults.ProjectName;
		TileSize = promptResults.TileSize;
		TileSetTileCount = promptResults.TileSetTileCount;
		TileSetUrl = promptResults.TileSetUrl;
		AirTile = promptResults.AirTile;
	}
	_mp.currentProject = {
		name : ProjectName,
		tileSize : TileSize,
		tileSetTileCount : TileSetTileCount,
		tileSetImageUrl : TileSetUrl,
		brushTile : 1,
		airTile : AirTile,
		paletteShortcuts : [0,25,50,75,100,125,150,175,200,225,250],
		levelArray : []
	};
	_mp.canvas.clear();
	_mp.initialiseDesign();
}
_mp.project.addNewLevelButton = function(){
	
	var tilesWide = 17 + parseInt(Math.random() * 7);
	var tilesHigh = 12 + parseInt(Math.random() * 7);
	
	var levelIndex = _mp.currentProject.levelArray.length + 1;
	_mp.prompt({"Level Name (String)" : "Level " + levelIndex, "Tiles Wide (Int)" : tilesWide, "Tiles Heigh (Int)" : tilesHigh}, "_mp.project.addNewLevel()","Add New Level To Project");
}
_mp.project.addNewLevel = function(){
	var promptResults = _mp.getPromptResults();
	var map = [];
	var tileCount = promptResults.TilesWide * promptResults.TilesHeigh;
	for(var i=0;i<tileCount;i++){
		map.push(_mp.currentProject.airTile);
	}
	var newLevel = {
		name : promptResults.LevelName,
		width : promptResults.TilesWide,
		height : promptResults.TilesHeigh,
		map : map
	};
	_mp.currentProject.levelArray.push(newLevel);
	_mp.canvas.drawlevel(_mp.currentProject.levelArray.length-1);
	_mp.projectOrganizer.draw();
}
_mp.project.deleteLevelButton = function(){
	_mp.prompt({}, "_mp.project.deleteLevel()","Warning! This Deletes The Current Level From The Project... Forever!");
}
_mp.project.deleteLevel = function(){
	_mp.promptCancel();
	if(_mp.currentLevelIndex==_mp.currentProject.levelArray.length || _mp.currentLevelIndex==null){
		return;
	}
	ArrayRemoveAtIndex(_mp.currentProject.levelArray, _mp.currentLevelIndex);
	_mp.projectOrganizer.draw();
	_mp.currentLevelIndex = 0;
	_mp.canvas.drawlevel(_mp.currentLevelIndex);
}
_mp.project.saveButton = function(){
	var object = _mp.currentProject;
	var string = _mp.convertToString(object);
	var html = '<span class="PromptBoxTitle">Copy This Level Object (String)</span><div class="SaveLevelString" id="SaveLevelStringId">' + string + "</div>";
	_mp.prompt({}, "", html);
	_mp.selectTextInsideId("SaveLevelStringId");
}
_mp.project.exportButton = function(){
	

	
	var object = _mp.currentProject.levelArray;
	var string = "static var LevelArray : Array = [";
	for(var i = 0; i < _mp.currentProject.levelArray.length; i++){
		var level = _mp.currentProject.levelArray[i];
			var levelString = "";
			levelString += "<br /><br />// Level Number "+i+"<br /><br />";
			levelString +='"' + level.name + '-' + level.width +','+level.height+'-'+level.map + '",';
			string += levelString;
	}
	string = string.slice(0, -1);
	string += "];";
	
	var html = '<span class="PromptBoxTitle">Copy This Level Object (String)</span><div class="SaveLevelString" id="SaveLevelStringId">' + string + "</div>";
	_mp.prompt({}, "", html);
	
	_mp.selectTextInsideId("SaveLevelStringId");
}
_mp.project.loadButton = function(){
	_mp.prompt({"Level Object (String)" : ""}, "_mp.project.load()", "Warning! This Replaces The Current Project.");
}
_mp.project.load = function(){
	var promptResults = _mp.getPromptResults();
	var LevelObjectString = promptResults.LevelObject;
	var evalLevel = eval("("+LevelObjectString+")");
	if(evalLevel.constructor != Object){
		alert("Levelformat Error");
		return;
	}
	_mp.currentProject = evalLevel;
	_mp.canvas.clear();
	_mp.initialiseDesign();
	_mp.canvas.drawlevel(0);
	_mp.projectOrganizer.draw();
}
// Canvas ---------------------------------------------------------------------------------------------------------------------------
_mp.canvas = {}; 
_mp.canvas.mouseState="unpressed";
_mp.canvas.MouseOverTileIndex = 0;
_mp.canvas.drawlevel = function(levelIndex){
	_mp.currentLevelIndex = typeof levelIndex=="undefined" ? _mp.currentLevelIndex : levelIndex;
	if(_mp.currentLevelIndex==_mp.currentProject.levelArray.length || _mp.currentLevelIndex==null){
		_mp.canvas.clear();
		return;
	}
	if(ElementExists($('.Canvas'))){
		var html = "";
		var currentLevelObject = _mp.currentProject.levelArray[_mp.currentLevelIndex];
		var width = currentLevelObject.width * _mp.currentProject.tileSize;
		var height = currentLevelObject.height * _mp.currentProject.tileSize;
		html += '<div class="LevelContainer" style="width:'+width+'px;height:'+height+'px;">';
		var map = currentLevelObject.map;
		var tileCss = "";
		tileCss += "background-image:url("+_mp.currentProject.tileSetImageUrl+");";
		tileCss += "width:"+ _mp.currentProject.tileSize + "px;";
		tileCss += "height:"+ _mp.currentProject.tileSize + "px;";
		for(var i=0; i < map.length; i++){
			var backgroundPosition = 'background-position: 0 '+(-map[i]*_mp.currentProject.tileSize)+'px;';
			html += '<div id="Tile'+i+'" class="LevelTile" style="'+tileCss+backgroundPosition+'"></div>';
		}
		var markerCss = "";
		markerCss += "width:"+ (_mp.currentProject.tileSize - 4) + "px;";
		markerCss += "height:"+ (_mp.currentProject.tileSize - 4) + "px;";
		html += '<div id="CanvasTileMarker" class="TileMarker" style="'+markerCss+'"></div>';
		html += '<div id="CanvasMouseCatcher" class="MouseCatcher"></div>';
		html += '</div>';
		$('.Canvas').html(html);
		_mp.canvas.bindMouseEvents($("#CanvasMouseCatcher"));
	}
	_mp.projectOrganizer.draw();
}
_mp.canvas.clear = function(){
	if(ElementExists($('.Canvas'))){
		$('.Canvas').html('');
	}
}
_mp.canvas.bindMouseEvents = function(Element){
	Element.mousedown(function(mouseDownEvent) {
		switch(mouseDownEvent.which){
			case 3 :
				_mp.canvas.mouseState = "delete";
			break;
			default : 
				_mp.canvas.mouseState = "draw";
				if (mouseDownEvent.shiftKey) {
	                
	            }
	            else if (mouseDownEvent.ctrlKey) {
	                
	            }
	            else if (mouseDownEvent.altKey) {
	                _mp.canvas.mouseState = "sample";
	            }
			break;
		}
		_mp.canvas.actionSwitch();
		mouseDownEvent.preventDefault();
	});
	Element.mouseout(function() {
		_mp.canvas.mouseState = "unpressed";
	});
	Element.mouseup(function(mouseDownEvent) {
		_mp.canvas.mouseState = "unpressed";
	});
	Element.mousemove(function(moveEvent){
		_mp.canvas.mouseMove(moveEvent);
		_mp.canvas.actionSwitch();
		moveEvent.preventDefault();
	});
}
_mp.canvas.actionSwitch = function(){
	switch(_mp.canvas.mouseState){
		case "draw" : 
		_mp.canvas.drawTile();
		break;
		case "sample" : 
		_mp.canvas.sampleTile();
		break;
		case "delete" : 
		_mp.canvas.deleteTile();
		break;
	}
}
_mp.canvas.mouseMove = function(e){
	var currentLevelObject = _mp.currentProject.levelArray[_mp.currentLevelIndex];
	var targetElement = $("#CanvasMouseCatcher");//e.currentTarget;
	var targetOffsetPosition = $(targetElement).offset();
	var CurrentTileX = Math.floor((e.pageX - targetOffsetPosition.left) / _mp.currentProject.tileSize);
	var CurrentTileY = Math.floor((e.pageY - targetOffsetPosition.top) / _mp.currentProject.tileSize);
	_mp.canvas.mouseOverTileIndex = CurrentTileX + CurrentTileY * currentLevelObject.width;
	$("#CanvasTileMarker").css({"left" : CurrentTileX * _mp.currentProject.tileSize, "top" : CurrentTileY * _mp.currentProject.tileSize});
}
_mp.canvas.changeTile = function(tileIndex){
	_mp.currentProject.levelArray[_mp.currentLevelIndex].map[_mp.canvas.mouseOverTileIndex]=tileIndex;
	$('#Tile'+_mp.canvas.mouseOverTileIndex).css("background-position",'0 '+(-tileIndex*_mp.currentProject.tileSize)+'px');
}
_mp.canvas.drawTile = function(){
	_mp.canvas.changeTile(_mp.currentProject.brushTile);
}
_mp.canvas.deleteTile = function(){
	_mp.canvas.changeTile(_mp.currentProject.airTile);
}
_mp.canvas.sampleTile = function(){
	_mp.currentProject.brushTile = _mp.currentProject.levelArray[_mp.currentLevelIndex].map[_mp.canvas.mouseOverTileIndex];
}
// Toolbar ---------------------------------------------------------------------------------------------------------------------------
_mp.palette = {}; 
_mp.palette.init = function(){
	if(ElementExists($('.Palette'))){
		_mp.palette.initTileMarker();
		_mp.palette.bindMouseEvents($("#PaletteMouseCatcher"));
	}
}
_mp.palette.initTileMarker = function(){
	$("#PaletteTileMarker").css({"width":_mp.currentProject.tileSize-4,"height":_mp.currentProject.tileSize-4, "top" : _mp.currentProject.brushTile * _mp.currentProject.tileSize});
}
_mp.palette.bindMouseEvents = function(Element){
	Element.click(function(event) {
		_mp.palette.setTileBrush(event);
		event.preventDefault();
	});
}
_mp.palette.shortcut = function(keyIndex){
	if(ElementExists($('.Palette'))){
		var scrollTop = _mp.currentProject.paletteShortcuts[keyIndex] * _mp.currentProject.tileSize;
		$('.Palette').scrollTop(scrollTop);
	}
}
_mp.palette.setTileBrush = function(event){
	var targetElement = $("#PaletteMouseCatcher");//e.currentTarget;
	var targetOffsetPosition = $(targetElement).offset();
	var clickedPaletteTileIndex = Math.floor((event.pageY - targetOffsetPosition.top) / _mp.currentProject.tileSize);
	_mp.currentProject.brushTile = clickedPaletteTileIndex;
	$("#PaletteTileMarker").css("top",clickedPaletteTileIndex*_mp.currentProject.tileSize)
}
// Project Organizer ---------------------------------------------------------------------------------------------------------------------------
_mp.projectOrganizer = {};
_mp.projectOrganizer.draw = function(){
	if(ElementExists($(".ProjectOrganizer"))){
		var html = "";
		html += '<ul class="Menu" id="ProjectOrganizerList">';
		for(var i=0; i<_mp.currentProject.levelArray.length;i++){
			var SelectedLevelClass = "";
			if(_mp.currentLevelIndex == i) SelectedLevelClass = " CurrentLevel";
			html += '<li class="MenuItem'+SelectedLevelClass+'" id="ProjectOrganizerLevel_'+i+'"><a href="#" onclick="_mp.canvas.drawlevel('+i+')" class="Button">'+i+'</a></li>';
		}
		html += '</ul>';
		
		$(".ProjectOrganizer").html(html);
		_mp.projectOrganizer.makeSortable();
	}
}
_mp.projectOrganizer.listPositionIndexOnStartDrag = null;
_mp.projectOrganizer.makeSortable = function(){
	$(function() {
		$( "#ProjectOrganizerList" ).sortable({
   			start: function(event, ui) { _mp.projectOrganizer.sortableStart(event, ui); }, 
			stop: function(event, ui) { _mp.projectOrganizer.sortableStop(event, ui); },
			delay: 200
		});
		$( "#ProjectOrganizerList" ).disableSelection();
	});
}
_mp.projectOrganizer.sortableStart = function (event, ui) {
	_mp.projectOrganizer.listPositionIndexOnStartDrag =  $(ui.item).index();
}
_mp.projectOrganizer.sortableStop = function (event, ui) {
	var listIndexWhenDropped = $(ui.item).index();
	_mp.projectOrganizer.moveLevelFromIndexToIndex(_mp.projectOrganizer.listPositionIndexOnStartDrag , listIndexWhenDropped);
}
_mp.projectOrganizer.moveLevelFromIndexToIndex = function(originalPosition, newPosition){

	var LevelToMove = _mp.currentProject.levelArray.splice(originalPosition,1)[0];
	_mp.currentProject.levelArray.splice(newPosition,0,LevelToMove);
	//_mp.canvas.drawlevel();
}

// EditLevel ---------------------------------------------------------------------------------------------------------------------------
_mp.editLevel = {};
_mp.editLevel.addRow = function(side){
	
	if(!_mp.currentProject.levelArray[_mp.currentLevelIndex]) return;
	
	switch(side){
		case "top" :
			var emptyRow = _mp.editLevel.returnEmptyRow();
			_mp.currentProject.levelArray[_mp.currentLevelIndex].height ++;
			_mp.currentProject.levelArray[_mp.currentLevelIndex].map = emptyRow.concat(_mp.currentProject.levelArray[_mp.currentLevelIndex].map);
			_mp.canvas.drawlevel();
		break;
		case "bottom" :
			var emptyRow = _mp.editLevel.returnEmptyRow();
			_mp.currentProject.levelArray[_mp.currentLevelIndex].height ++;
			_mp.currentProject.levelArray[_mp.currentLevelIndex].map = _mp.currentProject.levelArray[_mp.currentLevelIndex].map.concat(emptyRow);
			_mp.canvas.drawlevel();
		break;
		case "left" :
			_mp.currentProject.levelArray[_mp.currentLevelIndex].width ++;
			var mapArray = _mp.currentProject.levelArray[_mp.currentLevelIndex];
			for(var i = mapArray.height; i>0; i--){
				mapArray.map.splice((mapArray.width-1)*(i-1),0,_mp.currentProject.airTile);
			}
			_mp.canvas.drawlevel();
		break;
		case "right" :
			_mp.currentProject.levelArray[_mp.currentLevelIndex].width ++;
			var mapArray = _mp.currentProject.levelArray[_mp.currentLevelIndex];
			for(var i = mapArray.height; i>0; i--){
				mapArray.map.splice((mapArray.width-1)*i,0,_mp.currentProject.airTile);
			}
			_mp.canvas.drawlevel();
		break;
	}
}

_mp.editLevel.returnEmptyRow = function (){
	var emptyRowArray = [];
	var tempWidth = _mp.currentProject.levelArray[_mp.currentLevelIndex].width;
	
	for(var i=0;i<tempWidth;i++){
		emptyRowArray.push(_mp.currentProject.airTile);
	}
	
	return emptyRowArray;
}

_mp.editLevel.removeRow = function(side){
	
	if(!_mp.currentProject.levelArray[_mp.currentLevelIndex]) return;
	
	switch(side){
		case "top" :
			var mapArray = _mp.currentProject.levelArray[_mp.currentLevelIndex];
			mapArray.height --;
			mapArray.map.splice(0, mapArray.width);
			_mp.canvas.drawlevel();
		break;
		case "bottom" :
			var mapArray = _mp.currentProject.levelArray[_mp.currentLevelIndex];
			mapArray.height --;
			mapArray.map.splice(mapArray.map.length-mapArray.width, mapArray.width);
			_mp.canvas.drawlevel();
		break;
		case "left" :
			_mp.currentProject.levelArray[_mp.currentLevelIndex].width --;
			var mapArray = _mp.currentProject.levelArray[_mp.currentLevelIndex];
			for(var i = mapArray.height; i>0; i--){
				mapArray.map.splice((mapArray.width+1)*(i-1),1);
			}
			_mp.canvas.drawlevel();
		break;
		case "right" :
			_mp.currentProject.levelArray[_mp.currentLevelIndex].width --;
			var mapArray = _mp.currentProject.levelArray[_mp.currentLevelIndex];
			for(var i = mapArray.height; i>0; i--){
				mapArray.map.splice((mapArray.width+1)*i-1,1);
			}
			_mp.canvas.drawlevel();
		break;
	}
}

_mp.selectTextInsideId = function(SelectTextInsideIdString){
	if (document.selection) {
		var range = document.body.createTextRange();
		range.moveToElementText(document.getElementById(SelectTextInsideIdString));
		range.select();
	}
	else if (window.getSelection) {
		var range = document.createRange();
		range.selectNode(document.getElementById(SelectTextInsideIdString));
		window.getSelection().addRange(range);
	}
}

