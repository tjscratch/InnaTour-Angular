$(function () {

    (function () {
        var minDate = new Date();
        minDate.setDate(minDate.getDate() - 7);
        var datepicker = $('.Calendar-input').datepicker({
            minDate: minDate
        });

        $(window).resize(function() {
            datepicker.datepicker('hide');
            $('.Calendar-input').blur();
        });
    })();

    (function () {
        var $to = $('.SearchTo');
        $to.tooltip({ position: { my: 'center top+22', at: 'center bottom' } });
        $to.tooltip("disable");
    })();

    (function () {
        var $banners = $('.Offer-card-banners').children(),
            length = $banners.length,
            $dotsContainer = $('.Banner-dots'),
            currentI = 0,
            $dots,
            animate = false;

        $banners.each(function () {
            $dotsContainer.append('<li class="dot" />');
        });

        $dots = $dotsContainer.children();

        $banners.eq(currentI).css('zIndex', 2);
        $dots = $dotsContainer.children();
        $dots.eq(currentI).addClass('active');

        $dotsContainer.on('click', ':not(.active)', function (evt) {
            if (animate) {
                return;
            }

            var index = $dots.index(evt.target);

            scroll(currentI, index)
        });

        function scroll (fromI, toI) {
            if (animate) {
                return;
            }
            var $from = $banners.eq(fromI);
            var $fromInfo = $from.find('.info-container');
            var fromInfoWidth = $fromInfo.width();
            var $to = $banners.eq(toI);
            var $toInfo = $to.find('.info-container');
            var toInfoWidth = $toInfo.width();
            var $fromImg = $from.find('.img');

            animate = true;
            $dots
                .removeClass('active')
                .eq(toI)
                .addClass('active');
            $banners.css('zIndex', 0);
            $to.css('zIndex', 1);
            $fromImg.css('width', $fromImg.width());
            $from
                .css('zIndex', 2)
                .animate({
                    'width': 0
                }, {
                    duration: 1000,
                    ease: 'linear',
                    queue: false,
                    complete: function () {
                        $to.css('zIndex', 2);
                        $from.css({
                            'width': '100%',
                            'zIndex': 0
                        });
                        $fromImg.css('width', '100%')

                        currentI = toI;
                        animate = false
                    }
                });

            if ($fromInfo.length && $toInfo.length) {

                $fromInfo
                    .css('width', fromInfoWidth)
                    .animate({
                        'left': -fromInfoWidth
                    }, {
                        duration: 1000,
                        ease: 'linear',
                        queue: false,
                        complete: function () {
                            $fromInfo.css({
                                'left': 0,
                                'width': '100%'
                            });
                        }
                    });

                $toInfo
                    .css('left', toInfoWidth)
                    .animate({
                        'left': 0
                    }, {
                        duration: 1000,
                        ease: 'linear',
                        queue: false,
                        complete: function () {
                            $toInfo.css({
                                'width': '100%'
                            });
                        }
                    });
            }
        }



        setInterval($.proxy(function () {
            var next = currentI + 1;

            if (next === length) {
                next = 0;
            }

            scroll(currentI, next);
        }, this), 7000);
    })();



    $('.Mouse-scroll').on('click', function () {
        var $body = $('html, body'),
            headerHeight = $('.Header').height(),
            position = $('.Offers-anchor').position();

        $body.animate({scrollTop: position.top - headerHeight}, 500)
    });


});