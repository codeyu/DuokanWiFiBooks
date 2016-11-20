//
//                  Project Configuration
//

module.exports = function(app){
    // Create Safe Reference to the Environment Variable
    var environment = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : null ;
    
    // =======================================================
    //  Local
    // =======================================================
    if(environment == 'local' || !environment){
        return {
            host: 'http://localhost:3000'
        }
    
    // =======================================================
    //  Development
    // =======================================================
    } else if (environment == 'development' || environment == 'dev') {
        return {
            host: 'http://localhost:3000'
        }
      
    // =======================================================
    //  Production 
    // =======================================================
    } else if (environment == 'production') {
        var PORT = parseInt(process.env.LEANCLOUD_APP_PORT || 3000);
        return {
            host: PORT
        }
    }
    
}