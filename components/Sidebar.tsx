'use client';

import { CheckCircle2, ChevronRight } from 'lucide-react';
import { WizardStep } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  onStepClick: (step: WizardStep) => void;
}

const steps = [
  {
    id: 'details' as WizardStep,
    title: 'Node Details',
    description: 'Basic node information',
    icon: '📝',
  },
  {
    id: 'resources' as WizardStep,
    title: 'API Resources',
    description: 'Define your API endpoints',
    icon: '🔗',
  },
  {
    id: 'operations' as WizardStep,
    title: 'Operations',
    description: 'Configure operations for each resource',
    icon: '⚙️',
  },
  {
    id: 'auth' as WizardStep,
    title: 'Authentication',
    description: 'Set up authentication methods',
    icon: '🔐',
  },
  {
    id: 'fields' as WizardStep,
    title: 'Additional Fields',
    description: 'Add custom fields and options',
    icon: '📋',
  },
  {
    id: 'metadata' as WizardStep,
    title: 'Package Metadata',
    description: 'Final package configuration',
    icon: '📦',
  },
];

export function Sidebar({ currentStep, completedSteps, onStepClick }: SidebarProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="w-full lg:w-80 h-full overflow-hidden flex flex-col bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-800/60">
      {/* Header */}
      <div className="p-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
          Setup Progress
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {currentStepIndex + 1} of {steps.length} steps completed
        </p>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
            <span>0%</span>
            <span>{Math.round(progress)}%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isClickable = isCompleted || index <= currentStepIndex;

          return (
            <button
              key={step.id}
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={cn(
                "w-full group relative p-4 rounded-xl transition-all duration-200 text-left",
                "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                isCurrent && "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800",
                isCompleted && "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800",
                !isClickable && "opacity-50 cursor-not-allowed"
              )}
            >
              {/* Step Number and Icon */}
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-200",
                  isCurrent && "bg-blue-500 text-white shadow-lg shadow-blue-500/25",
                  isCompleted && "bg-green-500 text-white shadow-lg shadow-green-500/25",
                  !isCurrent && !isCompleted && "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                )}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={cn(
                        "font-semibold text-sm transition-colors duration-200",
                        isCurrent && "text-blue-700 dark:text-blue-300",
                        isCompleted && "text-green-700 dark:text-green-300",
                        !isCurrent && !isCompleted && "text-slate-900 dark:text-slate-100"
                      )}>
                        {step.title}
                      </h3>
                      <p className={cn(
                        "text-xs mt-0.5 transition-colors duration-200",
                        isCurrent && "text-blue-600 dark:text-blue-400",
                        isCompleted && "text-green-600 dark:text-green-400",
                        !isCurrent && !isCompleted && "text-slate-500 dark:text-slate-400"
                      )}>
                        {step.description}
                      </p>
                    </div>
                    
                    {isClickable && (
                      <ChevronRight className={cn(
                        "w-4 h-4 transition-all duration-200 opacity-0 group-hover:opacity-100",
                        isCurrent && "text-blue-500",
                        isCompleted && "text-green-500",
                        !isCurrent && !isCompleted && "text-slate-400"
                      )} />
                    )}
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              {isCurrent && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
          <p>Step {currentStepIndex + 1} of {steps.length}</p>
          <p className="mt-1">
            {completedSteps.length === steps.length 
              ? "🎉 Setup complete!" 
              : `${steps.length - completedSteps.length} steps remaining`
            }
          </p>
        </div>
      </div>
    </div>
  );
}