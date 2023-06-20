export const fetchJSON = async (url:string)=> {
    const res = await fetch(url);
    if (!res.ok) {
      const json = await res.json();
      throw json;
    }
    const data = await res.json();
    return data;
  };