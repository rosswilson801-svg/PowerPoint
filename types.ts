import React from 'react';

export interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
}

export interface ContactFormData {
  schoolName: string;
  fullName: string;
  email: string;
  jobTitle: string;
  region: string;
  message: string;
}