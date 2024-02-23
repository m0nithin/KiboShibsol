(function($, fnFrontend) {
    "use strict";



    var FrenifyMetaPortal = {

        isAdmin: false,
        adminBarH: 0,

        init: function() {

            if ($('body').hasClass('admin-bar')) {
                FrenifyMetaPortal.isAdmin = true;
                FrenifyMetaPortal.adminBarH = $('#wpadminbar').height();
            }

            var widgets = {
                'frel-gallery.default': FrenifyMetaPortal.allGalleryFunctions,
                'frel-down-button.default': FrenifyMetaPortal.downButtonFunction,
                'frel-video.default': FrenifyMetaPortal.videoFunction,
                'frel-buttons.default': FrenifyMetaPortal.ImgToSVG,
                'frel-team-member.default': FrenifyMetaPortal.teamMemberFunction,
                'frel-hero-header.default': FrenifyMetaPortal.heroHeader,
                'frel-counter-list.default': FrenifyMetaPortal.counter,
                'frel-roadmaps.default': FrenifyMetaPortal.roadmapSwiper,
            };

            $.each(widgets, function(widget, callback) {
                fnFrontend.hooks.addAction('frontend/element_ready/' + widget, callback);
            });
        },

        roadmapSwiper: function() {
            // slider
            var section = $('.fn_cs_roadmap .swiper-container');
            section.each(function() {
                var element = $(this);
                // Main Slider
                var mainSliderOptions = {
                    loop: false,
                    speed: 1500,
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false,
                    },
                    slidesPerView: 4,
                    spaceBetween: 40,
                    direction: 'horizontal',
                    loopAdditionalSlides: 10,
                    watchSlidesProgress: true,
                    breakpoints: {
                        768: {
                            slidesPerView: 1
                        },
                        1040: {
                            slidesPerView: 2
                        },
                        1200: {
                            slidesPerView: 3
                        },
                        1400: {
                            slidesPerView: 4
                        }
                    }
                };
                var mySwiper = new Swiper(element, mainSliderOptions);
                var slidersCount = mySwiper.params.loop ? mySwiper.slides.length - 2 : mySwiper.slides.length;
                var widthParts = 100 / slidersCount;

                var step = element.closest('.fn_cs_roadmap').find('.step_in');

                FrenifyMetaPortal.roadmapStep(mySwiper, step, widthParts);

                mySwiper.on('slideChange', function() {
                    FrenifyMetaPortal.roadmapStep(this, step, widthParts);
                });
            });
        },

        roadmapStep: function(mySwiper, step, widthParts) {
            var breakpoint = parseInt(mySwiper.currentBreakpoint);
            var viewBox;
            switch (breakpoint) {
                case 1400:
                    viewBox = 4;
                    break;
                case 1200:
                    viewBox = 3;
                    break;
                case 1040:
                    viewBox = 4;
                    break;
                case 768:
                    viewBox = 1;
                    break;
                default:
                    viewBox = 4;
            }

            step.css({
                width: (mySwiper.activeIndex + viewBox) * widthParts + '%'
            });
        },

        counter: function() {
            var element = $('.fn_cs_counter');
            element.each(function() {
                var el = $(this);
                el.waypoint({
                    handler: function() {
                        if (!el.hasClass('stop')) {
                            el.addClass('stop').countTo({
                                refreshInterval: 50,
                                formatter: function(value, options) {
                                    return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
                                },
                            });
                        }
                    },
                    offset: '90%'
                });
            });
        },

        hh_3dcarousel: function() {
            var slider = $('.fn_cs_3dcarousel');
            if (slider.length) {
                slider.each(function() {
                    var slider = $(this);

                    var sliderTop = slider.find('.slider_top');
                    var sliderBottom = slider.find('.slider_content');
                    var activeIndex = 2;
                    var speed = 6000; // milliseconds

                    // init slider animation
                    var myInterval = setInterval(function() {
                        activeIndex++;
                        activeIndex = FrenifyMetaPortal.sliderDo(sliderTop, sliderBottom, activeIndex);
                    }, speed);


                    // previous navigation button
                    slider.find('.slider_nav .prev').off().on('click', function() {
                        clearInterval(myInterval);
                        activeIndex--;
                        activeIndex = FrenifyMetaPortal.sliderDo(sliderTop, sliderBottom, activeIndex);
                        myInterval = setInterval(function() {
                            activeIndex++;
                            activeIndex = FrenifyMetaPortal.sliderDo(sliderTop, sliderBottom, activeIndex);
                        }, speed);
                        return false;
                    });

                    // next navigation button
                    slider.find('.slider_nav .next').off().on('click', function() {
                        clearInterval(myInterval);
                        activeIndex++;
                        activeIndex = FrenifyMetaPortal.sliderDo(sliderTop, sliderBottom, activeIndex);
                        myInterval = setInterval(function() {
                            activeIndex++;
                            activeIndex = FrenifyMetaPortal.sliderDo(sliderTop, sliderBottom, activeIndex);
                        }, speed);
                        return false;
                    });

                    // previous and next item
                    slider.find('.slider_top li').off().on('click', function() {
                        var getClass = $(this).attr('class');
                        if (getClass === 'next') {
                            activeIndex++;
                        } else if (getClass === 'prev') {
                            activeIndex--;
                        } else {
                            return false;
                        }
                        clearInterval(myInterval);
                        activeIndex = FrenifyMetaPortal.sliderDo(sliderTop, sliderBottom, activeIndex);
                        myInterval = setInterval(function() {
                            activeIndex++;
                            activeIndex = FrenifyMetaPortal.sliderDo(sliderTop, sliderBottom, activeIndex);
                        }, speed);
                        return false;
                    });
                });
            }
        },

        hh_bendedCarousel: function() {
            var slider = $('.frenify_cards_gallery');
            if (slider.length) {
                FrenifyMetaPortal.BgImg();
                slider.each(function() {
                    var element = $(this),
                        ul = element.find('ul'),
                        children = ul.children('li'),
                        length = children.length;

                    // stop function
                    if (length < 5) {
                        return false;
                    }

                    // build gallery slider
                    FrenifyMetaPortal.floww_change_slide(1, element);

                    // item click function
                    children.on('click', function() {
                        var el = $(this);
                        var index = el.index() + 1;
                        FrenifyMetaPortal.floww_change_slide(index, element);
                    });
                    FrenifyMetaPortal.floww_start_autoplay(ul, element);
                });
            }
        },

        /* since v4.0 */
        floww_start_autoplay: function(ul, element) {
            var timeout = 5000;
            var time = null;
            clearInterval(time);
            time = setInterval(function() {
                var index = ul.find('.current').index() + 2;
                FrenifyMetaPortal.floww_change_slide(index, element);
            }, timeout);
        },

        floww_change_slide: function(index, element) {
            var ul = element.find('ul'),
                children = ul.children('li'),
                length = children.length;
            index = (index + length) % length;
            var el = children.eq(index - 1);

            if (!el.hasClass('current')) {
                children.removeClass('current next1 next2 prev1 prev2 next3 prev3');
                el.addClass('current');
                var next1_index = (index + 1) % length;
                var next2_index = (index + 2) % length;
                var next3_index = (index + 3) % length;
                var prev1_index = (index - 1 + length) % length;
                var prev2_index = (index - 2 + length) % length;
                var prev3_index = (index - 3 + length) % length;
                children.eq(next1_index - 1).addClass('next1');
                children.eq(next2_index - 1).addClass('next2');
                children.eq(prev1_index - 1).addClass('prev1');
                children.eq(prev2_index - 1).addClass('prev2');
                if (length > 6) {
                    children.eq(next3_index - 1).addClass('next3');
                    children.eq(prev3_index - 1).addClass('prev3');
                }
                FrenifyMetaPortal.floww_calc_call(element);
            }
        },

        flow_calc: function(element) {
            var w = element.width(),
                initial_width = element.data('initial-width'),
                ratio = element.data('ratio'),
                padding = 20;
            padding *= 2;
            var width = ((w - padding) / 2 > initial_width) ? initial_width : (w - padding) / 2,
                height = width * ratio + padding,
                ul = element.find('ul'),
                children = ul.children('li');

            ul.height(height + 'px');
            children.find('.img_holder img').css({
                width: width + 'px',
                height: height - padding + 'px'
            });
            children.css({
                width: width + 'px',
                height: (height) + 'px'
            });
            var current_left = w / 2 - width / 2,
                next1_left = current_left + width / 2.5,
                next2_left = next1_left + width / 2.5,
                next3_left = next2_left + width / 2.5,
                prev1_left = current_left - width / 2.5,
                prev2_left = prev1_left - width / 2.5,
                prev3_left = prev1_left - width / 2.5;
            children.css({
                left: '50%',
                transform: 'scale(0)'
            });
            ul.find('.current').css({
                left: current_left + 'px',
                top: 0,
                transform: 'scale(1) translateZ(0) rotate(0)'
            });
            ul.find('.next1').css({
                left: next1_left + 'px',
                top: '90px',
                transform: 'scale(1) translateZ(0) rotate(15deg)'
            });
            ul.find('.next2').css({
                left: next2_left + 'px',
                top: '240px',
                transform: 'scale(1) translateZ(0) rotate(30deg)'
            });
            ul.find('.prev1').css({
                left: prev1_left + 'px',
                top: '90px',
                transform: 'scale(1) translateZ(0) rotate(-15deg)'
            });
            ul.find('.prev2').css({
                left: prev2_left + 'px',
                top: '240px',
                transform: 'scale(1) translateZ(0) rotate(-30deg)'
            });

            if (children.length > 6) {
                ul.find('.prev3').css({
                    left: prev3_left + 'px',
                    top: '360px',
                    transform: 'scale(1) translateZ(0) rotate(-45deg)'
                });
                ul.find('.next3').css({
                    left: next3_left + 'px',
                    top: '360px',
                    transform: 'scale(1) translateZ(0) rotate(45deg)'
                });
            }
        },

        floww_calc_call: function(element) {
            if (typeof element === 'undefined') {
                $('.frenify_cards_gallery').each(function() {
                    element = $(this);
                    FrenifyMetaPortal.flow_calc(element);
                });
            } else {
                FrenifyMetaPortal.flow_calc(element);
            }
        },


        hh_simpleCarousel: function() {
            var section = $('.fn_cs_simplecarousel .swiper-container');
            section.each(function() {
                var element = $(this);
                // Main Slider
                var mainSliderOptions = {
                    loop: true,
                    speed: 1000,
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                    },
                    slidesPerView: 'auto',
                    spaceBetween: 50,
                    direction: 'horizontal',
                    loopAdditionalSlides: 10,
                    watchSlidesProgress: true,
                };
                var mySwiper = new Swiper(element, mainSliderOptions);
            });
        },

        hh_fullSlider: function() {
            var section = $('.fn_cs_full_slider .swiper-container');
            section.each(function() {
                var element = $(this);
                var transform = 'Y';
                var direction = 'horizontal';
                var interleaveOffset = 0.5;
                if (direction === 'horizontal') {
                    transform = 'X';
                }
                var rate = 1;
                if ($('body').hasClass('rtl')) {
                    rate = -1;
                }
                // Main Slider
                var mainSliderOptions = {
                    loop: true,
                    speed: 1500,
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false,
                    },
                    navigation: {
                        nextEl: element.closest('.fn_cs_full_slider').find('.next'),
                        prevEl: element.closest('.fn_cs_full_slider').find('.prev'),
                    },
                    slidesPerView: 1,
                    direction: direction,
                    loopAdditionalSlides: 10,
                    watchSlidesProgress: true,
                    on: {
                        init: function() {
                            this.autoplay.stop();
                        },
                        imagesReady: function() {
                            this.autoplay.start();
                        },
                        progress: function() {
                            var swiper = this;
                            for (var i = 0; i < swiper.slides.length; i++) {
                                var slideProgress = swiper.slides[i].progress,
                                    innerOffset = swiper.width * interleaveOffset,
                                    innerTranslate = slideProgress * innerOffset * rate;
                                $(swiper.slides[i]).find(".abs_img").css({
                                    transform: "translate" + transform + "(" + innerTranslate + "px)"
                                });
                            }
                        },
                        touchStart: function() {
                            var swiper = this;
                            for (var i = 0; i < swiper.slides.length; i++) {
                                swiper.slides[i].style.transition = "";
                            }
                        },
                        setTransition: function(speed) {
                            var swiper = this;
                            for (var i = 0; i < swiper.slides.length; i++) {
                                swiper.slides[i].style.transition = speed + "ms";
                                swiper.slides[i].querySelector(".abs_img").style.transition =
                                    speed + "ms";
                            }
                        }
                    }
                };
                new Swiper(element, mainSliderOptions);
            });
        },

        heroHeader: function() {
            FrenifyMetaPortal.videoFunction();
            FrenifyMetaPortal.hh_3dcarousel();
            FrenifyMetaPortal.hh_bendedCarousel();
            FrenifyMetaPortal.hh_simpleCarousel();
            FrenifyMetaPortal.hh_fullSlider();
        },

        sliderDo: function(sliderTop, sliderBottom, activeIndex) {
            var topLength = sliderTop.find('li').length;
            if (activeIndex > topLength) {
                activeIndex -= topLength;
            }
            var indexPrev = activeIndex - 1;
            var indexPrev2 = activeIndex - 2;
            var indexNext = activeIndex + 1;
            var indexNext2 = activeIndex + 2;
            if (indexPrev > topLength) {
                indexPrev -= topLength;
            }
            if (indexPrev2 > topLength) {
                indexPrev2 -= topLength;
            }
            if (indexNext > topLength) {
                indexNext -= topLength;
            }
            if (indexNext2 > topLength) {
                indexNext2 -= topLength;
            }
            if (indexPrev < 1) {
                indexPrev += topLength;
            }
            if (indexPrev2 < 1) {
                indexPrev2 += topLength;
            }
            if (activeIndex < 1) {
                activeIndex += topLength;
            }
            if (indexNext < 1) {
                indexNext += topLength;
            }
            if (indexNext2 < 1) {
                indexNext2 += topLength;
            }
            sliderTop.find('li').removeClass('prev prev2 active next next2');
            sliderTop.find('li[data-index="' + indexPrev2 + '"]').addClass('prev2');
            sliderTop.find('li[data-index="' + indexPrev + '"]').addClass('prev');
            sliderTop.find('li[data-index="' + activeIndex + '"]').addClass('active');
            sliderTop.find('li[data-index="' + indexNext + '"]').addClass('next');
            sliderTop.find('li[data-index="' + indexNext2 + '"]').addClass('next2');
            return activeIndex;
        },

        teamMemberFunction: function() {
            FrenifyMetaPortal.ImgToSVG();
            FrenifyMetaPortal.BgImg();
        },

        videoFunction: function() {
            $('.popup-youtube, .popup-vimeo').each(function() { // the containers for all your galleries
                $(this).magnificPopup({
                    disableOn: 700,
                    type: 'iframe',
                    mainClass: 'mfp-fade',
                    removalDelay: 160,
                    preloader: false,
                    fixedContentPos: true,
                    callbacks: {
                        open: function() {
                            $.magnificPopup.instance.close = function() {
                                // Call the original close method to close the popup
                                $.magnificPopup.proto.close.call(this);
                            };
                        }
                    }
                });
            });
            FrenifyMetaPortal.ImgToSVG();
        },

        downButtonFunction: function() {
            $('.metaportal_fn_down').on('click', function() {
                var e = $(this),
                    href = e.attr('href');
                if (this.pathname === window.location.pathname || href.indexOf("#") !== -1) {
                    if ($(href).length) {
                        $([document.documentElement, document.body]).animate({
                            scrollTop: $(href).offset().top
                        }, 600);
                        return false;
                    }
                }
            });
            FrenifyMetaPortal.ImgToSVG();
        },



        allGalleryFunctions: function() {
            FrenifyMetaPortal.lightGallery();
            FrenifyMetaPortal.portalGallery();
            FrenifyMetaPortal.justifiedGallery();
            FrenifyMetaPortal.galleryMasonry();
            FrenifyMetaPortal.BgImg();
            FrenifyMetaPortal.gallerySlider();
            FrenifyMetaPortal.collageCarousel();
            FrenifyMetaPortal.isotopeFunction();
            FrenifyMetaPortal.inlineStyle();
            FrenifyMetaPortal.gallerySlider2();
            setTimeout(function() {
                FrenifyMetaPortal.isotopeFunction();
            }, 2000);
        },

        portalGallery: function() {
            $('.fn_cs_gallery_portal').each(function() {
                var collection = $(this);
                if (collection.hasClass('active')) {
                    return false;
                }
                collection.addClass('active');
                var items = collection.find('.item');
                var itemsLength = items.length;
                setInterval(function() {
                    var numberOne = Math.floor(Math.random() * itemsLength);
                    var numberTwo = Math.floor(Math.random() * itemsLength);

                    while (numberTwo === numberOne) {
                        numberTwo = Math.floor(Math.random() * itemsLength);
                    }
                    var firstDiv = collection.find('.item').eq(numberOne);
                    var secondDiv = collection.find('.item').eq(numberTwo);
                    var firstImage = firstDiv.find('input').val();
                    var secondImage = secondDiv.find('input').val();
                    firstDiv.addClass('ready');
                    secondDiv.addClass('ready');
                    setTimeout(function() {
                        firstDiv.find('input').val(secondImage);
                        firstDiv.find('.abs_img').css({
                            backgroundImage: 'url(' + secondImage + ')'
                        });
                        secondDiv.find('input').val(firstImage);
                        secondDiv.find('.abs_img').css({
                            backgroundImage: 'url(' + firstImage + ')'
                        });
                        firstDiv.removeClass('ready');
                        secondDiv.removeClass('ready');
                    }, 500);
                }, 2000);
            });
        },

        gallerySlider2: function() {
            // slider
            var section = $('.fn_cs_gallery_slider_2 .swiper-container');
            section.each(function() {
                var element = $(this);
                if (element.hasClass('ready')) {
                    return false;
                }
                element.addClass('ready');
                var transform = 'Y';
                var direction = 'horizontal';
                var interleaveOffset = 0.5;
                if (direction === 'horizontal') {
                    transform = 'X';
                }
                // Main Slider
                var mainSliderOptions = {
                    loop: true,
                    speed: 1500,
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false,
                    },
                    slidesPerView: 1,
                    direction: direction,
                    loopAdditionalSlides: 10,
                    watchSlidesProgress: true,
                    on: {
                        init: function() {
                            this.autoplay.stop();
                        },
                        imagesReady: function() {
                            this.autoplay.start();
                        },
                        progress: function() {
                            var swiper = this;
                            for (var i = 0; i < swiper.slides.length; i++) {
                                var slideProgress = swiper.slides[i].progress,
                                    innerOffset = swiper.width * interleaveOffset,
                                    innerTranslate = slideProgress * innerOffset;
                                $(swiper.slides[i]).find(".main_image").css({
                                    transform: "translate" + transform + "(" + innerTranslate + "px)"
                                });
                            }
                        },
                        touchStart: function() {
                            var swiper = this;
                            for (var i = 0; i < swiper.slides.length; i++) {
                                swiper.slides[i].style.transition = "";
                            }
                        },
                        setTransition: function(speed) {
                            var swiper = this;
                            for (var i = 0; i < swiper.slides.length; i++) {
                                swiper.slides[i].style.transition = speed + "ms";
                                swiper.slides[i].querySelector(".main_image").style.transition =
                                    speed + "ms";
                            }
                        }
                    }
                };
                new Swiper(element, mainSliderOptions);
            });
            FrenifyMetaPortal.BgImg();
        },

        inlineStyle: function() {
            var style = '';
            $('.metaportal_fn_style').each(function() {
                var element = $(this),
                    value = element.val();
                element.val('');
                style += value;
            });
            $('body').append(style);
        },

        collageCarousel: function() {
            var carousel = $('.fn_cs_gallery_collage_a .owl-carousel');
            var rtlMode = false;
            if ($('body').hasClass('rtl')) {
                rtlMode = true;
            }

            carousel.each(function() {
                var e = $(this);
                var myNav = false;
                var gutter = parseInt(e.closest('.fn_cs_gallery_collage_a').data('gutter'));

                e.owlCarousel({
                    items: 4,
                    lazyLoad: true,
                    loop: true,
                    rtl: rtlMode,
                    animateOut: 'fadeOut',
                    animateIn: 'fadeIn',
                    autoWidth: true,
                    autoplay: true,
                    autoplayTimeout: 70000,
                    smartSpeed: 2000,
                    margin: gutter,
                    dots: true,
                    nav: myNav,
                    navSpeed: true
                });
            });
        },

        gallerySlider: function() {
            $('.fn_cs_gallery_slider .inner').each(function() {
                var element = $(this);
                if (element.hasClass('gogogo')) {
                    return false;
                }
                element.addClass('gogogo');
                var container = element.find('.swiper-container');


                var pagination = element.closest('.fn_cs_gallery_slider').data('pag');
                var paginationClass = 'fn_cs_swiper__progress';
                var type = 'custom';
                var clickable = false;
                if (pagination === 'dots') {
                    paginationClass = 'fn_cs_swiper__dots';
                    type = 'bullets';
                    clickable = true;
                }


                var mySwiper = new Swiper(container, {
                    loop: true,
                    slidesPerView: 1,
                    spaceBetween: 70,
                    loopAdditionalSlides: 50,
                    speed: 800,
                    autoplay: {
                        delay: 8000,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    on: {
                        init: function() {
                            element.closest('.fn_cs_gallery_slider').addClass('ready');
                        },
                        autoplayStop: function() {
                            mySwiper.autoplay.start();
                        },
                    },
                    pagination: {
                        el: '.' + paginationClass,
                        type: type, // progressbar
                        clickable: clickable,
                        renderCustom: function(swiper, current, total) {
                            if (pagination === 'fill' || pagination === 'scrollbar') {
                                // progress animation
                                var scale, translateX;
                                var progressDOM = container.find('.fn_cs_swiper__progress');
                                if (progressDOM.hasClass('fill')) {
                                    translateX = '0px';
                                    scale = parseInt((current / total) * 100) / 100;
                                } else {
                                    scale = parseInt((1 / total) * 100) / 100;
                                    translateX = (current - 1) * parseInt((100 / total) * 100) / 100 + 'px';
                                }


                                progressDOM.find('.all span').css({
                                    transform: 'translate3d(' + translateX + ',0px,0px) scaleX(' + scale + ') scaleY(1)'
                                });
                                if (current < 10) {
                                    current = '0' + current;
                                }
                                if (total < 10) {
                                    total = '0' + total;
                                }
                                progressDOM.find('.current').html(current);
                                progressDOM.find('.total').html(total);
                            }
                        },
                        renderBullet: function(index, className) {
                            return '<span class="' + className + ' fn_dots"></span>';
                        }
                    },
                });
            });
            FrenifyMetaPortal.BgImg();
        },

        galleryMasonry: function() {
            FrenifyMetaPortal.lightGallery();
            FrenifyMetaPortal.isotopeFunction();
        },

        justifiedGallery: function() {
            FrenifyMetaPortal.lightGallery();
            var justified = $(".fn_cs_gallery_justified");
            justified.each(function() {
                var element = $(this);
                var height = parseInt(element.attr('data-height'));
                var gutter = parseInt(element.attr('data-gutter'));
                if (!height || height === 0) {
                    height = 400;
                }
                if (!gutter || gutter === 0) {
                    gutter = 10;
                }
                if ($().justifiedGallery) {
                    element.justifiedGallery({
                        rowHeight: height,
                        lastRow: 'nojustify',
                        margins: gutter,
                        refreshTime: 500,
                        refreshSensitivity: 0,
                        maxRowHeight: null,
                        border: 0,
                        captions: false,
                        randomize: false
                    });
                }
            });
        },


        /* COMMMON FUNCTIONS */
        BgImg: function() {
            var div = $('*[data-fn-bg-img]');
            div.each(function() {
                var element = $(this);
                var attrBg = element.attr('data-fn-bg-img');
                var dataBg = element.data('fn-bg-img');
                if (typeof(attrBg) !== 'undefined') {
                    element.addClass('frenify-ready');
                    element.css({
                        backgroundImage: 'url(' + dataBg + ')'
                    });
                }
            });
            var div2 = $('*[data-bg-img]');
            div2.each(function() {
                var element = $(this);
                var attrBg = element.attr('data-bg-img');
                var dataBg = element.data('bg-img');
                if (typeof(attrBg) !== 'undefined') {
                    element.addClass('frenify-ready');
                    element.css({
                        backgroundImage: 'url(' + dataBg + ')'
                    });
                }
            });
        },

        ImgToSVG: function() {

            $('img.fn__svg').each(function() {
                var $img = $(this);
                var imgClass = $img.attr('class');
                var imgURL = $img.attr('src');

                $.get(imgURL, function(data) {
                    var $svg = $(data).find('svg');
                    if (typeof imgClass !== 'undefined') {
                        $svg = $svg.attr('class', imgClass + ' replaced-svg');
                    }
                    $img.replaceWith($svg);

                }, 'xml');

            });
        },

        jarallaxEffect: function() {
            $('.jarallax').each(function() {
                var element = $(this);
                var customSpeed = element.data('speed');

                if (customSpeed !== "undefined" && customSpeed !== "") {
                    customSpeed = customSpeed;
                } else {
                    customSpeed = 0.5;
                }
                element.jarallax({
                    speed: customSpeed,
                    automaticResize: true
                });
            });
        },

        isotopeFunction: function() {
            var masonry = $('.fn_cs_masonry');
            if ($().isotope) {
                masonry.each(function() {
                    $(this).isotope({
                        itemSelector: '.fn_cs_masonry_in',
                        masonry: {}
                    });
                    $(this).isotope('reloadItems').isotope();
                });
            }
            var items = $('.fn_cs_project_category .posts_list');
            if ($().isotope) {
                items.each(function() {
                    $(this).isotope({
                        itemSelector: 'li',
                        masonry: {}
                    });
                });
            }
        },

        lightGallery: function() {
            if ($().lightGallery) {
                // FIRST WE SHOULD DESTROY LIGHTBOX FOR NEW SET OF IMAGES
                var gallery = $('.fn_cs_lightgallery');

                gallery.each(function() {
                    var element = $(this);
                    element.lightGallery(); // binding
                    if (element.length) {
                        element.data('lightGallery').destroy(true);
                    } // destroying
                    $(this).lightGallery({
                        selector: ".lightbox",
                        thumbnail: 1,
                        loadYoutubeThumbnail: !1,
                        loadVimeoThumbnail: !1,
                        showThumbByDefault: !1,
                        mode: "lg-fade",
                        download: !1,
                        getCaptionFromTitleOrAlt: !1,
                    });
                });
            }
        },
    };

    $(window).on('elementor/frontend/init', FrenifyMetaPortal.init);


    $(window).on('resize', function() {
        FrenifyMetaPortal.isotopeFunction();
        FrenifyMetaPortal.floww_calc_call();
        setTimeout(function() {
            FrenifyMetaPortal.isotopeFunction();
        }, 700);
    });
    $(window).on('load', function() {
        FrenifyMetaPortal.isotopeFunction();
    });

    $(window).on('scroll', function() {

    });

})(jQuery, window.elementorFrontend);