import React, { useState, useRef } from 'react';
import '../index.css';
import Header from '../components/Header';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Signup() {
  const signupBtnRef = useRef(null);
  const signinBtnRef = useRef(null);
  const emailFieldRef = useRef(null);
  const titleRef = useRef(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [surname, setSurname] = useState('');
  
  const navigate = useNavigate();

  const config = {
    headers: { 'X-Access-Token': 'd80b52a15d6b4d1392f59e3f919601f02106ab54c795e718f1eb987e8fba0dbb' }
  };

  function Redirect(id) {
    navigate("/landing/" + id);
  }


  function signin() {
    emailFieldRef.current.style.maxHeight = '0';
    titleRef.current.innerHTML = 'Sign in';
    signupBtnRef.current.classList.add('disable');
    signinBtnRef.current.classList.remove('disable');
    

    if (document.getElementsByClassName("input-text")[0].value !== '' &&
        document.getElementsByClassName("input-text")[1].value !== '') {

          let responseData;
    
          const getData = () => {
            return new Promise((resolve, reject) => {
              axios.get('https://late-glitter-4431.fly.dev/api/v54/users', config)
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
          
          getData()
            .then(data => {
              console.log(data); 
              let UserName = document.getElementsByClassName("input-text")[0].value;
              let UserSurname = document.getElementsByClassName("input-text")[1].value;
              const matchingObject = data.find(obj => obj.name === UserName && obj.surname === UserSurname);

              if (matchingObject) {
                console.log(matchingObject.id);
                Redirect(matchingObject.id);
              } else {
                console.log("No matching object found");
              }
            })
            .catch(error => {
              console.error(error);
            });
            
        }
    
  }

  function signup() {
    
    emailFieldRef.current.style.maxHeight = '60px';
    titleRef.current.innerHTML = 'Sign up';
    signupBtnRef.current.classList.remove('disable');
    signinBtnRef.current.classList.add('disable');

    if (document.getElementsByClassName("input-text")[0].value !== '' &&
        document.getElementsByClassName("input-text")[1].value !== '' &&
        document.getElementsByClassName("input-text")[2].value !== '') {
            let UserName = document.getElementsByClassName("input-text")[0].value;
            let UserSurname = document.getElementsByClassName("input-text")[1].value;
            console.log(UserName, UserSurname);

            const data = {
              data: {
                name: UserName,
                surname: UserSurname
            }
            };

            axios.post('https://late-glitter-4431.fly.dev/api/v54/users', data, config)
              .then(response => {
                console.log(response.data);
              })
              .catch(error => {
                console.error(error);
              });
        }
      
       
  }

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handleSurnameChange(e) {
    setSurname(e.target.value);
  }

  return (
    <div>
      <Header />
      <div className="form-box">
        <h1 ref={titleRef}>Sign up</h1>

        <form>
          <div className="input-group">
            <div className="input-field" id="NameField">
              <input
                type="text"
                placeholder="Name"
                class="input-text"
                value={name}
                onChange={handleNameChange}
              />
            </div>


            <div className="input-field">
              <input
                type="text"
                placeholder="Surname"
                class="input-text"
                value={surname}
                onChange={handleSurnameChange}
              />
            </div>

            <div className="input-field" ref={emailFieldRef}>
              <input
                type="text"
                placeholder="Email"
                class="input-text"
                value={email}
                onChange={handleEmailChange}
              />
            </div>

            
          </div>

          <div className="btn-field">
            <button onClick={signup} type="button" ref={signupBtnRef}>
              Sign up
            </button>
            <button
              onClick={signin}
              type="button"
              className="disable"
              ref={signinBtnRef}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
