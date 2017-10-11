///////////////////////////////////////////////////////////////////////////////
//            Created by Shashank Singh (a606169)                            //
//                   Browser Sandbox                                         //
///////////////////////////////////////////////////////////////////////////////
/*
                              Settings:
*/
///////////////////////////////////////////////////////////////////////////////
const host = "127.0.0.1"
const port = 8082;
///////////////////////////////////////////////////////////////////////////////
const express = require('express');
const app = express();
const jsdom = require("jsdom");
//const cookieJar = new jsdom.CookieJar();
const { JSDOM } = jsdom;
var request = require('request');
var url = require('url')
var fs = require('fs')
var scriptContent = fs.readFileSync("listen.js",'utf-8')
//app.use( bodyParser.json() );
//app.use( bodyParser.urlencoded({extended:true}));
var contentFilter = function(body){
    body.innerHTML = body.innerHTML.replace(/This/ig,'[ removed ]');
    //https://www.w3schools.com/html/
}
app.get('/g',(req,res)=>{
  request.get(req.param('u')).pipe(res);
});
app.post('/g',(req,res)=>{
  request.get(req.param('u')).pipe(res);
});
app.post('/o',(req,res)=>{
  console.log("loading:"+req.param("u"));
  var headers = req.headers;
  const dom = JSDOM.fromURL( req.param("u") ,{
    connection : headers["connection"],
    cacheControl : headers["cache-control"],
    upgradeInsecureRequests : headers["upgrade-insecure-requests"] ,
    userAgent : headers["user-agent"],
    accept : headers["accept"] ,
    acceptEncoding : headers["accept-encoding"] ,
    acceptLanguage : headers["accept-language"] ,
    cookie : headers["cookie"] ,
  //  ifNoneMatch : headers["if-none-match"] ,
    runScripts: "dangerously"
}).then(
  dom =>{
    var body = dom.window.document.body ;
    // Scripts to append
    //contentFilter(body);
    body.innerHTML += scriptContent;
    var srcs = dom.window.document.querySelectorAll("[src]");
    for(var i=0;i<srcs.length;i++)
      if( srcs[i].src.indexOf(/data:/i)!=-1)
        srcs[i].src = "http://" + host + ":" + port + "/g?u=" + srcs[i].src;
    var links = dom.window.document.querySelectorAll("link");
    for(var i=0;i<links.length;i++) links[i].href = "http://" + host + ":" + port + "/g?u=" + links[i].href;
    var as = dom.window.document.querySelectorAll("a");
    for(var i=0;i<as.length;i++)
      {
        //if(as[i].href.indexOf(/javascript:/i)==-1)
          as[i].href = "http://" + host + ":" + port + "/o?u=" + as[i].href;
      }
    res.set({"contentType":"text/html"});
    dataContent = "<!DOCTYPE html >\n" + dom.window.document.documentElement.outerHTML;
    dataContent = dataContent.replace(/\"\s\//g,"http://" + host + ":" + port +"?o=" + url.parse(req.param("u")).hostname +'"/');
    res.send(dataContent);
  });
});
app.get('/o',(req,res)=>{
  console.log("loading:"+req.param("u"));
  var headers = req.headers;
  const dom = JSDOM.fromURL( req.param("u") ,{
    connection : headers["connection"],
    cacheControl : headers["cache-control"],
    upgradeInsecureRequests : headers["upgrade-insecure-requests"] ,
    userAgent : headers["user-agent"],
    accept : headers["accept"] ,
    acceptEncoding : headers["accept-encoding"] ,
    acceptLanguage : headers["accept-language"] ,
    cookie : headers["cookie"] ,
  //  ifNoneMatch : headers["if-none-match"] ,
    runScripts: "dangerously"
}).then(
  dom =>{
    var body = dom.window.document.body ;
    // Scripts to append
    //contentFilter(body);
    body.innerHTML += scriptContent;
    var srcs = dom.window.document.querySelectorAll("[src]");
    for(var i=0;i<srcs.length;i++)
      if( srcs[i].src.indexOf(/data:/i)!=-1)
        srcs[i].src = "http://" + host + ":" + port + "/g?u=" + srcs[i].src;
    var links = dom.window.document.querySelectorAll("link");
    for(var i=0;i<links.length;i++) links[i].href = "http://" + host + ":" + port + "/g?u=" + links[i].href;
    var as = dom.window.document.querySelectorAll("a");
    for(var i=0;i<as.length;i++)
      {
        //if(as[i].href.indexOf(/javascript:/i)==-1)
          as[i].href = "http://" + host + ":" + port + "/o?u=" + as[i].href;
      }
    res.set({"contentType":"text/html"});
    dataContent = "<!DOCTYPE html >\n" + dom.window.document.documentElement.outerHTML;
    dataContent = dataContent.replace(/\"\s\//g,"http://" + host + ":" + port +"?o=" + url.parse(req.param("u")).hostname +'"/');
    res.send(dataContent);
  });
});

var server = app.listen(port,()=>{
  console.log( "Shashank's browser sandbox started at " + server.address().port);
});
