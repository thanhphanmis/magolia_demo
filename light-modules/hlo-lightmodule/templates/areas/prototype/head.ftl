[#compress]    
    [#assign site = sitefn.site(content)! /]
    [#assign theme = sitefn.theme(site)! /]
<meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    [#list theme.cssFiles as cssFile]
        <link rel="stylesheet preload prefetch" href="${cssFile.link}" as="style" type="text/css"/>
    [/#list]

    [#if ctx.cssFiles?? && ctx.cssFiles?size > 0]
        [#list ctx.cssFiles as cssFile]
            <link rel="stylesheet preload prefetch" href="${cssFile.link}?${.now?long?c}" as="style" type="text/css"/>
        [/#list]
    [/#if]


    [#assign pageTitle = page.title! /]
    [#assign metaTitle = page.metaTitle!pageTitle! /]
    <title>${(rootPage.pageTitlePrefix)!}${pageTitle!}${(rootPage.pageTitleSuffix)!}</title>
       <!-- Google Web Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500&family=Roboto:wght@500;700;900&display=swap" rel="stylesheet"> 

    <!-- Icon Font Stylesheet -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">
[/#compress]
