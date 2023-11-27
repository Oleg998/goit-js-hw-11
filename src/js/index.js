




async function getPhoto(){
const BASE_URL = `https://pixabay.com/api/`;
const KEY=`40926027-5cb2084dfcf445810afb57cb9`;
  const resp = await fetch(`${BASE_URL}?${KEY}`);
  if (!resp.ok) () => {
    throw new Error(resp.statusText);
  };
  return await resp.json();
}


getPhoto()
.then(data=>console.log(data))
.catch(err=>console.log(err))