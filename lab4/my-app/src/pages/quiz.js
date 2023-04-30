import React from 'react';
// import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import successSound from '../success.mp3';


const config = {
  headers: { 'X-Access-Token': 'd80b52a15d6b4d1392f59e3f919601f02106ab54c795e718f1eb987e8fba0dbb' }
};

let responseData;


function Quiz() {
	const [currentQuiz, setCurrentQuiz] = useState([]);
	const { id } = useParams();
	const { user } = useParams();

	const audio = new Audio(successSound);
  const playSound = () => {
		console.log("sound")
    audio.play();
  };

	console.log("id of quiz:", id)
	
	const getData = () => {
		return new Promise((resolve, reject) => {
			axios.get('https://late-glitter-4431.fly.dev/api/v54/quizzes/'+id, config)
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

	useEffect(() => {
		getData()
			.then(data => {
				console.log(data);
				setCurrentQuiz([
					{	
						questionID: data.questions[0].id,
						questionText: data.questions[0].question,
						answerOptions: [
							{answerText: data.questions[0].answers[0]},
							{answerText: data.questions[0].answers[1]}, 
							{answerText: data.questions[0].answers[2]},
							{answerText: data.questions[0].answers[3]}, 
						],
					},
					{	
						questionID: data.questions[1].id,
						questionText: data.questions[1].question,
						answerOptions: [
							{answerText: data.questions[1].answers[0]},
							{answerText: data.questions[1].answers[1]}, 
							{answerText: data.questions[1].answers[2]},
							{answerText: data.questions[1].answers[3]}, 
						],
					},
					{	
						questionID: data.questions[2].id,
						questionText: data.questions[2].question,
						answerOptions: [
							{answerText: data.questions[2].answers[0]},
							{answerText: data.questions[2].answers[1]}, 
							{answerText: data.questions[2].answers[2]},
							{answerText: data.questions[2].answers[3]}, 
						],
					},
					{
						questionID: data.questions[3].id,
						questionText: data.questions[3].question,
						answerOptions: [
							{answerText: data.questions[3].answers[0]},
							{answerText: data.questions[3].answers[1]}, 
							{answerText: data.questions[3].answers[2]},
							{answerText: data.questions[3].answers[3]}, 
						],
					},
				])
				console.log(currentQuiz)
			})
			.catch(error => {
				console.error(error);
			});
	}, []);

	const questions = currentQuiz;
	console.log(questions)

	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);
	const [counter, setCounter] = useState(0);
	const [scoreMsg, setMsg] = useState('');

	const handleAnswerOptionClick = (answerText) => {

		let data = {
			"data": {
        "question_id": currentQuiz[counter].questionID,
        "answer": answerText,
        "user_id": user
    }
		};

		setCounter(counter + 1)

		if (user !== undefined) {
			axios.post('https://late-glitter-4431.fly.dev/api/v54/quizzes/'+ id + '/submit', data, config)
				.then(response => {
					console.log(response.data);
					if(response.data.correct) {
						setScore(score + 1);
					}
				})
				.catch(error => {
					console.error(error);
				});
		}
		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < questions.length) {
			setCurrentQuestion(nextQuestion);
		} else {
			console.log("userID:" + user)
			if (user === undefined) { 
				setMsg("To view the score you should log in.");
			} else {
				setMsg("You scored " + score + " out of " + questions.length);
				playSound();
			}
			
			setShowScore(true);
			
		}
  }

	return (
		<div className='app'>
			{showScore ? (
				<div className='score-section'>
					{scoreMsg}
				</div>
			) : (
				<>
					<div className='question-section'>
						<div className='question-count'>
							<span>Question {currentQuestion + 1}</span>/{questions.length}
						</div>
						{questions[currentQuestion] && (
							<div className='question-text'>{questions[currentQuestion].questionText}</div>
						)}
					</div>
					<div className='answer-section'>
						{questions[currentQuestion]?.answerOptions.map((answerOption) => (
							<button onClick={() => handleAnswerOptionClick(answerOption.answerText)}>{answerOption.answerText}</button>
						))}
					</div>
				</>
			)}
		</div>
	);
	
}

export default Quiz;
