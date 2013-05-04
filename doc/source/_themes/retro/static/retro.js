$(document).ready(function() {

  var $navigation = $('.sphinxsidebar');
  function setCurrentNavItem(hash) {
    var $current = $('a[href$="' + hash + '"]');
    if ($current.length) {
      $navigation.find('a').removeClass('current');
      $current.addClass('current');
    }
  }

  var animatingSections = false;
  $('a[href*="#"]').on('click',function (e) {
    e.preventDefault();
    var target = this.hash,
      $target = $(target);
    setCurrentNavItem(target);
    animatingSections = true;
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top
    }, 400, 'swing', function () {
      window.location.hash = target;
      animatingSections = false;
    });
  });

  var sectionSelectors = [];
  $navigation.find('a[href*="#"]').each(function() {
    sectionSelectors.push(this.hash);
  });
  var $sections = $(sectionSelectors.join(','));

  $(window).on('scroll', function() {
    if (animatingSections === false) {
      var windowTopScroll = $(window).scrollTop(),
        nearestSectionId = null,
        smallestDistance = null,
        distance;
      $sections.each(function() {
        distance = Math.abs($(this).offset().top - windowTopScroll);
        if (smallestDistance === null || distance < smallestDistance) {
          smallestDistance = distance;
          nearestSectionId = this.id;
        }
        if (smallestDistance !== null && smallestDistance < 50) {
          setCurrentNavItem('#' + nearestSectionId);
        }
      });
    }
  });
});