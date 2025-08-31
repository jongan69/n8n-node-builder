'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NodeConfig } from '@/types';
import { Settings, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NodeDetailsStepProps {
  config: NodeConfig;
  onUpdate: (updates: Partial<NodeConfig>) => void;
  onNext: () => void;
}

export function NodeDetailsStep({ config, onUpdate, onNext }: NodeDetailsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    if (!config.name.trim()) newErrors.name = 'Node name is required';
    if (!config.displayName.trim()) newErrors.displayName = 'Display name is required';
    if (!config.description.trim()) newErrors.description = 'Description is required';
    if (!config.version.trim()) newErrors.version = 'Version is required';
    
    if (config.name && !/^[a-zA-Z][a-zA-Z0-9]*$/.test(config.name)) {
      newErrors.name = 'Node name must start with a letter and contain only letters and numbers';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25">
            <Settings className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
            Node Details
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
            Configure the basic information for your n8n node
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="glass shadow-modern-xl border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Basic Information
          </CardTitle>
          <CardDescription className="text-base">
            Define the core properties that identify your node
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-semibold">
                Node Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={config.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="myAwesomeNode"
                className={cn(
                  "h-12 transition-smooth shadow-modern focus:shadow-modern-lg",
                  errors.name ? 'border-destructive focus:border-destructive' : ''
                )}
              />
              {errors.name && (
                <p className="text-sm text-destructive flex items-center gap-2">
                  <span className="w-1 h-1 bg-destructive rounded-full"></span>
                  {errors.name}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Used for file names and class names (camelCase)
              </p>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="displayName" className="text-sm font-semibold">
                Display Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="displayName"
                value={config.displayName}
                onChange={(e) => onUpdate({ displayName: e.target.value })}
                placeholder="My Awesome Node"
                className={cn(
                  "h-12 transition-smooth shadow-modern focus:shadow-modern-lg",
                  errors.displayName ? 'border-destructive focus:border-destructive' : ''
                )}
              />
              {errors.displayName && (
                <p className="text-sm text-destructive flex items-center gap-2">
                  <span className="w-1 h-1 bg-destructive rounded-full"></span>
                  {errors.displayName}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Shown in the n8n interface
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-semibold">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={config.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="A brief description of what this node does..."
              className={cn(
                "min-h-[100px] resize-none transition-smooth shadow-modern focus:shadow-modern-lg",
                errors.description ? 'border-destructive focus:border-destructive' : ''
              )}
            />
            {errors.description && (
              <p className="text-sm text-destructive flex items-center gap-2">
                <span className="w-1 h-1 bg-destructive rounded-full"></span>
                {errors.description}
              </p>
            )}
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="version" className="text-sm font-semibold">
                Version <span className="text-destructive">*</span>
              </Label>
              <Input
                id="version"
                value={config.version}
                onChange={(e) => onUpdate({ version: e.target.value })}
                placeholder="1.0.0"
                className={cn(
                  "h-12 transition-smooth shadow-modern focus:shadow-modern-lg",
                  errors.version ? 'border-destructive focus:border-destructive' : ''
                )}
              />
              {errors.version && (
                <p className="text-sm text-destructive flex items-center gap-2">
                  <span className="w-1 h-1 bg-destructive rounded-full"></span>
                  {errors.version}
                </p>
              )}
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="icon" className="text-sm font-semibold">Icon SVG Name</Label>
              <Input
                id="icon"
                value={config.icon}
                onChange={(e) => onUpdate({ icon: e.target.value })}
                placeholder="icon.svg"
                className="h-12 transition-smooth shadow-modern focus:shadow-modern-lg"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Place SVG file in the nodes folder
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Actions */}
      <div className="flex justify-end pt-6 lg:pt-8">
        <Button 
          onClick={handleSubmit} 
          size="lg"
          className="gap-2 h-12 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-modern-lg hover:shadow-modern-xl transition-all duration-300 hover:scale-105"
        >
          Next: Configure Resources
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}