import './App.css';
import axios from 'axios';
import rickImage from './rick.png'
import wallpaperImage from './wallpaper.jpg'
import './custom.css'
import { useState, useEffect } from 'react';

function App() {
  
  const [charachter, setCharachter] = useState([])
  const [text, setText] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [show, setShow] = useState(false)
  const [chosenChar, setChosenChar] = useState([])

  useEffect(() => {
    // loading data from the api
    const loadCharachter = async()=>{
      const response = await axios.get("https://rickandmortyapi.com/api/character");
      setCharachter(response.data.results);
    }
    loadCharachter()
  }, [])

  const onTextHandler = (text) => {
    //Need to keep track of the text to compare with results
    let matches = []

    if (text.length>1){
      matches = charachter.filter(charachter => {
        const regex = new RegExp(`${text}`, "gi");
        return charachter.name.match(regex)
      })
    }
    setSuggestions(matches);
    setText(text);
  }

  const onSuggestionHandler = (e, info) => {
    if (suggestions.length>0){
      setSuggestions([])
    }

    const loadChosenCharachter = async()=>{
      const response = await axios.get(info.url)
      setChosenChar(response.data)
      setShow(true)
    }

    loadChosenCharachter() 
  } 
  

  return (
    <div>
      <div className="container">
        <div class="card card--inverted">
          <h2> <img src={rickImage} className="icon" aria-hidden="true" alt="Rick image"></img>Rick and Morty Characther Search</h2>
          <input class="input__field" type="text" 
                  placeholder="Type any charachter's name" 
                  value={text} 
                  onChange={e => onTextHandler(e.target.value)} />
        </div>

        
        {suggestions && suggestions.map((suggestions, i) => 
          <div key={i} className="col-md-12 suggestions"
            onClick={(e) => onSuggestionHandler(e, suggestions)}
            value={suggestions}
          > 
            {suggestions.name}
          </div>
        )}
        
        <div className="d-flex justify-content-center">
          {show ? (
            <div className={`modal-card mt-5 ${show ? "active" : ""}`}>
            <div className="modal-card-row">
              <img src={chosenChar.image} alt="Card cap"></img>
              <div>
                <h5 className="card-title p-5">{chosenChar.name}</h5>
              </div>
            </div>
            <div className="modal-card-row justify-content-center">
              <ul className="list-group row">
                <li className="list-group-item m-5">Origin: {chosenChar.origin.name}</li>
                <li className="list-group-item m-5">Species: {chosenChar.species}</li>
              </ul>
              
              <ul className="list-group row">
                <li className="list-group-item m-5">Gender: {chosenChar.gender}</li>
                <li className="list-group-item m-5">Status: {chosenChar.status}</li>
              </ul>
            </div>
          </div>
          ) : (<> </>)}
          
        </div>
        
      </div>
    </div>
  );
}

export default App;
