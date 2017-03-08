

	var playstyle=0;//播放模式0顺序1随机2单曲3列表
	var audioBufferSouceNode=null;
    var file = null; //the current file
    var fileName = null; //the current file name
    var audioContext = null;
    var source = null; //the audio source
    var infoUpdateId = null; //to sotore the setTimeout ID and clear the interval
    var animationId = null;
    var gainNode=null;
    var status = 0; //flag for sound is playing 1 or stopped 0
    var allCapsReachBottom = false;
    var analyser=null;
    var loud=1;
    var loca=0;
	var cli=false;
	var pli=false;
	var length;
	var l;
	var buf=null;
	var playerName;
	var musicName;
	var req;
	var fileLength;
	var audioInput = document.getElementById('uploadedFile');
	var playNumber=0;
	if(window.XMLHttpRequest)
   	{
   		req=new XMLHttpRequest();
   	}else if(window.ActiveXObject)
   	{
   		try
   		{
   			req=new ActiveXObject("Msxml2.XMLHTTP");
   		}catch(e)
   		{
   			req=new ActiveXObject("Microsoft.XMLHTTP");
   		}
   	}
   	$("#btnPlayway").click(function(){
   		$("#divselect").fadeToggle();
   	})
	$("#spansongnum1").click(function(){
		$("#divplayframe").fadeToggle();
	})
	$("#btnclose").click(function(){
		$("#divplayframe").fadeToggle();
	})
	$("#btnlrc").click(function(){
		$("#player_lyrics_pannel").fadeToggle();
	})
	$("#closelrcpannel").click(function(){
		$("#player_lyrics_pannel").fadeToggle();
	})
	$("#spanvolume").mousedown(function(e){
		cli=true;
	})
	$("#spanvolume").mouseup(function(e){
		cli=false;
	})
	$("#spanvolume").mousemove(function(e){
		if(cli==true)
		{
			
			var n=(e.pageX-445)/75;
			if(n>1)n=1;
			$("#spanvolumebar")[0].style.width=n*100+"%";	
			$("#spanvolumeop")[0].style.left=n*100+"%";
			gainNode.gain.value=n-1;
		}
	})
	$("#spanvolume").click(function(e){
		var n=(e.pageX-445)/76;
		$("#spanvolumebar")[0].style.width=n*100+"%";	
		$("#spanvolumeop")[0].style.left=n*100+"%";
		gainNode.gain.value=n-1;
	})
	
	////////////////////////////////////////以下为控制播放拖动/////////////////////////////////////////
	$("#player_bar").mousedown(function(e){
		clearInterval(l);
		audioBufferSouceNode.stop();
		pli=true;
	})
	$("#player_bar").mouseup(function(e){
		pli=false;
		clearInterval(l);
		audioBufferSouceNode.stop();
		visualize(audioContext, buf,loca/1000);
	})
	$("#player_bar").mouseleave(function(e){
		if(pli==true)
		{
			audioBufferSouceNode.stop();
			clearInterval(l);
			visualize(audioContext, buf,loca/1000);
		}
		pli=false;
	})
	$("#player_bar").mousemove(function(e){
		if(pli==true)
		{
    	//	clearInterval(l);
			var n=(e.pageX)/538;
			if(n>1)n=1;
			loca=parseInt(length*n*1000);
			$("#spanplaybar")[0].style.width=n*100+"%";	
			$("#spanprogress_op")[0].style.left=n*100+"%";
			audioBufferSouceNode.stop();
		}
	})
	$("#preone").click(function(e){
		if(playNumber+1<fileLength)
    	{
    		clearInterval(l);
			audioBufferSouceNode.stop();
    		loca=0;
    		playNumber++;
       		dofile(playNumber);
       	}
	})
	$("#nextone").click(function(e){
		if(playNumber-1>=0)
    	{
    		clearInterval(l);
			audioBufferSouceNode.stop();
    		loca=0;
    		playNumber--;
       		dofile(playNumber);
       	}
	})
	$("#player_bar").click(function(e){
		clearInterval(l);
		var n=(e.pageX)/538;
		loca=parseInt(length*n*1000);
		$("#spanplaybar")[0].style.width=n*100+"%";	
		$("#spanprogress_op")[0].style.left=n*100+"%";
		audioBufferSouceNode.stop();
		visualize(audioContext, buf,loca/1000);
	})
///////////////////////////////////////////////////////////////////////////
	$("#spanmute").click(function(){//静音
		if(gainNode.gain.value==-1)
		{
			gainNode.gain.value=loud;
		}else
		{
			loud=gainNode.gain.value;
			gainNode.gain.value=-1;
		}
	})
	
	
	
	$("#btnplay").click(function(){    //暂停
		if(status==1)
		{
			status=0;
			clearInterval(l);
			audioBufferSouceNode.stop();
		}else
		{
			status=1;
			visualize(audioContext, buf,loca/1000);
		}
	})
	window.onload = function() {
   		ini();
	};
	function realSetPlayWay(n)//播放模式0顺序1随机2单曲3列表
	{
		$("#divselect").fadeToggle();
		playstyle=n;
		if(n==0)
		{
			$("#btnPlayway").attr("class","ordered_bt");
		}else
		if(n==1)
		{
			$("#btnPlayway").attr("class","unordered_bt");
		}else
		if(n==2)
		{
			$("#btnPlayway").attr("class","cycle_single_bt");
		}else
		{
			$("#btnPlayway").attr("class","cycle_bt");
		}
	}
	function play()
	{
		loca+=1000;
		var n=(loca/1000)/length;
		if(n>1)n=1;
		var t1=(Array(2).join('0') + parseInt(loca/1000/60)).slice(-2);
		var t2=(Array(2).join('0') + (     parseInt(loca/1000)%60    )).slice(-2);
		var s=t1+":"+t2;
		
		$("#ptime").text(s);
		$("#spanplaybar")[0].style.width=n*100+"%";
		$("#spanprogress_op")[0].style.left=n*100+"%";
	}
	
    function ini() 
    {
        prepareAPI();
        addEventListner();
    }
    
    function prepareAPI() 
    {
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
        audioContext = new AudioContext();
    }//准备api
    
    
    function addEventListner() 
    {
        audioInput.onchange = function() 
        {
        	$("#divnulllist").text("");
        	fileLength=audioInput.files.length;
        	for(var j=0;j<fileLength;j++)
          	{
         	 	var filed = audioInput.files[j];
               	var fileNamed = filed.name;
          		var top=fileNamed.indexOf("-",1);
            	var music=fileNamed.substring(0,top);
            	var player=fileNamed.substring(top+1,fileNamed.length-4);
            	$("#divnulllist").html($("#divnulllist").html()+"<br/>"+music+"    "+player);
            }
            dofile(playNumber);
        }
    }
    
    
    function dofile(n)
    {
    	if (audioContext===null) {return;};
        if (audioInput.files.length !== 0) 
        {
           file = audioInput.files[n];
           fileName = file.name;
           var index=fileName.indexOf("-",1);
           playerName=fileName.substring(0,index);
           musicName=fileName.substring(index+1,fileName.length-4);
           $("#musicName").text(musicName);
           $("#playerName").text(playerName);
           start(0);
       	}
     };
    
    function start(n) 
    {
        var fr = new FileReader();
        fr.onload = function(e) 
        {
        	var fileResult = e.target.result;//result储存读取结果
        	if (audioContext === null)return;
        	audioContext.decodeAudioData(fileResult, function(buffer) //解码成功
        	{
        		buf=buffer;
        		ll=setInterval(getString,1000);
        		visualize(audioContext, buffer,n);
        	});
        };
        fr.onerror = function(e) 
        {
            console.log(e);
        };
        fr.readAsArrayBuffer(file);
    }
    
    
    
    function visualize(audioContext, buffer,n) 
    {
        audioBufferSouceNode = audioContext.createBufferSource();
        analyser = audioContext.createAnalyser();
        audioBufferSouceNode.connect(analyser);
        analyser.connect(audioContext.destination);
        audioBufferSouceNode.buffer = buffer;
        volumeControl(audioContext, audioBufferSouceNode,1);
        stopStart=audioContext.currentTime;
        length=audioBufferSouceNode.buffer.duration;
        l=setInterval('play();', 1000);
        getString();
       	ll=setInterval(getString,1000);
        audioBufferSouceNode.start(0,n);
        status = 1;
        source = audioBufferSouceNode;
        audioBufferSouceNode.onended = function() 
        {
        	clearInterval(l);
      	    audioEnd();
        };
    }
    
    function volumeControl(audioContext,audioBufferSouceNode,n)
    {
    	gainNode=audioContext.createGain();
    	audioBufferSouceNode.connect(gainNode);
    	gainNode.connect(audioContext.destination);
    	gainNode.gain.value=n;
    }
    
    
    function audioEnd() //播放模式0顺序1随机2单曲3列表
    {
	    if(loca>length*1000)
   		{
   			clearInterval(ll);
    		clearInterval(l);
   		 	if(playstyle==0)
    		{
    			if(playNumber+1<fileLength)
    			{
    				playNumber++;
    				loca=0;
       	 			dofile(playNumber);
       	 		}
   		 	}else
   		 	if(playstyle==1)
   		 	{
   		 		playNumber=parseInt(Math.random()*fileLength);
   		 		loca=0;
       	 		dofile(playNumber);
   		 	}else
   		 	if(playstyle==2)
   		 	{
   		 		loca=0;
       	 		dofile(playNumber);
   		 	}else
   		 	if(playstyle==3)
   		 	{
   		 		if(playNumber+1<fileLength)
    			{
    				playNumber++;
    				loca=0;
       	 			dofile(playNumber);
       	 		}else
       	 		{
       	 			playNumber=0;
    				loca=0;
       	 			dofile(playNumber);
       	 		}
   		 	}
    	}
    }
	
/////////////////////////////////////////////以下为ajax请求歌词///////////////////
    	function getString()
    	{
    		url="getString?name="+fileName+"&time="+loca;
    		req.open("get", url,true);
    		req.send(null);
    		req.onreadystatechange=callback;
    	}  
    	function callback()
    	{
    		if(req.readyState==4)
    		{
    			if($("#qrc_ctn").text()!==req.responseText)$("#qrc_ctn").text(req.responseText);
    		}
    	}
//////////////////////////////////////////////////////////////////////////////////////	




