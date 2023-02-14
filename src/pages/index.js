import { useEffect, useState } from 'react'
import React from 'react';

export default function Home() {

  const [list, setList] = useState([]);
  const [element, setElement] = useState("");
  const [quantity , setQuantity] = useState(0);
  const [savedList, setSavedList] = useState(false);
  const [link, setLink] = useState("https://esilv.olfsoftware.fr/td5/register"); 
  const [link2, setLink2] = useState("https://esilv.olfsoftware.fr/td5/courses");
  const [id, setId] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("list");
    if (data) {
      setList(JSON.parse(data));
      setSavedList(true);
    }
  }, []);
  
  async function AddItem() {

    if (!list.some(item => item.produit === element)){
      await setList([...list, {produit : element, qte : quantity}]);
      localStorage.setItem("list", JSON.stringify(list));
      setElement("");
      setQuantity(0);
      setSavedList(true);
    }
    else{
      const index = list.findIndex(item => item.produit === element);
      const newList = [...list];
      newList[index].qte = quantity;
      await setList(newList);
      localStorage.setItem("list", JSON.stringify(list));
      setElement("");
      setQuantity(0);
      setSavedList(true);
    }
  } 

  function handleModify(i) {
    setQuantity(list[i].qte);
    setElement(list[i].produit);
  }

 async function handleDeleteData() {
    localStorage.clear();
    await setList([]);
    setSavedList(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await AddItem();
  }

  async function handleConnect(){
    setList([]);
    try{
    const handleClick = await
    fetch(link)
      .then((result) => result.json())
      .then((get) => {
        //setList(get.courses.map((item) => {
        //const element = item.produit;
        //const quantity = item.qte;
        //return {element, quantity};
      //}));
      setId(get.id);
      setList(get.courses);
      localStorage.setItem("list", JSON.stringify(list));
      });
    
  } 
  catch (err) {
    console.log(err);
  }
};

async function handleSave(){
  
  const params = new URLSearchParams({
    id,
    chg: JSON.stringify([list]),
  });
  const res = await fetch('https://esilv.olfsoftware.fr/td5/courses', {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:params.toString(),  
})
console.log(res);

};

  return (
    <div>
      <div className="list-creation">
        <br></br> 
        <h1>Entrer des éléments dans la liste de courses</h1>
        
        <br></br>
        <button onClick={() => handleConnect()}>Connecter au serveur</button>
        <br></br>
        <form onSubmit={handleSubmit}>
          <p>Élément</p>
          <input 
            type="text" 
            value={element}  
            onChange={e => setElement(e.target.value)}
          />
          <p>Quantité</p>
          <input
            type="number"
            value={quantity}
            min="1"
            onChange={e => setQuantity(e.target.value)}
          />
          <br></br>
          <button type="submit">Ajouter</button>

        </form>
        <br></br> 
        <button onClick={() => handleSave()}>Sauvegarder la liste</button>
        <br></br>
        <button onClick={() => handleDeleteData()}>Effacer la liste</button>

      </div>
    
        <div className="list-display">
          <h2>Liste de courses</h2>
          <br></br> 
          <div>

          {
            list.map((item, index) => {return(
              <div><button onClick={()=> handleModify(index)}>{item.produit} : {item.qte}</button></div>); 
            })
          }
          </div>
        </div>

    </div>
  )
}
