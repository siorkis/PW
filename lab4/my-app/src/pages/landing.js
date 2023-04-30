import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";


const config = {
  headers: { 'X-Access-Token': 'd80b52a15d6b4d1392f59e3f919601f02106ab54c795e718f1eb987e8fba0dbb' }
};

let responseData;



const getData = () => {
  return new Promise((resolve, reject) => {
    axios.get('https://late-glitter-4431.fly.dev/api/v54/quizzes', config)
      .then(response => {
        responseData = response.data;
        resolve(responseData);
      })
      .catch(error => {
        console.error(error);
        reject(error);
      });
  });
};


function Landing() {
  const { id } = useParams();


  const navigate = useNavigate();
  function HandleClick (i, userID=0) {
    console.log(userID);
    if (userID > 0) {
      console.log("asd")
      navigate("/quiz/" + i + "/" + userID);
    } else {
      console.log("navigate to ./quiz/" + i)
    
      navigate("/quiz/" + i);
    }
    
  }

  
  getData()
  .then(data => {
    console.log(data);

  
  const elements = [];
  for (let i = 0; i < data.length; i++) {
    const quizzes = () => {
      return React.createElement("button", { 
        className: "quiz", 
        // onClick: handleClick(i)
        onClick: () => {HandleClick(data[--i].id, id)}
      }, "Quiz nr"+ (++i) );
    };
    elements.push(React.createElement(quizzes, { key: i }));
  }
    ReactDOM.render(
      React.createElement("div", { id: "quizzes" }, elements),
      document.getElementById("quizzes")
    );
  })
  .catch(error => {
    console.error(error);
  });

  return (

    <div className='quizzes' id="quizzes">
  
    </div>
    
  );
}

export default Landing;