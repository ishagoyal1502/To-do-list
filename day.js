exports.getDate=function(){
var date=new Date();
var day=date.getDay();
var options={
  weekday: "long",
  day:"numeric",
  month: "long",
};
var value=date.toLocaleDateString("en-US",options);
return value;
}
