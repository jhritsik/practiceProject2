#  Project Requirements
-  All development must meet [security standards (see 21CF Application Security Guidelines(2014).pdf](https://github.com/natgeo/specialprojects-isp-interactive-template/blob/docUpdate/docs/21CF%20Application%20Security%20Guidelines%20(2014).pdf) in docs folder)
-  All interactives must work 
  - 1. in our CMS (AEM) AND 
  - 2. as stand alone projects (NOTE: the ISP BluePrint can accomodate both).
-  All projects are expected to comply with [National Geographic Browser Support Standards](https://s3.amazonaws.com/uploads.hipchat.com/43415/453218/7ewAxGi2mR8zjGi/NationalGeographicBrowserSupportStandards%20%281%29.pdf). 
-  All projects must be built responsively with a mobile first approach (any / all exceptions require team's approval). The recommended defualt approach to mobile development is one website (one url) that can respond to different devices with viewport, Media Queries, and other technologies that support responsive design (responsive design = fluidity and proportionality - responds to browser size). If your project is an edge case that requires a separate mobile-specific website, please discuss directly with the product owner.
- Optimize the site for page-speed 
    - Keep http requests to a minimum
    - Minify CSS and JS (`grunt build` takes care of this if dependencies are declared within a page's YAML topmatter)
    - Properly optimize images, and load imagery appropriate for breakpoints.
    - When using data within a project (CSV, JSON, GeoJSON, etc), take care to pre-filter and precompute data (if possible) before delivering to the front-end, to reduce download size and expensive computations.
    - Lazy-load assets where appropriate
    - Ensure mobile performance is comparable to desktop (initial page load and interaction should be acceptable)
    - Mobile performance should be appropriate for good user experience
-  NGP uses the JIRA ticketing and project management tool to execute the development process. All of this runs parallel to Git, a branching and deployment technique, all developers must adapt to this workflow - please request access if necessary.
-  All projects must use source control (github)
-  All projects must be 'buildable' and all source code (including assets and dependencies) must be checked in 
 
- NOTE: The above listed requirements are in addition to [standard National Geographic Software Engineering development guidelines](https://github.com/natgeo/specialprojects-isp-interactive-template/blob/docUpdate/docs/DS-DeveloperStandardsTOC_6:3:2016.pdf) (some of which may not be directly applicable)

- Development Team Points of Contact
  - Jaime Hritsik, Lead Creative Developer (ISP Team)  <jaime.hritsik@natgeo.com> 
  - Brian Jacobs, Senior Creative Developer (ISP Team) <brian.jacobs@natgeo.com> 

