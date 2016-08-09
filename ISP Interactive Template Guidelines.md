## ISP-BluePrint Guidelines

This repository houses functioning examples of features commonly used for embeddable interactives. If there are gaps in documentation please submit a pull request or submit an [issue](https://github.com/natgeo/specialprojects-isp-interactive-template/issues). This project is to be used as a starting point for new interactives.


## ISP-BluePrint Technology Stack

Consult the following documentation sets in order to debug problems:

- Package management
  - [Node](http://nodejs.org/) & [NPM](https://www.npmjs.com/) are used to supply our build tools (Grunt) packages.
  - [Bower](http://bower.io/) is used to supply our front end packages (jQuery, D3, etc.)
- [Assemble](http://assemble.io/) is used as the static site generator, parsing includes and variables into real HTML
- Assemble uses the [Handlebars]((http://handlebarsjs.com)) templating language.
- [Sass](http://sass-lang.com/) is used as a CSS PreProcessor. [[Docs](http://sass-lang.com/documentation/file.SASS_REFERENCE.html)]
- [Grunt](http://gruntjs.com/) is used to build the project wrapping most of the stand alone utilities (Sass, Assemble, Autoprefixer, HTMLmin...) in to a single workflow. [[Docs](http://gruntjs.com/getting-started)]


## Static Site Generator

This project is a static site generator (using [Assemble](http://assemble.io)). While running the server, interactives are previewed within layout templates. When building a project, html and assets are generated in an embeddable form.

- **Pages** `/app/_pages/*.html`: Pages represent a single interactive. Uses YAML topmatter to give project a name, and reference a preview layout, javascript and css. Put html below frontmatter. 
- **Layouts** `/app/_layouts/*.html`: Provides preview wrappers for interactive content. Reference layouts using devLayout page topmatter. See layouts section below for more detail.
- **Partials** `/app/_includes/*.html`: Pages and layouts can use includes (partials) referenced like `{{> fileName }}`

Assemble parses [Handlebars](http://handlebarsjs.com/) template tags within HTML to build pages.

- Site-wide variables are set within `/_config.yml`. They can be referenced by using the `site` object: `{{ site.assetRoot }}`
- Other variables can be declared within YAML topmatter on a per-page basis and are referenced using he `page` object: `{{ page.title }}`


## What is the ISP-BluePrint? 

As mentioned above, the BluePrint is to be used as a starting point for new interactives.

More specifically, the ISP-BluePrint:
- generates html and assets in an embeddable (CMS friendly) format (see layout build section below)
- generates html with a body and html wrapper so it can stand alone (see layout build section below)
- emulates our CMS for testing purposes

All interactives must work in our CMS as well as a stand alone project. The finished code for interactives will be dropped into what is essentially an open html container in our CMS (the build process generates the html and assets in a CMS friendly format). Typically, however, there are JS and CSS conflicts when merging code in with our CMS. To help avoid these issues, the BluePrint emulates the CMS environment so developers can build and test at the same time. 

## Layouts

As mentioned above, the layouts provide preview wrappers for interactive content. These preview wrappers emulate our CMS environment (AEM). The most common layout is the "interactive_layout". This is a full page experience with a nav, share bar, comments and ads. The "embed" layouts are components within an article page. If you're building something that will require the full width of the page, but it needs to be inside an article page, you'll need to choose the "embed_cinematc" layout. The "basic_html_layout" layout is also very important. This is the wrapper you'll use to test a project as a "standalone" project (i.e. no CMS wrapper).
- embed_small – this component is ¼ the width of an article page 
- embed_medium – this component is 2/3 the width of an article page 
- embed_cinematic – this component is the full width of an article page but has a limited heigth 
- interactive_layout - this component is the full page but has navigation, banner ads, comments, social, etc... 
- basic_html_layout – this is the layout you'll want to use to test the project as a stand alone project (no CMS wrappers)

The designer/producer assigned to each project can help you determine which layout you'll need to test in. Also feel free to ask the ISP developers. 
All projects will be tested both inside and outside of the AEM environment. So they should work seamlessly as stand alone projects as well as inside the AEM environment.

## Asset Root

A custom helper exists called `{{ assetRoot }}`. While developing locally, `{{assetRoot}}` will correspond with the project `assets` folder. After building a project, `{{assetRoot}}` will correspond to an `assetRoot` absolute URL set within `_config.yml`. **This variable MUST be set according to the asset deploy location before building.**.

Within `_config.yml`, set the variable, e.g.:

```
assetRoot: http://nationalgeographic.com/specialprojects/assets
```
 
Use like so when referencing assets within HTML:
 
 ```
 <img src="{{assetRoot}}/assets/img/logo.svg">
 ```
 
Within javascript, assets can be referenced by using the folowing global:

```
ISP.assetRoot
```  

## Javascript

- JS libraries can be installed using `bower install` and live within `/app/assets/bower_components`. [jQuery](http://jquery.com/) is included by default.  
- Project code should go in here: `/app/assets/js`

Because this interactive will ultimately be embedded within a CMS environment follow these best practices to avoid code conflicts.

---

### Avoiding JS Collisions

Use closures and noConflict functions to protect common libraries. If using jQuery, it is already provided as a noConflict global `ISP.jQuery`. That should be referenced as a closure within js files:

```
(function($) {
// reference scoped $
})(ISP.jQuery);
```
---

jQuery plugins should also reference the noConflict jQuery. This typically means modifying the final line of jQuery plugins to reference `ISP.jQuery` instead of `window.jQuery`.

---

When declaring event triggers/listeners, namespace your events, e.g.:

```
$(window).on("scroll.nameOfProject", function(){ ... });
$(window).off("scroll.nameOfProject", function(){ ... });
```
---

If using Modernizr, use the class prefix option. e.g.: 

```
{
  "classPrefix": "ISP_",
}
```

---

Avoid setting classes on DOM elements beyond the interactive. `<div id="{{page.embedId}}">` will be the outer-most wrapper on the interactive to target.



## CSS

- SASS CSS needs to be placed in `/app/_scss/project.scss` or other sass files.
- Non-SASS CSS should live in `/app/assets/css`.
- Namespace your CSS as described below.

---

### Avoiding CSS Collisions

Shield your CSS with a namespace according to the project wrapper, whose name is determined by a page's `embedId`. This can be achieved in bulk by using sass. Within `_sass/project.scss`, e.g.:

```
#isp-projectName {
	.class1 {font-weight: bold;}
	.class2 {margin: 0 15px}
}
```

Or,

```
#isp-projectName .class1 {font-weight: bold;}
#isp-projectName .class2 {margin: 0 15px}
```

If using Modernizr, be specific:

```
.ISP_no-touchevents #isp-projectName .class1 { ... }
```

## Metadata

For every interactive, fill out `app/metadata.json`. This will allow the interactive to be consumed and indexed by our content management system, AEM. More documentation to come.


## AEM 
  
  - AEM is natgeo's content management system. If the interactive is going to be dropped into AEM you will have access to the following libraries:
    - [Mortar](https://github.com/natgeo/mortar), the National Geographic Society's living styleguide. You can preview Mortar's styles and patterns at [http://natgeo.github.io/mortar/]().
    - [icongs](https://github.com/natgeo/icongs), the National Geographic Society's icon font. You can preview available icons at [http://natgeo.github.io/icongs/]().


<<<<<<< HEAD

=======
>>>>>>> docUpdate
## Create a Git Mirror

Adapted from the [Github instructions](https://help.github.com/articles/duplicating-a-repository/)

1. [Create a repository](https://help.github.com/articles/create-a-repo/) with the convention "specialprojects-projectname"
- Run these commands

```
  git clone --bare git@github.com:natgeo/specialprojects-isp-interactive-template.git
  # Make a bare clone of the repository

  cd specialprojects-isp-interactive-template
  git push --mirror git@github.com:natgeo/specialprojects-[newproject].git
  # Mirror-push to the new repository
```
3.  Add the following teams [as collaborators](https://help.github.com/articles/adding-collaborators-to-a-personal-repository/): "NGS - Push / Pull", "Special Projects Contributors - Push & Pull", and "Special Projects Contributors - Pull Only"




