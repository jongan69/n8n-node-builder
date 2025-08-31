'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { NodeDetailsStep } from '@/components/steps/NodeDetailsStep';
import { ResourcesStep } from '@/components/steps/ResourcesStep';
import { OperationsStep } from '@/components/steps/OperationsStep';
import { AuthenticationStep } from '@/components/steps/AuthenticationStep';
import { AdditionalFieldsStep } from '@/components/steps/AdditionalFieldsStep';
import { MetadataStep } from '@/components/steps/MetadataStep';
import { CodePreview } from '@/components/CodePreview';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useNodeBuilder } from '@/hooks/useNodeBuilder';
import { WizardStep } from '@/types';

export default function Home() {
  const {
    config,
    currentStep,
    completedSteps,
    updateConfig,
    addResource,
    updateResource,
    deleteResource,
    addOperation,
    updateOperation,
    deleteOperation,
    addField,
    goToStep,
    nextStep,
    prevStep,
    markStepComplete,
  } = useNodeBuilder();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'details':
        return (
          <NodeDetailsStep
            config={config}
            onUpdate={updateConfig}
            onNext={nextStep}
          />
        );
      case 'resources':
        return (
          <ResourcesStep
            resources={config.resources}
            onAddResource={addResource}
            onUpdateResource={updateResource}
            onDeleteResource={deleteResource}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'operations':
        return (
          <OperationsStep
            resources={config.resources}
            onAddOperation={addOperation}
            onUpdateOperation={updateOperation}
            onDeleteOperation={deleteOperation}
            onAddField={addField}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'auth':
        return (
          <AuthenticationStep
            authentication={config.authentication}
            onUpdate={(auth) => updateConfig({ authentication: auth })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'fields':
        return (
          <AdditionalFieldsStep
            fields={config.additionalFields}
            onUpdate={(fields) => updateConfig({ additionalFields: fields })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'metadata':
        return (
          <MetadataStep
            metadata={config.metadata}
            onUpdate={(metadata) => updateConfig({ metadata })}
            onPrev={prevStep}
            onFinish={() => markStepComplete('metadata')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full glass-header border-b border-border/50 shadow-modern backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-logo shadow-modern-lg hover:shadow-modern-xl transition-all duration-300 hover:scale-105">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                  n8n Node Builder
                </h1>
                <p className="text-sm text-muted-foreground font-medium">Create custom n8n nodes with ease</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  n8n Builder
                </h1>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {['details', 'resources', 'operations', 'auth', 'fields', 'metadata'].map((step, index) => {
                    const isCompleted = completedSteps.has(step as WizardStep);
                    const isCurrent = currentStep === step;
                    const stepIndex = ['details', 'resources', 'operations', 'auth', 'fields', 'metadata'].indexOf(currentStep);
                    const isActive = index <= stepIndex;
                    
                    return (
                      <div key={step} className="flex items-center">
                        <div className={`
                          flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300
                          ${isCompleted 
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                            : isCurrent 
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 progress-pulse' 
                            : isActive 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                            : 'bg-muted text-muted-foreground'
                          }
                        `}>
                          {isCompleted ? (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            index + 1
                          )}
                        </div>
                        {index < 5 && (
                          <div className={`
                            w-8 h-0.5 mx-1 transition-all duration-300
                            ${isActive ? 'bg-blue-500' : 'bg-muted'}
                          `} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Step Counter */}
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-muted-foreground">Step</span>
                <span className="font-semibold text-foreground">
                  {['details', 'resources', 'operations', 'auth', 'fields', 'metadata'].indexOf(currentStep) + 1}
                </span>
                <span className="text-muted-foreground">of 6</span>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Mobile Progress */}
              <div className="md:hidden flex items-center space-x-2">
                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${((['details', 'resources', 'operations', 'auth', 'fields', 'metadata'].indexOf(currentStep) + 1) / 6) * 100}%` 
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {['details', 'resources', 'operations', 'auth', 'fields', 'metadata'].indexOf(currentStep) + 1}/6
                </span>
              </div>
              
              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar
          currentStep={currentStep}
          completedSteps={Array.from(completedSteps)}
          onStepClick={goToStep}
        />
        
        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Form Area */}
          <div className="flex-1 overflow-auto">
            <div className="container max-w-4xl py-8">
              {renderCurrentStep()}
            </div>
          </div>
          
          {/* Code Preview */}
          <div className="w-1/2 border-l glass">
            <CodePreview config={config} />
          </div>
        </div>
      </div>
    </div>
  );
}