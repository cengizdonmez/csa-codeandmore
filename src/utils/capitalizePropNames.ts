


export default function(input:any){
  const propNames = Object.keys(input);

  const result ={};
  propNames.forEach(item=>{
    const val = input[item];
    const newName = item.charAt(0).toUpperCase()+ item.slice(1);
    result[newName]= val;
  })
  return result
}
