'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Resource } from '@/types';
import { Link, Plus, Edit, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

interface ResourcesStepProps {
  resources: Resource[];
  onAddResource: (resource: Omit<Resource, 'id'>) => void;
  onUpdateResource: (id: string, updates: Partial<Resource>) => void;
  onDeleteResource: (id: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function ResourcesStep({ 
  resources, 
  onAddResource, 
  onUpdateResource, 
  onDeleteResource, 
  onNext, 
  onPrev 
}: ResourcesStepProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Resource>>({});

  const handleSubmit = () => {
    if (formData.name && formData.value && formData.description) {
      if (editingIndex !== null) {
        onUpdateResource(resources[editingIndex].id, formData as Partial<Resource>);
      } else {
        onAddResource(formData as Omit<Resource, 'id'>);
      }
      handleClose();
    }
  };

  const handleEdit = (resource: Resource, index: number) => {
    setFormData(resource);
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setFormData({});
    setEditingIndex(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-green-700 shadow-lg shadow-green-500/25">
            <Link className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
            API Resources
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
            Define the API endpoints and resources your node will interact with
          </p>
        </div>
      </div>

      {/* Resources List */}
      <Card className="card-modern shadow-medium">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Resources
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400">
                Add API endpoints and resources for your node
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {editingIndex !== null ? 'Edit Resource' : 'Add Resource'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Resource Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Users"
                      className="border-slate-200 dark:border-slate-700 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Resource Value *
                    </Label>
                    <Input
                      id="value"
                      value={formData.value || ''}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder="users"
                      className="border-slate-200 dark:border-slate-700 focus:border-green-500 focus:ring-green-500"
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
                      placeholder="Manage user accounts and profiles"
                      rows={3}
                      className="border-slate-200 dark:border-slate-700 focus:border-green-500 focus:ring-green-500 resize-none"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button variant="outline" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                      {editingIndex !== null ? 'Update' : 'Add'}
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
                  <Link className="h-6 w-6 text-slate-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No resources yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Add your first API resource to get started
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 lg:p-6 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {resource.name}
                      </h3>
                      <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">
                        {resource.value}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {resource.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(resource, index)}
                      className="h-8 px-3 text-xs hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteResource(resource.id)}
                      className="h-8 px-3 text-xs hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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
          Back to Details
        </Button>
        <Button
          onClick={onNext}
          disabled={resources.length === 0}
          className="h-12 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-200 hover:scale-105"
        >
          Continue to Operations
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}