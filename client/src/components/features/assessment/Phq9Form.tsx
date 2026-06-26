'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const PHQ9_QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure',
  'Trouble concentrating on things',
  'Moving or speaking slowly, or being fidgety/restless',
  'Thoughts that you would be better off dead, or of hurting yourself',
];

const SCORE_OPTIONS = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half' },
  { value: 3, label: 'Nearly every day' },
];

interface Phq9FormProps {
  onSubmit: (answers: number[]) => void;
  disabled?: boolean;
}

export function Phq9Form({ onSubmit, disabled }: Phq9FormProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(9).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswer = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
    // Auto-advance to next question
    if (questionIndex < 8) {
      setTimeout(() => setCurrentQuestion(questionIndex + 1), 300);
    }
  };

  const handleSubmit = () => {
    if (answers.some((a) => a === null)) return;
    onSubmit(answers as number[]);
  };

  const answeredCount = answers.filter((a) => a !== null).length;
  const isComplete = answeredCount === 9;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / 9) * 100}%` }}
          />
        </div>
        <span className="text-xs text-neutral-500">{answeredCount}/9</span>
      </div>

      {/* Question */}
      <Card>
        <CardContent className="py-5">
          <p className="text-xs text-neutral-400 mb-1">Question {currentQuestion + 1} of 9</p>
          <p className="text-sm font-medium text-neutral-700 mb-4">
            Over the last 2 weeks, how often have you been bothered by: <br />
            <span className="text-neutral-800">{PHQ9_QUESTIONS[currentQuestion]}</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SCORE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(currentQuestion, option.value)}
                disabled={disabled}
                className={cn(
                  'px-3 py-2.5 rounded-[10px] text-sm text-left transition-all duration-200 border',
                  answers[currentQuestion] === option.value
                    ? 'bg-primary-50 border-primary-300 text-primary-700 font-medium'
                    : 'bg-neutral-50 border-border text-neutral-600 hover:bg-neutral-100'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation dots */}
      <div className="flex justify-center gap-1.5">
        {PHQ9_QUESTIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentQuestion(i)}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              i === currentQuestion ? 'bg-primary-500 w-4' : answers[i] !== null ? 'bg-primary-300' : 'bg-neutral-200'
            )}
          />
        ))}
      </div>

      {/* Submit */}
      {isComplete && (
        <Button onClick={handleSubmit} disabled={disabled} className="w-full">
          Submit Assessment
        </Button>
      )}
    </div>
  );
}
