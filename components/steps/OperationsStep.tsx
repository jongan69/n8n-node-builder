'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Resource, Operation, NodeField } from '@/types';
import { Settings, Plus, Edit, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

interface OperationsStepProps {
  resources: Resource[];
  onAddOperation: (resourceId: string, operation: Omit<Operation, 'id'>) => void;
  onUpdateOperation: (resourceId: string, operationId: string, updates: Partial<Operation>) => void;
  onDeleteOperation: (resourceId: string, operationId: string) => void;
  onAddField: (resourceId: string, operationId: string, field: Omit<NodeField, 'id'>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function OperationsStep({
  resources,
  onAddOperation,
  onUpdateOperation,
  onDeleteOperation,
  onNext,
  onPrev,
}: OperationsStepProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedResourceIndex, setSelectedResourceIndex] = useState<number | null>(null);
  const [editingOperation, setEditingOperation] = useState<{ resourceIndex: number; operationIndex: number } | null>(null);
  const [formData, setFormData] = useState<Partial<Operation>>({});

  const handleSubmit = () => {
    if (formData.name && formData.value && formData.description && selectedResourceIndex !== null) {
      const resource = resources[selectedResourceIndex];
      if (editingOperation) {
        const operation = resource.operations[editingOperation.operationIndex];
        onUpdateOperation(resource.id, operation.id, formData as Partial<Operation>);
      } else {
        onAddOperation(resource.id, formData as Omit<Operation, 'id'>);
      }
      handleClose();
    }
  };

  const handleEdit = (operation: Operation, resourceIndex: number, operationIndex: number) => {
    setFormData(operation);
    setSelectedResourceIndex(resourceIndex);
    setEditingOperation({ resourceIndex, operationIndex });
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setFormData({});
    setSelectedResourceIndex(null);
    setEditingOperation(null);
    setIsDialogOpen(false);
  };

  const canProceed = resources.some(resource => resource.operations.length > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-600 to-orange-600 shadow-lg shadow-orange-500/25">
            <Settings className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
            Operations
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
            Define the operations available for each resource
          </p>
        </div>
      </div>

      {/* Operations List */}
      <Card className="card-modern shadow-medium">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Resource Operations
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400">
                Configure operations for each API resource
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Operation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {editingOperation ? 'Edit Operation' : 'Add Operation'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Operation Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Get All Users"
                      className="border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Operation Value *
                    </Label>
                    <Input
                      id="value"
                      value={formData.value || ''}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder="getAll"
                      className="border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Retrieve all users from the API"
                      rows={3}
                      className="border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:ring-orange-500 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="action" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      HTTP Method *
                    </Label>
                    <select
                      id="action"
                      value={formData.action || 'GET'}
                      onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-md focus:border-orange-500 focus:ring-orange-500 bg-white dark:bg-slate-800"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="PATCH">PATCH</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button variant="outline" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700">
                      {editingOperation ? 'Update' : 'Add'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {resources.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                  <Settings className="h-6 w-6 text-slate-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No resources available
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Add resources first to configure operations
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {resources.map((resource, resourceIndex) => (
                <AccordionItem
                  key={resourceIndex}
                  value={`resource-${resourceIndex}`}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-soft"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                          {resource.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {resource.operations.length} operation{resource.operations.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    {resource.operations.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          No operations defined for this resource
                        </p>
                        <Button
                          onClick={() => {
                            setSelectedResourceIndex(resourceIndex);
                            setIsDialogOpen(true);
                          }}
                          className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Operation
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {resource.operations.map((operation, operationIndex) => (
                          <div
                            key={operationIndex}
                            className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                                  {operation.name}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  {operation.action}
                                </Badge>
                                <span className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">
                                  {operation.value}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {operation.description}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(operation, resourceIndex, operationIndex)}
                                className="h-8 px-3 text-xs hover:bg-slate-200 dark:hover:bg-slate-600"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteOperation(resource.id, operation.id)}
                                className="h-8 px-3 text-xs hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          onClick={() => {
                            setSelectedResourceIndex(resourceIndex);
                            setIsDialogOpen(true);
                          }}
                          variant="outline"
                          className="w-full mt-4"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Operation to {resource.name}
                        </Button>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          onClick={onPrev}
          variant="outline"
          className="h-12 px-6 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Resources
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="h-12 px-6 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-200 hover:scale-105"
        >
          Continue to Authentication
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}