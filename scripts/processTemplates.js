var Promise = require('bluebird');
Promise.longStackTraces();

var cheerio = require("cheerio");
var request = Promise.promisify(require("request"));
var fs = Promise.promisifyAll(require('fs'));

var $xSmallBlock, $smallBlock, $mediumBlock;
var templateEmbed = '\n' +
    '               <!--- START: ISP TEMPLATE EMBED --> \n' +
    '               <div id="{{page.embedId}}">\n' +
    '                   {{> embedDeps}}\n' +
    '                   {{> body }}\n' +
    '               </div>\n' +
    '               <!--- END: ISP TEMPLATE EMBED -->\n';


function processHtml(html) {
    var processed
        // strip new relic
    processed = html.replace(/<script type="text\/javascript">[\S]?window.NREUM[\s\S]*?<\/script>/g, "<!-- new relic stripped -->")

    // strip gtm
    processed = processed.replace(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->/g, "<!-- google tag manager stripped -->")

    // make absolute URLs absolute to domain instead of root
    processed = processed.replace(/="\//g, '="http://news.nationalgeographic.com/');
    processed = processed.replace(/":"\/(?!\/)/g, '":"http://news.nationalgeographic.com/');

    return processed;
}


// extract medium and x-small blocks
var r1 = request('http://www.nationalgeographic.com/magazine/2016/05/yellowstone-national-parks-part-1.html')
    .then(function(response) {
        var $ = cheerio.load(response.body, {
            decodeEntities: false
        });

        $xSmallBlock = $('.Interactive.section')
            .has('.media--xsmall')
        $xSmallBlock
            .find(".media--xsmall")
            .html(templateEmbed)

        $xSmallBlock = $.html($xSmallBlock)

        $mediumBlock = $('.Interactive.section')
            .has('.media--medium')
        $mediumBlock
            .find(".media--medium")
            .html(templateEmbed)

        $mediumBlock = $.html($mediumBlock)

    })
    .catch(function(e) {
        console.error("xSmall/medium block extract failed")
    })

// extract small block
var r2 = request('http://news.nationalgeographic.com/2016/04/160420-coral-bleaching-australia-map-climate-change/')
    .then(function(response) {
        var $ = cheerio.load(response.body, {
            decodeEntities: false
        });

        $smallBlock = $('.Interactive.section')
            .has('.media--small')

        $smallBlock
            .find(".media--small")
            .html(templateEmbed)

        $smallBlock = $.html($smallBlock)

    })
    .catch(function(e) {
        console.error("small block extract failed")
    })


// insert and write embed layouts
Promise.all([r1, r2])
    .then(function() {
        return request('http://news.nationalgeographic.com/2016/02/160202-solar-sail-space-nasa-exploration/')
    })
    .then(function(response) {
        var processed = processHtml(response.body);
        var replacementText = '<div class="text smartbody parbase section">\n<h2>The light stuff</h2></div>';

        var xSmallHtml = processed.replace(replacementText, $xSmallBlock + "\n\n" + replacementText);
        var smallHtml = processed.replace(replacementText, $smallBlock + "\n\n" + replacementText);
        var mediumHtml = processed.replace(replacementText, $mediumBlock + "\n\n" + replacementText);

        fs.writeFileAsync("app/_layouts/embed_xsmall.html", xSmallHtml)
            .then(function() {
                console.log("\t🌈\u0020 x-small layout saved to app/_layouts/embed_xsmall.html");
            }).catch(function(e) {
                console.error("\t❌\u0020 x-small layout failed", e.stack)
            })

        fs.writeFileAsync("app/_layouts/embed_small.html", smallHtml)
            .then(function() {
                console.log("\t🌈\u0020 Small layout saved to app/_layouts/embed_small.html");
            }).catch(function(e) {
                console.error("\t❌\u0020 Small layout failed", e.stack)
            })

        fs.writeFileAsync("app/_layouts/embed_medium.html", mediumHtml)
            .then(function() {
                console.log("\t🌈\u0020 Medium layout saved to app/_layouts/embed_medium.html");
            }).catch(function(e) {
                console.error("\t❌\u0020 Medium layout failed", e.stack)
            })
    })


// insert and write interactive layout
request('http://www.nationalgeographic.com/magazine/2016/05/yellowstone-national-parks-elk-migration-map/')
    .then(function(response) {
        var processed;

        // process html
        processed = processHtml(response.body);
        // strip existing interactive code
        processed = processed.replace(/<!-- start interactive embed -->[\s\S]*?<!-- end interactive embed -->/g, templateEmbed)

        fs.writeFile("app/_layouts/interactive_layout.html", processed, function(err) {
            if (err) {
                return console.log(err);
            }

            console.log("\t🌈\u0020 Interactive layout saved to app/_layouts/interactive_layout.html");
        });
    })
    .catch(function(e) {
        console.error("\t❌\u0020 Interactive layout failed", e.stack)
    })


// NOTES:
// We cannot currently use Cheerio to parse entire documents because it changes
// This is the reason for the more fragile string search to insert embed html.
// When processing a whoel document Cheerio converts single quotes to double on html attributes
// This breaks elements that use JSON within attributes--most react components
// $ = cheerio.load(processed, {
//     decodeEntities: false,
//     recognizeSelfClosing: true
// });

// http://stackoverflow.com/a/6714233
// String.prototype.replaceAll = function(str1, str2, ignore) {
//     return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof(str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
// }
