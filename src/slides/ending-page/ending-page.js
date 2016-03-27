function EndingPage() {

  console.log($('html').on('PrestrifyLoaded', function () {
    console.log('vikam se');
    Reveal.addEventListener('slidechanged', function (event) {
      var slide = $(event.currentSlide).children();
      if (slide.attr('data-background-iframe')) {
        console.log('as');
        $(slide.find('iframe')).css({
          height: $(window).height(),
          width: $(window).width(),
          left: '0',
          top: '0',
          overflow: 'hidden',
          position: 'fixed',
          'z-index': '999',
          '-webkit-transform': 'translateZ(0)'
        })
        ;
      } else {
        $('.reveal > .backgrounds').css('z-index', 0);
      }
    });
  }));
}
