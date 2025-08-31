'use client';

import { useState, useEffect } from 'react';
import { NodeConfig, WizardStep, Resource, Operation, NodeField } from '@/types';

const defaultConfig: NodeConfig = {
  name: '',
  displayName: '',
  description: '',
  version: '1.0.0',
  icon: '',
  resources: [],
  authentication: {
    type: 'none',
    fields: [],
  },
  additionalFields: [],
  metadata: {
    author: '',
    license: 'MIT',
    repository: '',
    keywords: [],
  },
};

export function useNodeBuilder() {
  const [config, setConfig] = useState<NodeConfig>(defaultConfig);
  const [currentStep, setCurrentStep] = useState<WizardStep>('details');
  const [completedSteps, setCompletedSteps] = useState<Set<WizardStep>>(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('n8n-node-builder-config');
    if (saved) {
      try {
        const parsedConfig = JSON.parse(saved);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Failed to load saved config:', error);
      }
    }
  }, []);

  // Save to localStorage whenever config changes
  useEffect(() => {
    localStorage.setItem('n8n-node-builder-config', JSON.stringify(config));
  }, [config]);

  const updateConfig = (updates: Partial<NodeConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const addResource = (resource: Omit<Resource, 'id'>) => {
    const newResource: Resource = {
      ...resource,
      id: Date.now().toString(),
      operations: [],
    };
    setConfig(prev => ({
      ...prev,
      resources: [...prev.resources, newResource],
    }));
  };

  const updateResource = (id: string, updates: Partial<Resource>) => {
    setConfig(prev => ({
      ...prev,
      resources: prev.resources.map(resource =>
        resource.id === id ? { ...resource, ...updates } : resource
      ),
    }));
  };

  const deleteResource = (id: string) => {
    setConfig(prev => ({
      ...prev,
      resources: prev.resources.filter(resource => resource.id !== id),
    }));
  };

  const addOperation = (resourceId: string, operation: Omit<Operation, 'id'>) => {
    const newOperation: Operation = {
      ...operation,
      id: Date.now().toString(),
    };
    setConfig(prev => ({
      ...prev,
      resources: prev.resources.map(resource =>
        resource.id === resourceId
          ? { ...resource, operations: [...resource.operations, newOperation] }
          : resource
      ),
    }));
  };

  const updateOperation = (resourceId: string, operationId: string, updates: Partial<Operation>) => {
    setConfig(prev => ({
      ...prev,
      resources: prev.resources.map(resource =>
        resource.id === resourceId
          ? {
              ...resource,
              operations: resource.operations.map(op =>
                op.id === operationId ? { ...op, ...updates } : op
              ),
            }
          : resource
      ),
    }));
  };

  const deleteOperation = (resourceId: string, operationId: string) => {
    setConfig(prev => ({
      ...prev,
      resources: prev.resources.map(resource =>
        resource.id === resourceId
          ? {
              ...resource,
              operations: resource.operations.filter(op => op.id !== operationId),
            }
          : resource
      ),
    }));
  };

  const addField = (resourceId: string, operationId: string, field: Omit<NodeField, 'id'>) => {
    const newField: NodeField = {
      ...field,
      id: Date.now().toString(),
    };
    setConfig(prev => ({
      ...prev,
      resources: prev.resources.map(resource =>
        resource.id === resourceId
          ? {
              ...resource,
              operations: resource.operations.map(op =>
                op.id === operationId
                  ? { ...op, fields: [...op.fields, newField] }
                  : op
              ),
            }
          : resource
      ),
    }));
  };

  const markStepComplete = (step: WizardStep) => {
    setCompletedSteps(prev => new Set([...prev, step]));
  };

  const goToStep = (step: WizardStep) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    markStepComplete(currentStep);
    const steps: WizardStep[] = ['details', 'resources', 'operations', 'auth', 'fields', 'metadata'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: WizardStep[] = ['details', 'resources', 'operations', 'auth', 'fields', 'metadata'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  return {
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
  };
}