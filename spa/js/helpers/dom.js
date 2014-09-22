var DOM_HELPER = {

    closest: function (elem, selector) {

        while (elem) {
            if (elem.matches && elem.matches(selector)) {
                return true;
            } else {
                elem = elem.parentNode;
            }
        }
        return false;
    }
};
