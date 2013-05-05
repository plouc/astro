$(document).ready(function() {

  // wrap section numbering with an 'i' tag
  $('.sphinxsidebar').find('a')
    .add('.toctree-wrapper a')
    .add('h1, h2, h3, h4, h5, h6')
  .each(function() {
    var $this = $(this),
      content = $this.html();
    $this.html(content.replace(/^([0-9.]+)\. (.*)$/, '<i>$1</i>$2'));
  });

  var $navigation = $('.sphinxsidebar');
  function setCurrentNavItem(hash) {
    var $current = $('a[href$="' + hash + '"]');
    if ($current.length) {
      $navigation.find('a').removeClass('current');
      $current.addClass('current');
    }
  }

  // animate scroll for anchors
  var animatingSections = false;
  $('a[href*="#"]').on('click',function (e) {
    // try to find the target element with link hash
    var target = this.hash,
      $target  = $(target);

    // if $target is an existing element on current page,
    // scroll to this element
    if ($target.length >= 1) {
      e.preventDefault();
      setCurrentNavItem(target);
      animatingSections = true;
      $('html, body').stop().animate({
          'scrollTop': $target.offset().top
      }, 400, 'swing', function () {
        window.location.hash = target;
        animatingSections = false;
      });
    }
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