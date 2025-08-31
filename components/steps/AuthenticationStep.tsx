'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { AuthConfig, NodeField } from '@/types';
import { cn } from '@/lib/utils';

interface AuthenticationStepProps {
  authentication: AuthConfig;
  onUpdate: (auth: AuthConfig) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function AuthenticationStep({ authentication, onUpdate, onNext, onPrev }: AuthenticationStepProps) {
  const [isAddFieldDialogOpen, setIsAddFieldDialogOpen] = useState(false);
  const [fieldData, setFieldData] = useState({
    name: '',
    type: 'string' as const,
    description: '',
    required: true,
  });

  const handleAuthTypeChange = (type: 'none' | 'apiKey' | 'oauth2') => {
    let defaultFields: NodeField[] = [];
    
    if (type === 'apiKey') {
      defaultFields = [{
        id: '1',
        name: 'API Key',
        type: 'string',
        required: true,
        description: 'Your API key for authentication',
      }];
    } else if (type === 'oauth2') {
      defaultFields = [
        {
          id: '1',
          name: 'Client ID',
          type: 'string',
          required: true,
          description: 'OAuth2 client ID',
        },
        {
          id: '2',
          name: 'Client Secret',
          type: 'string',
          required: true,
          description: 'OAuth2 client secret',
        },
      ];
    }
    
    onUpdate({ type, fields: defaultFields });
  };

  const addField = () => {
    const newField: NodeField = {
      ...fieldData,
      id: Date.now().toString(),
    };
    
    onUpdate({
      ...authentication,
      fields: [...authentication.fields, newField],
    });
    
    setFieldData({
      name: '',
      type: 'string',
      description: '',
      required: true,
    });
    setIsAddFieldDialogOpen(false);
  };

  const removeField = (fieldId: string) => {
    onUpdate({
      ...authentication,
      fields: authentication.fields.filter(field => field.id !== fieldId),
    });
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-xl lg:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-modern-lg">
          <Shield className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Authentication
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure how users will authenticate with your API
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="glass shadow-modern-xl border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Security Configuration
          </CardTitle>
          <CardDescription className="text-base">
            Choose the authentication method for your n8n node
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-6">
            <Label className="text-sm font-semibold">Authentication Type</Label>
            <RadioGroup
              value={authentication.type}
              onValueChange={(value: any) => handleAuthTypeChange(value)}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className={cn(
                "flex items-center space-x-3 p-4 lg:p-6 border rounded-xl transition-all duration-300 cursor-pointer hover:bg-muted/30",
                authentication.type === 'none' ? "border-primary bg-primary/5" : "border-border"
              )}>
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-semibold text-base">None</p>
                    <p className="text-sm text-muted-foreground mt-1">No authentication required</p>
                  </div>
                </Label>
              </div>
              
              <div className={cn(
                "flex items-center space-x-3 p-4 lg:p-6 border rounded-xl transition-all duration-300 cursor-pointer hover:bg-muted/30",
                authentication.type === 'apiKey' ? "border-primary bg-primary/5" : "border-border"
              )}>
                <RadioGroupItem value="apiKey" id="apiKey" />
                <Label htmlFor="apiKey" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-semibold text-base">API Key</p>
                    <p className="text-sm text-muted-foreground mt-1">Bearer token authentication</p>
                  </div>
                </Label>
              </div>
              
              <div className={cn(
                "flex items-center space-x-3 p-4 lg:p-6 border rounded-xl transition-all duration-300 cursor-pointer hover:bg-muted/30",
                authentication.type === 'oauth2' ? "border-primary bg-primary/5" : "border-border"
              )}>
                <RadioGroupItem value="oauth2" id="oauth2" />
                <Label htmlFor="oauth2" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-semibold text-base">OAuth2</p>
                    <p className="text-sm text-muted-foreground mt-1">OAuth2 client credentials</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {authentication.type !== 'none' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h4 className="text-lg font-semibold">Credential Fields</h4>
                <Dialog open={isAddFieldDialogOpen} onOpenChange={setIsAddFieldDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="gap-2 h-10 px-4 transition-smooth hover:scale-105"
                    >
                      <Plus className="h-4 w-4" />
                      Add Field
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Add Credential Field</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="fieldName" className="text-sm font-semibold">
                          Field Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="fieldName"
                          value={fieldData.name}
                          onChange={(e) => setFieldData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="API Key"
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
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="fieldDescription" className="text-sm font-semibold">
                          Description <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="fieldDescription"
                          value={fieldData.description}
                          onChange={(e) => setFieldData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Your API key for authentication"
                          rows={3}
                          className="min-h-[100px] resize-none transition-smooth shadow-modern focus:shadow-modern-lg"
                        />
                      </div>
                      <Button 
                        onClick={addField} 
                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-modern-lg hover:shadow-modern-xl transition-all duration-300 hover:scale-105"
                        disabled={!fieldData.name || !fieldData.description}
                      >
                        Add Field
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {authentication.fields.length === 0 ? (
                <div className="text-center py-12 lg:py-16">
                  <div className="flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 mx-auto mb-6">
                    <Shield className="h-8 w-8 lg:h-10 lg:w-10 text-purple-500" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold mb-3">No credential fields defined</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Add credential fields to define what users need to provide for authentication.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {authentication.fields.map((field) => (
                    <div
                      key={field.id}
                      className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 lg:p-6 border rounded-xl hover:bg-muted/30 transition-all duration-300 group shadow-modern hover:shadow-modern-lg"
                    >
                      <div className="flex-1 mb-4 lg:mb-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                          <h5 className="font-semibold text-lg">{field.name}</h5>
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
          className="gap-2 h-12 px-6 order-1 sm:order-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 shadow-modern-lg hover:shadow-modern-xl transition-all duration-300 hover:scale-105"
        >
          Next: Additional Fields
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}