'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { SkeletonLoader } from '@/components/ui/skeleton-loader';
import { Badge } from '@/components/ui/badge';
import {
  profileService,
  projectsService,
  skillsService,
  educationService,
  experienceService,
  servicesService,
  socialLinksService,
  siteSettingsService,
} from '@/lib/services';

interface TestResult {
  endpoint: string;
  name: string;
  status: 'pending' | 'success' | 'error';
  statusCode?: number;
  data?: any;
  error?: string;
}

export default function DevApiTestPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const [results, setResults] = useState<TestResult[]>([
    { name: '1. Profile API', endpoint: '/api/profile', status: 'pending' },
    { name: '2. Site Settings API', endpoint: '/api/site-settings', status: 'pending' },
    { name: '3. Projects API', endpoint: '/api/projects', status: 'pending' },
    { name: '4. Skills API', endpoint: '/api/skills', status: 'pending' },
    { name: '5. Education API', endpoint: '/api/education', status: 'pending' },
    { name: '6. Experience API', endpoint: '/api/experience', status: 'pending' },
    { name: '7. Services API', endpoint: '/api/services', status: 'pending' },
    { name: '8. Social Links API', endpoint: '/api/social-links', status: 'pending' },
  ]);

  const [isTesting, setIsTesting] = useState(false);

  const runAllTests = async () => {
    setIsTesting(true);
    const updatedResults = [...results];

    const testEndpoint = async (index: number, fn: () => Promise<any>) => {
      try {
        const data = await fn();
        updatedResults[index] = {
          ...updatedResults[index],
          status: 'success',
          statusCode: 200,
          data,
        };
      } catch (err: any) {
        updatedResults[index] = {
          ...updatedResults[index],
          status: 'error',
          statusCode: err.statusCode || 500,
          error: err.message || 'Error executing request',
        };
      }
    };

    await Promise.all([
      testEndpoint(0, () => profileService.getProfile()),
      testEndpoint(1, () => siteSettingsService.getSiteSettings()),
      testEndpoint(2, () => projectsService.getProjects()),
      testEndpoint(3, () => skillsService.getSkills()),
      testEndpoint(4, () => educationService.getEducation()),
      testEndpoint(5, () => experienceService.getExperience()),
      testEndpoint(6, () => servicesService.getServices()),
      testEndpoint(7, () => socialLinksService.getSocialLinks()),
    ]);

    setResults([...updatedResults]);
    setIsTesting(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-mono text-amber-400 font-semibold uppercase">Development Tool Only</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              NestJS REST API Endpoint Verification
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Verifying centralized frontend API client connection to <code className="text-blue-400">http://localhost:5000/api</code>
            </p>
          </div>
          <button
            onClick={runAllTests}
            disabled={isTesting}
            className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition disabled:opacity-50"
          >
            {isTesting ? 'Running Endpoint Verification...' : 'Re-Run API Verification'}
          </button>
        </div>

        {isTesting && <SkeletonLoader count={2} height="h-28" />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((res) => (
            <div
              key={res.endpoint}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">{res.name}</h3>
                  {res.status === 'pending' && <Badge variant="info">Testing...</Badge>}
                  {res.status === 'success' && <Badge variant="success">200 OK</Badge>}
                  {res.status === 'error' && <Badge variant="danger">{res.statusCode || 'ERROR'}</Badge>}
                </div>
                <p className="text-xs font-mono text-slate-400">{res.endpoint}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 max-h-40 overflow-y-auto">
                {res.status === 'success' && (
                  <pre className="text-[11px] text-emerald-400 font-mono whitespace-pre-wrap">
                    {JSON.stringify(res.data, null, 2)}
                  </pre>
                )}
                {res.status === 'error' && (
                  <p className="text-xs text-rose-400 font-medium">{res.error}</p>
                )}
                {res.status === 'pending' && (
                  <p className="text-xs text-slate-500 italic">Executing request...</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
