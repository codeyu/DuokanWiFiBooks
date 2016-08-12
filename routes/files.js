//
//                     Files Routes
//

// =======================================================
//  Dependencies
// =======================================================
    var app = module.app = module.parent.app

// =======================================================
//  Controllers
// =======================================================
    var files = app.controller('files')

// =======================================================
//  Routes
// =======================================================
    app.get('/files', files.display)
    app.get('/files/:fileName', files.download)
    app.post('/files', files.upload)
    app.post('/files/:fileName', files.action)
  
                    