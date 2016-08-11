//
//                     File Controller
//
var fs = require('fs')
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