/**
 * во вьюхе используем как
 * ReservationsController as reservation
 */
innaAppControllers.controller('PaymentSuccessController', function (EventManager, innaAppApiEvents) {
    
    var self = this;
    
    $(".Header").hide();
    $(".zopim").hide();
    $("body").removeClass("light-theme");
    EventManager.fire(innaAppApiEvents.FOOTER_HIDDEN);
    
    
});
