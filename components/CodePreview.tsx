'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Copy, Check } from 'lucide-react';
import { NodeConfig } from '@/types';
import { generateNodeFile, generateCredentialsFile, generateNodeJson, generatePackageJson } from '@/lib/codeGeneration';
import { exportNodeAsZip } from '@/lib/zipExport';
import { cn } from '@/lib/utils';

interface CodePreviewProps {
  config: NodeConfig;
}

export function CodePreview({ config }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState('node');
  const [copied, setCopied] = useState<string | null>(null);

  const codeFiles = {
    node: generateNodeFile(config),
    credentials: generateCredentialsFile(config),
    nodeJson: generateNodeJson(config),
    packageJson: generatePackageJson(config),
  };

  const handleCopy = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleExport = async () => {
    try {
      await exportNodeAsZip(config);
    } catch (err) {
      console.error('Failed to export:', err);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
              Generated Code
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Preview and export your n8n node files
            </p>
          </div>
          <Button
            onClick={handleExport}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 hover:scale-105"
          >
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Export ZIP</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 flex flex-col min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-12 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <TabsTrigger 
                value="node" 
                className="rounded-lg text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <span className="hidden lg:inline">Node Files</span>
                <span className="lg:hidden">Node</span>
              </TabsTrigger>
              <TabsTrigger 
                value="credentials" 
                className="rounded-lg text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <span className="hidden lg:inline">Credentials</span>
                <span className="lg:hidden">Auth</span>
              </TabsTrigger>
              <TabsTrigger 
                value="nodeJson" 
                className="rounded-lg text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <span className="hidden lg:inline">node.json</span>
                <span className="lg:hidden">Config</span>
              </TabsTrigger>
              <TabsTrigger 
                value="packageJson" 
                className="rounded-lg text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <span className="hidden lg:inline">package.json</span>
                <span className="lg:hidden">Package</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 pt-4 min-h-0">
            {Object.entries(codeFiles).map(([key, content]) => (
              <TabsContent 
                key={key} 
                value={key} 
                className="h-full flex flex-col space-y-0 data-[state=active]:flex"
              >
                <Card className="flex-1 flex flex-col bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 shadow-soft">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {key === 'node' && 'Node Implementation'}
                        {key === 'credentials' && 'Credentials'}
                        {key === 'nodeJson' && 'node.json'}
                        {key === 'packageJson' && 'package.json'}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(content, key)}
                        className="h-8 px-3 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        {copied === key ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span className="ml-1 hidden sm:inline">
                          {copied === key ? 'Copied!' : 'Copy'}
                        </span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-0">
                    <div className="h-full relative">
                      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 rounded-b-lg overflow-hidden">
                        <pre className="h-full p-4 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-auto">
                          <code>{content}</code>
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}