[#compress]
    [#assign site = sitefn.site()! /]
    [#assign theme = sitefn.theme(site)! /]

    [#list theme.jsFiles as jsFile]
        <script src="${jsFile.link}" async></script>
    [/#list]


    [#if ctx.jsFiles?? && ctx.jsFiles?size > 0]
        [#list ctx.jsFiles as jsFile]
            <script src="${jsFile.link}?${.now?long?c}" async></script>
        [/#list]
    [/#if]

[/#compress]