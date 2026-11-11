import { useEffect, useRef, useState } from 'react'

const questions = [
  {
    prompt: 'The field report and station log disagree. What should both teams check first?',
    options: ['Which report is easier to read', 'Where and when each reading was recorded', 'Which source appears first'],
    correct: 1,
    feedback: 'Source, time, and location can explain why two readings disagree.',
  },
  {
    prompt: 'What does the transport layer do in NGC2?',
    options: ['Carries updates between systems', 'Stores the complete historical record', 'Presents the operator’s display'],
    correct: 0,
    feedback: 'The transport layer provides the communications link that carries an update.',
  },
  {
    prompt: 'When can combining two observations narrow uncertainty?',
    options: ['When both reports copy the same source', 'Whenever the system has two reports', 'When the observations agree and their errors are independent'],
    correct: 2,
    feedback: 'Two independent observations can narrow uncertainty. A shared error can make agreement misleading.',
  },
  {
    prompt: 'What does an object detector’s confidence score describe?',
    options: ['The authority to act', 'The model’s estimate for its detection', 'The cause of an event'],
    correct: 1,
    feedback: 'The score describes the detection. Authorization requires separate evidence and judgment.',
  },
  {
    prompt: 'Nine of 59 alerts were correct. What was the precision?',
    options: ['About 15%', 'About 50%', 'About 90%'],
    correct: 0,
    feedback: 'Precision is the number of correct alerts divided by all alerts. Here it is 9 ÷ 59.',
  },
  {
    prompt: 'Which action illustrates automation bias?',
    options: ['Checking the source record', 'Asking for a second opinion', 'Approving an automated recommendation without checking its evidence'],
    correct: 2,
    feedback: 'Automation bias occurs when people give an automated recommendation too much weight.',
  },
  {
    prompt: 'How should you present the disputed Lavender claims?',
    options: ['Attribute the reporting and give the IDF response', 'Describe the reporting as a confirmed finding', 'Treat a commentator’s summary as the original source'],
    correct: 0,
    feedback: 'The investigation and the official response are distinct accounts. Attribute each to its source.',
  },
  {
    prompt: 'What changed between the two views in the Robocurve clip?',
    options: ['The physical object on the bench', 'The image the model received', 'The room in which the test took place'],
    correct: 1,
    feedback: 'The physical prop stayed in place while the model received an altered image.',
  },
  {
    prompt: 'What kind of evidence was Anthropic’s fictional emergency?',
    options: ['A verified incident involving a real person', 'A survey of deployed systems', 'A result from a controlled simulation'],
    correct: 2,
    feedback: 'The simulated scenario shows choices under a designed set of conditions.',
  },
  {
    prompt: 'What makes human oversight meaningful for an agent with tools?',
    options: ['A high confidence score', 'Limited permissions and a person who can intervene', 'A faster interface'],
    correct: 1,
    feedback: 'People need the evidence, time, and authority to act. Limited permissions constrain what the agent can do.',
  },
]

export function Quiz() {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const heading = useRef<HTMLHeadingElement>(null)
  const nextButton = useRef<HTMLButtonElement>(null)
  const question = questions[index]
  const answer = answers[index]
  const score = answers.filter((choice, position) => choice === questions[position].correct).length

  useEffect(() => {
    if (index > 0) heading.current?.focus({ preventScroll: true })
  }, [index])

  useEffect(() => {
    if (answer !== undefined) nextButton.current?.focus({ preventScroll: true })
  }, [answer])

  return <section className="quiz-panel" aria-label="Ten-question review" data-stage-interactive>
    <div className="quiz-progress">
      <span>{question ? `Question ${index + 1} of ${questions.length}` : 'Review complete'}</span>
      <progress max={questions.length} value={answers.length} aria-label="Questions answered" />
    </div>
    {question ? <>
      <h2 ref={heading} tabIndex={-1}>{question.prompt}</h2>
      <div className="quiz-options">
        {question.options.map((option, choice) => <button key={option} type="button" disabled={answer !== undefined}
          data-answer={answer === undefined ? undefined : choice === question.correct ? 'correct' : choice === answer ? 'incorrect' : undefined}
          onClick={() => setAnswers(current => current.length > index ? current : [...current, choice])}>
          {option}
        </button>)}
      </div>
      <div className="quiz-feedback">
        <p id="quiz-feedback" role="status">{answer !== undefined && <><strong>{answer === question.correct ? 'Correct.' : 'Incorrect.'}</strong> {question.feedback}</>}</p>
        <button className="quiz-next" ref={nextButton} type="button" aria-describedby="quiz-feedback"
          disabled={answer === undefined} onClick={() => setIndex(index + 1)}>
          {index === questions.length - 1 ? 'See score' : 'Next question'} <span aria-hidden="true">→</span>
        </button>
      </div>
    </> : <div className="quiz-complete">
      <h2 ref={heading} tabIndex={-1}>You got {score} out of {questions.length} correct.</h2>
      <button className="quiz-next" type="button" onClick={() => { setAnswers([]); setIndex(0) }}>Start again</button>
    </div>}
  </section>
}
