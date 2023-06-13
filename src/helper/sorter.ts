export function sorterTurkish(a: any, b: any, key: string){
  var atitle = a[key];
  var btitle = b[key];
  var alfabe = "AaBbCcÇçDdEeFfGgĞğHhIıİiJjKkLlMmNnOoÖöPpQqRrSsŞşTtUuÜüVvWwXxYyZz0123456789";
  if (atitle.length === 0 || btitle.length === 0) {
      return atitle.length - btitle.length;
  }
  for(var i=0;i<atitle.length && i<btitle.length;i++){
      var ai = alfabe.indexOf(atitle[i]);
      var bi = alfabe.indexOf(btitle[i]);
      if (ai !== bi) {
          return ai - bi;
      }
  }
} 