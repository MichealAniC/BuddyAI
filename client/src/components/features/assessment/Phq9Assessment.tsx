'use client';

import { useState } from 'react';
import { SanctuaryCard } from '@/components/shared/SanctuaryCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { assessmentService, Phq9AssessmentResponse } from '@/services/assessmentService';
import { getSeverityColor } from '@/utils/colors';
import { ClipboardList, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const PHQ9_QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed — or the opposite, being fidgety or restless',
  'Thoughts that you would be better off dead, or of hurting yourself',
];

const SCORE_OPTIONS = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
];

interface Phq9AssessmentProps {
  onSubmitted?: () => void;
  className?: string;
}

export function Phq9Assessment({ onSubmitted, className }: Phq9AssessmentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(9).fill(-1));
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<Phq9AssessmentResponse | null>(null);
  const { showToast } = useToast();

  const currentAnswer = answers[currentStep];
  const canProceed = currentAnswer !== -1;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === PHQ9_QUESTIONS.length - 1;
  const progress = ((currentStep + (canProceed ? 1 : 0)) / PHQ9_QUESTIONS.length) * 100;

  const handleSelect = (value: number) => {
    const nextAnswers = [...answers];
    nextAnswers[currentStep] = value;
    setAnswers(nextAnswers);
  };

  const handleNext = () => {
    if (!canProceed) return;
    if (!isLastStep) {
      setCurrentStep((step) => step + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep((step) => step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed || !isLastStep) return;

    setStatus('loading');

    try {
      const assessment = await assessmentService.submitPhq9(answers);
      setResult(assessment);
      setStatus('success');
      showToast('Assessment submitted successfully!', 'success');
      onSubmitted?.();
    } catch (error) {
      setStatus('error');
      const message = error instanceof Error ? error.message : 'Failed to submit assessment.';
      showToast(message, 'error');
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers(new Array(9).fill(-1));
    setStatus('idle');
    setResult(null);
  };

  if (status === 'success' && result) {
    return (
      <SanctuaryCard className={cn('p-6 text-center', className)}>
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-green-50">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-800">Assessment Complete</h3>
            <p className="text-sm text-neutral-500 mt-1">
              Your PHQ-9 has been submitted and saved.
            </p>
          </div>

          <div className="w-full max-w-xs p-4 rounded-[14px] bg-neutral-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Total Score</span>
              <span className="text-2xl font-semibold text-neutral-800">
                {result.totalScore}/27
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Severity</span>
              <Badge className={getSeverityColor(result.severityLevel)}>
                {result.severityLevel.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          <Button onClick={handleRestart} variant="outline" className="mt-2">
            Take Again
          </Button>
        </div>
      </SanctuaryCard>
    );
  }

  return (
    <SanctuaryCard className={cn('p-6', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-xl bg-blue-50">
          <ClipboardList className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-semibold text-neutral-800">PHQ-9 Assessment</h3>
          <p className="text-xs text-neutral-500">Over the last 2 weeks, how often have you been bothered by...</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
          <span>
            Question {currentStep + 1} of {PHQ9_QUESTIONS.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-sm font-medium text-neutral-700 mb-4 leading-relaxed">
          {PHQ9_QUESTIONS[currentStep]}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SCORE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              disabled={status === 'loading'}
              className={cn(
                'px-4 py-3 rounded-[12px] text-sm text-left transition-all duration-200 border',
                currentAnswer === option.value
                  ? 'bg-primary-50 border-primary-300 text-primary-700 font-medium'
                  : 'bg-neutral-50 border-border text-neutral-600 hover:bg-neutral-100'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error message */}
      {status === 'error' && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-[10px] bg-red-50 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Submission failed. Please try again.</span>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isFirstStep || status === 'loading'}
          className="min-w-[90px]"
        >
          Back
        </Button>

        {isLastStep ? (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed || status === 'loading'}
            className="min-w-[90px]"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting
              </>
            ) : (
              'Submit'
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed || status === 'loading'}
            className="min-w-[90px]"
          >
            Next
          </Button>
        )}
      </div>
    </SanctuaryCard>
  );
}
