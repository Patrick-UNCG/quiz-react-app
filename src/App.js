import React from "react"
import Quiz from "./Quiz"
import {nanoid} from "nanoid"
import "./style.css"

export default function App(){
    const [allQuestions, setAllQuestions] = React.useState([])
    const [startPage, setStartPage] = React.useState(true)
    const [score, setScore] = React.useState(0)
    const [resetState, setResetState]= React.useState(0)
    const initialState = [{questionText: "", 
    answerOptions:[
    {answerText: "", isCorrect:false, color:'#F8BCBC'},
    {answerText: "", isCorrect:false, color:'#F8BCBC'},
    {answerText: "", isCorrect:true, color:'#94D7A2'},
    {answerText: "", isCorrect:false,color:'#F8BCBC'}],
    answerChosen:false,id:nanoid()
  }];

  

    React.useEffect(() => {
      function trimValues(arr) {
        const newArr = [];
        arr.forEach((element) => {
          newArr.push({
            questionText: cleanString(element.question),
            answerChosen:false,
            id: nanoid(),
            answerOptions: shuffle([
              {
              answerText: cleanString(element.correct_answer),
              isCorrect: true,
              color:'#94D7A2'
    
              },
            ...element.incorrect_answers.map((item) => ({
              answerText: cleanString(item),
              isCorrect: false,
              color:'#F8BCBC'
              })),
            ]),
          });
        });
        return newArr;
      }
      fetch("https://opentdb.com/api.php?amount=5&category=15&difficulty=easy&type=multiple")
          .then(res => res.json())
          .then(data => setAllQuestions(trimValues(data.results)))
    }, [resetState])

    

    function cleanString(val) {
      let newStr = val.replace(/&quot;/g, "'");
      newStr = newStr.replace(/&#/g, " #");
      newStr = newStr.replace(/;s/g, "s");
      newStr = newStr.replace(/&amp;/g, "");
      newStr = newStr.replace(/#039/g, "'");
      newStr = newStr.replace(/&eacute;/g, "é");
      newStr = newStr.replace(/';/g, "'");
      return newStr;
    }

    function shuffle(array) {
      let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
      while (currentIndex !== 0) {
      // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

      // And swap it with the current element.
        [ array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }
      return array;
    }

    function startButton(){
      setStartPage(false)
      setResetState(resetState+1)
    }

    function checkCorrect(id, index, isCorrect){
      if(allQuestions[index].answerChosen){
        return
      }
      else{
        setAllQuestions(oldQuestions => oldQuestions.map(question =>{
          return question.id === id ? {...question, answerChosen: true} : question
        }))
        if(isCorrect){
          setScore(score+1)
        }
      }
    }

    const quizElements = allQuestions.map((quest, index)=>
    (<div>
      <Quiz key={index} question={quest.questionText}/>
      <div className="quiz-answer-container">
      {quest.answerOptions.map((item,index2)=>(
        <button style={{
          backgroundColor: quest.answerChosen ? item.color : 'white'
        }} onClick={()=>(checkCorrect(quest.id, index, item.isCorrect))}className="quiz-answer">{item.answerText}</button>
      ))}
      </div>
    </div>
    ))

    function reset(){
      setStartPage(true)
      setAllQuestions(initialState)
      setScore(0)
    }
    return (<main>
        {startPage ? 
        <div className = "start-page">
            <h1 className = "start-title">Gamequiz</h1> 
            <h3 className = "start-desc">A video game quiz</h3>
            <button className = "start-btn" onClick={startButton}>Start quiz</button>
        </div> 
        : 
        <div className = "quiz-page">
          <h3 className = "score">Score: {score} / 5</h3>
          {quizElements}
          <button className="reset-btn" onClick={reset}>Reset</button>
        </div>
             }
    </main>)
}