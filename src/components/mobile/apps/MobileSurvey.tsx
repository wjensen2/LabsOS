'use client';

import { useState } from 'react';
import { Check, ArrowRight, Star } from 'lucide-react';

interface Question {
  id: string;
  type: 'rating' | 'multiple' | 'text';
  question: string;
  options?: string[];
  required: boolean;
}

const surveyQuestions: Question[] = [
  {
    id: '1',
    type: 'rating',
    question: 'How would you rate your overall experience at Fountain Summit?',
    required: true
  },
  {
    id: '2',
    type: 'multiple',
    question: 'Which sessions were most valuable to you?',
    options: ['Keynote Presentations', 'Technical Workshops', 'Networking Sessions', 'Product Demos', 'Q&A Panels'],
    required: true
  },
  {
    id: '3',
    type: 'text',
    question: 'What topics would you like to see covered in future events?',
    required: false
  },
  {
    id: '4',
    type: 'rating',
    question: 'How likely are you to recommend Fountain Labs to a colleague?',
    required: true
  }
];

export function MobileSurvey() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isComplete, setIsComplete] = useState(false);

  const question = surveyQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === surveyQuestions.length - 1;
  const progress = ((currentQuestion + 1) / surveyQuestions.length) * 100;

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [question.id]: value
    }));
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      setIsComplete(true);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const canProceed = () => {
    if (!question.required) return true;
    return answers[question.id] !== undefined;
  };

  if (isComplete) {
    return (
      <div className="h-full bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted successfully. We appreciate your time and input.
          </p>
          <button
            onClick={() => {
              setCurrentQuestion(0);
              setAnswers({});
              setIsComplete(false);
            }}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium"
          >
            Take Survey Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Progress Bar */}
      <div className="p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {surveyQuestions.length}</span>
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {question.question}
        </h2>

        {question.type === 'rating' && (
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleAnswer(rating)}
                  className={`p-3 ${
                    answers[question.id] === rating
                      ? 'text-yellow-500'
                      : 'text-gray-300'
                  }`}
                >
                  <Star size={32} className={answers[question.id] === rating ? 'fill-current' : ''} />
                </button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-500 px-2">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>
        )}

        {question.type === 'multiple' && (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <button
                key={option}
                onClick={() => {
                  const currentAnswers = answers[question.id] || [];
                  const newAnswers = currentAnswers.includes(option)
                    ? currentAnswers.filter((a: string) => a !== option)
                    : [...currentAnswers, option];
                  handleAnswer(newAnswers);
                }}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  (answers[question.id] || []).includes(option)
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {(answers[question.id] || []).includes(option) && (
                    <Check size={20} className="text-purple-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {question.type === 'text' && (
          <textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg resize-none focus:border-purple-600 focus:outline-none"
          />
        )}
      </div>

      {/* Navigation */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex gap-3">
          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion(prev => prev - 1)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium"
            >
              Back
            </button>
          )}
          <button
            onClick={nextQuestion}
            disabled={!canProceed()}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium ${
              canProceed()
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLastQuestion ? 'Submit' : 'Next'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}