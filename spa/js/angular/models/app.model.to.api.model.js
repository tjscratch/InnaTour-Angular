//маппинг моделей на модели для api
function aviaCriteriaToApiCriteria(data) {
    var self = this;
    data = data || {};

    self.FromCityName = data.From;
    self.FromId = data.FromId;
    self.FromCityUrl = data.FromUrl;
    self.ToCityName = data.To;
    self.ToId = data.ToId;
    self.ToCityUrl = data.ToUrl;
    self.BeginDate = data.BeginDate;
    self.ReturnDate = data.EndDate;
    self.AdultsNumber = data.AdultCount;
    self.ChildCount = data.ChildCount;
    self.BabyCount = data.InfantsCount;
    self.CabinClass = data.CabinClass;
    self.IsFlexible = data.IsFlexible == 1 ? true : false;

    self.BeginDate = dateHelper.dateToApiDate(data.BeginDate);
    self.ReturnDate = dateHelper.dateToApiDate(data.EndDate);

};