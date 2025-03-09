var Webflow = Webflow || [];
  Webflow.push(function() {
    var curUrl = location.pathname;

    $('nav a').each(function() {
      var link = $(this).attr('href');

      if (link === curUrl) {
        $(this).addClass('w--current');
      } else if (curUrl.startsWith('/work') && link === '/work') {
        $(this).addClass('w--current');
      } else if (curUrl.startsWith('/about') && link === '/about') {
        $(this).addClass('w--current');
      }
    });
  });