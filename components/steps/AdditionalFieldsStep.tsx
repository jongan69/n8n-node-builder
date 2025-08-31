'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Settings, ArrowLeft, ArrowRight } from 'lucide-react';
import { NodeField } from '@/types';

interface AdditionalFieldsStepProps {
  fields: NodeField[];
  onUpdate: (fields: NodeField[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function AdditionalFieldsStep({ fields, onUpdate, onNext, onPrev }: AdditionalFieldsStepProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [fieldData, setFieldData] = useState({
    name: '',
    type: 'string' as NodeField['type'],
    description: '',
    required: false,
    options: [] as Array<{ name: string; value: string }>,
    default: '',
  });

  const addField = () => {
    const newField: NodeField = {
      ...fieldData,
      id: Date.now().toString(),
      options: fieldData.type === 'options' ? fieldData.options : undefined,
      default: fieldData.default || undefined,
    };
    
    onUpdate([...fields, newField]);
    
    setFieldData({
      name: '',
      type: 'string',
      description: '',
      required: false,
      options: [],
      default: '',
    });
    setIsAddDialogOpen(false);
  };

  const removeField = (fieldId: string) => {
    onUpdate(fields.filter(field => field.id !== fieldId));
  };

  const addOption = () => {
    setFieldData(prev => ({
      ...prev,
      options: [...prev.options, { name: '', value: '' }],
    }));
  };

  const updateOption = (index: number, key: 'name' | 'value', value: string) => {
    setFieldData(prev => ({
      ...prev,
      options: prev.options.map((option, i) =>
        i === index ? { ...option, [key]: value } : option
      ),
    }));
  };

  const removeOption = (index: number) => {
    setFieldData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-xl lg:rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 shadow-modern-lg">
          <Settings className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Additional Fields
          </h1>
          <p className="text-muted-foreground mt-1">
            Define optional fields that will be shown as &quot;Additional Fields&quot; in n8n
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="glass shadow-modern-xl border-0">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 pb-6">
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Custom Fields
            </CardTitle>
            <CardDescription className="text-base">
              Configure optional fields to enhance your node&apos;s functionality
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="gap-2 h-12 px-6 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-modern-lg hover:shadow-modern-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                Add Field
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl">Add Additional Field</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="fieldName" className="text-sm font-semibold">
                      Field Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="fieldName"
                      value={fieldData.name}
                      onChange={(e) => setFieldData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Custom Header"
                      className="h-12 transition-smooth shadow-modern focus:shadow-modern-lg"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Field Type</Label>
                    <Select 
                      value={fieldData.type} 
                      onValueChange={(value: any) => setFieldData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="h-12 transition-smooth shadow-modern focus:shadow-modern-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="dateTime">Date Time</SelectItem>
                        <SelectItem value="options">Options</SelectItem>
                        <SelectItem value="collection">Collection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="fieldDescription" className="text-sm font-semibold">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="fieldDescription"
                    value={fieldData.description}
                    onChange={(e) => setFieldData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Additional header to include in requests"
                    rows={3}
                    className="min-h-[100px] resize-none transition-smooth shadow-modern focus:shadow-modern-lg"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="required"
                    checked={fieldData.required}
                    onCheckedChange={(checked) => setFieldData(prev => ({ ...prev, required: !!checked }))}
                  />
                  <Label htmlFor="required" className="text-sm font-semibold">Required field</Label>
                </div>

                {fieldData.type === 'options' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-semibold">Options</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addOption} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Option
                      </Button>
                    </div>
                    {fieldData.options.map((option, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <Input
                          placeholder="Display name"
                          value={option.name}
                          onChange={(e) => updateOption(index, 'name', e.target.value)}
                          className="flex-1 h-10 transition-smooth shadow-modern focus:shadow-modern-lg"
                        />
                        <Input
                          placeholder="Value"
                          value={option.value}
                          onChange={(e) => updateOption(index, 'value', e.target.value)}
                          className="flex-1 h-10 transition-smooth shadow-modern focus:shadow-modern-lg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="h-10 w-10 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {fieldData.type !== 'options' && fieldData.type !== 'collection' && (
                  <div className="space-y-3">
                    <Label htmlFor="defaultValue" className="text-sm font-semibold">Default Value</Label>
                    <Input
                      id="defaultValue"
                      value={fieldData.default}
                      onChange={(e) => setFieldData(prev => ({ ...prev, default: e.target.value }))}
                      placeholder="Optional default value"
                      className="h-12 transition-smooth shadow-modern focus:shadow-modern-lg"
                    />
                  </div>
                )}
                
                <Button 
                  onClick={addField} 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-modern-lg hover:shadow-modern-xl transition-all duration-300 hover:scale-105"
                  disabled={!fieldData.name || !fieldData.description}
                >
                  Add Field
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-6">
          {fields.length === 0 ? (
            <div className="text-center py-12 lg:py-16">
              <div className="flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/10 to-blue-500/10 mx-auto mb-6">
                <Settings className="h-8 w-8 lg:h-10 lg:w-10 text-indigo-500" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold mb-3">No additional fields defined</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Additional fields are optional but can enhance user experience and provide more configuration options.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 lg:p-6 border rounded-xl hover:bg-muted/30 transition-all duration-300 group shadow-modern hover:shadow-modern-lg"
                >
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                      <h4 className="font-semibold text-lg">{field.name}</h4>
                      <Badge variant="secondary" className="w-fit mt-1 sm:mt-0">
                        {field.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{field.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {field.required && (
                        <Badge variant="destructive" className="text-xs">
                          Required
                        </Badge>
                      )}
                      {field.options && (
                        <Badge variant="outline" className="text-xs">
                          {field.options.length} option{field.options.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeField(field.id)}
                      className="h-10 px-4 text-destructive hover:text-destructive transition-smooth hover:scale-105"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 lg:pt-8">
        <Button 
          variant="outline" 
          onClick={onPrev} 
          className="gap-2 h-12 px-6 order-2 sm:order-1 transition-smooth hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button 
          onClick={onNext} 
          className="gap-2 h-12 px-6 order-1 sm:order-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-modern-lg hover:shadow-modern-xl transition-all duration-300 hover:scale-105"
        >
          Next: Metadata
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}