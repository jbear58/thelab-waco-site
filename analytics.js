(function () {
  'use strict';

  var measurementId = 'G-YZ4Z5QW705';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId);

  var googleTag = document.createElement('script');
  googleTag.async = true;
  googleTag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(googleTag);

  function pageName() {
    var name = window.location.pathname.split('/').pop() || 'home';
    return name.replace(/\.html$/, '');
  }

  function ctaLocation(link) {
    if (link.closest('nav')) return 'navigation';
    if (link.closest('footer')) return 'footer';
    var section = link.closest('section[id]');
    return section ? section.id : 'page';
  }

  function sendEvent(name, parameters) {
    window.gtag('event', name, Object.assign({
      page_name: pageName()
    }, parameters || {}));
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href') || '';
    var locationName = ctaLocation(link);

    if (href.indexOf('tel:') === 0) {
      sendEvent('phone_click', { cta_location: locationName });
      sendEvent('generate_lead', {
        lead_type: 'phone',
        cta_location: locationName
      });
      return;
    }

    if (href.indexOf('mailto:') === 0) {
      sendEvent('email_click', { cta_location: locationName });
      sendEvent('generate_lead', {
        lead_type: 'email',
        cta_location: locationName
      });
      return;
    }

    var destination;
    try {
      destination = new URL(href, window.location.href);
    } catch (error) {
      return;
    }

    if (destination.hostname === 'thelabfitnessandwellness.virtuagym.com') {
      if (destination.pathname.indexOf('/webshop') === 0) {
        sendEvent('join_click', { cta_location: locationName });
        sendEvent('generate_lead', {
          lead_type: 'membership',
          cta_location: locationName
        });
      } else {
        sendEvent('member_login_click', { cta_location: locationName });
      }
      return;
    }

    if (
      destination.hostname === 'eliteathleticbodywork.com' &&
      destination.pathname.indexOf('/book-') === 0
    ) {
      sendEvent('booking_click', {
        service: 'massage_recovery',
        cta_location: locationName
      });
      sendEvent('generate_lead', {
        lead_type: 'massage_booking',
        cta_location: locationName
      });
      return;
    }

    var coachPages = ['dayton.html', 'kelvin.html', 'keenan.html', 'osiel.html'];
    var destinationPage = destination.pathname.split('/').pop();
    if (destination.origin === window.location.origin && coachPages.indexOf(destinationPage) !== -1) {
      sendEvent('coach_profile_view', {
        coach: destinationPage.replace('.html', ''),
        cta_location: locationName
      });
    }
  });
}());
