//
//                     File Controller
//
var fs = require('fs')
var formidable = require('formidable')
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
                obj.id =  1;
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
                
                
    
// =======================================================
//  Exports
// =======================================================
    module.exports.display = function($){
        var filesList = getFileList("D:/tmp/"); 
        filesList.sort(sortHandler);
        $.data = filesList;
        $.end();
    }
    module.exports.upload = function($){
        var filesList = getFileList("D:/tmp/"); 
        if($.multipart){
    	// parse multipart form data
            var form = new formidable.IncomingForm();
            form.uploadDir='D:/temp/';
            form.parse($.request, function(err, fields, files) {
                fs.renameSync(files.newfile.path, "D:/tmp/" + files.newfile.name);
                 $.success()
            });	
        } else {
            console.log($.body)
        }
    }
    module.exports.action = function($){
        if($.body._method==='delete'){
            console.log($.body);
            fs.unlink('D:/tmp/' + $.params.fileName);
        }
        $.end();
    }
    module.exports.download = function($){
        // 实现文件下载 
        var fileName = $.params.fileName;
        console.log($.params);
        var filePath = 'D:/tmp/' + fileName;
        console.log(filePath);
        var stats = fs.statSync(filePath); 
        if(stats.isFile()){
            $.header('content-type', 'application/octet-stream');
            $.header('Content-Disposition', 'attachment; filename='+fileName);
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