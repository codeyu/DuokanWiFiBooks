//
//                     File Controller
//
var fs = require('fs')
var formidable = require('formidable')
var iconv = require('iconv-lite');
// =======================================================
//  Dependencies
// =======================================================
    var app = module.app = module.parent.app;

// =======================================================
//  Models
// =======================================================

    var getFileList = function (path) { 
        var filesList = []; 
        readFile(path,filesList); 
        return filesList; 
    } 
    function readFile(path,filesList) { 
        var files = fs.readdirSync(path);
        files.forEach(walk); 
        function walk(file) { 
            states = fs.statSync(path+file); 
            if(states.isDirectory()) { 
                readFile(path+file,filesList); 
            } else { 
                var obj = new Object(); 
                obj.size = states.size; 
                obj.name = file;
                obj.path = path+file; 
                obj.id =  filesList.length + 1;
                filesList.push(obj); 
            } 
        } 
    } 
    function sortHandler(a,b) { 
        if(a.size > b.size) 
        return -1; 
        else if(a.size < b.size)
        return 1 
        else return 0; 
    }                                       
    function getUploadDir(){
        var uploadDir = './DuoKanUpload/';
        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        return uploadDir;
    }            
    var UPLOAD_DIR   = getUploadDir();         
    
// =======================================================
//  Exports
// =======================================================
    module.exports.display = function($){
        var filesList = getFileList(UPLOAD_DIR); 
        filesList.sort(sortHandler);
        $.data = filesList;
        $.end();
    }
    module.exports.upload = function($){
        if($.multipart){
    	// parse multipart form data
            var form = new formidable.IncomingForm();
            form.uploadDir=UPLOAD_DIR;
            form.parse($.request, function(err, fields, files) {
                fs.renameSync(files.newfile.path, UPLOAD_DIR + files.newfile.name);
                 $.success()
            });	
        } else {
            console.log($.body)
        }
    }
    module.exports.action = function($){
        if($.body._method==='delete'){
            fs.unlink(UPLOAD_DIR + decodeURI($.params.fileName));
        }
        $.end();
    }
    module.exports.download = function($){
        // 实现文件下载 
        var userAgent = $.header('user-agent');
        var fileName = decodeURI($.params.fileName);
        var filePath = UPLOAD_DIR + fileName;
        var stats = fs.statSync(filePath); 
        var attFileName = getContentDispositionFileName(userAgent,fileName)
        if(stats.isFile()){
            $.header('content-type', 'application/octet-stream');
            $.header('Content-Disposition', 'attachment; ' + attFileName);
            $.header('Content-Length', stats.size);
            
            var rs = fs.createReadStream(filePath);
            rs.on("data", function (chunk){
                 $.send(chunk);
            });
            rs.on("end", function () {
                $.end();
            });
        } else {
            $.error($.params.fileName, 'not find')
            $.failure()
        }
    }

    function getContentDispositionFileName(userAgent, filename) {
        var new_filename = encodeURIComponent(filename) 
        rtn = 'filename=' + new_filename;  
        if (userAgent != null)  
        {  
            userAgent = userAgent.toLowerCase(); 
            var Sys = {};
            var s;
            (s = userAgent.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
            (s = userAgent.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = userAgent.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
            (s = userAgent.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
            (s = uuserAgenta.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
            (s = userAgent.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
            if (Sys.ie || Sys.chrome)  
            {  
                rtn = 'filename=' + new_filename;  
            }  
         
            else if (Sys.firefox || Sys.opera)  
            {  
                rtn = 'filename*=UTF-8\'\'' + new_filename;  
            }  
            else if (Sys.safari)  
            {  
                
                console.log(safariFileName);
                rtn = 'filename=' + new Buffer(filename).toString('binary');  
            }  
        } 
        return rtn; 
    }