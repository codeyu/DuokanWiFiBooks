//
//                      Project Index
//

// =======================================================
//  Require Diet
// =======================================================
var server = require('diet')

// =======================================================
//  Create Server
// =======================================================
var app = module.app = server()
    app.config = require('./config')(app)
    app.listen(app.config.host)

// =======================================================
//  View Engine
// =======================================================
    var ect = require('ect')({ 
        root  : app.path+'/views/html/', 
        open  : '{{', 
        close : '}}',
        cache : true,
        watch : true,
        gzip  : true, 
        ext   : '.html'
    })
    
    app.view('html', ect.render)
    
// =======================================================
//  Static Files
// ======================================================= 
    var static  = require('diet-static')({ path: app.path+'/views/' });
    app.view('file', static)
    
// =======================================================
//  Cookies
// =======================================================
    var cookies = require('diet-cookies');
    app.header(cookies);
    
// =======================================================
//  Initialize Models & Routes
// =======================================================
    require('./models')(function(){
        require('./routes')
    })
    
    