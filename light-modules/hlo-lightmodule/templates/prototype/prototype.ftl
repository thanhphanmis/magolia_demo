[#assign bodyCls = def.parameters.bodyCls!]

<!DOCTYPE html>
<html xml:lang="${cmsfn.language()}" lang="${cmsfn.language()}">
  <head>
    [@cms.init /]
    [@cms.area name="head" contextAttributes={"cssFiles": def.cssFiles![], "jsFiles": def.jsFiles![]} /]
    <!-- End Google Tag Manager -->
  </head>
    <body
      class="${cmsfn.isEditMode()?then('mgnl-admin', '')} ${bodyCls!}"
    >
      [@cms.area name="header" /]
      <div class="__content">
          [@cms.area name="main" /]
      </div>
      [@cms.area name="footer" /]
      [@cms.area name="formModal" /]
      [@cms.area name="modals" /]
      [@cms.area name="javascript" contextAttributes={"cssFiles": def.cssFiles![], "jsFiles": def.jsFiles![]} /]
    </body>
</html>