//https://stackoverflow.com/questions/29544371/finding-the-average-of-an-array-using-js/29544442
 Array.prototype.sum = function() {
    return this.reduce(function(a,b){return a+b;});
};
//
//https://stackoverflow.com/questions/23593052/format-javascript-date-to-yyyy-mm-dd
function GetFormattedDateAPI(date) {
	var todayTime = new Date(date);
    var month = (todayTime.getMonth()+1);
    var day = (todayTime.getDate());
    var year = (todayTime.getFullYear());
	if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    return [year,month,day].join("");
}
//
function GetFormattedDate(date) {
	var todayTime = new Date(date);
    var month = (todayTime.getMonth()+1);
    var day = (todayTime.getDate());
    var year = (todayTime.getFullYear());
	if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    return [year,month,day].join("/");
}
//
function PCAGo() {
	var PCAresults=PCAanalysis(PCAvar,PCAname,PCAxdata);
	var xdates=PCAxdata;
		// plot scores
	var rtrace=[];
	var nl= PCAresults.m;
	var adata=[];
 //
 	//clear previous;
	if (PCAgraph.firstChild){
	for (var jj=0;jj<4;	jj++) {rtrace[jj]=jj;}
		firstgraph = document.getElementById('PCAgraph');
		Plotly.deleteTraces(firstgraph,rtrace);
		Eigenvectors.removeChild(Eigenvectors.firstChild);
	}
	//
	for (var k=0; k<4;k++){
	  var name = k;
	  var pvar = PCAresults.PPE[k]*100;
	  //
	  var xdata=[];
	  var ydata=[];
	  var ddata=[];
		//
	  for (var i=0;i<nl;i++) {
		xdata[i]=xdates[i];
		ydata[i]=PCAresults.A[i][k];
		//adata.push(A[i][k]);
	  }
	  //console.log('yave ', yave);
	  //
		PCAgraph = document.getElementById('PCAgraph');
		var trace = {x: xdata,   y: ydata,   mode: 'lines',  name: (" a"+(k+1)+' var '+pvar.toFixed(0)+'%')};
		ddata=[trace];
		var llayout = {   title:'1-4 PCA loads: Time vs. Amplitude', plot_bgcolor: '#DCDCDC' ,legend: {"orientation": "h",xanchor:'center',x:0.5,y:-0.2},xaxis: {title: 'Date'}, yaxis: {title: 'Standardized Amplitudes'}};
		//console.log("plotting ", name);
		Plotly.plot(PCAgraph, ddata, llayout);
	};
	//write out eigen vectors to HTML
	formWriteEig(PCAname,PCAresults.E,4,"Eigenvectors");
		////
	//ClusterGo();
}
//
function ClusterGo() {
	//
	var PCAresults=PCAanalysis(PCAgrad,PCAname,PCAxdata);
	console.log("size PCAresults"+PCAresults.E.length);
	var xdates=PCAxdata;
		// plot scores
	var rtrace=[];
	var nl= PCAresults.m;
	//console.log(nl);
 // data for clustering
 	var ne = PCAresults.E.length;
	var kcount=0;
	for (var i=0;i<ne;i=i+2) {//i=i+2 for two variables; i=i+1 for one variables
		// TWO variables: var row=
		 var row=[PCAresults.E[0][i],PCAresults.E[0][i+1],PCAresults.E[1][i],PCAresults.E[1][i+1],PCAresults.E[2][i],PCAresults.E[2][i+1],PCAresults.E[3][i],PCAresults.E[3][i+1]];
		 data[kcount]=row;
		//data[kcount]=[PCAresults.E[0][i],PCAresults.E[1][i],PCAresults.E[2][i],PCAresults.E[3][i],PCAresults.E[4][i]];
		kcount++;
	}
	//
	var nclus=4;
	var kmeans = new KMeans({
		  canvas: document.getElementById('canvas'),
		  data: data,
		  k: nclus
		});
		//console.log(kmeans);
	////summurize cluster info
	var ccount=[nclus];
	var clusresults=[nclus];
	var vclusresults=[nclus];
	var iccount=0;	
	//ccount.fill(0);
	for (var j=0;j<nclus;j++) {
		iccount=0;
		for (var i=0;i<kcount;i++) {
			if (kmeans.assignments[i]==j){
			iccount++;
			}
		}
		ccount[j]=iccount;
	}
	//console.log(clusresults);
	///
		for (var j=0;j<nclus;j++) {
			var iclusr=[nl];
			var vclusr=[nl];
		for (var i=0;i<nl;i++) {iclusr[i]=0;vclusr[i]=0} // zero arrays each clustering
		for (var k=0;k<kcount;k++) {
			if (kmeans.assignments[k]==j){
				for (var i=0;i<nl;i++) {
					iclusr[i]=iclusr[i]+PCAgrad[2*k][i]/ccount[j]; //for TWO variables
					vclusr[i]=vclusr[i]+PCAgrad[2*k+1][i]/ccount[j];		
					//iclusr[i]=iclusr[i]+PCAgrad[k][i]/ccount[j]; // prices to cluster
					//vclusr[i]=vclusr[i]+Avdata[k][i]/ccount[j];		// volumes	to cluster
				}}}
		clusresults[j]=iclusr;
		vclusresults[j]=vclusr;
	}
	//	console.log(ccount,clusresults);
	//
	//clear previous;
	if (PCAgraph2.firstChild){
	for (var jj=0;jj<noTraces;	jj++) {rtrace[jj]=jj;}
		firstgraph = document.getElementById('PCAgraph2');
		Plotly.deleteTraces(firstgraph,rtrace);
		firstgraph = document.getElementById('PCAgraph2bar');
		Plotly.deleteTraces(firstgraph,rtrace);
		firstgraph = document.getElementById('PCAgraph3');
		Plotly.deleteTraces(firstgraph,rtrace);
		assignments.removeChild(assignments.firstChild);
		Scores.removeChild(Scores.firstChild);
	}
	//plots
	//price change
	for (var k=0; k<nclus;k++){
	  var name = k;
	  //
	  var xdata=[];
	  var ydata=[];
	  var ddata=[];
	//
	  for (var i=0;i<nl;i++) {
		xdata[i]=xdates[i];
		ydata[i]=clusresults[k][i];
	  }
	  //console.log('yave ', yave);
	  //
		PCAgraph = document.getElementById('PCAgraph2');
		var trace = {x: xdata,   y: ydata,   mode: 'lines',  name: ("cluster "+(k+1)+' ('+ccount[k]+')')};
		ddata=[trace];
		var llayout = {title:'Time vs. Cluster 3-day avg. Price Change', plot_bgcolor: '#DCDCDC' ,legend: {"orientation": "h",xanchor:'center',x:0.5,y:-0.2},xaxis: {title: 'Date'}, yaxis: {title: 'Daily Change price/mean'}};
		//console.log("plotting ", name);
		Plotly.plot(PCAgraph, ddata, llayout);
	};
	//plot volumes
	for (var k=0; k<nclus;k++){
	  var name = k;
	  var xdata=[];
	  var ydata=[];
	  var ddata=[];
	//
	  for (var i=0;i<nl;i++) {
		xdata[i]=xdates[i];
		ydata[i]=vclusresults[k][i];
	  }
	  //console.log('yave ', yave);
	  //
		PCAgraph = document.getElementById('PCAgraph2bar');
		var trace = {x: xdata, y: ydata, type: 'bar', name: ("cluster "+(k+1)+' ('+ccount[k]+')'), line: {shape: 'hv'}, type: 'scatter'};
		ddata=[trace];
		var llayout = {title:'Time vs. Cluster 3-day avg. Volume change', plot_bgcolor: '#DCDCDC' ,legend: {"orientation": "h",xanchor:'center',x:0.5,y:-0.2},xaxis: {title: 'Date'}, yaxis: {title: '0.1 x Daily Change volume / mean'}};
		//console.log("plotting ", name);
		Plotly.plot(PCAgraph, ddata, llayout);
	};	
		////plot scores
	for (var k=0; k<4;k++){
	  var name = k;
	  var pvar = PCAresults.PPE[k]*100;
	  //
	  var xdata=[];
	  var ydata=[];
	  var ddata=[];
		//
	  for (var i=0;i<nl;i++) {
		xdata[i]=xdates[i];
		ydata[i]=PCAresults.A[i][k];
		//adata.push(A[i][k]);
	  }
	  //console.log('yave ', yave);
	  //
		PCAgraph = document.getElementById('PCAgraph3');
		var trace = {x: xdata,   y: ydata,   mode: 'lines',  name: (" a"+(k+1)+' var '+pvar.toFixed(0)+'%')};
		ddata=[trace];
		var llayout = {   title:'1-4 PCA loads: Time vs. Amplitude ', plot_bgcolor: '#DCDCDC' ,legend: {"orientation": "h",xanchor:'center',x:0.5,y:-0.2},xaxis: {title: 'Date'}, yaxis: {title: 'Standardized Amplitudes'}};
		//console.log("plotting ", name);
		Plotly.plot(PCAgraph, ddata, llayout);
	};	
	//
	formWriteEig2(PCAname,PCAresults.E,kmeans.assignments,4,"assignments");
	formWriteScore(PCAresults.A,4,"Scores");
}
//
 function tpdata(time, price) {
    this.time = time;
    this.price = price;
}
//
function readCheckBox() {
	var nameseta =[];
  // Get the checkbox
	var count=0;
	for (i=0; i<50; i++){
	  var checkBox = document.getElementById("coin"+i);
	  // If the checkbox is checked, display the output text
	  if (checkBox.checked == true){
		nameseta[count]=checkBox.value;
		count++;
	  } else {
		;
	  }
	}
	console.log("new namset ", nameseta);
	return nameseta;
}
//
function PCAanalysis(X,labels,xdates) {
    /*
        Program for doing PCA analysis with top 100 coins from Coinmarket Cap
		THis program was adapted fpr code founf here: http://davywybiral.blogspot.ca/2012/11/numeric-javascript.html		
    */  
	//
	// X is dataset
	// Z is centered
	// ZS is standardized
	// C is covariance or corr 
	// E is eigen Vectors of C
	// Ev is eigen values
	// A is amplitudes A=ZE
	// amount of variance is Evi/sum(Ev)
	// S diagnol scaling matrix of var ii
	//
	//START loader symbols
	//
	X = numeric.transpose(X);
	var n = X.length;
	var cen = center(n);
	var Z=numeric.dot(cen,X);
	var m = Z.length;
	var nv = Z[0].length;
	//Covariance Matrix
    var C = numeric.div(numeric.dot(numeric.transpose(Z), Z), m);
	//Correlation matrix
	//var I =numeric.identity(C.length);
	//var S = numeric.sqrt(numeric.mul(I,C));
	//var ZS = numeric.dot(Z,numeric.inv(S));
	//var corr = numeric.div(numeric.dot(numeric.transpose(ZS), ZS), m);
	//C = corr;
    var E = numeric.svd(C).U;
	//A=ZE for Correlation matrix, use ZS
	var A = numeric.dot(Z,E);
	// Eigen vectors
	var EVM = numeric.dot(numeric.transpose(A), A);
	var EV = MtoV(EVM);
	//check
	var eg = numeric.eig(C);
	// variance explained
	var tVar=arraySum(EV);
	var PPE=numeric.div(EV,tVar);
	var PTV=varExplain(PPE);
	//console.log('labels ',labels,'eigen values ', numeric.transpose(E),'fraction total variation ', PPE, 'total variation explained ', PTV);
	var returnVar = new PCAreturn (m, PPE, PTV, tVar, E, A);
	return returnVar;
}
//
function PCAreturn(m, PPE, PTV, tVar, E, A) {
    this.m = m;
    this.PPE = PPE;
    this.PTV = PTV;
    this.tVar = tVar;
	this.E = E;
	this.A = A;
}
///
function center(n) {
    /*
        Returns centering matrix for matrix size m
    */        
    var I = numeric.identity(n);
    var O = [];
	var row =[];
	for (j=0; j<n; j++){row[j]=1/n;}
	for (i=0; i<n; i++){O[i]=row;}
	var Cen=numeric.sub(I,O);
    return Cen;
}
	//
function MtoV(M) {
    /*
        Returns centering matrix for matrix size m
    */        
    var m = M.length;
	var V =[];
	for (i=0; i<m; i++){V[i]=M[i][i];}
	//console.log(V);
    return V;
}
//
function arraySum(X){
		var count=0;
		var sum=0;
		var n=X.length;
		for (var i=0;i<n;i++){
			if (X[i]!='NAN'){
			sum=sum+X[i];
			count++;
			}
		}
		return sum;	
}
	//
function varExplain (PPE){
		var PTV=[];
		var amountVar=0;
		for (var jj=0; jj<PPE.length; jj++){amountVar=amountVar+PPE[jj]; PTV[jj]=amountVar;}
		return PTV;
}
	//
function formWriteEig (labels,E,k,id){
	//sort eigenvectors into ascending (to do)
	//
	var div_eigenv = document.getElementById(id);
	var div_container = document.createElement('div');
	div_container.className=("column");
	var para = document.createElement('p');
	var b = document.createElement('b');
	div_eigenv.appendChild(div_container);	
	div_container.appendChild(para);	
	para.appendChild(b);
	b.appendChild(document.createTextNode(" Eigenvectors: "));
	//
	var tbl = document.createElement('table');
	//tbl.className="t2";
	var tbdy = document.createElement('tbody');
	div_container.appendChild(tbl);
	tbl.appendChild(tbdy);
	//header
	var tr = document.createElement('tr');
	tbdy.appendChild(tr);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Coin'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Vector 1'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Vector 2'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Vector 3'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Vector 4'));
	tr.appendChild(td);
	// write out results,
	for (var i=0; i<E.length; i++) {
		var textOutLabel = labels[i];
		//alert(textOutCoef );
		var tr = document.createElement('tr');
		tbdy.appendChild(tr);
		var td = document.createElement('td');
		td.appendChild(document.createTextNode(textOutLabel));
		tr.appendChild(td);
		for (var j=0; j<k; j++){
			var textOutCoef = E[i][j];		
			var td = document.createElement('td');
			td.appendChild(document.createTextNode(textOutCoef.toFixed(3)));		
			tr.appendChild(td);
		}
	}
} // end function
function formWriteEig2 (labels,E,ass,k,id){
	//sort eigenvectors into ascending (to do)
	//
	var div_eigenv = document.getElementById(id);
	var div_container = document.createElement('div');
	div_container.className=("column");
	var para = document.createElement('p');
	var b = document.createElement('b');
	div_eigenv.appendChild(div_container);	
	div_container.appendChild(para);	
	para.appendChild(b);
	b.appendChild(document.createTextNode(" Eigenvectors: "));
	//
	var tbl = document.createElement('table');
	//tbl.className="t2";
	var tbdy = document.createElement('tbody');
	div_container.appendChild(tbl);
	tbl.appendChild(tbdy);
	//header
	var tr = document.createElement('tr');
	tbdy.appendChild(tr);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Coin'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Vector 1'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Vector 2'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Vector 3'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Vector 4'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Cluster'));
	tr.appendChild(td);
	var nlabel=0;
	// write out results,
	for (var i=0; i<E.length; i=i+2) {// i=i+2 for two variables
		var textOutLabel = (labels[nlabel]);
		//price row
		var tr = document.createElement('tr');
		tbdy.appendChild(tr);
		var td = document.createElement('td');
		td.appendChild(document.createTextNode(textOutLabel));
		tr.appendChild(td);
		for (var j=0; j<k; j++){
			var textOutCoef = E[i][j];		
			var td = document.createElement('td');
			td.appendChild(document.createTextNode(textOutCoef.toFixed(3)));		
			tr.appendChild(td);
		}
		var textOutLabel = ass[nlabel]+1;
		var td = document.createElement('td');
		td.appendChild(document.createTextNode(textOutLabel));
		tr.appendChild(td);
		//volume row whe 2 variables
		var textOutLabel = (labels[nlabel] + " v");
		var tr = document.createElement('tr');
		tbdy.appendChild(tr);
		var td = document.createElement('td');
		td.appendChild(document.createTextNode(textOutLabel));
		tr.appendChild(td);
		for (var j=0; j<k; j++){
			var textOutCoef = E[i+1][j];		
			var td = document.createElement('td');
			td.appendChild(document.createTextNode(textOutCoef.toFixed(3)));		
			tr.appendChild(td);
		}
		//var textOutLabel = ass[nlabel]+1;
		//var td = document.createElement('td');
		//td.appendChild(document.createTextNode(textOutLabel));
		//tr.appendChild(td);
		//
		nlabel++;
	}
} // end function
//
function formWriteASS (labels,ass,id){
	//sort eigenvectors into ascending (to do)
	//
	var div_eigenv = document.getElementById(id);
	var div_container = document.createElement('div');
	div_container.className=("column");
	var para = document.createElement('p');
	var b = document.createElement('b');
	div_eigenv.appendChild(div_container);	
	div_container.appendChild(para);	
	para.appendChild(b);
	b.appendChild(document.createTextNode(" Clusters: "));
	//
	var tbl = document.createElement('table');
	//tbl.className="t2";
	var tbdy = document.createElement('tbody');
	div_container.appendChild(tbl);
	tbl.appendChild(tbdy);
	//header
	var tr = document.createElement('tr');
	tbdy.appendChild(tr);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Coin'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Cluster'));
	tr.appendChild(td);
	// write out results,
	for (var i=0; i<ass.length; i++) {
		var textOutLabel = labels[i];
		//alert(textOutCoef );
		var tr = document.createElement('tr');
		tbdy.appendChild(tr);
		var td = document.createElement('td');
		td.appendChild(document.createTextNode(textOutLabel));
		tr.appendChild(td);
		//
		var textOutCoef = ass[i]+1;		
		var td = document.createElement('td');
		td.appendChild(document.createTextNode(textOutCoef));		
		tr.appendChild(td);
	}
} // end function
//
function formWriteScore (E,k){
	//sort eigenvectors into ascending (to do)
	//
	var div_eigenv = document.getElementById("Scores");
	var div_container = document.createElement('div');
	div_container.className=("column");
	var para = document.createElement('p');
	var b = document.createElement('b');
	div_eigenv.appendChild(div_container);	
	div_container.appendChild(para);	
	para.appendChild(b);
	b.appendChild(document.createTextNode(" Scores: "));
	//
	var tbl = document.createElement('table');
	//tbl.className="t2";
	var tbdy = document.createElement('tbody');
	div_container.appendChild(tbl);
	tbl.appendChild(tbdy);
	//header
	var tr = document.createElement('tr');
	tbdy.appendChild(tr);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('day'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Score 1'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Score 2'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Score 3'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Score 4'));
	tr.appendChild(td);
	/*var td = document.createElement('td');
	td.appendChild(document.createTextNode('Score 5'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Score 6'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Score 7'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Score 8'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Score 9'));
		var td = document.createElement('td');
	td.appendChild(document.createTextNode('Score 10'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Score 11'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Score 12'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Score 13'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Score 14'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Score 15'));
	tr.appendChild(td);*/
	// write out results,
	for (var i=0; i<E.length; i++) {
		var textOutLabel = i;
		//alert(textOutCoef );
		var tr = document.createElement('tr');
		tbdy.appendChild(tr);
		var td = document.createElement('td');
		td.appendChild(document.createTextNode(textOutLabel));
		tr.appendChild(td);
		for (var j=0; j<k; j++){
			var textOutCoef = E[i][j];		
			var td = document.createElement('td');
			td.appendChild(document.createTextNode(textOutCoef.toFixed(3)));		
			tr.appendChild(td);
		}
	}
} // end function

function startLoader(id){
	console.log(id);
	var div_new = document.getElementById(id);
	var div_container = document.createElement('div');
	div_container.className="loader";
	div_new.appendChild(div_container);
}
//
function graphIt() {
	/*
	
	*/
	var rtrace=[];
	//clear plot
	for (var jj=0;jj<noTraces;	jj++) {rtrace[jj]=jj;}
	firstgraph = document.getElementById('firstgraph');
	Plotly.deleteTraces(firstgraph,rtrace)
	firstgraphbar= document.getElementById('firstgraphbar');
	Plotly.deleteTraces(firstgraphbar,rtrace)
	//read check boxes
	var nameseta=readCheckBox() ;
	noTraces=nameseta.length;
	//
	for (var k=0; k<nameseta.length;k++){
		var name = nameseta[k];
		$.getJSON('http://www.allorigins.me/get?url=' + encodeURIComponent("https://coinmarketcap.com/currencies/"+name+"/historical-data/?start="+sdate+"&end="+ddate) + '&callback=?', function(response) {
		//
		var cname=$(response.contents).find('#historical-data');
		cname=cname[0].innerText.substring(22,30);
		//cname=cname.substring[21,30];
		//console.log(cname);
		var xdata=[];
		var ydata=[];
		var vdata=[];
		var ydatan=[];
		var vdatan=[];
		var data=[];
		var pricedata =$(response.contents).find('tbody tr');
		var nl= pricedata.length;
		for (var i=0;i<pricedata.length;i++) {
			j=nl-i-1;
			xdata[i]=new Date(pricedata[j].children[0].innerText);
			ydata[i]=Number(pricedata[j].children[4].innerText);
			vdata[i]=Number(pricedata[j].children[5].innerText.replace(/,/g, ''));	
		  }
		 var yave=ydata.sum()/ydata.length;
		 var vave=vdata.sum()/vdata.length;
		 //console.log('yave ', yave);
		 for (var i=0;i<pricedata.length;i++) {
			ydatan[i]=ydata[i]/yave;
			vdatan[i]=vdata[i]/vave;			
		 }
		//
		/*firstgraph = document.getElementById('firstgraph');
		var trace = {x: xdata,   y: ydatan,   mode: 'lines+markers', name: (cname +" ave "+yave.toFixed(2))};
		data=[trace];
		var layout = {   title:'Normalized Cryto-currency Time vs. Price' , legend: {"orientation": "h", xanchor:'center',x:0.5,y:-0.15},xaxis: {title: 'Date'},yaxis: {title: 'price / mean '}  };
		//console.log("plotting ", name);
		Plotly.plot(firstgraph, data, layout,);*/
		plotGrapgh('firstgraph',xdata,ydatan,cname,yave);
		plotGrapghBar('firstgraphbar',xdata,vdatan,cname,vave); 
	});
	};
} // end of graphIt
//
function loadDataPCA100(j,ccount){ 

		return ccount;
}
//
function loadCheckBox(){	
	/*
	get top 100 tickers
	load in check box
	load data for 100PCA
	*/
	var ccount=0;
	var ccount2=0;
 	$.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent("https://api.coinmarketcap.com/v1/ticker/?limit=50") + '&callback=?', function(data,status){
	if (status != "success"){alert("We are sorry. External data is not available");} 
	coinsNo=data.contents.length;
	//
	for (var i=0; i < coinsNo; i++) {
		coinlist[i]=data.contents[i].id;
		//console.log(data.contents[i].id);
	};
	//add freicoin
	coinlist[coinsNo-1]="freicoin";
	coinsNo=coinlist.length;
	//creat HTML check box
	var form = document.getElementById("coinCheckList");
	for (var j=0; j<coinsNo; j++){
		var labelbox = document.createElement('div');
		labelbox.style.display=("inline-block");
		labelbox.style.width=("200px");
		//console.log("trying to create label");
		var label = document.createElement('label');
		label.style.color=("#F8F9F9");
		label.style.fontSize=("1em");
		label.style.fontFamily=("verdana");
		label.for = ("coin"+j);
		label.innerHTML = coinlist[j];
		//
		var input = document.createElement('input');		
		input.type = ("checkbox");
		input.name = ("coin"+j);
		input.id = ("coin"+j);
		input.value = coinlist[j];
		//
		labelbox.appendChild(input);
		labelbox.appendChild(label);
		form.appendChild(labelbox);
		///
		// get data for PCA analysis of 100 		
		var pcaname = coinlist[j];
		var commonlength;
		$.getJSON('http://www.allorigins.me/get?url=' + encodeURIComponent("https://coinmarketcap.com/currencies/"+pcaname+"/historical-data/?start="+sdate+"&end="+ddate) + '&callback=?', function(response) {
			//
			var cname=$(response.contents).find('#historical-data');
			//console.log(cname);
			cname=cname[0].innerText.substring(22,30);
			//
			var ydata=[];
			var vdata=[];
			var data=[];
			var ydatan=[];
			var vdatan=[];			
			var graddata=[];
			var vraddata=[];
			var pricedata =$(response.contents).find('tbody tr');
			// get common length for data from first coin
			if (ccount==0){
				commonlength=pricedata.length;
				document.getElementById("ndays").innerHTML=commonlength;
			}
			//
			var nl= pricedata.length;
			//console.log('ccount is : ', ccount, ' nl ', nl,' commonlength ', commonlength);
			if (nl==commonlength){
				  for (var i=0;i<pricedata.length;i++) {
				  var jj=nl-i-1;	
					PCAxdata[i]=new Date(pricedata[jj].children[0].innerText);				  
					ydata[i]=Number(pricedata[jj].children[4].innerText);
					vdata[i]=Number(pricedata[jj].children[5].innerText.replace(/,/g, ''));	
				  }
				  var yave=ydata.sum()/ydata.length;
				  var vave=vdata.sum()/vdata.length;
				  //console.vavelog('yave ', yave);
				  for (var i=0;i<pricedata.length;i++) {
					ydatan[i]=ydata[i]/yave;
					vdatan[i]=vdata[i]/vave;						
				  }
				  for (var i=1;i<pricedata.length-2;i++) {
					 //adjusted value for derivative 2018-03-22 ydatan[i]=(ydata[i+1]-ydata[i])/yave 
					//ydatan[i]=(ydata[i+1]-ydata[i])/yave;
					//ydatan[i-2]=((ydata[i-1]-ydata[i-2])+(ydata[i]-ydata[i-1])+(ydata[i+1]-ydata[i])+(ydata[i+2]-ydata[i+1]))/(4*yave);
					graddata[i-1]=((ydata[i]-ydata[i-1])+(ydata[i+1]-ydata[i])+(ydata[i+2]-ydata[i+1]))/(3*yave); // 3 day average price change
					vraddata[i-1]=((vdata[i]-vdata[i-1])+(vdata[i+1]-vdata[i])+(vdata[i+2]-vdata[i+1]))/(3*10*vave);		// 		3 day average volume				
				  }
			  // for one variable
			    //PCAgrad[ccount]=graddata;	// variable used for clustering
				//Avdata[ccount]=vraddata;	// other variable
			  // for two variables
			  	//console.log("length PCAgrad "+PCAgrad.length);
				PCAgrad[ccount2]=graddata;
				PCAgrad[ccount2+1]=vraddata;
				ccount2=ccount2+2;
				//console.log("ccount2 is "+ccount2);
				PCAvar[ccount] =ydatan;
				PCAname[ccount] = cname;
				ccount++;	
				//console.log('ccount is : ', ccount, ' pcaname ', cname);
				document.getElementById("ncoins").innerHTML=ccount;
			}
		});
		//		
	};
	});
} // end of loadCheckBoxes
//
function plotGrapgh(graphId,xdata,ydatan,cname,yave){
	/*
	add traces to graph
	*/
    firstgraph = document.getElementById(graphId);
	var trace = {x: xdata,   y: ydatan,   mode: 'lines+markers', name: (cname +" ave "+yave.toFixed(2))};
	data=[trace];
	var layout = {   title:'Normalized Cryto-currency Time vs. Price',legend: {"orientation": "h", xanchor:'center', x:0.5, y:-0.15},xaxis: {title: 'Date'},yaxis: {title: 'price / mean '} };
	//console.log("plotting ", name);
	Plotly.plot(firstgraph, data, layout,);
}
	//
	//
function plotGrapghBar(graphId,xdata,vdata,cname,yave){
	/*
	add traces to graph
	*/
    var agraphId = document.getElementById(graphId);
	var trace = {x: xdata, y: vdata, type:'bar', name: (cname +" ave "+yave.toFixed(2)), line: {shape: 'hv'}, type: 'scatter'};
	var data=[trace];
	var layout = {title:'Cryto-currency Time vs. Volume Change',legend: {"orientation": "h", xanchor:'center', x:0.5, y:-0.15},xaxis: {title: 'Date'},yaxis: {title: 'volume / mean '}};
	//console.log("plotting ", name);
	Plotly.plot(agraphId, data, layout,);
}
	//
function loadOpeningGraph(){
	var nameset=["Bitcoin","Ethereum","Steem","Freicoin"];
	///
	noTraces=nameset.length;
	//var ccount=0;
	for (var k=0; k<nameset.length;k++){
	var name = nameset[k];
	$.getJSON('http://www.allorigins.me/get?url=' + encodeURIComponent("https://coinmarketcap.com/currencies/"+name+"/historical-data/?start="+sdate+"&end="+ddate) + '&callback=?', function(response,status) {
	  //
	  if (status != "success"){alert("We are sorry. External data is not available");} 
	  var cname=$(response.contents).find('#historical-data');
	  //console.log(response.contents);
	  cname=cname[0].innerText.substring(22,30);
	  //cname=cname.substring[21,30];
	  //console.log(cname);
	  var xdata=[];
	  var ydata=[];
	  var vdata=[];
	  var ydatan=[];
	  var vdatan=[];
	  var data=[];
	  var pricedata =$(response.contents).find('tbody tr ');
	  var nl= pricedata.length;
	  for (var i=0;i<pricedata.length;i++) {
	  j=nl-i-1;
		xdata[i]=new Date(pricedata[j].children[0].innerText);
		ydata[i]=Number(pricedata[j].children[4].innerText);
		vdata[i]=Number(pricedata[j].children[5].innerText.replace(/,/g, ''));
	  //console.log('cname ', phigh, plow, ydata[i], vdata[i]);		
	  }
	  var yave=ydata.sum()/ydata.length;
	  var vave=vdata.sum()/vdata.length;
	  for (var i=0;i<pricedata.length;i++) {
		ydatan[i]=ydata[i]/yave;
		vdatan[i]=vdata[i]/vave;
	  }
	//
	plotGrapgh('firstgraph',xdata,ydatan,cname,yave);   
	plotGrapghBar('firstgraphbar',xdata,vdatan,cname,vave); 
	});
	};
}