//http://stackoverflow.com/questions/21503510/assemble-register-handlebar-helper-function
// this works in conjunction with server/build options within assemble gruntfile
module.exports.register = function(Handlebars, options, params) {
    Handlebars.registerHelper('assetRoot', function() {
    	// console.log(params.assemble.task.target)

    	// Normalize the slash
        if (options.assetRoot.substr(-1) === '/') {
            return options.assetRoot.substr(0, options.assetRoot.length - 1);
        }
        return options.assetRoot;
    });
};
