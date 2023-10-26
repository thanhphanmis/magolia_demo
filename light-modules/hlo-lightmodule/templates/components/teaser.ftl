[#assign targetPageLink = content.targetPageLink!]
 
[#if targetPageLink?has_content]
    [#assign targetPage = cmsfn.contentById(content.targetPageLink)!]
 
    [#if targetPage?has_content]
        <div class="default-teaser">
     
            [#-- Create target page link here. Use its title or page name as its text. --]
             
            [#-- Access abstract content of the target page. --]
             
            [#-- An optional possible extends: Trying also to get an image from the target page. --]
             
            <p><a href="${cmsfn.link(targetPage)!}">${i18n['teaser.link.readon']}</a></p>
            <h4 class="chapter-head">
              <a href="${cmsfn.link(targetPage)!}">${targetPage.title!targetPage.@name}</a>
            </h4>
            <p>${targetPage.abstract!}</p>
        </div>
    [#elseif cmsfn.editMode]
        <div>Target Page could not be resolved.</div>
    [/#if]
 
 
[#elseif cmsfn.editMode]
    <div>No target page has been chosen, please open dialog and do so.</div>
[/#if]