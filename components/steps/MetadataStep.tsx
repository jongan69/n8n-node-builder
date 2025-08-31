'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Package, ArrowLeft, CheckCircle } from 'lucide-react';
import { NodeConfig } from '@/types';

interface MetadataStepProps {
  metadata: NodeConfig['metadata'];
  onUpdate: (metadata: NodeConfig['metadata']) => void;
  onPrev: () => void;
  onFinish: () => void;
}

export function MetadataStep({ metadata, onUpdate, onPrev, onFinish }: MetadataStepProps) {
  const [keywordInput, setKeywordInput] = useState('');

  const addKeyword = () => {
    if (keywordInput.trim() && !metadata.keywords.includes(keywordInput.trim())) {
      onUpdate({
        ...metadata,
        keywords: [...metadata.keywords, keywordInput.trim()],
      });
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    onUpdate({
      ...metadata,
      keywords: metadata.keywords.filter(k => k !== keyword),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-xl lg:rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-modern-lg">
          <Package className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Metadata
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure package.json metadata for your n8n node
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="glass shadow-modern-xl border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Package Information
          </CardTitle>
          <CardDescription className="text-base">
            Define the metadata that will be included in your node&apos;s package.json
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid gap-6 lg:gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="author" className="text-sm font-semibold">
                Author <span className="text-destructive">*</span>
              </Label>
              <Input
                id="author"
                value={metadata.author}
                onChange={(e) => onUpdate({ ...metadata, author: e.target.value })}
                placeholder="Your Name"
                className="h-12 transition-smooth shadow-modern focus:shadow-modern-lg"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="license" className="text-sm font-semibold">License</Label>
              <Input
                id="license"
                value={metadata.license}
                onChange={(e) => onUpdate({ ...metadata, license: e.target.value })}
                placeholder="MIT"
                className="h-12 transition-smooth shadow-modern focus:shadow-modern-lg"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="repository" className="text-sm font-semibold">Repository URL</Label>
            <Input
              id="repository"
              value={metadata.repository}
              onChange={(e) => onUpdate({ ...metadata, repository: e.target.value })}
              placeholder="https://github.com/username/n8n-nodes-mynode"
              className="h-12 transition-smooth shadow-modern focus:shadow-modern-lg"
            />
            <p className="text-xs text-muted-foreground">
              GitHub repository URL for your node
            </p>
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="keywords" className="text-sm font-semibold">Keywords</Label>
            <div className="flex gap-3">
              <Input
                id="keywords"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a keyword"
                className="flex-1 h-12 transition-smooth shadow-modern focus:shadow-modern-lg"
              />
              <Button 
                onClick={addKeyword} 
                disabled={!keywordInput.trim()}
                type="button"
                className="h-12 px-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-modern-lg hover:shadow-modern-xl transition-all duration-300 hover:scale-105"
              >
                Add
              </Button>
            </div>
            
            {metadata.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 border rounded-xl bg-muted/20">
                {metadata.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="text-sm gap-2">
                    {keyword}
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Keywords help users discover your node in the n8n community
            </p>
          </div>
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
          onClick={onFinish} 
          disabled={!metadata.author.trim()}
          className="gap-2 h-12 px-6 order-1 sm:order-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-modern-lg hover:shadow-modern-xl transition-all duration-300 hover:scale-105"
        >
          <CheckCircle className="h-4 w-4" />
          Complete Setup
        </Button>
      </div>
    </div>
  );
}