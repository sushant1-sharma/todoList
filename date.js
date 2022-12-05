
module.exports.getdate = function(){
let today = new Date();

  let currentDay = new Date();
  let options = {
      day: "numeric",
      weekday: "long",
      month: "long"	
  };

  let day = currentDay.toLocaleDateString("en-US", options);
  return day;
}

module.exports.getday = function(){
let today = new Date();

  let currentDay = new Date();
  let options = {
  	  day: "numeric",
      weekday: "long",
      month: "long"	
  };

  return day.getDay();
}