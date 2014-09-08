
var tours = {
    grid: {
        //htype: {
        //    main: 'main',
        //    big: 'big',//grid8
        //    med: 'med',//grid6
        //    small: 'small',//grid4
        //},
        //vtype: {
        //    main: 'main',
        //    full: 'full',
        //    advice: 'advice',
        //    small: 'small',
        //},
        blockType: {
            bR:"R",
            bXL:"XL",
            b2SL:"2SL",
            bL2S:"L2S",
            b2M:"2M",
            bLSS:"LSS",
            bSSL:"SSL",
            bL3L3L3:"L3L3L3",
            bP1P2P1:"P1P2P1",
            bP1P1P2:"P1P1P2",
            bP2P1P1:"P2P1P1"
        }
    },

    end: null
};

function gridItem(tourDesc, name, price, imgUrl) {
    var self = this;
    self.tourDesc = tourDesc;
    self.name = name;
    self.price = price;
    self.imgUrl = imgUrl;
}

function gridBlock(type, item1, item2, item3) {
    var self = this;
    self.type = type;
    self.item1 = item1;
    self.item2 = item2;
    self.item3 = item3;
}

function nvItem(value, name) {
    var self = this;
    self.value = value;
    self.name = name;
}

function idNameItem(id, name) {
    var self = this;
    self.id = id;
    self.name = name;
}

function fromItem(id, name, altName) {
    var self = this;
    self.id = id;
    self.name = name;
    self.altName = altName;
}

function toItem(id, name, type, countryId, countryName, resortId, resortName, codeIcao) {
    var self = this;
    self.id = id;
    self.name = name;
    self.type = type;
    self.countryId = countryId;
    self.countryName = countryName;
    self.resortId = resortId;
    self.resortName = resortName;
    self.codeIcao = codeIcao;
}

function toItemData(data) {
    var self = this;
    data = data || {};
    self.id = data.id;
    self.name = data.name;
    self.type = data.type;
    self.countryId = data.countryId;
    self.countryName = data.countryName;
    self.resortId = data.resortId;
    self.resortName = data.resortName;
    self.codeIcao = data.codeIcao;
}

toItemData.prototype.description = function() {
	var toItemType = { country: 'country', resort: 'resort', hotel: 'hotel' };
    var country = "";
    var resort = "";
    
    if (this.countryName != null) {
    	country = this.countryName;
    }
    
    if (this.resortName != null) {
    	resort = this.resortName;
    }
    
    

    if (this.type == toItemType.country)  {
    	return ", по всей стране";
    } else if (this.type == toItemType.resort) {
        return ", " + country;
    } else if (this.type == toItemType.hotel) {
        return ", " + country + ", " + resort;
    }
}

function nightItem(name, min, max) {
    var self = this;
    self.name = name;
    self.min = min;
    self.max = max;
}

function itCategoryRightItem(name, description, imgRight, textRight) {
    var self = this;
    self.name = name;
    self.description = description;
    self.imgRight = imgRight;
    self.textRight = textRight;
}

function sendRequestData(data) {
    var self = this;
    data = data || {};
    self.Email = data.email;
    self.Phone = data.phone;
    self.F = null;
    self.I = data.name;
    self.O = null;
    self.Description = data.comments;
    if (data.offer != null)
        self.LinkProduct = data.offer.Id;
    self.OffersCategoriesId = data.offersCategoriesId;
    self.IsSubscribe = data.isSubscribe;
}

//function gridItem(htype, vtype, tourDesc, name, price, imgUrl) {
//    var self = this;
//    self.htype = htype;
//    self.vtype = vtype;
//    self.tourDesc = tourDesc;
//    self.name = name;
//    self.price = price;
//    self.imgUrl = imgUrl;
//}