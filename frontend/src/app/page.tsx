'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">ExtractResume AI</h1>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-indigo-600">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          AI-Powered Placement Assistant
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Automate job applications, optimize your resume, and ace interviews with AI-powered guidance
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            title="Resume Optimization"
            description="Get ATS-optimized resume suggestions & increase your chances"
            icon="📄"
          />
          <FeatureCard
            title="Skill Gap Analysis"
            description="Identify missing skills and get personalized learning roadmaps"
            icon="🎯"
          />
          <FeatureCard
            title="1-Click Job Apply"
            description="Auto-generate cover letters and apply to multiple jobs instantly"
            icon="⚡"
          />
          <FeatureCard
            title="Mock Interviews"
            description="Practice with AI-powered interview simulations and real-time feedback"
            icon="🎤"
          />
          <FeatureCard
            title="Job Tracking"
            description="Track all applications, deadlines, and interview schedules in one place"
            icon="📊"
          />
          <FeatureCard
            title="HR Networking"
            description="Auto-find and connect with HR professionals at target companies"
            icon="🤝"
          />
        </div>

        {/* CTA */}
        <div className="mt-16">
          <Link
            href="/signup"
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
          >
            Get Started for Free
          </Link>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
