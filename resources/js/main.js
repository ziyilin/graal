// On-load actions.
$(window).on("load", function () {
  $("body").removeClass("preload");
});

function copySnippet(elem) {
  var div = $(elem.parentElement.parentElement);
  text = "";
  div.find("figure").each(function () {
    var currentText = $(this).text();
    text += currentText;
  });
  copyTextToClipboard(text);
}

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    // console.log('Copying text command was ' + msg);
  } catch (err) {
    // console.log('Oops, unable to copy');
  }
  document.body.removeChild(textArea);
}

function createTerminal(serverUrl, containerId, terminalId, uid) {
  var appearDuration = 350;
  var revealDuration = 750;
  var bootTerminalDuration = 750;

  $(containerId).animate({
    padding: "8px",
    opacity: 1.0
  }, appearDuration)

  $(terminalId).animate({
    height: "260px"
  }, revealDuration, function () {
    $(terminalId).terminal(function (command) {
      var shell = this;

      if (command !== "") {
        shell.freeze(true);
        var currentPrompt = shell.get_prompt();
        shell.set_prompt("");
        var escapedLine = encodeURIComponent(command);
        var url = serverUrl + "/send-line?uid=" + uid + "&line=" + escapedLine;
        $.get(url).done(function (data) {
          console.log(data);
          data = JSON.parse(data);
          if (data["language"]) {
            currentPrompt = data["language"] + "> ";
          }
          if (data["error"]) {
            shell.echo(data["error"]);
            if (!data["terminate"]) {
              shell.freeze(false);
              shell.set_prompt(currentPrompt);
            }
          } else {
            console.log(data)
            var output = JSON.parse("\"" + data["output"] + "\"");
            shell.echo(output);
            shell.freeze(false);
            shell.set_prompt(currentPrompt);
          }
        }).fail(function (r) {
          shell.echo("Server error code " + r.status + ": " + r.statusText);
          shell.enable();
        })
      } else {
        shell.echo("");
      }
    }, {
      greetings: "GraalVM Shell (type 'js', 'ruby' or 'R' to switch languages)",
      name: "graalvm_shell",
      height: 240,
      prompt: "js> ",
      onInit: function () {
        var shell = this;
        $(terminalId).click(function () {
          console.log("Focused terminal.");
          shell.focus(true);
        });
        shell.disable();
        shell.enable();

        // window.addEventListener("keydown", function(e) {
        //   if (e.keyCode == 32 && e.target == document.body) {
        //     // $(terminalId).keydown()[0].focus();
        //     // e.preventDefault();
        //   }
        // });
      }
    });

    $(terminalId).animate({
      opacity: 1.0
    }, bootTerminalDuration);
  });
}

function establishSessionAndCreateTerminal(serverUrl) {
  console.log("Establishing shell session with " + serverUrl);
  $.get(serverUrl + "/start-session").done(function (data) {
    console.log(data);
    data = JSON.parse(data);
    if (data["error"]) {
      console.error(data["error"]);
    } else {
      console.log("Starting terminal session...");
      createTerminal(serverUrl, "#terminal-container", "#terminal", data["uid"]);
    }
  }).fail(function (r) {
    console.error(r);
  });
}

$(document).ready(function () {

  // highlightjs init
  $('pre code').each(function (i, block) {
    hljs.highlightBlock(block);
  });

  // slick slider init
  (function () {
    $('.video-carousel').slick({
      dots: true,
      accessibility: true,
      responsive: [
        {
          breakpoint: 900,
          settings: {
            arrows: false,
            adaptiveHeight: true
          }
        }
      ]
    });
  }());

  (function () {
    $('.news-carousel').slick({
      dots: false,
      accessibility: true,
      slidesToShow: 4,
      arrows: true,
      slidesToScroll: 1,
      // autoplay: true,
      // autoplaySpeed: 3000,
      responsive: [
        {
          breakpoint: 1500,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            adaptiveHeight: true,
          }
        },
        {
          breakpoint: 580,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  }());

  var configProfile = {
    "profile": {"screenName": 'thomaswue'},
    "domId": 'tweets',
    "maxTweets": 10,
    "enableLinks": true,
    "showUser": false,
    "showTime": true,
    "showImages": false,
    "lang": 'en',
    "customCallback": function (data) {
      var el = $("#tweets");
      for (var i in data) {
        el.append('<div>' + data[i] + '</div>');
      }
      el.slick({
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        autoplaySpeed: 3000,
        responsive: [
          {
            breakpoint: 1280,
            settings: {
              arrows: false
            }
          },
          {
            breakpoint: 768,
            settings: {
              arrows: false,
              adaptiveHeight: true,
              slidesToShow: 1
            }
          }
        ]
      });
    }
  };
  twitterFetcher.fetch(configProfile);

  (function () {
    var topBanner = $('.home-banner');
    var header = $('.header');
    var topBannerHeight = topBanner.innerHeight();
    var showed = false;

    $(window).scroll(function () {
      var scrollTop = $(document).scrollTop();

      if (scrollTop > topBannerHeight && !showed) {
        header.addClass('header--filled animated fadeIn');
        showed = true;
      } else if (scrollTop <= topBannerHeight && showed) {
        header.removeClass('header--filled animated fadeIn').addClass('header--filled animated fadeOut');
        setTimeout(function () {
          header.removeClass('header--filled animated fadeOut');
        }, 500);
        showed = false;
      }
    });
  }());

  // stiky content menu
  (function () {
    var headerHeight = $('.header').innerHeight();
    var sectionHeadingHeight = $('.section-heading').innerHeight();
    var offsetTop = parseInt(headerHeight) + parseInt(sectionHeadingHeight);

    var contentMenuHorixontal = $(".toc-bullets--horizontal");
    var showed = false;

    $(window).scroll(function () {
      var scrollTop = $(document).scrollTop();

      if (scrollTop > offsetTop && !showed) {
        contentMenuHorixontal.addClass('toc-bullets--horizontal-stiky');
        showed = true;
      } else if (scrollTop <= sectionHeadingHeight && showed) {
        contentMenuHorixontal.removeClass('toc-bullets--horizontal-stiky');
        showed = false;
      }
    });
  }());


  // mobile menu
  if ($('.js-show-menu').length) {
    $(".js-show-menu, .overlay").click(function (e) {
      e.preventDefault();
      $('body').toggleClass('overflow-hidden');
      $(".menu-btn--menu").toggleClass('menu-open').toggleClass('close');
      $('.menu__list').toggleClass('open');
      $('.menu__logo').toggleClass('open');
      $('.menu').toggleClass('open');
      $('.overlay').fadeToggle();
    });
  }

  if ($(".js-show-sidebar").length) {
    $(".js-show-sidebar, .overlay").click(function (e) {
      e.preventDefault();
      $('body').toggleClass('overflow-hidden');
      $(".menu-btn--sidebar").toggleClass('menu-open');
      $('.sidebar').toggleClass('open');
      $('.overlay').fadeToggle();
    });
  }

  if (window.location.href.toString().split(window.location.host)[1] === '/docs/faq/') {
    var contentWrapp = $('#content-wrapper');

    var allIds = contentWrapp.find($("*[id]:not([id='graalvm---run-any-language-anywhere'])"));

    allIds.addClass('title-faq');
    allIds.nextUntil("h3").hide();

    allIds.attr('tabindex', "0");

    allIds.click(function () {
      // $(this).toggleClass("title-faq--opened");
      // $(this).nextUntil("h3").slideToggle();
      showHiddenContent($(this));
    });

    allIds.keypress(function (e) {
      var key = e.which;
      if (key == 13) {
        showHiddenContent($(this));
      }
    });

    function showHiddenContent(element) {
      element.toggleClass("title-faq--opened");
      element.nextUntil("h3").slideToggle();
    }
  }

  // (function() {
  //   var video = $("#js-video");
  //   video.width(450);
  //   video.height(450);
  //   var largeScreenRes = 1600;
  //
  //   $(window).on('resize', function() {
  //     var windowWidth = $(window).innerWidth();
  //     if (windowWidth >= largeScreenRes) {
  //       video.width(650);
  //       video.height(650);
  //       console.log(windowWidth);
  //     } else {
  //       video.width(450);
  //       video.height(450);
  //     }
  //   });
  // })();


  (function () {
    var videoId = $('#js-video');
    //play video on hover
    $("body").on('mouseover', '.home-banner__video', function () {
      videoId.get(0).play();
    });

    //pause video on mouse leave
    $("body").on('mouseleave', '.home-banner__video', function () {
      videoId.get(0).pause();
    });
  })()
});


// if (window.location.href.toString().split(window.location.host)[1] === '/docs/faq/') {
//   var content = document.getElementById('content-wrapper');
//   var allID = content.querySelectorAll('*[id]:not([id="graalvm---run-any-language-anywhere"])');
//   var header = content.querySelector('[id]');
//
//   var nextUntil = function (elem, selector) {
//     var siblings = [];
//     elem = elem.nextElementSibling;
//     while (elem) {
//       if (elem.matches(selector)) break;
//       siblings.push(elem);
//       elem = elem.nextElementSibling;
//     }
//
//     return siblings;
//
//   };
//
//   function wrap(el, wrapper) {
//     el.parentNode.insertBefore(wrapper, el);
//     wrapper.appendChild(el);
//   }
//
//   allID.forEach(function(item, value) {
//     item.classList.add('title-faq');
//     item.nextElementSibling.style.display = 'none';
//
//     item.addEventListener('click', function () {
//       this.classList.toggle('title-faq--opened');
//       this.nextElementSibling.classList.toggle('visible');
//     })
//   });
// }

// stiky sidebar
var sidebar = document.querySelector('.sidebar-wrap');

if (sidebar) {
  var stickySidebar = new StickySidebar(sidebar, {
    topSpacing: 74,
    bottomSpacing: 40
  });

  sidebar.addEventListener('affix.container-bottom.stickySidebar', function (event) {
    window.dispatchEvent(new Event('resize'));
  });
}


// video popup
var modal = document.getElementById('video-view');
var btnsArray = document.querySelectorAll(".js-popup");
var closeModal = document.getElementById("js-close");
var btn;

[].forEach.call(btnsArray, function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    var videoIndex = this.dataset.video;
    modal.style.display = "flex";
    loadVideo(videoIndex);
  })
});

if (closeModal) {
  closeModal.onclick = function () {
    modal.style.display = "none";
    stopVideo();
  };
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    stopVideo();
  }
};

document.addEventListener('keyup', function (event) {
  if (event.keyCode == 27) {
    modal.style.display = "none";
    stopVideo();
  }
});

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player, lastVideoId = '';

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: 'auto',
    width: 'auto',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function loadVideo(id) {
  if (player && id != lastVideoId) {
    player.loadVideoById(id);
    lastVideoId = id;
  } else {
    player.playVideo();
  }
}

function onPlayerReady(event) {
  event.target.playVideo();
}

var done = false;

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 1000);
    done = true;
  }
}

function stopVideo() {
  player.pauseVideo();
}

function clearResults() {
  var clearBtn = document.getElementById('clear-btn');

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      document.getElementById('module-name').value = '';
      document.getElementById('no-results').style.display = "none";

      var resultsTable = document.querySelectorAll('.results-table .table');
      resultsTable.forEach(function (value) {
        value.style.display = "none";
      });
    });
  }
}

clearResults();

var safVideo = document.getElementById('js-safary-video');
var defVideo = document.getElementById('js-def-video');

if (safVideo && defVideo) {
  if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
    defVideo.style.display = 'none';
    safVideo.style.display = 'block';
  } else {
    safVideo.style.display = "none";
    defVideo.style.display = 'block';
  }
}


if ($('#map').length) {
  jQuery(function($) {
    // Asynchronously Load the map API
    var script = document.createElement('script');
    script.src = "//maps.googleapis.com/maps/api/js?key=&sensor=false&callback=initialize";
    document.body.appendChild(script);
  });
}


// Initialize and add the map
function initialize() {
  let defaultView = {lat: 46.214484, lng: -21.114842};
  const locations = {
    prague: [
      {
        conference: 'GeeCon',
        date: 'October 18-19, 2018',
        url: '#event-one',
        position: {lat: 50.109042, lng: 14.585350}
      }
    ],
    saintpetersburg: [
      {
        conference: 'JokerConf',
        date: 'October 20-21, 2018',
        url: '#event-two',
        position: {lat: 59.762016, lng: 30.356999}
      }
    ],
    sanfrancisco: [
      {
        conference: 'Oracle Code One',
        date: 'October 22-25, 2018',
        url: '#event-three',
        position: {lat: 37.783638, lng: -122.400888}
      }
    ],
    berlin: [
      {
        conference: 'GOTO Berlin',
        date: 'November 2, 2018',
        url: '#event-four',
        position: {lat: 52.520782, lng: 13.416515}
      }
    ],
    haarlem: [
      {
        conference: 'JFall',
        date: 'November 8, 2018',
        url: '#event-five',
        position: {lat: 52.015803, lng: 5.648064}
      }
    ],
    antwerpen: [
      {
        conference: 'Devoxx Belgium',
        date: 'November 12-16, 2018',
        url: '#event-six',
        position: {lat: 51.246048, lng: 4.416641}
      }
    ],
    copenhagen: [
      {
        conference: 'GOTO Copenhagen',
        date: 'November 19-23, 2018',
        url: '#event-seven',
        position: {lat: 55.637904, lng: 12.576342}
      }
    ],
    kyiv: [
      {
        conference: 'Devoxx Ukraine',
        date: 'November 23-24, 2018',
        url: '#event-eight',
        position: {lat: 50.449100, lng: 30.540826}
      }
    ],
    oslo: [
      {
        conference: 'javaBin Oslo',
        date: 'November 26, 2018',
        url: '#event-nine',
        position: {lat: 59.923517, lng: 10.731775}
      }
    ],
    helsinki: [
      {
        conference: 'Helsinki Java User Group',
        date: 'November 27, 2018',
        url: '#event-ten',
        position: {lat: 60.169422, lng: 24.928233}
      }
    ],
    washington_dc: [
      {
        conference: 'CGO & Graal Workshop',
        date: 'February 16-20, 2019',
        url: '#event-eleven',
        position: {lat: 38.904722, lng: -77.016389}
      }
    ],
    bruhl: [
      {
        conference: 'JAVALAND',
        date: 'March 19-21, 2019',
        url: '#event-twelve',
        position: {lat: 50.799537, lng: 6.879517}
      }
    ]
  };

  let labelIndex = 1;
  let markerDefault = '/resources/img/marker.svg';
  let markerActive = '/resources/img/marker-active.svg';

  // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
  let mapOptions = {
    zoom: 2.5,
    center: new google.maps.LatLng(defaultView),
    disableDefaultUI: true,
    styles: [
      {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#0c0b0b"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "geometry",
        "stylers": [
          {
            "hue": "#ff0000"
          },
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#180c0c"
          },
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#d2d7da"
          },
          {
            "weight": "1.00"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.province",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "all",
        "stylers": [
          {
            "hue": "#ff0069"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
          {
            "hue": "#2800ff"
          },
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#a6afb6"
          },
          {
            "gamma": "1.00"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
          {
            "saturation": -100
          },
          {
            "lightness": 45
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#090909"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "hue": "#ff0000"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9b7f7f"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#fef7f7"
          }
        ]
      }
    ]
  };


  const mapElement = document.getElementById('map');

  // Create the Google Map using our element and options defined above
  const map = new google.maps.Map(mapElement, mapOptions);

  for (let city in locations) {
    let bounds = new google.maps.LatLngBounds();
    let cityLocations = locations[city];

    for (let i = 0; i < cityLocations.length; i++) {
      const marker = new google.maps.Marker({
        position: cityLocations[i].position,
        map: map,
        icon: markerDefault,
        label: {
          text: ""+(labelIndex++),
          color: "white",
          fontSize: '11px'
        },
        url: cityLocations[i].url
      });

      bounds.extend(marker.position);
      const infoWindow = new google.maps.InfoWindow();
      let infoWindowContent = '<div class="info-tooltip"><div class="info-tooltip__col"><h4 class="events-table__detail__title">Conference</h4><p>' + cityLocations[i].conference + '</p></div><div class="info-tooltip__col"><h4 class="events-table__detail__title">Date</h4><p>' + cityLocations[i].date + '</p></div></div>'

      google.maps.event.addListener(marker, "mouseover", function () {
        marker.setIcon(markerActive);
        infoWindow.setContent(infoWindowContent);
        infoWindow.open(map, marker);
      });

      google.maps.event.addListener(marker, 'mouseout', function () {
        marker.setIcon(markerDefault);
        infoWindow.close(map, marker);
      });

      google.maps.event.addListener(marker, "click", function () {
        let elem = $(marker.url);
        let eventTableRow = $('.events-table__row');
        eventTableRow.removeClass('active');

        $('html, body').animate({
          scrollTop: elem.offset().top - 70
        }, 1000 );
        elem.toggleClass('active');
      });
    }
  }
}
