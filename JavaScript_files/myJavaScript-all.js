function loadDropMenu(){
//On load, reads API and loads drop down menus
	var formid=["C1","C2","C3","C4","C5"];
 	$.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent("https://api.livecoin.net/info/coinInfo") + '&callback=?', function(data,status){
		if (status != "success"){alert("We are sorry. External data is not available");} 
		coinsNo=data.contents.info.length;
		for (var i=0; i < coinsNo; i++) {
			coinlist[i]=data.contents.info[i].symbol;
		};
		coinlist[coinsNo+1]="USD";
		coinlist[coinsNo+2]="EUR";
		coinlist[coinsNo+3]="RUR";
		coinsNo=coinlist.length;
		for (var j=0; j<5; j++){
			var select = document.getElementById(formid[j]);
			for (var i=0; i < coinsNo; i++) {
				var opt = document.createElement('option');
				opt.value = coinlist[i];
				opt.innerHTML = coinlist[i];
				select.appendChild(opt);
			};	
		};
	});
}
//
function loadPairRates(){
// On load, reads API for trade pair rates
 	$.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent("https://api.livecoin.net/exchange/maxbid_minask") + '&callback=?', function(data){
	pairNo=data.contents.currencyPairs.length;
		for (var i=0; i < pairNo; i++) {
			pairrates[i]=data.contents.currencyPairs[i];
		}
	});
}
//
function tradeOptMain(opti){
//Main function for Trading Optimiser Algorithim
//RE 2017-12-01
//this program different trading permutaion of max 5 coins on one exchange
//coins - string names of coins
//startEndIndex - array of start end pairs
//branchResults - array of objects containing results of trading calcs
//start global iterations
console.log("opti ",opti);
if (opti==0){iter=1;}
if (opti==1){iter=100;}
console.log("Starting !");
setMaxconvert(0);
console.log("Maxconvert 0!");
for (var globaliter=0; globaliter < iter; globaliter++){ //future work random iterations
// Check if results already generated, if so, erase
	var element =  document.getElementById('div_results');
	if (typeof(element) != 'undefined' && element != null)
	{
	  // exists.
		var element = document.getElementById("div_results");
		element.parentNode.removeChild(element);
	}
// read in coins
	if (typeof coins == "undefined" || !(coins instanceof Array)) {
    var coins = [];	}
	coins.length=0;
//
	if (opti==0){ //read from screen
		coins[0] = document.getElementById("C1").value;
		coins[1] = document.getElementById("C2").value;
		coins[2] = document.getElementById("C3").value;
		coins[3] = document.getElementById("C4").value;
		coins[4] = document.getElementById("C5").value;
		//console.log(coins[1],coins[2],coins[3],coins[4]);
	var ncoins=coins.length;
	}
	//
	if (opti==1){ //choose coins randomly
		var coinNo= getCoinNo();
		var secondChoice=["ETH", "XMR", "DASH"]
		var thirdChoice=["USD", "EUR", "RUR"]
		var coinlist= getCoinlist();;
			coins[0] = "BTC";
			coins[1] = secondChoice[getRandomInt(3)];
			coins[2] = thirdChoice[getRandomInt(3)];
			coins[3] = coinlist[getRandomInt(coinNo)];
			coins[4] = coinlist[getRandomInt(coinNo)];
			console.log(coins[0],coins[1],coins[2],coins[3],coins[4]);
		var ncoins=coins.length;
		}

//  get rates data from, array built from API from exchange
	var ratepairs = GetPairrates();
	for (var i=0; i<ncoins; i++){
		for (var j=i+1; j<ncoins; j++) {
			//element ids
			var refRT="RT"+i+j;
			var refFT="FT"+i+j;
			var refST="ST"+i+j;
			var refA="A"+i+j;
			var refB="B"+i+j;
			//trade pair
			var textA=coins[i]+"/" +coins[j];
			var textB=coins[j]+"/" +coins[i];
			var found=0;
			//loop through api data
			for (var k=0; k<ratepairs.length; k++){
											//console.log(textA,textB,ratepairs[k].symbol);
				if (textA==ratepairs[k].symbol){
					console.log("rate pair found:",ratepairs[k].symbol);
					document.getElementById(refRT).innerHTML=ratepairs[k].symbol;
					document.getElementById(refFT).innerHTML=coins[i];
					document.getElementById(refST).innerHTML=coins[j];
					document.getElementById(refA).innerHTML=ratepairs[k].minAsk;
					document.getElementById(refB).innerHTML=ratepairs[k].maxBid;
					found=1;
				}
				else if (textB==ratepairs[k].symbol){
					console.log("rate pair found:",ratepairs[k].symbol);
					document.getElementById(refRT).innerHTML=ratepairs[k].symbol;
					document.getElementById(refFT).innerHTML=coins[j];
					document.getElementById(refST).innerHTML=coins[i];
					document.getElementById(refA).innerHTML=ratepairs[k].minAsk;
					document.getElementById(refB).innerHTML=ratepairs[k].maxBid;
					found=1;
					;
				}
				else {;}
					
			
		}
		if (found==0){
					//console.log("rate pair not found:",textA);
					document.getElementById(refRT).innerHTML=textA;
					document.getElementById(refFT).innerHTML=coins[i];
					document.getElementById(refST).innerHTML=coins[j];
					document.getElementById(refA).innerHTML=" ";
					document.getElementById(refB).innerHTML=" "
		}
	}
	}
// write coin exchange matrix for FROM/TO calcs
// write row col headers
	for (var i=1; i<ncoins+1; i++){
		//element ids
		var refRh="hR"+i;
		var refCh="hC"+i;
		document.getElementById(refRh).innerHTML=coins[i-1];
		document.getElementById(refCh).innerHTML=coins[i-1];
	}
//
for (var i=0; i<ncoins; i++){
	var coinFrom=coins[i]
	for (var j=0; j<ncoins; j++) {
		if (i==j) {;}
		else {
			if (i<j) {var im=i;jm=j;}
			if (i>j) {var im=j;jm=i;}
			var coinTO=coins[j];
			//check coin1/coin2 and value and change for FROM/TO;
			var rfc = "FT" + im +jm;
			var rsc = "ST" + im +jm;
			var rmi = "R"+(i+1)+ (j+1);
			var aski = "A"+ im +jm;
			var bidi = "B"+ im +jm;
			var mrate=0, askRate=0, bidRate=0;
			askRate = document.getElementById(aski).innerHTML;
			bidRate = document.getElementById(bidi).innerHTML;
			var rfcoin=document.getElementById(rfc).innerHTML;
			var rscoin=document.getElementById(rsc).innerHTML;
			//
			if (!(askRate>0) || !(bidRate>0) ){document.getElementById(rmi).innerHTML = " ";} // skip when no rate between two coins
			else {
				if (coinTO == rfcoin ) {
					mrate=1/askRate; 
					var valueOut = mrate.toFixed(8);
					document.getElementById(rmi).innerHTML = valueOut;}
				else {
					mrate=bidRate*1.0; 
					var valueOut = mrate.toFixed(8);
					document.getElementById(rmi).innerHTML = valueOut;}
				//alert(mrate);				
				}
		}
	}  
}
	//Read in coin exchange matrix to array
	var rates = new Array(ncoins);
	var rc;
	for (var i=0; i<ncoins; i++){
		rates[i] = new Array(ncoins);
		for (var j=0; j<ncoins; j++) {
			rc="R"+(i+1)+(j+1);
			rates[i][j] = document.getElementById(rc).innerHTML;
			//alert(" rc " + rc + " i:"+i+" j:"+ j+" rate:" +rates[i][j]);
		}
	}
	//create Start End pairs
	var maxSEPairs = factorial(ncoins)/factorial(ncoins-2);// max possible pairs
	var startEndIndex=genSEPairs(coins,ncoins);
	//echoSETable(startEndIndex,coins);
	//
	//Generate branch and excecute trade
	var branchResults=calcBranchTrades(coins,startEndIndex,rates);
	//Sumarize results
} //end global iterations
} // end main
//
//
function factorial(n){
//
//FUNCTION: Calculate N!
//RE 2017-11-11
	var f=1;
	if (n==0){n=1;}
	for (i=n; i>0; i--){f=f*i;}
	return f;
}
//
function genSEPairs(coins,ncoins){
//FUNCTION: Generate Start/End Pairs
//RE 2017-11-11
	var sen=0;
	var startEndIndex=[];
	for (i=0; i<ncoins; i++) {
		for (j=0; j<ncoins; j++) {
			if (i != j) {
				startEndIndex[sen]=new SEPair(sen,i,j);
				sen++;				
			}
		}
	}
	//console.log(startEndIndex);
	return startEndIndex;
}

function genBranches(coins,start,end,rates){
//FUNCTION: Generate trading Branches (Method 1: fixed at max 5 coins, non recursive)
//RE 2017-11-12
	var branchIndex=[];
	var bi=0,j=0,k=0,l=0,m=0;
	for (j=0; j<=(coins.length-2); j++) {
		switch (j) {
			case 3:
				for (k=0; k<(coins.length); k++) 
					{for (l=0; l<(coins.length); l++)
						{for (m=0; m<(coins.length); m++)
							{
							if (k==l || k==m || k==start || k==end|| l==m || l==end || l==start || m==start || m==end) {;}
							else if(!(rates[l][m]>0)||!(rates[k][l]>0)||!(rates[start][k]>0)||!(rates[m][end]>0)){;}
							else {		
									branchIndex[bi]=new branchi(j+2,start,k,l,m,end);
									bi++;
								}
							}
							}
						}
			break;
			case 2:
				for (k=0; k<(coins.length); k++) {for(l=0; l<(coins.length); l++){
					if (k==l || k==start || k==end || l==end || l==start) {;}
					else if(!(rates[k][l]>0)||!(rates[start][k]>0)||!(rates[l][end]>0)){;}
					else{
					branchIndex[bi]=new branchi(j+2,start,k,l,end,null);
					bi++;
					//alert("case 2");
					}					
				}}
			break;
			case 1: 
				for (k=0; k<(coins.length); k++) {
					if (k==start || k==end) {;}
					else if(!(rates[start][k]>0)||!(rates[k][end]>0)){;}
					else{
					branchIndex[bi]=new branchi(j+2,start,k,end,null,null);
					bi++;
					//alert("case 1");
					}
				}
			break;
			default:
				branchIndex[bi]=new branchi(j+2,start,end,null,null,null);
				bi++;
				//alert("case 0");
		}
	}
	return branchIndex;
}

function calcBranchTrades(coins,startEndIndex,rates){
// FUNCTION: Calculates Trade Branches
// Calculates trades
// RE 2017-12-01
	var countBranch=0;
	var element1 = document.body;
	var div_results = document.createElement('div');
	div_results.id="div_results";
	element1.appendChild(div_results);
	//For each Start-Start End pair, generate branch and excecute trade
	for (var si=0; si<startEndIndex.length; si++ ){
	var branchIndex=genBranches(coins,startEndIndex[si].start,startEndIndex[si].end,rates);
	//echoBranches(branchIndex,coins);
	//read through trade branches and excecute calcs
	//zero arrays
	if (typeof branchResults == "undefined" || !(branchResults instanceof Array)) {
    var branchResults = [];	}
	branchResults.length=0;
	if (typeof branchValue == "undefined" || !(branchValue instanceof Array)) {
    var branchValue = [];	}
	branchValue.length=0;
	if (typeof branchValStart == "undefined" || !(branchValStart instanceof Array)) {
    var branchValStart = [];}
	branchValStart.length=0;
		//console.log("initializing branchValStart", branchValStart);
	var nbranch = branchIndex.length;
	for (var i=0; i<nbranch; i++) {
		//branchValStart[i]=0;
		//console.log("starting loop branchValStart ", branchValStart[i])
		//alert("check " + i);
		var ntrades=branchIndex[i].j;
		var TValue = 1,irate=1;
		for (itrade = 1; itrade<ntrades; itrade++) {
			//alert("check 2" + itrade);
			sellC=Object.values(branchIndex[i])[itrade];
			buyC=Object.values(branchIndex[i])[itrade+1];
			if (sellC<buyC){irate=rates[sellC][buyC];}
			else{irate=rates[sellC][buyC];}
			TValue = TValue*irate;	
			//alert("trade: " +i+"Sell: " + sellC + "Buy: " +buyC + "rate: " +irate+"Tvalue :" + TValue);		
		}
		branchValue[i]=TValue;
		//convert back to Start
		sellC=Object.values(branchIndex[i])[ntrades];
		buyC=Object.values(branchIndex[i])[1];
		//alert("Sell: " + sellC + "Buy: " +buyC);
		if (sellC<buyC){irate=rates[sellC][buyC];}
		else{irate=rates[sellC][buyC];}
		branchValStart[i]=TValue*irate;
		//alert("Branch: " + i + "Tvalue: " + TValue + "TvalueStart: " + branchValStart[i]);
		countBranch++;
		branchResults[countBranch]=branchResultsi(countBranch,si,i,startEndIndex[si].start,startEndIndex[si].end,branchValue[i],branchValStart[i]);
	}
	FormbranchValues(branchIndex,coins,branchValue,branchValStart,startEndIndex[si].start,startEndIndex[si].end);
	}
	return branchResults
}

function echoBranches(Branchset,coins){
//FUNCTION: Echo Trade Branches SIMPLE
//RE 2017-11-11
//
	// write out header
	document.getElementById("p3").innerHTML="Generate Branches"
	var count=0
	for (var i=0; i<Branchset.length; i++) {		
		textOut =	(Branchset[count].j + " : "
					+ coins[Branchset[count].first] + " -> "  
					+ coins[Branchset[count].second] + " -> " 
					+ coins[Branchset[count].third] + " -> " 
					+ coins[Branchset[count].fourth] + " -> " 
					+ coins[Branchset[count].fifth]); 
		//alert(bob);
		var para = document.createElement("p");
		var node = document.createTextNode(textOut);
		para.appendChild(node);
		var element = document.getElementById("div2");
		element.appendChild(para);		
		count++;
	}
}

function echobranchValues(Branchset,coins,branchValue,branchValStart){
//FUNCTION: Echo Trade Branches trade values SIMPLE
//RE 2017-11-11
	// write out header
	document.getElementById("p4").innerHTML="Branches Results"
	var count=0
	for (var i=0; i<Branchset.length; i++) {		
		textOut =	(Branchset[count].j + " : "
					+ coins[Branchset[count].first] + " -> "  
					+ coins[Branchset[count].second] + " -> " 
					+ coins[Branchset[count].third] + " -> " 
					+ coins[Branchset[count].fourth] + " -> " 
					+ coins[Branchset[count].fifth] + " -> "
					+ branchValue[count] + " -- "
					+ branchValStart[count]); 
		//alert(bob); 
		var para = document.createElement("p");
		var node = document.createTextNode(textOut);
		para.appendChild(node);
		var element = document.getElementById("div2");
		element.appendChild(para);		
		count++;
	}
}

function FormbranchValues(Branchset,coins,branchValue,branchValStart,start,end){
//FUNCTION: Echo Trade Branches trade values FORMATTED
//RE 2017-11-11
	//Create elements
	var div_results2 = document.getElementById("div_results");
	var para = document.createElement('p');
	var b = document.createElement('b');
	div_results2.appendChild(para);	
	para.appendChild(b);
	b.appendChild(document.createTextNode("Trade Results: 1.0 " + coins[start] + " to " + coins[end]));
	var tbl = document.createElement('table');
	//tbl.className="t2";
	var tbdy = document.createElement('tbody');
	div_results.appendChild(tbl);
	//header
	var tr = document.createElement('tr');
	tbdy.appendChild(tr);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Index'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Permutation'));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode(coins[end]));
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(document.createTextNode('Reconvert Ratio'));
	tr.appendChild(td);
	// identify max last coin and reconvert > 1
	var maxLast=0;
	for (var i=0; i<Branchset.length; i++) {
		if (branchValue[i] >= maxLast) {
			maxLast = branchValue[i];
		}
	}
	// write out results,
	for (var i=0; i<Branchset.length; i++) {
		var textOut = " " + coins[Branchset[i].first];
		var branchEntry = Object.values(Branchset[i])
		//alert(branchEntry);
		for (var j=2; j<6 ; j++){
			if (branchEntry[j] || branchEntry[j] ==0){
					textOut = textOut + " -> "+ coins[branchEntry[j]] ; 
			}
		}
		//alert(bob);
/* 		textOut =	(Branchset[i].j + " : "
					+ coins[Branchset[i].first] + " -> "  
					+ coins[Branchset[i].second] + " -> " 
					+ coins[Branchset[i].third] + " -> " 
					+ coins[Branchset[i].fourth] + " -> " 
					+ coins[Branchset[i].fifth] );  */
		var tr = document.createElement('tr');
		tbdy.appendChild(tr);
		var td = document.createElement('td');
		td.appendChild(document.createTextNode(i));
		tr.appendChild(td);		
		var td = document.createElement('td');
		td.appendChild(document.createTextNode(textOut));		
		tr.appendChild(td);		
		var td = document.createElement('td');
		if (branchValue[i]==0){var valueOut = " - ";}
		else {var branchValueO = branchValue[i];
			if (branchValueO == maxLast) {tr.style.backgroundColor="yellow";} // highlight best branch
			var valueOut =  branchValue[i].toFixed(8)
		}
		td.appendChild(document.createTextNode(valueOut));
		tr.appendChild(td);		
		var td = document.createElement('td');
		if (branchValStart[i]==0){var branchValStartO = " - ";}
		else {var branchValStartO = branchValStart[i].toFixed(3);}
		// record highest value
		var lastMax=getMaxconvert();
		if (branchValStartO > lastMax){
			console.log("last max ",lastMax);
			console.log("new value ",branchValStartO, branchValStart[i]);
			lastMax=branchValStartO;
			setMaxconvert(branchValStartO);
			document.getElementById("BT1").innerHTML= coins[Branchset[i].first];   
			document.getElementById("BT2").innerHTML= coins[Branchset[i].second];  
			document.getElementById("BT3").innerHTML= coins[Branchset[i].third];  
			document.getElementById("BT4").innerHTML= coins[Branchset[i].fourth];  
			document.getElementById("BT5").innerHTML= coins[Branchset[i].fifth]; 
			document.getElementById("RCON").innerHTML=branchValStartO;
		} 
		// change color of text at limit value
		if (branchValStartO >= 1.0) {
			td.style.color="red";
		} // highlight profit opportunity
		td.appendChild(document.createTextNode(branchValStartO));
		tr.appendChild(td);
		//write to best trade box

	}
		tbl.appendChild(tbdy);
}


function echoSE(startEndIndex){
//FUNCTION: Echo Start-End Pairs SIMPLE
//RE 2017-11-11
	var count=0
	for (i=0; i<startEndIndex.length; i++) {		
		textOut ="startEndIndex " + startEndIndex[count].seindex + " : " + coins[startEndIndex[count].start] + " -> " + coins[SEIndex[count].end]; 
		//alert(bob);
		var para = document.createElement("p");
		var node = document.createTextNode(textOut);
		para.appendChild(node);
		var element = document.getElementById("div1");
		element.appendChild(para);		
		count++;
	}
}
//
function echoSETable(startEndIndex,coins) {
//FUNCTION: Echo Start-End Pairs Table
//RE 2017-11-11
//Based on code by Craig Taub, https://stackoverflow.com/questions/14643617/create-table-using-javascript
	// write out header
	var element = document.getElementById("div1");
	document.getElementById("p1").innerHTML="Generate startEndIndex"
	var tbl = document.createElement('table');
    tbl.style.width = '30%';
    //tbl.setAttribute('border', '0');
    var tbdy = document.createElement('tbody');
	//Header
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	var U = document.createElement('U');
	U.appendChild(document.createTextNode('index'));
	td.appendChild(U);
	tr.appendChild(td);
	var td = document.createElement('td');
	var U = document.createElement('U');
	U.appendChild(document.createTextNode('start'));
	td.appendChild(U);
	tr.appendChild(td);
	var td = document.createElement('td');
	var U = document.createElement('U');
	U.appendChild(document.createTextNode('end'));
	td.appendChild(U);
	tr.appendChild(td);
	tbdy.appendChild(tr);
	//Table body
	var count=0;
	var text;
	// loop over Start End Pairs
    for (var i = 0; i < startEndIndex.length; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < 3; j++) {
				if (j==0) {text = startEndIndex[count].index}
				if (j==1) {text = coins[startEndIndex[count].start]}
				if (j==2) {text = coins[startEndIndex[count].end]}
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(text));
                tr.appendChild(td);
            }
		count++;
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    element.appendChild(tbl);
}
//
function SEPair(seindex,start,end){
//CONSTRUCTOR: SEPair
//RE 2017-11-11
	this.seindex=seindex;
	this.start=start;
	this.end=end;
}
function branchi(j,first,second,third,fourth,fifth){
//CONSTRUCTOR: Branch
//RE 2017-11-11
	this.j=j;
	this.first=first;
	this.second=second;
	this.third=third;
	this.fourth=fourth;
	this.fifth=fifth;
}

function branchResultsi(n,i,j,branchValue,branchValueStart){
//CONSTRUCTOR: branchValue
//RE 2017-11-11
	this.n=n;
	this.i=i;
	this.j=j;
	this.branchValue=branchValue;
	this.branchValueStart=branchValueStart;
}
//
////Debugging function to echo factorial
function operate(){
	var n = document.getElementById('b1').value;
	var bob = factorial(n);
//document.getElementById('a3').innerHTML = bob;
}

function getRandomInt(max) {
// random integer generator https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  return Math.floor(Math.random() * Math.floor(max));
}
// Getter and Setter
function getMaxconvert(){
	return maxconvert;
	}
//
function setMaxconvert(value){
	maxconvert=value;
	console.log("set max value = ",value)
	}
//
function GetPairrates(){
// Get function to access pair rates
	return pairrates;
	}
// 
function getCoinlist(){
// Get function to access coinlist
	return coinlist;
	}	
//
function getCoinNo(){
// Get function to access coinN
	return coinsNo;
	}	